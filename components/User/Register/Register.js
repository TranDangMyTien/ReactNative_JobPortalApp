import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
  }, []);

  useFocusEffect(resetForm);
  useEffect(() => {
    return () => {
      setRegistrationData(null);
    };
  }, []);

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
  };

  const register = async () => {
    if (user["password"] !== user["confirm"]) {
      setErr(true);
    } else {
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
    }
  };

  if (!isImageLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B14F" />
        <Text style={styles.loadingText}>Đang tải...</Text>
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
            <Text style={styles.subject}>ĐĂNG KÝ TÀI KHOẢN</Text>
            <TouchableOpacity style={styles.avatarContainer} onPress={picker}>
              {/* {user.avatar ? (
                <Image
                  source={{ uri: user.avatar.uri }}
                  style={styles.avatar}
                />
              ) : (
                <Image
                  source={require("../../../assets/Images/avatar_df.webp")}
                  style={styles.avatar}
                  // onLoad={() => setDefaultAvatarLoading(false)}
                />
              )} */}
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
            </View>
            <HelperText type="error" visible={err}>
              Mật khẩu không khớp!
            </HelperText>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setChecked(!checked)}
            >
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                onPress={() => setChecked(!checked)}
              />
              <View style={{ flex: 1 }}>
                <Text>
                  Tôi đã đọc và đồng ý với{" "}
                  <Text style={styles.linkText}>Điều khoản dịch vụ</Text> và{" "}
                  <Text style={styles.linkText}>Chính sách bảo mật</Text> của OU
                  Job!
                </Text>
              </View>
            </TouchableOpacity>

            <Button
              icon="account"
              loading={loading}
              mode="contained"
              onPress={register}
              disabled={!checked}
              style={styles.button}
            >
              ĐĂNG KÝ
            </Button>

            <TouchableRipple onPress={() => nav.navigate("Login")}>
              <Text style={styles.linkTextCentered}>
                Bạn đã có tài khoản? Đăng nhập ngay
              </Text>
            </TouchableRipple>

            <TouchableRipple onPress={() => nav.navigate("HomeScreen")}>
              <Text style={styles.linkTextCentered}>
                Trải nghiệm không cần đăng nhập
              </Text>
            </TouchableRipple>
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
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  linkText: {
    color: "green",
    textDecorationLine: "underline",
  },
  linkTextCentered: {
    color: "green",
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#28A745",
    marginVertical: 10,
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
});

export default Register;
