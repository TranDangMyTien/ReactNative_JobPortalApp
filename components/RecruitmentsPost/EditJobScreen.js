import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
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
        setJob(response.data);
        setFormData({
          title: response.data.title,
          position: response.data.position,
          deadline: response.data.deadline,
          quantity: response.data.quantity,
          location: response.data.location,
          salary: response.data.salary,
          description: response.data.description,
          experience: response.data.experience,
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await authAPI(authToken).patch(
        endpoints["edit-post"](jobId),
        formData
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa bài đăng tuyển dụng</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={formData.title}
        onChangeText={(text) => handleChange("title", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Position"
        value={formData.position}
        onChangeText={(text) => handleChange("position", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Deadline"
        value={formData.deadline}
        onChangeText={(text) => handleChange("deadline", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        keyboardType="numeric"
        value={formData.quantity.toString()}
        onChangeText={(text) => handleChange("quantity", parseInt(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => handleChange("location", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Salary"
        keyboardType="numeric"
        value={formData.salary.toString()}
        onChangeText={(text) => handleChange("salary", parseInt(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        multiline
        numberOfLines={4}
        value={formData.description}
        onChangeText={(text) => handleChange("description", text)}
      />
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
});

export default EditJobScreen;
