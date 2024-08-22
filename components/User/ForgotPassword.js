import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../../components/constants/CustomHeader";
import APIs, { endpoints } from "../../configs/APIs";
import TextComponent from "../../components/constants/TextComponent";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (email.trim().length === 0) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      // Check if email exists
      let checkRes = await APIs.post(endpoints["check_email_exists"], { email });
      if (!checkRes.data.exists) {
        Alert.alert(
          "Email Not Found",
          "The email you entered is not registered in our system. Please check and try again."
        );
        setEmail(""); // Clear the entered email
        setIsLoading(false);
        return;
      }

      // If email exists, proceed to send the reset code
      let sendRes = await APIs.post(endpoints["password-reset"], { email });
      console.log(sendRes);
      Alert.alert("Success", "We have sent a code to your email for password reset!");
    } catch (error) {
      console.log(`Unable to send code via email, ${error}`);
      Alert.alert(
        "Error",
        "An error occurred while sending the password reset code. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <CustomHeader title="Forgot Password" onBackPress={handleGoBack} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextComponent
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                email.trim().length === 0 ? styles.disabledButton : styles.enabledButton,
              ]}
              onPress={handleForgotPassword}
              disabled={isLoading || email.trim().length === 0}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Processing..." : "Send Code"}
              </Text>
            </TouchableOpacity>
            <View style={styles.instructionContainer}>
              <Text style={styles.instruction}>
                Enter the email address associated with your account, and we will send you a code to reset your password.
              </Text>
            </View>
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
  inputContainer: {
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#007bff",
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
    textAlign: "center",
  },
  instructionContainer: {
    marginTop: 16,
  },
  instruction: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default ForgotPassword;
