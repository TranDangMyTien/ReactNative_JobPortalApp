import React, { useState, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";
import APIs, { endpoints } from "../../../configs/APIs";
import LottieView from "lottie-react-native";
import * as Animatable from "react-native-animatable";
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
  // const { userId } = route.params;
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
  }, []);

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
    setApplicant((current) => ({ ...current, [field]: value }));
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
        console.log(JSON.stringify(res.data, null, 2));

        setApplicant({});
        setSelectedSkills([]);
        setSelectedAreas([]);
        setSelectedCareer(null);

        setSnackbarVisible(true);
        setRegistrationSuccess(true);

        // setTimeout(() => {
        //   navigation.navigate("Home");
        // }, 2000);
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
    navigation.navigate("Login");
  };

  const navigateToHome = () => {
    navigation.navigate("Home");
  };

  const renderField = (label, icon, name, options = {}) => (
    <RoundedTextInput
      label={label}
      left={<TextInput.Icon icon={icon} color={"#1E3A8A"} />}
      onChangeText={(text) => updateApplicant(name, text)}
      mode="outlined"
      outlineColor={"#1E3A8A"}
      activeOutlineColor={"#1E3A8A"}
      {...options}
    />
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
      onRequestClose={() => setModalVisible(false)}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{title}</Text>
        <ScrollView>
          {items.map((item) => (
            <TouchableRipple
              key={item.id}
              onPress={() => toggleItem(item)}
              style={[
                styles.modalItem,
                selectedItems.includes(item) && styles.selectedModalItem,
              ]}
            >
              <Text>{item.name}</Text>
            </TouchableRipple>
          ))}
        </ScrollView>
        <Button
          mode="contained"
          onPress={() => setModalVisible(false)}
          style={styles.modalButton}
        >
          Done
        </Button>
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
            { keyboardType: "numeric" }
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
          {/* {jsonLoading && (
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
          )} */}

          <Modal
            visible={registrationSuccess}
            transparent={true}
            animationType="fade"
          >
            <View style={styles.successModalContainer}>
              <View style={styles.successModalContent}>
                <LottieView
                  source={require("../../../assets/animations/success.json")}
                  autoPlay
                  loop={false}
                  style={styles.successAnimation}
                />
                <Text style={styles.successText}>Welcome aboard!</Text>
                <Text style={styles.successSubText}>
                  Your application has been submitted successfully.
                </Text>
                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={navigateToLogin}
                    style={styles.modalButton}
                  >
                    Go to Login
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={navigateToHome}
                    style={styles.modalButton}
                  >
                    Back to Home
                  </Button>
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
    marginBottom: 10,
    borderRadius: 20,
    overflow: "hidden",
    // backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: -10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
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
    fontSize: 18,
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
  },
  successAnimation: {
    width: 150,
    height: 150,
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10B981",
    marginVertical: 20,
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
    // fontSize: 28,
    // fontWeight: "bold",
    // textAlign: "center",
    // marginBottom: 30,
    // color: "#1E3A8A",
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
    marginBottom: 20,
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
    padding: 20,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1E3A8A",
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
  },
  selectedModalItem: {
    backgroundColor: "#E0E7FF",
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: "#1E3A8A",
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1E3A8A",
  },
  snackbar: {
    backgroundColor: "#10B981",
  },
});

export default RegisterApplicant;
