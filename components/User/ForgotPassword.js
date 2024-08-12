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
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../../components/constants/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
const ForgotPassword = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <CustomHeader title="Forgot Password" onBackPress={handleGoBack} />
     
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
});

export default ForgotPassword;
