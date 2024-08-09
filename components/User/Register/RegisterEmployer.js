import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  HelperText,
  TextInput,
  Card,
  Paragraph,
  TouchableRipple,
  IconButton,
  useTheme,
} from "react-native-paper";
import MyStyles from "../../../styles/MyStyles";
import React, { useState, useEffect } from "react";
import APIs, { endpoints } from "../../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from "react-native";
import LottieView from "lottie-react-native";
import * as Animatable from "react-native-animatable";
import * as Font from "expo-font";

// Đóng warning
LogBox.ignoreLogs([
  "Warning: TextInput.Icon: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
]);

const RoundedTextInput = ({ style, ...props }) => {
  const theme = useTheme();
  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        {...props}
        style={styles.input}
        theme={{ roundness: 30, colors: { primary: "#4CAF50" } }}
      />
    </View>
  );
};

const RegisterEmployer = ({ route }) => {
  const [employer, setEmployer] = useState({});
  const [err, setErr] = useState(false);
  const [companyTypeError, setCompanyTypeError] = useState(false); // Thêm state để lưu trữ lỗi loại hình công ty
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [companyTypeModalVisible, setCompanyTypeModalVisible] = useState(false);
  const theme = useTheme();
  const [error, setError] = useState(null);
  const [selectedCompanyType, setSelectedCompanyType] = useState(null);

  // const { userId } = route.params;

  // // TEST BẰNG TAY - Tạo EMPLOYER
  const userId = 67;

  const companyTypes = [
    { id: 0, name: "Limited Liability Company" },
    { id: 1, name: "Joint Stock Company" },
    { id: 2, name: "Single Member Limited Liability Company" },
    { id: 3, name: "Private Company" },
    { id: 4, name: "Joint Venture Company" },
    { id: 5, name: "Corporation" },
  ];


  const nav = useNavigation();
  const [companyType, setCompanyType] = useState(""); // State mới để lưu trữ giá trị số của loại hình công ty

  const loadFonts = async () => {
    await Font.loadAsync({
      Faustina: require("../../../assets/fonts/Faustina_ExtraBold.ttf"),
      //Faustina_ExtraBold.ttf
    });
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const updateEmployer = (field, value) => {
    setEmployer(current => ({ ...current, [field]: value }));
    if (field === 'company_website') {
      validateWebsite(value);
    }

  };

  const validateWebsite = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      setErrorMessages(current => ({ ...current, company_website: "Please enter a valid URL (e.g., https://www.example.com)" }));
    } else {
      setErrorMessages(current => ({ ...current, company_website: "" }));
    }
  };
  

  const handleRegister = async () => {
    setErr(false);
    let errors = {};
    if (!employer.companyName) errors.companyName = "Please enter company name";
    if (!employer.position) errors.position = "Please enter position";
    if (!employer.information)
      errors.information = "Please enter company information";
    if (!employer.address) errors.address = "Please enter address";
    if (!employer.company_website)
      errors.company_website = "Please enter company website";
    if (!employer.company_type)
      errors.company_type = "Please select company type";

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    setErrorMessages({});
    setError(null);
    setLoading(true);

    let form = new FormData();
    for (let key in employer) {
      form.append(key, employer[key]);
    }

    // Lấy id từ user (Mẫu trên cùng để tạo)
    form.append("user", userId);

    console.info(form);
    console.info(userId);
    setLoading(true);
    try {
      let res = await APIs.post(endpoints["create-employer"](userId), form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) nav.navigate("MyLogin"); //Đăng ký xong thì chuyển qua login
    } catch (ex) {
      console.error(ex);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label, icon, name, options = {}) => (
    <>
      <RoundedTextInput
        label={label}
        left={<TextInput.Icon icon={icon} color={"#1E3A8A"} />}
        onChangeText={(text) => updateEmployer(name, text)}
        value={employer[name]}
        mode="outlined"
        outlineColor={"#1E3A8A"}
        activeOutlineColor={"#1E3A8A"}
        {...options}
      />
      <HelperText
        type="error"
        visible={!!errorMessages[name]}
        style={styles.errorText}
      >
        {errorMessages[name]}
      </HelperText>
    </>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[MyStyles.container, MyStyles.margin]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Become a Hiring Partner</Text>
            </View>

            {renderField("Company Name", "domain", "companyName")}
            {renderField("Position", "briefcase", "position")}
            {renderField("Company Information", "information", "information", {
              multiline: true,
              numberOfLines: 3,
            })}
            {renderField("Address", "map-marker", "address")}
            {renderField("Website", "web", "company_website", {
              keyboardType: "url",
            })}

            <TouchableRipple
              onPress={() => setCompanyTypeModalVisible(true)}
              style={styles.selectionButton}
            >
              <View style={styles.selectionButtonContent}>
                <IconButton
                  icon="briefcase-variant"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.selectionButtonText}>
                  {selectedCompanyType 
                    ? companyTypes.find(t => t.id === selectedCompanyType).name 
                    : "Select Company Type"}
                </Text>
              </View>
            </TouchableRipple>
            <HelperText
              type="error"
              visible={!!errorMessages.company_type}
              style={styles.errorText}
            >
              {errorMessages.company_type}
            </HelperText>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={2000}
            >
              <Button
                mode="contained"
                onPress={handleRegister}
                disabled={loading}
                style={styles.registerButton}
                labelStyle={styles.registerButtonLabel}
              >
                Register Now
              </Button>
            </Animatable.View>

            <Modal
              visible={companyTypeModalVisible}
              animationType="slide"
              onRequestClose={() => setCompanyTypeModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Company Type</Text>
                <ScrollView style={styles.modalScrollView}>
                  {companyTypes.map((type) => (
                    <TouchableRipple
                      key={type.id}
                      onPress={() => {
                        updateEmployer("company_type", type.id);
                        setSelectedCompanyType(type.id);
                        setCompanyTypeModalVisible(false);
                      }}
                      style={[
                        styles.modalItem,
                        selectedCompanyType === type.id && styles.selectedModalItem
                      ]}
                    >
                      <View style={styles.modalItemContent}>
                        <Text style={[
                          styles.modalItemText,
                          selectedCompanyType === type.id && styles.selectedModalItemText
                        ]}>
                          {type.name}
                        </Text>
                        {selectedCompanyType === type.id && (
                          <IconButton
                            icon="check"
                            size={24}
                            color={"#4CAF50"}
                          />
                        )}
                      </View>
                    </TouchableRipple>
                  ))}
                </ScrollView>
                <Button
                  mode="contained"
                  onPress={() => setCompanyTypeModalVisible(false)}
                  style={styles.modalButton}
                >
                  Close
                </Button>
              </View>
            </Modal>

            <Modal
              visible={registrationSuccess}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setRegistrationSuccess(false)}
            >
              <View style={styles.successModalContainer}>
                <View style={styles.successModalContent}>
                  <LottieView
                    source={require("../../../assets/animations/success.json")}
                    autoPlay
                    loop={false}
                    style={styles.successAnimation}
                  />
                  <Text style={styles.successText}>Congratulations!</Text>
                  <Text style={styles.successSubText}>
                    Your employer account has been successfully registered.
                  </Text>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => {
                      setRegistrationSuccess(false);
                      navigation.navigate("MyLogin");
                    }}
                  >
                    <Text style={styles.primaryButtonText}>Go to Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  title: {
    fontFamily: "Faustina",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E3A8A",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    marginBottom: 5,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  input: {
    height: 50,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 60,
  },
  selectionButton: {
    backgroundColor: "#E0E7FF",
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  selectionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectionButtonText: {
    color: "#1E3A8A",
    fontSize: 17,
  },
  errorText: {
    color: "#DC2626",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: "#1E3A8A",
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  registerButtonLabel: {
    fontSize: 17,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1E3A8A",
    textAlign: "center",
  },
  modalScrollView: {
    flex: 1,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: "#1E3A8A",
  },
  successModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  successModalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "90%",
    maxWidth: 400,
  },
  successAnimation: {
    width: 150,
    height: 150,
  },
  successText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#10B981",
    marginVertical: 20,
    textAlign: "center",
  },
  successSubText: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#28A745",
    marginVertical: 0,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
  },
  selectedModalItem: {
    backgroundColor: "#E0E7FF",
  },
  modalItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  selectedModalItemText: {
    color: "#4CAF50",
    fontWeight: 'bold',
  },
});
export default RegisterEmployer;
