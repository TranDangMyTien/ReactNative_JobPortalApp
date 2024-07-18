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
} from "react-native";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import { MyDispatchContext } from "../../configs/Contexts";
import { Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Login = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();
  const dispatch = useContext(MyDispatchContext);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      Faustina: require("../../assets/fonts/Faustina_ExtraBold.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const change = (value, field) => {
    setUser((current) => {
      return { ...current, [field]: value };
    });
  };
  const login = async () => {
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
      await AsyncStorage.setItem("token", res.data.access_token);
      setTimeout(async () => {
        let user = await authAPI(res.data.access_token).get(
          endpoints["current-user"]
        );
        console.info(user.data);
        dispatch({ type: "login", payload: user.data });
        nav.navigate("HomeScreen");
      }, 100);
    } catch (ex) {
      Alert.alert(
        "Lỗi đăng nhập",
        "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại !!",
        [
          {
            text: "Đóng",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {};
  const handleLoginWithFacebook = async () => {};

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#00B14F" />;
  }

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
              onChangeText={(t) => change(t, "username")}
              style={styles.input}
              label="Username"
              left={<TextInput.Icon icon="email" />}
              theme={{ colors: { primary: "#00B14F" } }}
            />
            <TextInput
              value={user.password}
              onChangeText={(t) => change(t, "password")}
              style={styles.input}
              label="Password"
              secureTextEntry
              left={<TextInput.Icon icon="lock" />}
              theme={{ colors: { primary: "#00B14F" } }}
            />
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => nav.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={login}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
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
              Experience without logging in
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
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
    fontSize: 18,
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
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 15,
    color: "#00B14F",
  },
  button: {
    backgroundColor: "#00B14F",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
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
    fontWeight: "bold",
  },
  experienceButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  experienceButtonText: {
    color: "#333",
    fontSize: 16,
  },
});

export default Login;
