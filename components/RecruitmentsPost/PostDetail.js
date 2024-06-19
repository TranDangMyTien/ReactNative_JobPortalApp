import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { Appbar, Menu, Divider, Card } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MyUserContext } from '../../configs/Contexts';
import Comments from './Comments';
import Ratings from './Ratings';
import axiosInstance, { authApi, endpoints } from '../../configs/APIs';
import { LogBox } from 'react-native';
import { getToken } from '../../utils/storage';

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.']);

const PostDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId } = route.params;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmittingFavorite, setIsSubmittingFavorite] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(5);
  const user = useContext(MyUserContext);
  const [menuVisible, setMenuVisible] = useState(false); // State hide and report
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); // keyboard visibility
  const [isLiked, setIsLiked] = useState(false);

  const handleGoBack = () => {
    navigation.navigate("HomeScreen");
  };

  //xử lý chức năng ứng tuyển
  const handleApplyJob = async () => {
    try {
      if (user) {
        navigation.navigate('ApplyJob',{ jobId: jobId });
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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        const response = await axiosInstance.get(endpoints['job-detail'](jobId));
        setJob(response.data);

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

  // Handle menu actions
  const handleReport = () => {
    Alert.alert('Báo cáo', 'Bạn đã báo cáo công việc này.');
    //setMenuVisible(false);
  };

  const handleHide = () => {
    Alert.alert('Ẩn', 'Bạn đã ẩn công việc này.');
    //setMenuVisible(false);
  };

  // DELETE BÀI TUYỂN DỤNG, NẾU ĐÓ LÀ BÀI VIẾT DO NHÀ TUYỂN DỤNG TẠO RA 
  const handleDeleteJob = async (jobId, userId) => {
    try {
      const token = await getToken();
      const res = await authApi(token).delete(endpoints['delete-post'](jobId, userId));
      if (res.status === 200) {
        Alert.alert('Thông báo', 'Xóa bài tuyển dụng thành công.');
        navigation.navigate('HomeScreen'); 
      } else {
        Alert.alert('Thông báo', 'Xóa bài tuyển dụng không thành công.');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xóa bài tuyển dụng.');
    }
  };

  const handleLikeJob = async () => {
    // Implement logic to toggle like status and send to server if needed
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction onPress={handleGoBack} color='white'/>
        <Appbar.Content title="Thông tin chi tiết" 
        style={{ alignItems: 'center', justifyContent: 'center' }} 
        titleStyle={{ color: 'white' }}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action icon="dots-vertical" color="white" onPress={() => setMenuVisible(true)} />
          }
        >
          <Menu.Item onPress={handleReport} title="Báo cáo" />
          <Menu.Item onPress={handleHide} title="Ẩn" />
        </Menu>
      </Appbar.Header>
      <ScrollView nestedScrollEnabled>
        <Image source={{ uri: job.image }} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{job.title}</Text>
          <Card style={styles.card}>
            <Text style={styles.company}>Công ty: {job.employer.companyName}</Text>
            <Text style={styles.detailText}>Tuyển vị trí: {job.position}</Text>
            <Text style={styles.detailText}>Lĩnh vực: {job.career.name}</Text>
            <Text style={styles.detailText}>Mức lương: {`${job.salary} VNĐ`} </Text>
            <Text style={styles.detailText}>Số lượng tuyển: {job.quantity}</Text>
            {/* <Text style={styles.detailText}>Loại thời gian: {job.employmenttype.type}</Text> */}
            <Text style={styles.detailText}>Địa điểm: {job.location}</Text>
            <Text style={styles.deadline}>Hạn nộp hồ sơ: {job.deadline}</Text>
            <Divider />
            <Text style={styles.sectionTitle}>Mô tả công việc:</Text>
            <Text style={styles.description}>{job.description}</Text>
            <Divider />
            <Text style={styles.sectionTitle}>Yêu cầu kinh nghiệm:</Text>
            <Text style={styles.description}>- {job.experience}</Text>
            <Divider />
            <Text style={styles.sectionTitle}>Thông tin công ty:</Text>
            <Text style={styles.detailText}>- Công ty: {job.employer.companyName}</Text>
            <Text style={styles.detailText}>- Địa chỉ: {job.employer.address}</Text>
            <Text style={styles.detailText}>- Website: {job.employer.company_website}</Text>
            <Text style={styles.detailText}>- Loại doanh nghiệp: {job.employer.company_type_display}</Text>
            <Text style={styles.description}>- {job.employer.information}</Text>
            <TouchableOpacity onPress={handleLikeJob}>
              <Icon
                name={isLiked ? 'favorite' : 'favorite-border'} // Thay đổi icon name tùy theo biểu tượng bạn muốn sử dụng
                size={30}
                color={isLiked ? '#FF0000' : '#C0C0C0'}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          </Card>
          <View style={styles.commentsContainer}>
            <Text style={styles.sectionTitle}>Đánh giá:</Text>
            <Ratings jobId={jobId} rating={rating} setRating={setRating} />
          </View>
          <Divider/>
          <View style={styles.commentsContainer}>
            <Text style={styles.sectionTitle}>Bình luận:</Text>
            <Comments jobId={jobId} comments={comments} setComments={setComments} />
          </View>
        </View>
      </ScrollView>
      {!isKeyboardVisible && user && user.applicant && (
        <View style={styles.applyButtonContainer}>
          <TouchableOpacity onPress={handleToggleFavorite}>
            <Icon
              name={isFavorite ? "bookmark" : "bookmark-outline"}
              size={40}
              color={isFavorite ? "#00b14f" : "#C0C0C0"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyJob}>
            <Text style={styles.applyButtonText}>Ứng tuyển ngay</Text>
          </TouchableOpacity>
        </View>
      )}

      {user && user.employer?.id === job.employer?.id && ( // Nếu employer hoặc id là null hoặc undefined, phép so sánh sẽ không thực hiện => nút xóa kh hiện
        <View style={{margin: "auto"}}>
          <View style={{alignItems: "center",width: "50%", backgroundColor: "#a52a2a", borderRadius: 20, margin: 10}}>
          <Menu.Item  onPress={() => handleDeleteJob(job.id)} 
            title="Xóa bài tuyển dụng"
            titleStyle={{color:"white"}}
          />
        </View>
        </View>
        
      )}

      {isSubmittingFavorite && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00b14f" />
        </View>
      )}

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
  container: {
    flex: 1,
  },
  appbarHeader: {
    backgroundColor: '#28A745',
    height: 30,
  },
  contentContainer: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    padding: 10,
    paddingBottom: 30,
    backgroundColor: '#fffff0',
    marginBottom: 20,
  },
  company: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 4,
  },
  deadline: {
    fontSize: 18,
    marginBottom: 16,
    color: 'red',
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
  applyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    width: '100%',
    backgroundColor: '#f5fffa',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  applyButton: {
    backgroundColor: '#00b14f',
    padding: 12,
    marginRight: 30,
    borderRadius: 13,
    width: '70%',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingOverlay: {
    flex: 1,
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
  commentsContainer: {
    marginBottom: 20,
  },
});

export default PostDetail;
