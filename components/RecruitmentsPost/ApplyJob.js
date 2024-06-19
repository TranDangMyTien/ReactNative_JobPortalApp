import React, { useState, useContext } from "react";
import { View,Text,StyleSheet,TextInput,TouchableOpacity,ActivityIndicator,Image,TouchableWithoutFeedback,Keyboard} from "react-native";
import { Checkbox, Snackbar } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MyUserContext } from "../../configs/Contexts";
import { RadioButton } from "react-native-paper";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { getToken } from "../../utils/storage";

const ApplyJob = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isStudent, setIsStudent] = useState(false); //Khởi tạo giá trị ban đầu không phải là học sinh
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [maxLength, setMaxLength] = useState(1000);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const { jobId } = route.params; 
  const user = useContext(MyUserContext);
  const applicantId = user.applicant.id;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleApplyJob = async () => {
    setSnackbarVisible(false);

    if (!coverLetter) {
      setSnackbarMessage("Bạn chưa nhập thư giới thiệu.");
      setSnackbarVisible(true);
      return;
    }
    if (coverLetter.length < 10) {
      setSnackbarMessage("Thư giới thiệu phải có ít nhất 10 kí tự.");
      setSnackbarVisible(true);
      return;
    }
    let form = new FormData();
    form.append("is_student", isStudent ? "True" : "False");
    form.append("coverLetter", coverLetter);
    // form.append("applicant", applicantId);
    form.append("status", "Pending");
    console.log(form);

    setLoading(true);
    try {
      const token = await getToken();
      let res = await authApi(token).post(
        endpoints["job-apply"](jobId, applicantId),
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 201) {
        Alert.alert("Success", "Ứng tuyển thành công!");
        setTimeout(() => {
            navigation.navigate("HomeScreen"); // Ứng tuyển thành công sẽ trở về trang chủ
        }, 2000);
      }
        
    } catch (error) {
      console.log(error); /// Message loi
      if (error.response) {
        console.log("Status code:", error.response.status);
        console.log("Error data:", error.response.data);
      }
      
      setSnackbarMessage("Đăng ký không thành công!");
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Image
              source={require("../../assets/icons/left.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đơn ứng tuyển</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>Bạn có phải là sinh viên?</Text>
            <RadioButton
              value="student"
              status={isStudent ? "checked" : "unchecked"}
              onPress={() => setIsStudent(!isStudent)}
              color="#00b14f"
            />
          </View>

          <Text style={styles.coverLetterLabel}>Thư giới thiệu</Text>
          <TextInput
            style={styles.coverLetterInput}
            placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do làm việc tại công ty này"
            value={coverLetter}
            placeholderTextColor="#000"
            onChangeText={(text) => {
              if (text.length > maxLength) {
                setShowErrorSnackbar(true);
              } else {
                setCoverLetter(text);
              }
            }}
            onBlur={Keyboard.dismiss}
            multiline
            maxLength={maxLength}
          />

          <View style={styles.letterCountContainer}>
            <Text style={styles.letterCountText}>
              {coverLetter.length}/{maxLength} ký tự
            </Text>
            <TouchableOpacity
              style={styles.exitButton}
              onPress={() => {
                setCoverLetter("");
                setIsStudent(false);
              }}
            >
              <Text style={styles.exitButtonText}>Xóa</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.noticeLabel}>Lưu ý</Text>
          <Text style={styles.noticeText}>
            JobOU khuyên tất cả các bạn hãy luôn cẩn trọng trong quá trình tìm
            việc và chủ động nghiên cứu về thông tin công ty, vị trí việc làm
            trước khi ứng tuyển. Nếu bạn gặp phải tin tuyển dụng hoặc nhận được
            liên lạc đáng ngờ của nhà tuyển dụng, hãy báo cáo ngay cho JobOU qua
            email: OuJob@gmail.com để được hỗ trợ kịp thời.
          </Text>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyJob}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.applyButtonText}>Ứng tuyển</Text>
            )}
          </TouchableOpacity>
        </View>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={Snackbar.DURATION_SHORT}
          action={{
            label: "OK",
            onPress: () => {
              setSnackbarVisible(false);
            },
          }}
        >
          {snackbarMessage}
        </Snackbar>

        <Snackbar
          visible={showErrorSnackbar}
          onDismiss={() => setShowErrorSnackbar(false)}
          duration={Snackbar.DURATION_SHORT}
          action={{
            label: "OK",
            onPress: () => {
              setShowErrorSnackbar(false);
            },
          }}
        >
          Bạn đã vượt quá giới hạn số lượng ký tự cho phép!
        </Snackbar>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5fffa",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  coverLetterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  coverLetterInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    height: 150,
    textAlignVertical: "top",
  },
  noticeLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  noticeText: {
    fontSize: 14,
    color: "#666",
  },
  applyButton: {
    backgroundColor: "#00b14f",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "white",
  },
  backButton: {
    padding: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#00b14f",
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  letterCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  letterCountText: {
    fontSize: 14,
    color: "#666",
  },
  exitButton: {
    backgroundColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  exitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ApplyJob;
