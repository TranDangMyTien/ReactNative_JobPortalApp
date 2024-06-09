import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Checkbox, Icon } from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MyUserContext } from '../../configs/Contexts';
import { fetchApplyPost } from '../../configs/APIs';


const ApplyJob = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isStudent, setIsStudent] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const { jobId } = route.params;  
  const user = useContext(MyUserContext);

  const handleGoBack = () => {
    navigation.goBack();
  };


  const fetchApply = async (jobId, isStudent, coverLetter) => {
    const url = fetchApplyPost(jobId);
    try {
      
      if (!user) {
        throw new Error('Error');
      }
  
      const response = await axios.post(url, {
        is_student: isStudent,
        applicant: user.id,
        coverLetter: coverLetter
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Lỗi:', error.message);
      throw error;
    }
  };

  const handleApplyJob = async () => {
    if (!coverLetter) {
      Alert.alert('Thông báo', 'Bạn chưa nhập thư giới thiệu.');
      return;
    }
    if (coverLetter.length < 10) {
      Alert.alert('Thông báo', 'Thư giới thiệu phải có ít nhất 10 kí tự.');
      return;
    }

    try {
      const response = await fetchApply(jobId, isStudent, coverLetter);
      Alert.alert('Thông báo', 'Đơn đăng ký ứng tuyển đã được gửi thành công!');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi:', error.message);
      Alert.alert('Thông báo', 'Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title="Ứng tuyển" style={{ alignItems: 'center', justifyContent: 'center' }} />
      </Appbar.Header>

      <View style={styles.container}>
        <View style={styles.studentCheckContainer}>
          <Text style={styles.studentCheckLabel}>Bạn có phải là sinh viên?</Text>
          <Checkbox
            status={isStudent ? 'checked' : 'unchecked'}
            onPress={() => setIsStudent(!isStudent)}
          />
        </View>

        <Text style={styles.coverLetterLabel}>Thư giới thiệu</Text>
        <TextInput
          style={styles.coverLetterInput}
          placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do làm việc tại công ty này"
          value={coverLetter}
          onChangeText={setCoverLetter}
          multiline
        />

        <Text style={styles.noticeLabel}>Lưu ý</Text>
        <Text style={styles.noticeText}>
          JobOU khuyên tất cả các bạn hãy luôn cẩn trọng trong quá trình tìm việc và chủ động nghiên cứu về thông tin công ty, vị trí việc làm trước khi ứng tuyển. 
          Nếu bạn gặp phải tin tuyển dụng hoặc nhận được liên lạc đáng ngờ của nhà tuyển dụng, hãy báo cáo ngay cho JobOU qua email: btrinh2505@gmail.com để được hỗ trợ kịp thời.
        </Text>

        <TouchableOpacity style={styles.applyButton} onPress={handleApplyJob}>
          <Text style={styles.applyButtonText}>Ứng tuyển</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5fffa',
  },
  studentCheckContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  studentCheckLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  coverLetterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  coverLetterInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  noticeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  noticeText: {
    fontSize: 14,
    color: '#666',
  },
  applyButton: {
    backgroundColor: '#00b14f',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ApplyJob;