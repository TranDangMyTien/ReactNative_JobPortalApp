import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { Button, Title, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

const RegisterRole = ({ route }) => {
  const navigation = useNavigation();
  const { userId, is_employer } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const loadFonts = async () => {
    await Font.loadAsync({
      Faustina: require("../../../assets/fonts/Faustina_ExtraBold.ttf"),
    });
  };

  const handleGoBack = () => {
    setLoading(true);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setLoading(false);
        // navigation.goBack(); Register
        navigation.navigate("HomeScreen");
      }, 1000);
    });
  };

  const handleApplicantPress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("RegisterApplicant", { userId });
    }, 2000);
  };

  const handleEmployerPress = () => {
    if (is_employer === true) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigation.navigate("RegisterEmployer", { userId });
      }, 2000);
    } else {
      Alert.alert(
        "Application in Progress",
        "Thank you for your interest in becoming an employer! 🎉\n\nYour application is currently under review by our admin team. We're working hard to process it as quickly as possible.\n\nWe'll notify you as soon as it's approved. In the meantime, feel free to explore other features of OU Job!",
        [
          {
            text: "Got it!",
            onPress: () => console.log("OK Pressed"),
            style: "default",
          },
        ],
        { cancelable: false }
      );
    }
  };
  useEffect(() => {
    if (!userId) {
      navigation.navigate("HomeScreen");
    }
    loadFonts();
  }, [userId]);

  return (
    <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
      <LinearGradient colors={["#000000", "#0E3353"]} style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Image
            source={require("../../../assets/icons/left.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Path</Text>
      </LinearGradient>

      <View style={styles.progressIndicator}>
        <View style={styles.progressStep}></View>
        <View style={[styles.progressStep, styles.activeStep]}></View>
        <View style={styles.progressStep}></View>
      </View>

      <View style={styles.container}>
        <Text style={styles.header}>OU Job</Text>
        <Title style={styles.title}>What brings you to OU Job?</Title>
        <Button
          mode="contained"
          icon="briefcase-search"
          style={styles.buttonApp}
          onPress={handleApplicantPress}
          disabled={loading}
          labelStyle={styles.buttonText}
        >
          I'm looking for work
        </Button>
        <Button
          mode="contained"
          icon="account-tie"
          style={styles.buttonEmp}
          onPress={handleEmployerPress}
          disabled={loading}
          labelStyle={styles.buttonText}
        >
          I'm hiring
        </Button>
        {loading && (
          <View style={styles.loadingContainer}>
            <LottieView
              source={require("../../../assets/animations/loading.json")}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
            <Text style={styles.loadingText}>Please wait...</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  header: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#28A745",
    marginBottom: 15,
    fontFamily: "Faustina",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 35,
    color: "#333",
    fontFamily: "Faustina",
  },
  buttonApp: {
    marginVertical: 10,
    paddingVertical: 10,
    width: "80%",
    backgroundColor: "#38F426",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow property for Android
    elevation: 5,
    
  },
  buttonEmp: {
    marginVertical: 10,
    paddingVertical: 10,
    width: "80%",
    backgroundColor: "#26F4E7",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow property for Android
    elevation: 5,
    
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loading: {
    marginTop: 20,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#00b14f",
    position: "relative",
  },
  backIcon: {
    width: 40, // Điều chỉnh kích thước biểu tượng quay lại
    height: 40, // Điều chỉnh kích thước biểu tượng quay lại
    tintColor: "white",
  },
  backButton: {
    padding: 8, // Thêm lề cho vùng chạm
  },
  headerTitle: {
    flex: 1, // Đảm bảo tiêu đề chiếm hết không gian còn lại
    textAlign: "center",
    fontSize: 24, // Điều chỉnh kích thước chữ
    fontWeight: "bold",
    color: "white",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#28A745",
    fontWeight: "bold",
  },
  progressIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#F5F5F5",

  },
  progressStep: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D1D1D1",
    marginHorizontal: 5,
  },
  activeStep: {
    backgroundColor: "#000000",
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});

export default RegisterRole;
