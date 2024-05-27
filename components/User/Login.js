import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { MyDispatchContext } from "../../configs/Contexts";

const Login = () => {
  const fields = [
    { label: "Email", icon: "email", field: "username" },
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
    try {
      let res = await APIs.post(endpoints["login"], {
        ...user,
        "client_id": "NeVC6qnpHJRgsBLyvgsRH9sxHyjMvp0PwvbsTzMD",
        "client_secret": "ivNEzYwTq6gGqjXBDw9bACnfWraPZGSyDm8y5Jr1opAt52JCvGuVoePOP3w3PRBDWZ1LnP9jYdIxWESY2nP05lmRApwmbT3pVq8UmK3CckRPzFU4SlNOLgcZg6foYGPw",
        "grant_type": "password",
      });
      await AsyncStorage.setItem("token", res.data.access_token);
      setTimeout(async () => {
        let user = await authApi(res.data.access_token).get(endpoints["current-user"]);
        console.info(user.data);
        dispatch({ type: "login", payload: user.data });
        nav.navigate("Home");
      }, 100);
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        />
      ))}
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
      <Text style={styles.registerText}>Hoặc đăng nhập bằng</Text>
      <View style={styles.socialLoginContainer}>
        <TouchableOpacity style={styles.socialLoginButton}>
          <Text style={styles.socialLoginButtonText}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialLoginButton}>
          <Text style={styles.socialLoginButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialLoginButton}>
          <Text style={styles.socialLoginButtonText}>Apple</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.registerText}>
        Đăng nhập để trở thành thành viên của OU Job!
      </Text>
      <TouchableOpacity style={styles.registerButton} onPress={() => nav.navigate("Register")}>
        <Text style={styles.registerButtonText}>Bạn chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.experienceButton} onPress={() => nav.navigate("Home")}>
        <Text style={styles.experienceButtonText}>Trải nghiệm không cần đăng nhập</Text>
      </TouchableOpacity>
    </View>
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  socialLoginButtonText: {
    color: "#333",
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