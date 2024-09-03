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
    companyName: "",
    position: "",
    information: "",
    address: "",
    company_website: "",
    company_type: 0,
    image: "",
    career: { name: "" },
    employmenttype: { type: "" },
    area: { name: "" },
    deadline: "",
    quantity: 0,
    gender: 0,
    location: "",
    salary: 0,
    description: "",
    experience: "",
    reported: true,
    active: true,
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await APIs.get(endpoints["job-detail"](jobId));
        setJob(response.data);
        setFormData({
          ...response.data,
          career: response.data.career.name,
          employmenttype: response.data.employmenttype.type,
          area: response.data.area.name,
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
      <Text style={styles.title}>Edit Job Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={formData.title}
        onChangeText={(text) => handleChange("title", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Company Name"
        value={formData.companyName}
        onChangeText={(text) => handleChange("companyName", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Position"
        value={formData.position}
        onChangeText={(text) => handleChange("position", text)}
      />
      {/* Add more inputs for other fields */}
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
