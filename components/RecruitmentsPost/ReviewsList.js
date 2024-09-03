import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import APIs, { endpoints, authAPI } from "../../configs/APIs";
import { MyUserContext } from "../../configs/Contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Star } from "lucide-react-native";

const StarRating = ({ rating, setRating }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Star
            size={30}
            color={star <= rating ? "#FFD700" : "#D3D3D3"}
            fill={star <= rating ? "#FFD700" : "none"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const ReviewsList = ({ jobId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useContext(MyUserContext);
  const currentUser = user;
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editReviewData, setEditReviewData] = useState({
    id: null,
    rating: 5,
    content: "",
  });

  useEffect(() => {
    getReviews();
  }, [jobId]);

  const getReviews = async () => {
    try {
      const response = await APIs.get(endpoints["job-reviews"](jobId));
      const sortedReviews = response.data.results.sort(
        (a, b) => new Date(b.created_date) - new Date(a.created_date)
      );
      setReviews(sortedReviews); // Sắp xếp đánh giá để đánh giá mới nhất hiển thị trước
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Có lỗi xảy ra khi tải đánh giá.");
      setLoading(false);
    }
  };

  const handleReviewAdded = () => {
    getReviews(); // Lấy lại danh sách đánh giá sau khi có đánh giá mới
  };

  const handleEditReview = (review) => {
    setEditReviewData({
      id: review.id,
      rating: review.rating ? review.rating : 5, // Mặc định là 5 sao
      content: review.content,
    });
    setIsEditModalVisible(true);
  };

  const handleSaveEditReview = async () => {
    const { id, rating, content } = editReviewData;
    try {
      console.log("Updating review with data:", {
        rating: parseInt(rating),
        content,
      });
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await authAPI(authToken).patch(
        endpoints["change-review"](jobId, id),
        {
          rating: parseInt(rating),
          content: content,
        }
      );
      setIsEditModalVisible(false);
      getReviews();
    } catch (error) {
      console.error("Error updating review:", error);
      setError("Có lỗi xảy ra khi chỉnh sửa đánh giá.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      await authAPI(authToken).delete(endpoints["delete-review"](jobId, reviewId));
      getReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      setError("Có lỗi xảy ra khi xóa đánh giá.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewContainer}>
      <View style={styles.userInfo}>
        {item.user.avatar ? (
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <View style={styles.userDetails}>
          <Text style={styles.reviewUser}>{item.user.username}</Text>
          <Text style={styles.reviewRating}>Rating: {item.rating}/5</Text>
        </View>
      </View>
      <Text style={styles.reviewContent}>{item.content}</Text>
      <Text style={styles.reviewDate}>
        {new Date(item.created_date).toLocaleDateString()}
      </Text>
      {/* Chỉ hiển thị các nút nếu người dùng hiện tại là người tạo ra đánh giá */}
      {currentUser && item.user.id === currentUser.id && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => handleEditReview(item)}
            style={styles.editButton}
          >
            <Text style={styles.buttonText}>Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteReview(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.buttonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đánh giá từ người dùng</Text>
      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa đánh giá</Text>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Xếp hạng:</Text>
              <StarRating
                rating={parseInt(editReviewData.rating)}
                setRating={(value) =>
                  setEditReviewData({
                    ...editReviewData,
                    rating: value.toString(),
                  })
                }
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nội dung đánh giá:</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                multiline
                value={editReviewData.content}
                onChangeText={(value) =>
                  setEditReviewData({ ...editReviewData, content: value })
                }
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSaveEditReview}
              >
                <Text style={styles.modalButtonText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  reviewContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  reviewRating: {
    fontSize: 14,
    color: "#FFD700",
  },
  reviewContent: {
    fontSize: 14,
    color: "#666",
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  editButton: {
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#F44336",
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "90%",
    maxWidth: 400,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  modalButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReviewsList;
