import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import { Menu, Divider, Card, Button } from "react-native-paper";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MyUserContext } from "../../configs/Contexts";
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import { getToken } from "../../utils/storage";
import CustomHeaderPostDetail from "../constants/CustomHeaderPostDetail";
import ReviewForm from "./ReviewForm"; // Import component ReviewForm
import ReviewsList from "./ReviewsList";
import { LogBox } from "react-native";

// Ignore specific warnings
LogBox.ignoreLogs([
  "Warning: TapRating: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
  "Warning: Star: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
  "Warning: VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
  "[AxiosError: Request failed with status code 404]",
]);

const PostDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId } = route.params;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmittingFavorite, setIsSubmittingFavorite] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(5);
  const user = useContext(MyUserContext);
  const [menuVisible, setMenuVisible] = useState(false); // State hide and report
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); // keyboard visibility
  const [isLiked, setIsLiked] = useState();
  const [refreshKey, setRefreshKey] = useState(0);
  const handleGoBack = () => {
    navigation.navigate("HomeScreen");
  };

  const handleSubmitReview = async (review) => {
    try {
      // Fetch updated reviews
      const response = await APIs.get(endpoints["job-reviews"](jobId));
      setComments(response.data);
      Alert.alert(
        "Thành công",
        "Đánh giá của bạn đã được gửi và danh sách đánh giá đã được cập nhật."
      );
    } catch (error) {
      console.error("Error fetching reviews:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật danh sách đánh giá.");
    }
  };

  // Hàm để làm mới danh sách đánh giá
  const handleReviewAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Thay đổi refreshKey để làm mới ReviewsList
  };

  //xử lý chức năng ứng tuyển
  const handleApplyJob = async () => {
    try {
      if (user) {
        navigation.navigate("ApplyJob", { jobId: jobId });
      } else {
        Alert.alert(
          "Thông báo",
          "🔒 Bạn cần đăng nhập!",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login"),
            },
          ],
          { cancelable: false } //thông báo chỉ bị tắt khi nhấn nút trên hộp thoại
        );
      }
    } catch (error) {
      console.error("Error checking login status: ", error);
      navigation.navigate("Login");
    }
  };

  //  Thêm bài tuyển dụng vào ds yêu thích
  const handleToggleFavorite = async () => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!user) {
      Alert.alert(
        "Thông báo",
        "🔒 Bạn cần đăng nhập để lưu công việc yêu thích!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
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
      const message = newFavoriteStatus
        ? "Lưu việc làm thành công"
        : "Đã bỏ lưu việc làm";
      setNotificationMessage(message);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      // Thực hiện lưu vào danh sách yêu thích
      try {
        const favoriteJobs =
          JSON.parse(await AsyncStorage.getItem("favoriteJobs")) || [];
        const updatedFavoriteJobs = newFavoriteStatus
          ? [...favoriteJobs, job] // Thêm công việc vào danh sách yêu thích
          : favoriteJobs.filter((item) => item.id !== jobId); // Loại bỏ công việc khỏi danh sách yêu thích
        await AsyncStorage.setItem(
          "favoriteJobs",
          JSON.stringify(updatedFavoriteJobs)
        );
      } catch (error) {
        console.error("Error handling favorite job: ", error);
      }
    }, 2000);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const getJobDetails = async () => {
    try {
      const response = await APIs.get(endpoints["job-detail"](jobId));
      setJob(response.data);

      const favoriteJobs =
        JSON.parse(await AsyncStorage.getItem("favoriteJobs")) || [];
      const isFav = favoriteJobs.some((item) => item.id === jobId);
      setIsFavorite(isFav);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobDetails();
  }, [jobId]);

  // Make sure job details are updated when returning to this screen
  useFocusEffect(
    React.useCallback(() => {
      getJobDetails();
    }, [jobId])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.notFoundContainer}>
        <Icon name="search-off" size={80} color="#666" />
        <Text style={styles.notFoundText}>
          Rất tiếc, chúng tôi không tìm thấy công việc này.
        </Text>
        <Text style={styles.notFoundSubText}>
          Công việc có thể đã bị xóa hoặc không tồn tại.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("HomeScreen")}
          style={styles.backButton}
        >
          Quay lại trang chủ
        </Button>
      </View>
    );
  }

  // Handle menu actions
  const handleReport = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await authAPI(authToken).patch(
        endpoints["report-post"](jobId),
        { reported: true }
      );

      if (response.status === 200) {
        Alert.alert("Báo cáo", "Bạn đã báo cáo công việc này.");
      } else {
        Alert.alert("Thông báo", "Báo cáo không thành công.");
      }
    } catch (error) {
      console.error("Error reporting job post:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi báo cáo công việc.");
    }
  };

  const handleHide = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      let res = await authAPI(authToken).post(
        endpoints["hide-post"](jobId)
      );
      if (res.status === 200) {
        Alert.alert("Thông báo", "Ẩn bài tuyển dụng thành công.");
        navigation.navigate("HomeScreen");
      } else {
        Alert.alert("Thông báo", "Ẩn bài tuyển dụng không thành công.");
      }
    } catch (error) {
      console.error("Error hiding job:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi ẩn bài tuyển dụng.");
    }
  };

  const handleDeleteJob = async (jobId, userId) => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      let res = await authAPI(authToken).delete(
        endpoints["delete-post"](jobId)
      );
      if (res.status === 204) {
        Alert.alert("Thông báo", "Xóa bài tuyển dụng thành công.");
        navigation.navigate("HomeScreen");
      } else {
        Alert.alert("Thông báo", "Xóa bài tuyển dụng không thành công.");
      }
    } catch (error) {
      console.error("Failed to hide the job post:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi xóa bài tuyển dụng.");
    }
  };

  // XỬ LÝ PHẦN LIKE
  const handleLikeJob = async () => {
    try {
      // Check if user is authenticated
      if (!user) {
        Alert.alert(
          "Thông báo",
          "🔒 Bạn cần đăng nhập để thực hiện hành động này!",
          [
            {
              text: "Đăng nhập",
              onPress: () => navigation.navigate("MyLogin"),
            },
          ],
          { cancelable: false }
        );
        return;
      }

      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        Alert.alert("Lỗi", "Bạn chưa đăng nhập.");
        return;
      }

      const response = await authAPI(authToken).post(
        endpoints["like-post"](jobId)
      );

      
      // Log the full response for debugging
      console.log("API Response:", response.data);

      if (response.status === 200) {
        // Check if 'liked' status is true in the response
        const isLikedNow = response.data.liked;
        setIsLiked(isLikedNow);

        if (isLikedNow) {
          Alert.alert("Thành công", "Bạn đã thích công việc này.");
        } else {
          Alert.alert("Thông báo", "Bạn đã bỏ thích công việc này.");
        }
      } else {
        Alert.alert("Lỗi", "Có lỗi xảy ra khi thực hiện hành động này.");
      }
    } catch (error) {
      console.error("Error liking job:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi thích công việc.");
    }
  };

  const handleEditJob = () => {
    navigation.navigate("EditJobScreen", { jobId: job.id });
  };


  return (
    <View style={styles.container}>
      <CustomHeaderPostDetail
        title="Thông tin chi tiết"
        onBackPress={() => navigation.navigate("HomeScreen")}
        onReport={handleReport}
        onHide={handleHide}
      />
      <ScrollView nestedScrollEnabled>
        <Image source={{ uri: job.image }} style={styles.image} />
        <View style={styles.contentContainer}>

        <Text style={styles.title}>{job.title}</Text>
        
          
          <Text style={styles.updatedDate}>
            Cập nhật lần cuối: {new Date(job.updated_date).toLocaleDateString()}
          </Text>
            <Text style={styles.company}>
              Công ty: {job.employer.companyName}
            </Text>
            <Text style={styles.detailText}>Tuyển vị trí: {job.position}</Text>
            <Text style={styles.detailText}>Lĩnh vực: {job.career.name}</Text>
            <Text style={styles.detailText}>
              Mức lương: {`${job.salary} VNĐ`}{" "}
            </Text>
            <Text style={styles.detailText}>
              Số lượng tuyển: {job.quantity}
            </Text>
            <Text style={styles.detailText}>
              Loại hình công việc: {job.employmenttype.type}
            </Text>
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
            <Text style={styles.detailText}>
              - Công ty: {job.employer.companyName}
            </Text>
            <Text style={styles.detailText}>
              - Địa chỉ: {job.employer.address}
            </Text>
            <Text style={styles.detailText}>
              - Website: {job.employer.company_website}
            </Text>
            <Text style={styles.detailText}>
              - Loại doanh nghiệp: {job.employer.company_type_display}
            </Text>
            <Text style={styles.description}>- {job.employer.information}</Text>
            <TouchableOpacity onPress={handleLikeJob}>
              <Icon
                name={isLiked ? "favorite" : "favorite-border"} // Thay đổi icon name tùy theo biểu tượng bạn muốn sử dụng
                size={30}
                color={isLiked ? "#FF0000" : "#C0C0C0"}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
        
          <ReviewForm
            jobId={jobId}
            onSubmit={handleReviewAdded}
            isUserLoggedIn={!!user}
          />
          <ReviewsList key={refreshKey} jobId={jobId} />
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

      {user &&
        user.employer?.id === job.employer?.id && ( // Nếu employer hoặc id là null hoặc undefined, phép so sánh sẽ không thực hiện => nút xóa kh hiện

          
          <View style={styles.buttonContainer}>
          <View style={styles.editButtonWrapper}>
            <Menu.Item
              onPress={handleEditJob}
              title="Chỉnh sửa bài tuyển dụng"
              titleStyle={styles.menuItemText}
            />
          </View>
          <View style={styles.deleteButtonWrapper}>
            <Menu.Item
              onPress={() => handleDeleteJob(job.id)}
              title="Xóa bài tuyển dụng"
              titleStyle={styles.menuItemText}
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
          <TouchableOpacity onPress={() => navigation.navigate("FavoriteJobs")}>
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
    backgroundColor: "#f5f5f5",
  },
  appbarHeader: {
    backgroundColor: "#28A745",
    height: 45, // Set the height here
  },
  contentContainer: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 10,
  },
  company: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 4,
  },
  deadline: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF0000",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  applyButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    width: "100%",
    backgroundColor: "#f5fffa",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  applyButton: {
    backgroundColor: "#00b14f",
    padding: 12,
    marginRight: 30,
    borderRadius: 13,
    width: "70%",
  },
  applyButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  notification: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00b14f",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 16,
  },
  notificationLink: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  notFoundText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  notFoundSubText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#00b14f",
  },
  reviewContainer: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
  },
  buttonContainer: {

    flexDirection: 'row',
    justifyContent: 'space-around', 
    padding: 10, 
    
  },
  editButtonWrapper: {
    flex: 1,
    backgroundColor: "#4CAF50", 
    borderRadius: 20,
    marginHorizontal: 5,
    paddingVertical: 5,
    alignItems: "center",
  },
  deleteButtonWrapper: {
    flex: 1,
    backgroundColor: "#F44336", // Màu đỏ cho nút xóa
    borderRadius: 20,
    marginHorizontal: 5,
    paddingVertical: 5,
    alignItems: "center",
  },
  updatedDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  menuItemText: {
    color: "white",
  },
});

export default PostDetail;
