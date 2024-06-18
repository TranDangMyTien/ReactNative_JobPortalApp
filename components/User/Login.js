import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, TouchableWithoutFeedback, Keyboard } from "react-native";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { MyDispatchContext } from "../../configs/Contexts";
import Config from "react-native-config";
import { CLIENT_ID, CLIENT_SECRET } from "../../utils/evn";
import { Alert } from "react-native";


const Login = () => {
  const fields = [
    { label: "Tên đăng nhập", icon: "email", field: "username" },
    { label: "Nhập mật khẩu", icon: "lock", field: "password", secureTextEntry: true },
  ];
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();
  const dispatch = useContext(MyDispatchContext);

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
        "client_id": process.env.CLIENT_ID,
        "client_secret": process.env.CLIENT_SECRET,
        "grant_type": "password",
      });
      await AsyncStorage.setItem("token", res.data.access_token);
      setTimeout(async () => {
        let user = await authApi(res.data.access_token).get(endpoints["current-user"]);
        console.info(user.data);
        dispatch({ type: "login", payload: user.data });
        nav.navigate("HomeScreen");
      }, 100);
    } catch (ex) {
      Alert.alert(
        'Lỗi đăng nhập',
        'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại !!',
        [
          {
            text: 'Đóng',
            style: 'cancel',
          },
        ],
        { cancelable: false }
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { fontSize: 32, marginTop: -20 }]}>OU Job</Text>
        <Text style={styles.welcomeText}>Chào mừng bạn đến với OU Job</Text>
      </View>
      {fields.map((f) => (
        <TextInput
          value={user[f.field]}
          onChangeText={(t) => change(t, f.field)}
          key={f.field}
          style={styles.input}
          label={f.label}
          secureTextEntry={f.secureTextEntry}
          left={<TextInput.Icon icon={f.icon} />}
          theme={{
            colors: {
              background: '#f2f2f2',
            },
          }}
        />
      ))}
      <TouchableOpacity style={styles.forgotPassword} onPress={() => nav.navigate("ForgotPassword")}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={login}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Đăng nhập</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.registerText}>Hoặc đăng nhập bằng</Text>
      <View style={styles.socialLoginContainer}>
        <TouchableOpacity style={styles.socialLoginButton}>
          <Image source={require('../Images/facebook.png')} style={styles.socialLoginImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialLoginButton}>
          <Image source={require('../Images/google.png')} style={styles.socialLoginImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialLoginButton}>
          <Image source={require('../Images/apple.png')} style={styles.socialLoginImage} />
        </TouchableOpacity>
      </View>
      <Text style={styles.registerText}>
        Đăng nhập để trở thành thành viên của OU Job!
      </Text>
      <TouchableOpacity style={styles.registerButton} onPress={() => nav.navigate("Register")}>
        <Text style={styles.registerButtonText}>Bạn chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.experienceButton} onPress={() => nav.navigate("HomeScreen")}>
        <Text style={styles.experienceButtonText}>Trải nghiệm không cần đăng nhập</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00B14F",
  },
  welcomeText: {
    fontSize: 16,
  },
  input: {
    width: "100%",
    marginBottom: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 30, // Rounded corners
    elevation: 2,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: "#00B14F",
  },
  button: {
    backgroundColor: "#00B14F",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  registerText: {
    marginBottom: 16,
  },
  socialLoginContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  socialLoginButton: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 8,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  socialLoginImage: {
    width: 24,
    height: 24,
  },
  registerButton: {
    marginBottom: 16,
  },
  registerButtonText: {
    color: "#00B14F",
  },
  experienceButton: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  experienceButtonText: {
    color: "#333",
  },
});

export default Login;
