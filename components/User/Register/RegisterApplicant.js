import {View,Text,Alert,Image,ScrollView,KeyboardAvoidingView,Platform,Modal, StyleSheet, TouchableWithoutFeedback, Keyboard} from "react-native";
import {Button,HelperText,TextInput,TouchableRipple,List,Card,} from "react-native-paper";
import MyStyles from "../../../styles/MyStyles";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
import APIs, { endpoints } from "../../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from "react-native";
  
  // Đóng warning
  LogBox.ignoreLogs([
    "Warning: TextInput.Icon: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
  ]);
  
  const RegisterApplicant = ({ route }) => {
    const [applicant, setApplicant] = useState({});
    const [err, setErr] = useState(false);
    const { userId } = route.params;
    // const userId = 100;
    const fields = [
      {
        label: "Vị trí ứng tuyển",
        icon: "briefcase",
        name: "position",
      },
      {
        label: "Mức lương mong muốn",
        icon: "currency-usd",
        name: "salary_expectation",
        keyboardType: "numeric",
      },
      {
        label: "Kinh nghiệm",
        icon: "account-hard-hat",
        name: "experience",
        multiline: true,
      },
    ];
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
  
    const [skillsModalVisible, setSkillsModalVisible] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skills, setSkills] = useState([]);
  
    const [areasModalVisible, setAreasModalVisible] = useState(false);
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [areas, setAreas] = useState([]);
  
    const [careersModalVisible, setCareersModalVisible] = useState(false);
    const [selectedCareer, setSelectedCareer] = useState(null);
    const [careers, setCareers] = useState([]);
  
    useEffect(() => {
      const fetchSkills = async () => {
        try {
          const res = await APIs.get(endpoints["skills"]);
          setSkills(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchSkills();
  
      const fetchAreas = async () => {
        try {
          const res = await APIs.get(endpoints["areas"]);
          setAreas(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchAreas();
  
      const fetchCareers = async () => {
        try {
          const res = await APIs.get(endpoints["careers"]);
          setCareers(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchCareers();
    }, []);
  
    const toggleSkill = (skill) => {
      if (selectedSkills.includes(skill)) {
        setSelectedSkills((prevSelectedSkills) =>
          prevSelectedSkills.filter((s) => s !== skill)
        );
      } else if (selectedSkills.length < 5) {
        setSelectedSkills((prevSelectedSkills) => [...prevSelectedSkills, skill]);
      } else {
        Alert.alert("Lưu ý", "Bạn chỉ có thể chọn tối đa 5 kỹ năng");
      }
    };
  
    const toggleArea = (area) => {
      if (selectedAreas.includes(area)) {
        setSelectedAreas((prevSelectedAreas) =>
          prevSelectedAreas.filter((a) => a !== area)
        );
      } else if (selectedAreas.length < 3) {
        setSelectedAreas((prevSelectedAreas) => [...prevSelectedAreas, area]);
      } else {
        Alert.alert("Lưu ý", "Bạn chỉ có thể chọn tối đa 3 vùng làm việc");
      }
    };
  
    const toggleCareer = (career) => {
      if (selectedCareer === career) {
        setSelectedCareer(null);
      } else {
        setSelectedCareer(career);
      }
    };
  
    const picker = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted")
        Alert.alert("JobPortalApp", "Permissions Denied!");
      else {
        let res = await ImagePicker.launchImageLibraryAsync();
        if (!res.canceled) {
          updateState("cv", res.assets[0]);
        }
      }
    };
  
    const updateState = (field, value) => {
      setApplicant((current) => {
        return { ...current, [field]: value };
      });
    };
  
    const register = async () => {
      setErr(false);
  
      let form = new FormData();
      form.append("position", applicant.position || "Nhân viên");
      form.append("salary_expectation", applicant.salary_expectation || "");
      form.append("experience", applicant.experience || "");
  
    //   selectedSkills.forEach((skill, index) => {
    //     form.append(`skills[${index}]`, skill.id);
    //   });
  
    //   selectedAreas.forEach((area, index) => {
    //     form.append(`areas[${index}]`, area.id);
    //   });
  
    //   if (selectedCareer) {
    //     form.append("career", selectedCareer.id);
    //   } else {
    //     form.append("career", "");
    //   }

    selectedSkills.forEach((skill, index) => {
      form.append(`skills`, skill.id);
    });

    selectedAreas.forEach((area, index) => {
      form.append(`areas`, area.id);
    });

    if (selectedCareer) {
      form.append("career", selectedCareer.id);
    } else {
      form.append("career", "");
    }
  
      if (applicant.cv) {
        form.append("cv", {
          uri: applicant.cv.uri,
          name: applicant.cv.fileName || "cv.jpg",
          type: applicant.cv.type || "image/jpeg",
        });
      } else {
        form.append("cv", null); // Gửi null nếu không có file CV
      }
  
      form.append("user", userId);
  
      setLoading(true);
      try {
        let res = await APIs.post(endpoints["create-applicant"](userId), form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.info(form);
        if (res.status === 201) nav.navigate("Login"); // Đăng ký xong thì chuyển qua đăng nhập
      } catch (ex) {
        console.error(ex);
        setErr(true);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[MyStyles.container, MyStyles.margin]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView>
            <Text style={styles.subject}>ĐĂNG KÝ</Text>
            {fields.map((f) => (
              <TextInput
                key={f.name}
                label={f.label}
                left={<TextInput.Icon name={f.icon} />}
                onChangeText={(txt) => updateState(f.name, txt)}
                style={styles.input}
                multiline={f.multiline}
                keyboardType={f.keyboardType}
              />
            ))}
  
            {/* Chọn kỹ năng */}
            <TouchableRipple
              style={MyStyles.margin}
              onPress={() => setSkillsModalVisible(true)}
            >
              <Card>
                <Card.Content>
                  <Text>Chọn kỹ năng...</Text>
                </Card.Content>
              </Card>
            </TouchableRipple>
            <Modal
              visible={skillsModalVisible}
              onRequestClose={() => setSkillsModalVisible(false)}
            >
              <ScrollView>
                <List.Section>
                  <List.Accordion
                    title="Chọn kỹ năng"
                    left={(props) => <List.Icon {...props} icon="star" />}
                  >
                    {skills.map((skill) => (
                      <List.Item
                        key={skill.id}
                        title={skill.name}
                        onPress={() => toggleSkill(skill)}
                      />
                    ))}
                  </List.Accordion>
                </List.Section>
  
                {selectedSkills.length > 0 && (
                  <List.Section title="Kỹ năng đã chọn">
                    {selectedSkills.map((skill) => (
                      <List.Item
                        key={skill.id}
                        title={skill.name}
                        onPress={() => toggleSkill(skill)}
                      />
                    ))}
                  </List.Section>
                )}
              </ScrollView>
  
              <Button onPress={() => setSkillsModalVisible(false)}>Đóng</Button>
            </Modal>
  
            {/* Chọn vùng làm việc */}
            <TouchableRipple
              style={MyStyles.margin}
              onPress={() => setAreasModalVisible(true)}
            >
              <Card>
                <Card.Content>
                  <Text>Chọn vùng làm việc...</Text>
                </Card.Content>
              </Card>
            </TouchableRipple>
            <Modal
              visible={areasModalVisible}
              onRequestClose={() => setAreasModalVisible(false)}
            >
              <ScrollView>
                <List.Section>
                  <List.Accordion
                    title="Chọn vùng làm việc"
                    left={(props) => <List.Icon {...props} icon="map-marker" />}
                  >
                    {areas.map((area) => (
                      <List.Item
                        key={area.id}
                        title={area.name}
                        onPress={() => toggleArea(area)}
                      />
                    ))}
                  </List.Accordion>
                </List.Section>
  
                {selectedAreas.length > 0 && (
                  <List.Section title="Vùng làm việc đã chọn">
                    {selectedAreas.map((area) => (
                      <List.Item
                        key={area.id}
                        title={area.name}
                        onPress={() => toggleArea(area)}
                      />
                    ))}
                  </List.Section>
                )}
              </ScrollView>
  
              <Button onPress={() => setAreasModalVisible(false)}>Đóng</Button>
            </Modal>
  
            {/* Chọn nghề nghiệp */}
            <TouchableRipple
              style={MyStyles.margin}
              onPress={() => setCareersModalVisible(true)}
            >
              <Card>
                <Card.Content>
                  <Text>Chọn nghề nghiệp...</Text>
                </Card.Content>
              </Card>
            </TouchableRipple>
            <Modal
              visible={careersModalVisible}
              onRequestClose={() => setCareersModalVisible(false)}
            >
              <ScrollView>
                <List.Section>
                  <List.Accordion
                    title="Chọn nghề nghiệp"
                    left={(props) => <List.Icon {...props} icon="briefcase" />}
                  >
                    {careers.map((career) => (
                      <List.Item
                        key={career.id}
                        title={career.name}
                        onPress={() => toggleCareer(career)}
                      />
                    ))}
                  </List.Accordion>
                </List.Section>
  
                {selectedCareer && (
                  <List.Section title="Nghề nghiệp đã chọn">
                    <List.Item
                      key={selectedCareer.id}
                      title={selectedCareer.name}
                      onPress={() => toggleCareer(selectedCareer)}
                    />
                  </List.Section>
                )}
              </ScrollView>
  
              <Button  onPress={() => setCareersModalVisible(false)}>Đóng</Button>
            </Modal>
  
            <HelperText type="error" visible={err}>
              Có lỗi xảy ra!
            </HelperText>
  
            {/* Chọn CV */}
            <TouchableRipple style={styles.avatarPicker} onPress={picker}>
                  <Text>Tải lên CV...</Text>
               
            </TouchableRipple>
  
            {applicant.cv && (
                  <View style={styles.cancelCVContainer}>
                    <Text style={styles.cancelCVText} onPress={() => updateState("cv", null)}>
                        Hủy tải CV
                    </Text>
                </View>
            )}

            {applicant.cv && (
              <Image source={{ uri: applicant.cv.uri }} style={MyStyles.avatar} />
            )}
  
            <Button
              icon="account-plus"
              loading={loading}
              mode="contained"
              onPress={register}
              style={styles.button}
            >
              ĐĂNG KÝ
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      </TouchableWithoutFeedback>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    subject: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        marginVertical: 10, // Slightly increased margin
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 15, // Slightly increased padding
        height: 50, // Slightly increased height
        fontSize: 16, // Slightly increased font size
    },
    avatarPicker: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
        alignItems: 'center',
    },
    avatarPickerText: {
        color: '#333',
        fontSize: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginVertical: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    linkText: {
        color: 'green',
        textDecorationLine: 'underline',
    },
    linkTextCentered: {
        color: 'green',
        textAlign: 'center',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#28A745',
        marginVertical: 10,
    },cancelCVContainer: {
      alignItems: 'center',
      marginTop: 10,
    },
    cancelCVText: {
        color: 'red',
        fontSize: 16,
        textDecorationLine: 'underline',
    },

});
  export default RegisterApplicant;
  