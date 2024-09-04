import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import { getToken } from "../../utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditJobScreen = ({ route, navigation }) => {
  const { jobId } = route.params;
  const [job, setJob] = useState({});
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
    // Ensure that quantity and salary are handled as numbers
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
        navigation.goBack(); // Navigate back to the job details screen
      } else {
        Alert.alert("Error", "Failed to update job post.");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      Alert.alert("Error", "An error occurred while updating the job post.");
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa bài đăng tuyển dụng</Text>
      <Text style={styles.sectionTitle}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={formData.title}
        onChangeText={(text) => handleChange("title", text)}
      />
      <Text style={styles.sectionTitle}>Position</Text>
      <TextInput
        style={styles.input}
        placeholder="Position"
        value={formData.position}
        onChangeText={(text) => handleChange("position", text)}
      />
      <Text style={styles.sectionTitle}>Deadline</Text>
      <TextInput
        style={styles.input}
        placeholder="Deadline"
        value={formData.deadline}
        onChangeText={(text) => handleChange("deadline", text)}
      />
      <Text style={styles.sectionTitle}>Quantity</Text>
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        keyboardType="numeric"
        value={formData.quantity.toString()}
        onChangeText={(text) => handleChange("quantity", parseInt(text))}
      />
      <Text style={styles.sectionTitle}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={formData.location}
        onChangeText={(text) => handleChange("location", text)}
      />
      <Text style={styles.sectionTitle}>Salary</Text>
      <TextInput
        style={styles.input}
        placeholder="Salary"
        keyboardType="numeric"
        value={formData.salary.toString()}
        onChangeText={(text) => handleChange("salary", parseInt(text))}
      />
      <Text style={styles.sectionTitle}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        multiline
        numberOfLines={4}
        value={formData.description}
        onChangeText={(text) => handleChange("description", text)}
      />
      <Text style={styles.sectionTitle}>Experience</Text>
      <TextInput
        style={styles.input}
        placeholder="Experience"
        multiline
        numberOfLines={2}
        value={formData.experience}
        onChangeText={(text) => handleChange("experience", text)}
      />
      <Button title="Update Job Post" onPress={handleSubmit} />
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
});

export default EditJobScreen;
