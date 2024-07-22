import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as Font from 'expo-font';
import {
  View,
  Text,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import {
  Button,
  HelperText,
  TextInput,
  TouchableRipple,
  Checkbox,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from "react-native";
import APIs, { endpoints } from "../../../configs/APIs";
import { FontAwesome6 } from "@expo/vector-icons";
import AlertModalRegister from "../../constants/AlertModalRegister";
import ImageView from "react-native-image-zoom-viewer";
import Modal from "react-native-modal";
// Ignore specific warning
LogBox.ignoreLogs([
  "Warning: TextInput.Icon: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
]);

const Register = () => {
  const [user, setUser] = useState({});
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const nav = useNavigation();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const handleService = async () => {};
  const handleRules = async () => {};
  const handleClose = useCallback(() => {
    setIsAlertVisible(false);
    resetForm();
  }, []);

  const handleLogin = useCallback(() => {
    setIsAlertVisible(false);
    resetForm();
    nav.navigate("Login");
  }, [nav, resetForm]);

  const handleRegisterRole = useCallback(() => {
    setIsAlertVisible(false);
    resetForm();
    if (registrationData) {
      nav.navigate("RegisterRole", {
        userId: registrationData.id,
        is_employer: registrationData.is_employer,
      });
    } else {
      console.error("Registration data is not available");
      // Có thể hiển thị một thông báo lỗi cho người dùng ở đây
    }
  }, [nav, registrationData, resetForm]);

  const handleImagePress = () => {
    setIsImageViewVisible(true);
  };

  useEffect(() => {
    Image.prefetch(
      Image.resolveAssetSource(require("../../../assets/Images/avatar_df.webp"))
        .uri
    )
      .then(() => setIsImageLoaded(true))
      .catch((error) => {
        console.error("Error loading default avatar:", error);
        setIsImageLoaded(true);
      });
    loadFonts();
  }, []);

  const resetForm = useCallback(() => {
    setUser({
      email: "",
      username: "",
      password: "",
      confirm: "",
    });
    setErr(false);
    setChecked(false);
    setPasswordVisible(false);
    setConfirmPasswordVisible(false);
    setErrorMessages({});
  }, []);

  useFocusEffect(resetForm);
  useEffect(() => {
    return () => {
      setRegistrationData(null);
    };
  }, []);

  const loadFonts = async () => {
    await Font.loadAsync({
      Faustina: require("../../../assets/fonts/Faustina_ExtraBold.ttf"),
    });
  };

  const picker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("JobPortalApp", "Quyền truy cập bị từ chối!");
    } else {
      let res = await ImagePicker.launchImageLibraryAsync();
      if (!res.canceled) {
        updateState("avatar", res.assets[0]);
      }
    }
  };

  const updateState = (field, value) => {
    setUser((current) => ({ ...current, [field]: value }));
    setErrorMessages((current) => ({ ...current, [field]: "" }));
  };

  const register = async () => {
    let errors = {};
    // Kiểm tra email
    if (!user.email) {
      errors.email = "Oops! It looks like you forgot to enter an email.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        errors.email = "Oops! Please enter a valid email address.";
      }
    }

    // Kiểm tra username
    if (!user.username) {
      errors.username = "Oops! It looks like you forgot to enter a username.";
    } else if (user.username.length < 3) {
      errors.username = "Username must be at least 3 characters long.";
    }

    // Kiểm tra password
    if (!user.password) {
      errors.password = "Oops! It looks like you forgot to enter a password.";
    } else if (user.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    } else if (!/\d/.test(user.password) || !/[a-zA-Z]/.test(user.password)) {
      errors.password = "Password must contain both letters and numbers.";
    }

    // Kiểm tra confirm password
    if (!user.confirm) {
      errors.confirm =
        "Oops! It looks like you forgot to confirm your password.";
    } else if (user.password !== user.confirm) {
      errors.confirm = "Oops! The passwords don't match. Please try again.";
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    setErrorMessages({});
    setErr(false);

    let form = new FormData();
    for (let key in user) {
      if (key !== "confirm") {
        if (key === "avatar") {
          form.append(key, {
            uri: user.avatar.uri,
            name: user.avatar.fileName,
            type: user.avatar.type,
          });
        } else {
          form.append(key, user[key]);
        }
      }
    }

    setLoading(true);
    try {
      let res = await APIs.post(endpoints["register"], form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201 && res.data) {
        setRegistrationData(res.data); // Lưu dữ liệu đăng ký
        resetForm();
        setUser({});
        // setTimeout(() => {
        //   nav.navigate("RegisterRole", {
        //     userId: res.data.id,
        //     is_employer: res.data.is_employer,
        //   });
        // }, 3000);
        // Alert.alert("Success", "Đăng ký thành công!");
        setIsAlertVisible(true);
      } else {
        Alert.alert("Error", res.data?.message || "Something went wrong");
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };

  if (!isImageLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B14F" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  //   const handleLogin = useCallback(() => {
  //   setIsAlertVisible(false);
  //   resetForm();
  //   nav.navigate("Login");
  // }, [nav, resetForm]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            {/* <Text style={styles.subject}>REGISTER AN ACCOUNT</Text> */}
            <View style={styles.titleContainer}>
              <Text style={styles.titleMain}>REGISTER</Text>
              <Text style={styles.titleSub}>Become an OU JOB member</Text>
            </View>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={handleImagePress}
            >
              <Image
                source={
                  user.avatar
                    ? { uri: user.avatar.uri }
                    : require("../../../assets/Images/avatar_df.webp")
                }
                style={styles.avatar}
                onError={(error) =>
                  console.error("Error loading avatar:", error)
                }
              />
              <TouchableOpacity
                style={styles.addIconContainer}
                onPress={picker}
              >
                <FontAwesome6 name="plus" size={16} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <TextInput
                value={user.email}
                onChangeText={(t) => updateState("email", t)}
                style={styles.input}
                label="Email"
                left={<TextInput.Icon icon="email" />}
                theme={{
                  colors: { primary: "#00B14F" },
                }}
              />
              {errorMessages.email && (
                <HelperText
                  type="error"
                  visible={true}
                  style={styles.errorText}
                >
                  {errorMessages.email}
                </HelperText>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                value={user.username}
                onChangeText={(t) => updateState("username", t)}
                style={styles.input}
                label="Username"
                left={<TextInput.Icon icon="account" />}
                theme={{ colors: { primary: "#00B14F" } }}
              />
              {errorMessages.username && (
                <HelperText
                  type="error"
                  visible={true}
                  style={styles.errorText}
                >
                  {errorMessages.username}
                </HelperText>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                secureTextEntry={!passwordVisible}
                value={user.password}
                onChangeText={(t) => updateState("password", t)}
                style={styles.input}
                label="Password"
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={passwordVisible ? "eye" : "eye-off"}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  />
                }
                theme={{ colors: { primary: "#00B14F" } }}
              />
              {errorMessages.password && (
                <HelperText
                  type="error"
                  visible={true}
                  style={styles.errorText}
                >
                  {errorMessages.password}
                </HelperText>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                secureTextEntry={!confirmPasswordVisible}
                value={user.confirm}
                onChangeText={(t) => updateState("confirm", t)}
                style={styles.input}
                label="Confirm Password"
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon
                    icon={confirmPasswordVisible ? "eye" : "eye-off"}
                    onPress={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  />
                }
                theme={{ colors: { primary: "#00B14F" } }}
              />
              {errorMessages.confirm && (
                <HelperText
                  type="error"
                  visible={true}
                  style={styles.errorText}
                >
                  {errorMessages.confirm}
                </HelperText>
              )}
            </View>

            <View style={styles.termsOuterContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setChecked(!checked)}
              >
                <Checkbox
                  status={checked ? "checked" : "unchecked"}
                  onPress={() => setChecked(!checked)}
                  color="#00B14F"
                />
                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>
                    I agree with the{" "}
                    <Text style={styles.linkText} onPress={handleService}>
                      Terms of Service
                    </Text>{" "}
                    and{" "}
                    <Text style={styles.linkText} onPress={handleRules}>
                      Privacy Policy
                    </Text>{" "}
                    of <Text style={styles.ouJobText}>OU Job</Text>
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Button
              icon="account"
              loading={loading}
              mode="contained"
              onPress={register}
              disabled={!checked}
              style={styles.button}
              labelStyle={styles.registerButtonLabel}
            >
              Register
            </Button>

            <View style={styles.navigationOptionsContainer}>
              <TouchableOpacity
                style={styles.navigationOption}
                onPress={() => nav.navigate("MyLogin")}
              >
                <Text style={styles.navigationOptionText}>
                  Already have an account?{" "}
                  <Text style={styles.navigationOptionHighlight}>Log in</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navigationOption}
                onPress={() => nav.navigate("HomeScreen")}
              >
                <Text style={styles.navigationOptionText}>
                  Explore without logging in{" "}
                  <Text style={styles.navigationOptionHighlight}>Try now</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <AlertModalRegister
          isVisible={isAlertVisible}
          title="Registration Successful!"
          message="Congratulations! Your registration was successful. You can now proceed to set up your profile or explore the app."
          onClose={handleClose}
          onLogin={handleLogin}
          onRegisterRole={handleRegisterRole}
        />
        <Modal
          isVisible={isImageViewVisible}
          onBackdropPress={() => setIsImageViewVisible(false)}
          onBackButtonPress={() => setIsImageViewVisible(false)}
          style={{ margin: 0 }}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsImageViewVisible(false)}
            >
              <FontAwesome6 name="xmark" size={24} color="white" />
            </TouchableOpacity>
            <ImageView
              imageUrls={[
                {
                  url: user.avatar
                    ? user.avatar.uri
                    : Image.resolveAssetSource(
                        require("../../../assets/Images/avatar_df.webp")
                      ).uri,
                },
              ]}
              enableSwipeDown={true}
              onSwipeDown={() => setIsImageViewVisible(false)}
              renderHeader={() => <View />} // This removes the default header
            />
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  registerButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ouJobText: {
    color: "#00B14F",
    fontWeight: "bold",
    fontSize: 16,
    textShadowColor: "rgba(0, 177, 79, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subject: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 5,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  linkText: {
    // color: "#00B14F",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  termsOuterContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  linkTextCentered: {
    color: "green",
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#28A745",
    marginVertical: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Optional: add some padding and adjust border radius for better appearance
    padding: 2,
    borderRadius: 30,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 20,
    position: "relative",
    borderWidth: 2,
  },
  addIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 0,
    width: 30,
    height: 30,
    backgroundColor: "#757474",
    borderRadius: 15,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#00B14F",
  },
  termsTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  termsText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  titleMain: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Faustina",
    color: "#00B14F",

    letterSpacing: 2,
    textShadowColor: "rgba(0, 177, 79, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  titleSub: {
    fontSize: 18,
    color: "#333",
    marginTop: 5,
    letterSpacing: 1,
  },
  navigationOptionsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  navigationOption: {
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    width: "100%",
  },
  navigationOptionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  navigationOptionHighlight: {
    color: "#00B14F",
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff3333",
    fontSize: 14,
    marginTop: -5,
    marginBottom: 10,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
  },
});

export default Register;
