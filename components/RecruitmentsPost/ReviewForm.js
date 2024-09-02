import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import  {endpoints, authAPI} from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyUserContext } from "../../configs/Contexts";

const { width } = Dimensions.get('window');

const ReviewForm = ({ jobId, onSubmit, isUserLoggedIn }) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const user = useContext(MyUserContext);
  console.log(jobId);

  const handleSubmit = async () => {
    if (!isUserLoggedIn) {
      Alert.alert('Thông báo', '🔒 Bạn cần đăng nhập để gửi đánh giá!');
      return;
    }

    if (rating === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn số sao đánh giá.');
      return;
    }

    if (content.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung đánh giá.');
      return;
    }

    try {
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        Alert.alert('Lỗi', 'Bạn chưa đăng nhập.');
        return;
      }

      const response = await authAPI(authToken).post(endpoints['create-review'](jobId), {
        rating: rating,
        content: content,
        recruitment: jobId,
        user: user.id,
      });

      console.log('Response Data:', response.data);

      Alert.alert('Thành công', 'Đánh giá của bạn đã được gửi.');
      onSubmit(response.data);
      setRating(5);
      setContent('');
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        Alert.alert('Lỗi', `Có lỗi xảy ra khi gửi đánh giá: ${error.response.data.message || 'Vui lòng thử lại sau.'}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        Alert.alert('Lỗi', 'Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.');
      } else {
        console.error('Error message:', error.message);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.');
      }
    }
  };

  if (!isUserLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Đánh giá công việc</Text>
        <Text style={styles.loginMessage}>Vui lòng đăng nhập để gửi đánh giá.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đánh giá của bạn</Text>
      <AirbnbRating
        count={5}
        defaultRating={rating}
        onFinishRating={setRating}
        size={40}
        showRating={false}
        selectedColor="#FFD700"
        unSelectedColor="#e0e0e0"
        starContainerStyle={styles.ratingContainer}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập nội dung đánh giá..."
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={5}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Gửi đánh giá</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: width - 32,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    margin: 16,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  ratingContainer: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    height: 120,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  loginMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ReviewForm;