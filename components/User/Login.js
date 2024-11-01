import React, { useContext, useState, useEffect } from "react";
import * as Font from "expo-font";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Switch,
} from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import { MyDispatchContext } from "../../configs/Contexts";
import { Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AlertModalLogin from "../constants/AlertModalLogin";
import { Linking } from "react-native";
import {auth} from "../../firebaseConfig";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  storeToken,
  getToken,
  removeToken,
  storeCredentials,
  getCredentials,
  removeCredentials,
} from "../../utils/storage";
import Modal from "react-native-modal";
import {GoogleAuthProvider, onAuthStateChanged, signInWithCredential} from "firebase/auth";
WebBrowser.maybeCompleteAuthSession();
const Login = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();
  const dispatch = useContext(MyDispatchContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [userInfo, setUserInfo] = useState();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:'899497425158-6vcg6s5t4s0o64drl57uitivp0d4jebo.apps.googleusercontent.com',
    androidClientId:'899497425158-vhcrste5is511btu4vijtadb4sssetl1.apps.googleusercontent.com',
  });

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        Faustina: require("../../assets/fonts/Faustina_ExtraBold.ttf"),
        FaustinaMd: require("../../assets/fonts/Faustina_Medium.ttf"),
        DejaVu: require("../../assets/fonts/DejaVuSerifCondensed_Bold.ttf"),
      });
      setFontLoaded(true);
    } catch (error) {
      console.error("Error loading fonts:", error);
    } finally {
      setIsLoading(false); //Khi fonts loading xong đồng nghĩa với form loading xong
    }
  };

  useEffect(() => {
    const checkRememberedUser = async () => {
      const { username, password } = await getCredentials();
      if (username && password) {
        setUser({ username, password });
        setRememberMe(true);
      }
    };

    checkRememberedUser();
  }, []);

  useEffect(() => {
    loadFonts();
  }, []);

  useEffect(() => {
    if (response?.type == "success"){
      const {id_token} = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response])

  if (isLoading || !fontLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B14F" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const change = (value, field) => {
    setUser((current) => {
      return { ...current, [field]: value };
    });
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    if (!user.username) {
      newErrors.username =
        "Oops! It looks like you forgot to enter your username.";
      isValid = false;
    }

    if (!user.password) {
      newErrors.password = "Please provide a password to secure your account.";
      isValid = false;
    } else if (user.password.length < 6) {
      newErrors.password =
        "Your password should be at least 6 characters long for better security.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const login = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);

    // console.log("Client ID: ", Config.process.env.CLIENT_ID); // Kiểm tra giá trị
    // console.log("Client Secret: ", Config.process.env.CLIENT_SECRET); // Kiểm tra giá trị
    try {
      let res = await APIs.post(endpoints["login"], {
        ...user,
        // "client_id": CLIENT_ID,
        // "client_secret": CLIENT_SECRET,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "password",
      });
      // Luôn lưu token cho phiên hiện tại
      await storeToken(res.data.access_token);
      // Nếu rememberMe được bật, lưu token riêng để sử dụng cho các lần đăng nhập sau
      if (rememberMe) {
        await storeCredentials(user.username, user.password);
      } else {
        await removeCredentials();
      }

      setTimeout(async () => {
        let user = await authAPI(res.data.access_token).get(
          endpoints["current-user"]
        );
        console.info(user.data);
        dispatch({ type: "login", payload: user.data });
        nav.navigate("HomeScreen");
      }, 100);
    } catch (ex) {
      setIsAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRememberMeToggle = (value) => {
    setRememberMe(value);
    if (!value) {
      removeCredentials();
    }
  };

  // const handleLoginWithGoogle = async () => {
  //   const googleCallbackLogin = endpoints["googleCallbackLogin"];
  //   const redirectUri = encodeURIComponent(googleCallbackLogin);


  //   const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  //   // Lấy URL frontend hiện tại để truyền qua backend
  //   const currentFrontendUrl = "http://172.20.10.3:8000/";

  //   const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&access_type=offline&prompt=select_account&state=${currentFrontendUrl}`;

  //   // Sử dụng Linking để mở trình duyệt
  //   try {
  //     await Linking.openURL(authUrl);
  //   } catch (error) {
  //     console.error("Failed to open URL: ", error);
  //   }
  // };
  const handleLoginWithGoogle = async () => {
    await promptAsync(); // Bắt đầu quá trình đăng nhập với Google
  };
  const handleLoginWithFacebook = async () => {};

  const handleRetry = () => {
    setIsAlertVisible(false);
    setUser({ username: "", password: "" });
  };

  const handleForgotPassword = () => {
    setIsAlertVisible(false);
    setUser({ username: "", password: "" });
    nav.navigate("ForgotPassword");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>OU Job</Text>
            <Text style={styles.welcomeText}>Your path to great careers!</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={user.username}
              onChangeText={(t) =>
                setUser((prev) => ({ ...prev, username: t }))
              }
              style={styles.input}
              label="Username"
              left={<TextInput.Icon icon="email" />}
              theme={{ colors: { primary: "#00B14F" } }}
            />
            <HelperText
              type="error"
              visible={!!errors.username}
              style={styles.errorText}
            >
              {errors.username}
            </HelperText>
            {/* Cập nhật TextInput cho mật khẩu */}
            <TextInput
              value={user.password}
              onChangeText={(t) =>
                setUser((prev) => ({ ...prev, password: t }))
              }
              style={styles.input}
              label="Password"
              secureTextEntry={!passwordVisible}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={passwordVisible ? "eye" : "eye-off"}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                />
              }
              theme={{ colors: { primary: "#00B14F" } }}
            />
            <HelperText
              type="error"
              visible={!!errors.password}
              style={styles.errorText}
            >
              {errors.password}
            </HelperText>
          </View>

          <View style={styles.rememberForgotContainer}>
            <View style={styles.rememberMeContainer}>
              <Switch
                value={rememberMe}
                onValueChange={handleRememberMeToggle}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={rememberMe ? "#00B14F" : "#f4f3f4"}
                style={styles.switch}
              />
              <Text style={styles.rememberMeText}>Remember me</Text>
            </View>
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => nav.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={login}>
            {loading ? (
              <ActivityIndicator size={24} color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Log in</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialLoginContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleLoginWithFacebook}
            >
              <Icon name="facebook" size={20} color="#3b5998" />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleLoginWithGoogle}
            >
              <Icon name="google" size={20} color="#db4a39" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?{" "}
              <Text
                style={styles.registerLink}
                onPress={() => nav.navigate("MyRegister")}
              >
                Register now
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.experienceButton}
            onPress={() => nav.navigate("HomeScreen")}
          >
            <Text style={styles.experienceButtonText}>
              EXPERIENCE WITHOUT LOGGING IN
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      <AlertModalLogin
        isVisible={isAlertVisible}
        title="Oops! Login unsuccessful ###"
        message="It looks like there's a problem with your login information. Please check your username and password again!"
        onClose={() => setIsAlertVisible(false)}
        onRetry={handleRetry}
        onForgotPassword={handleForgotPassword}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  headerText: {
    fontSize: 40,
    fontFamily: "Faustina",
    fontWeight: "bold",
    color: "#00B14F",
  },
  welcomeText: {
    fontSize: 20,
    color: "#333",
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 30,
    elevation: 2,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    // marginBottom: 20,
  },
  button: {
    backgroundColor: "#00B14F",
    paddingVertical: 12,
    borderRadius: 25,
    height: 45, // Fixed height
    alignItems: "center",
    // Thêm shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#757575",
  },
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "48%",
    // Thêm shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.15,
    },
    shadowOpacity: 0.15,
    //  shadowRadius: 3.84,
    elevation: 5,
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  registerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  registerText: {
    fontSize: 16,
  },
  registerLink: {
    color: "#00B14F",
    fontFamily: "DejaVu",
  },
  experienceButton: {
    // backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  experienceButtonText: {
    color: "#B5AFB3",
    fontSize: 16,
    fontFamily: "FaustinaMd",
  },
  rememberForgotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: -30,
    height: 40, // Đặt chiều cao cố định cho container
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%", // Đảm bảo chiều cao bằng với container cha
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Làm nhỏ Switch
    marginRight: 8, // Thêm khoảng cách giữa switch và text
  },
  rememberMeText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#00B14F",
    textAlignVertical: "center", // Căn giữa theo chiều dọc
    fontFamily: "DejaVu",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#d35bb9",
    textAlignVertical: "center", // Căn giữa theo chiều dọc
    marginBottom: 12,
    fontFamily: "DejaVu",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#00B14F",
    fontFamily: "FaustinaMd",
  },
  errorText: {
    color: "#ff3333",
    fontSize: 14,
    marginTop: -5,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default Login;
