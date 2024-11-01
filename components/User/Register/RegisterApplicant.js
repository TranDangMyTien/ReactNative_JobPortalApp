import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { HelperText } from "react-native-paper";
import {
  View,
  Text,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  TextInput,
  TouchableRipple,
  Snackbar,
  IconButton,
  useTheme,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import APIs, { endpoints } from "../../../configs/APIs";
import LottieView from "lottie-react-native";
import * as Animatable from "react-native-animatable";
// import { inflateSync } from "zlib";
// Thêm component RoundedTextInput mới
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

const RegisterApplicant = ({ route }) => {
  const [applicant, setApplicant] = useState({});
  const [error, setError] = useState(null);
  const [errorMessages, setErrorMessages] = useState({
    position: '',
    salary_expectation: '',
    experience: '',
    skills: '',
    areas: '',
    career: '',
    cv: ''
  });

  const { userId } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillsModalVisible, setSkillsModalVisible] = useState(false);

  const [areas, setAreas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [areasModalVisible, setAreasModalVisible] = useState(false);

  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [careersModalVisible, setCareersModalVisible] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [jsonLoading, setJsonLoading] = useState(false);

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const theme = useTheme();

  const formatLargeNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const resetForm = () => {
    setApplicant({});
    setSelectedSkills([]);
    setSelectedAreas([]);
    setSelectedCareer(null);
    setError(null);
    setRegistrationSuccess(false);
    setJsonLoading(false);
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      Faustina: require("../../../assets/fonts/Faustina_ExtraBold.ttf"),
      // FaustinaMd: require("../../assets/fonts/Faustina_Medium.ttf"),
      // DejaVu: require("../../assets/fonts/DejaVuSerifCondensed_Bold.ttf"),
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, areasRes, careersRes] = await Promise.all([
          APIs.get(endpoints["skills"]),
          APIs.get(endpoints["areas"]),
          APIs.get(endpoints["careers"]),
        ]);
        setSkills(skillsRes.data);
        setAreas(areasRes.data);
        setCareers(careersRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load necessary data. Please try again.");
      }
    };
    fetchData();
    loadFonts();
  }, []);

  useEffect(() => {
    return () => {
      setRegistrationSuccess(false);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setRegistrationSuccess(false);
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      resetForm();
    }, [])
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to upload your CV."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      updateApplicant("cv", result.assets[0]);
    }
  };

  const updateApplicant = (field, value) => {
    if (field === "salary_expectation") {
      // Chỉ cho phép nhập số
      const numericValue = value.replace(/[^0-9]/g, "");
      // Loại bỏ các số 0 ở đầu
      const formattedValue = numericValue.replace(/^0+/, "");
      setApplicant((current) => ({ ...current, [field]: formattedValue }));
    } else {
      setApplicant((current) => ({ ...current, [field]: value }));
    }
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills((prevSelectedSkills) =>
        prevSelectedSkills.filter((s) => s.id !== skill.id)
      );
    } else if (selectedSkills.length < 5) {
      setSelectedSkills((prevSelectedSkills) => [...prevSelectedSkills, skill]);
    } else {
      Alert.alert("Note", "You can only select up to 5 skills");
    }
  };

  const toggleArea = (area) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas((prevSelectedAreas) =>
        prevSelectedAreas.filter((a) => a.id !== area.id)
      );
    } else if (selectedAreas.length < 3) {
      setSelectedAreas((prevSelectedAreas) => [...prevSelectedAreas, area]);
    } else {
      Alert.alert("Note", "You can only select up to 3 work areas");
    }
  };

  const toggleCareer = (career) => {
    setSelectedCareer((prevSelectedCareer) =>
      prevSelectedCareer && prevSelectedCareer.id === career.id ? null : career
    );
  };

  const handleRegister = async () => {
    let errors = {};

    // Kiểm tra các trường bắt buộc
    if (!selectedSkills.length) {
      errors.skills = "Please select at least one skill!";
    }
    if (!selectedAreas.length) {
      errors.areas = "Please select at least one area!";
    }
    if (!selectedCareer) {
      errors.career = "Please select a career!";
    }
    if (!applicant.salary_expectation) {
      errors.salary_expectation = "Please enter your salary expectation!";
    } else {
      const salaryValue = parseInt(applicant.salary_expectation, 10);
      if (isNaN(salaryValue)) {
        errors.salary_expectation = "Salary must be a valid number!";
      } else if (salaryValue < 0 || salaryValue > 2147483647) {
        errors.salary_expectation =
          "Salary must be between 0 and 2,147,483,647!";
      }
    }
    if (!applicant.position) {
      errors.position = "Please enter your position!";
    }
    if (!applicant.experience) {
      errors.experience = "Please enter your experience!";
    }
    if (!applicant.cv) {
      errors.cv = "Please upload your CV!";
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }
    setErrorMessages({});
    setError(null);
    setLoading(true);
    setJsonLoading(true);

    const formData = new FormData();
    formData.append("position", applicant.position || "Employee");
    formData.append("salary_expectation", applicant.salary_expectation || "");
    formData.append("experience", applicant.experience || "");

    selectedSkills.forEach((skill) => formData.append("skills", skill.id));
    selectedAreas.forEach((area) => formData.append("areas", area.id));
    if (selectedCareer) formData.append("career", selectedCareer.id);

    if (applicant.cv) {
      formData.append("cv", {
        uri: applicant.cv.uri,
        name: applicant.cv.fileName || "cv.jpg",
        type: applicant.cv.type || "image/jpeg",
      });
    }

    formData.append("user", userId);

    try {
      const res = await APIs.post(
        endpoints["create-applicant"](userId),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.status === 201) {
        // Kiểm tra dữ liệu nhập vào
        // console.log(JSON.stringify(res.data, null, 2));

        setApplicant({});
        setSelectedSkills([]);
        setSelectedAreas([]);
        setSelectedCareer(null);

        setSnackbarVisible(true);
        setRegistrationSuccess(true);

        setTimeout(() => {
          resetForm();
          navigation.navigate("Register");
        }, 5000);
      } else {
        Alert.alert("Error", res.data?.message || "Something went wrong");
      }
    } catch (ex) {
      console.error(ex);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
      // setJsonLoading(false);
    }
  };
  const navigateToLogin = () => {
    setRegistrationSuccess(false);
    resetForm();
    navigation.navigate("MyLogin");
  };

  const navigateToHome = () => {
    setRegistrationSuccess(false);
    resetForm();
    navigation.navigate("HomeScreen");
  };

  const renderField = (label, icon, name, options = {}) => (
    <>
      <RoundedTextInput
        label={label}
        left={<TextInput.Icon icon={icon} color={"#1E3A8A"} />}
        onChangeText={(text) => updateApplicant(name, text)}
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
        {name === "salary_expectation" &&
        errorMessages[name] &&
        errorMessages[name].includes("between")
          ? `Salary must be between ${formatLargeNumber(
              0
            )} and ${formatLargeNumber(2147483647)}!`
          : errorMessages[name] || ""}
      </HelperText>
    </>
  );

  const renderModal = (
    title,
    items,
    selectedItems,
    toggleItem,
    visible,
    setModalVisible
  ) => (
    <Modal
      visible={visible}
      // onRequestClose={() => setModalVisible(false)}
      animationType="slide"
      onRequestClose={() => setRegistrationSuccess(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView style={styles.modalScrollView}>
            {items.map((item) => (
              <TouchableRipple
                key={item.id}
                onPress={() => toggleItem(item)}
                style={[
                  styles.modalItem,
                  selectedItems.includes(item) && styles.selectedModalItem,
                ]}
              >
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  {selectedItems.includes(item) && (
                    <IconButton icon="check" size={20} color="#4CAF50" />
                  )}
                </View>
              </TouchableRipple>
            ))}
          </ScrollView>
          <View style={styles.modalFooter}>
            <Button
              mode="contained"
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              Done
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Join Our Team</Text>
          </View>

          {renderField(
            "What position are you looking for?",
            "briefcase",
            "position"
          )}
          {renderField(
            "What's your expected salary?",
            "currency-usd",
            "salary_expectation",
            {
              keyboardType: "numeric",
              maxLength: 10, // Độ dài tối đa của số nguyên 32-bit không dấu
            }
          )}
          {renderField(
            "Tell us about your experience",
            "account-hard-hat",
            "experience",
            {
              multiline: true,
              numberOfLines: 3,
            }
          )}

          <TouchableRipple
            onPress={() => setSkillsModalVisible(true)}
            style={styles.selectionButton}
          >
            <View style={styles.selectionButtonContent}>
              <IconButton icon="star" size={24} color={theme.colors.primary} />
              <Text style={styles.selectionButtonText}>
                Your top skills ({selectedSkills.length}/5)
              </Text>
            </View>
          </TouchableRipple>
          <HelperText
            type="error"
            visible={!!errorMessages.skills}
            style={styles.errorText}
          >
            {errorMessages.skills}
          </HelperText>
          {renderModal(
            "Select Your Top Skills",
            skills,
            selectedSkills,
            toggleSkill,
            skillsModalVisible,
            setSkillsModalVisible
          )}

          <TouchableRipple
            onPress={() => setAreasModalVisible(true)}
            style={styles.selectionButton}
          >
            <View style={styles.selectionButtonContent}>
              <IconButton
                icon="map-marker"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.selectionButtonText}>
                Preferred work areas ({selectedAreas.length}/3)
              </Text>
            </View>
          </TouchableRipple>
          <HelperText
            type="error"
            visible={!!errorMessages.areas}
            style={styles.errorText}
          >
            {errorMessages.areas}
          </HelperText>
          {renderModal(
            "Select Work Areas",
            areas,
            selectedAreas,
            toggleArea,
            areasModalVisible,
            setAreasModalVisible
          )}

          <TouchableRipple
            onPress={() => setCareersModalVisible(true)}
            style={styles.selectionButton}
          >
            <View style={styles.selectionButtonContent}>
              <IconButton
                icon="briefcase-outline"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.selectionButtonText}>
                Career path {selectedCareer ? `(${selectedCareer.name})` : ""}
              </Text>
            </View>
          </TouchableRipple>
          <HelperText
            type="error"
            visible={!!errorMessages.career}
            style={styles.errorText}
          >
            {errorMessages.career}
          </HelperText>
          {renderModal(
            "Choose Your Career Path",
            careers,
            [selectedCareer],
            toggleCareer,
            careersModalVisible,
            setCareersModalVisible
          )}

          <TouchableRipple onPress={pickImage} style={styles.uploadButton}>
            <View style={styles.uploadButtonContent}>
              <IconButton icon="file-upload" size={24} color="white" />
              <Text style={styles.uploadButtonText}>
                {applicant.cv ? "Change CV" : "Upload Your CV"}
              </Text>
            </View>
          </TouchableRipple>
          <HelperText
            type="error"
            visible={!!errorMessages.cv}
            style={styles.errorText}
          >
            {errorMessages.cv}
          </HelperText>
          {applicant.cv && (
            <View style={styles.cvPreview}>
              <Image
                source={{ uri: applicant.cv.uri }}
                style={styles.cvImage}
              />
              <TouchableRipple
                onPress={() => updateApplicant("cv", null)}
                style={styles.removeCvButton}
              >
                <Text style={styles.removeCvText}>Remove CV</Text>
              </TouchableRipple>
            </View>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
          >
            <Button
              mode="contained"
              onPress={handleRegister}
              // loading={loading}
              disabled={loading}
              style={styles.registerButton}
              labelStyle={styles.registerButtonLabel}
            >
              Join Now
            </Button>
          </Animatable.View>
          {jsonLoading && (
            <View style={styles.loadingContainer}>
              <LottieView
                source={require("../../../assets/animations/loading.json")}
                autoPlay
                loop
                style={styles.lottieAnimation}
              />
              <Text style={styles.loadingText}>
                Processing your application...
              </Text>
            </View>
          )}

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
                  Your application has been successfully submitted. Welcome to
                  our team!
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={navigateToLogin}
                  >
                    <Text style={styles.primaryButtonText}>Go to Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={navigateToHome}
                  >
                    <Text style={styles.secondaryButtonText}>Back to Home</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 5,
    borderRadius: 20,
    overflow: "hidden",
    // backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%', // Đảm bảo các ô chiếm hết chiều rộng của container
  },
  selectionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: -10,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  secondaryButtonText: {
    color: "#1E3A8A",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1E3A8A",
    width: "100%",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  uploadButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 20,
    color: "#1E3A8A",
    textAlign: "center",
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
    marginTop: -18,
  },
  successSubText: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    // backgroundColor: "#FFF8E1", // Màu nền ấm áp hơn
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontFamily: "Faustina",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#1E3A8A",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    height: 50, // Đặt chiều cao cố định cho tất cả các ô nhập liệu
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderRadius: 60, // Tăng độ bo tròn
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Thêm đổ bóng
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
  selectionButtonText: {
    color: "#1E3A8A",
    fontSize: 17,
    textAlign: "center",
  },
  uploadButton: {
    backgroundColor: "#10B981",
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  cvPreview: {
    alignItems: "center",
    marginBottom: 20,
  },
  cvImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  removeCvButton: {
    padding: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 5,
  },
  removeCvText: {
    color: "#DC2626",
    fontWeight: "bold",
  },
  registerButtonLabel: {
    fontSize: 17,
    color: "white",
  },
  errorText: {
    color: "#DC2626",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#1E3A8A",
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // Cho Android
  },
  modalContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  modalHeader: {
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    color: "#1E3A8A",
    alignItems: "center",
    textAlign: "center",
  },
  modalScrollView: {
    flex: 1,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
    height: 60,
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    textAlignVertical: "center",
  },
  modalItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 16, // Thêm padding ngang
  },

  selectedModalItem: {
    backgroundColor: "#E0E7FF",
  },
  modalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E7FF",
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: "#1E3A8A",
  },
  // loadingContainer: {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "rgba(255, 255, 255, 0.8)",
  // },
  // loadingText: {
  //   marginTop: 10,
  //   fontSize: 16,
  //   color: "#1E3A8A",
  // },
  snackbar: {
    backgroundColor: "#10B981",
  },
  errorText: {
    color: "#ff3333",
    fontSize: 14,
    marginTop: -5,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default RegisterApplicant;
