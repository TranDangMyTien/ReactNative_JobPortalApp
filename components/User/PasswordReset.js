import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import APIs, { endpoints } from "../../configs/APIs";
import CustomHeader from "../../components/constants/CustomHeader";
import TextComponent from "../../components/constants/TextComponent";

const PasswordReset = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputs = useRef([]);

  const handleTokenChange = (text, index) => {
    const newToken = [...token];
    newToken[index] = text;
    setToken(newToken);

    // Auto-focus to the next input field
    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }

    if (newToken.every((char) => char !== "")) {
      validateToken(newToken.join(""));
    } else {
      setIsTokenValid(false);
    }
  };

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
  };

  const validateToken = async (token) => {
    try {
      let res = await APIs.post(endpoints["check-token"], { token });
      if (res.data.exists) {
        setIsTokenValid(true);
      } else {
        setIsTokenValid(false);
        Alert.alert(
          "Invalid Token",
          "The token you entered does not exist. Please check and try again.",
          [{ text: "OK", onPress: () => setToken(["", "", "", ""]) }]
        );
      }
    } catch (error) {
      console.error("Error validating token", error);
      setIsTokenValid(false);
      Alert.alert(
        "Error",
        "An error occurred while validating the token. Please try again later.",
        [{ text: "OK", onPress: () => setToken(["", "", "", ""]) }]
      );
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword.length < 6) {
      Alert.alert(
        "Password Error",
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (!isTokenValid) {
      Alert.alert(
        "Token Error",
        "The token is invalid. Please check and try again."
      );
      return;
    }

    setIsLoading(true);
    try {
      const tokenInt = parseInt(token.join(""));
      let res = await APIs.post(endpoints["change-password"], {
        token: tokenInt,
        new_password: newPassword,
      });
      console.log(res);
      Alert.alert("Success", "Password has been reset successfully!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error resetting password", error);
      Alert.alert("Error", "Failed to reset password. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <CustomHeader title="Reset Password" onBackPress={handleGoBack} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter the token sent to your email and your new password.
            </Text>

            <View style={styles.tokenContainer}>
              {token.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={styles.tokenInput}
                  value={value}
                  onChangeText={(text) => handleTokenChange(text, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  placeholder="-"
                />
              ))}
            </View>

            <TextComponent
              style={styles.passwordInput}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={handleNewPasswordChange}
            />

            <TouchableOpacity
              style={[
                styles.button,
                !isTokenValid || newPassword.length < 7
                  ? styles.disabledButton
                  : styles.enabledButton,
              ]}
              onPress={handlePasswordReset}
              disabled={isLoading || !isTokenValid || newPassword.length < 7}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Processing..." : "Send"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  tokenContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  tokenInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 24,
    textAlign: "center",
  },
  passwordInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  enabledButton: {
    backgroundColor: "#00b14f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PasswordReset;
