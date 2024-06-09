import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, FlatList, Button, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchJobDetail } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MyUserContext } from '../../configs/Contexts';

const PostDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId } = route.params;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isSubmittingFavorite, setIsSubmittingFavorite] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const user = useContext(MyUserContext);

  //xử lý chức năng ứng tuyển
  const handleApplyJob = async () => {
    try {
      if (user) {
        navigation.navigate('ApplyJob');
      } else {
        Alert.alert(
          'Thông báo',
          '🔒 Bạn cần đăng nhập!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ],
          { cancelable: false } //thông báo chỉ bị tắt khi nhấn nút trên hộp thoại
        );
      }
    } catch (error) {
      console.error('Error checking login status: ', error);
      navigation.navigate('Login');
    }
  };

  //  Thêm bài tuyển dụng vào ds yêu thích
  const handleToggleFavorite = async () => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!user) {
      Alert.alert(
        'Thông báo',
        '🔒 Bạn cần đăng nhập để lưu công việc yêu thích!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
        { cancelable: false } // Thông báo chỉ bị tắt khi nhấn nút trên hộp thoại
      );
      return;
    }
    setIsSubmittingFavorite(true);
    setTimeout(async () => {
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      setIsSubmittingFavorite(false);
  
      // Hiển thị thông báo lưu or bỏ việc làm yêu thích
      const message = newFavoriteStatus ? 'Lưu việc làm thành công' : 'Đã bỏ lưu việc làm';
      setNotificationMessage(message);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      // Thực hiện lưu vào danh sách yêu thích
      try {
        const favoriteJobs = JSON.parse(await AsyncStorage.getItem('favoriteJobs')) || [];
        const updatedFavoriteJobs = newFavoriteStatus 
          ? [...favoriteJobs, job] // Thêm công việc vào danh sách yêu thích
          : favoriteJobs.filter(item => item.id !== jobId); // Loại bỏ công việc khỏi danh sách yêu thích
        await AsyncStorage.setItem('favoriteJobs', JSON.stringify(updatedFavoriteJobs));
      } catch (error) {
        console.error('Error handling favorite job: ', error);
      }
    }, 2000);
  };

  // Chức năng đánh giá bình luận
  const handleAddComment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const newComment = {
        id: comments.length.toString(),
        rating,
        comment,
      };
      setComments([...comments, newComment]);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        const response = await fetchJobDetail(jobId);
        setJob(response.data);

        // Kiểm tra xem bài viết này có trong danh sách yêu thích hay không
        const favoriteJobs = JSON.parse(await AsyncStorage.getItem('favoriteJobs')) || [];
        const isFav = favoriteJobs.some(item => item.id === jobId);
        setIsFavorite(isFav);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getJobDetails();
  }, [jobId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không tìm thấy công việc</Text>
      </View>
    );
  }

  return (
    <View style={styles.container_1}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image 
            source={require('../../assets/icons/left.png')}
            style={styles.backIcon} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin chi tiết tuyển dụng</Text>
      </View>
      <ScrollView style={styles.container}>
        <Image source={{ uri: job.image }} style={styles.image} />
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.company}>Công ty: {job.employer.companyName}</Text>
        <Text style={styles.textget}>Tuyển vị trí: {job.position}</Text>
        <Text style={styles.textget}>Mức lương: {job.salary}</Text>
        <Text style={styles.textget}>Địa điểm: {job.location}</Text>
        <Text style={styles.deadline}>Hạn nộp hồ sơ: {job.deadline}</Text>
        <Text style={styles.sectionTitle}>Mô tả công việc:</Text>
        <Text style={styles.description}>{job.description}</Text>
        <Text style={styles.sectionTitle}>Yêu cầu kinh nghiệm:</Text>
        <Text style={styles.description}>{job.experience}</Text>
        <Text style={styles.sectionTitle}>Thông tin công ty:</Text>
        <Text style={styles.SizeText}>Công ty: {job.employer.companyName}</Text>
        <Text style={styles.SizeText}>Địa chỉ: {job.employer.address}</Text>
        <Text style={styles.SizeText}>Website: {job.employer.company_website}</Text>
        <Text style={styles.SizeText}>Loại doanh nghiệp: {job.employer.company_type_display}</Text>
        <Text style={styles.description}>- {job.employer.information}</Text>

        {/* Phần đánh giá và bình luận */}
        <Text style={styles.sectionTitle}>Đánh giá và bình luận:</Text>
        <View style={styles.commentSection}>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Icon
                  name="star"
                  size={30}
                  color={star <= rating ? "#FFD700" : "#C0C0C0"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.commentInput}
            placeholder="Nhập bình luận của bạn"
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
            <Text style={styles.applyButtonText}>Gửi</Text>
          </TouchableOpacity>
        </View>

        {/* ds các đánh giá và bình luận */}
        <View>
          {comments.map((item) => (
            <View key={item.id} style={styles.commentItem}>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    name="star"
                    size={20}
                    color={star <= item.rating ? "#FFD700" : "#C0C0C0"}
                  />
                ))}
              </View>
              <Text style={{fontSize: 16, marginBottom: 10}}>{item.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView> 

      {/* lưu bài viết */}
      <View style={styles.applyButtonContainer}>
        <TouchableOpacity onPress={handleToggleFavorite}>
          <Icon
            name={isFavorite ? "favorite" : "favorite-border"}
            size={40}
            color={isFavorite ? "#FF0000" : "#C0C0C0"}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyJob}>
          <Text style={styles.applyButtonText}>Ứng tuyển ngay</Text>
        </TouchableOpacity>
      </View>

       {/* Loading spinner */}
       {isSubmittingFavorite && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00b14f" />
        </View>
      )}

      {/* Notification */}
      {showNotification && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>{notificationMessage}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('FavoriteJobs')}>
            <Text style={styles.notificationLink}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container_1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#00b14f',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  company: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deadline: {
    fontSize: 18,
    marginBottom: 16,
    color: 'red',
  },
  textget: {
    fontSize: 18,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  SizeText: {
    fontSize: 16,
  },
  applyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    width: '80%',
    backgroundColor: '#f5fffa',
  },
  applyButton: {
    backgroundColor: '#00b14f',
    padding: 12,
    marginLeft: 30,
    borderRadius: 13,
    width: '90%',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  commentSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starIcon: {
    width: 40,
    height: 40,
  },
  commentInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  commentItem: {
    padding: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    margin: 5,
  },
  sendButton: {
    backgroundColor: '#00b14f',
    padding: 12,
    borderRadius: 5,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notification: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00b14f',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 16,
  },
  notificationLink: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostDetail;