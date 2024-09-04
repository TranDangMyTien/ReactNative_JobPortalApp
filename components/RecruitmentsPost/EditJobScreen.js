import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditJobScreen = ({ route, navigation }) => {
  const { jobId } = route.params;
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    position: "",
    deadline: "",
    quantity: 0,
    location: "",
    salary: 0,
    description: "",
    experience: "",
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await APIs.get(endpoints["job-detail"](jobId));
        const jobData = response.data;
        setFormData({
          title: jobData.title,
          position: jobData.position,
          deadline: jobData.deadline,
          quantity: jobData.quantity?.toString() || "",
          location: jobData.location,
          salary: jobData.salary?.toString() || "",
          description: jobData.description,
          experience: jobData.experience,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleChange = (name, value) => {
    if (name === "quantity" || name === "salary") {
      const numberValue = value === "" ? "" : parseInt(value, 10);
      setFormData({ ...formData, [name]: isNaN(numberValue) ? "" : numberValue.toString() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await authAPI(authToken).patch(
        endpoints["edit-post"](jobId),
        {
          ...formData,
          quantity: parseInt(formData.quantity, 10),
          salary: parseInt(formData.salary, 10),
        }
      );
      if (response.status === 200) {
        Alert.alert("Success", "Job post updated successfully!");
        navigation.navigate("JobDetail", { jobId });
      } else {
        Alert.alert("Error", "Failed to update job post.");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      Alert.alert("Error", "An error occurred while updating the job post.");
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Edit Job Post</Text>
        {Object.keys(formData).map((key) => (
          <View key={key} style={styles.inputContainer}>
            <Text style={styles.sectionTitle}>{capitalizeFirstLetter(key)}</Text>
            <TextInput
              style={styles.input}
              placeholder={capitalizeFirstLetter(key)}
              value={formData[key].toString()}
              onChangeText={(text) => handleChange(key, text)}
              keyboardType={key === "quantity" || key === "salary" ? "numeric" : "default"}
              multiline={key === "description" || key === "experience"}
              numberOfLines={key === "description" ? 4 : key === "experience" ? 2 : 1}
              placeholderTextColor="#888"
            />
          </View>
        ))}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Update Job Post</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
    textTransform: "uppercase",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#FFF",
    fontSize: 16,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#555",
  },
});

export default EditJobScreen;
