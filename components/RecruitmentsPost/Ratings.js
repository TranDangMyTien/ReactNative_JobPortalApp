import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Button, Text, FlatList } from 'react-native'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import axiosInstance, { authAPI, endpoints } from '../../configs/APIs';
import { getToken } from '../../utils/storage';
import { MyUserContext } from '../../configs/Contexts';

const Ratings = ({ jobId }) => {
  const [rating, setRating] = useState(5); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [submittedRating, setSubmittedRating] = useState(null); 
  const [ratingsList, setRatingsList] = useState([]);
  const user = useContext(MyUserContext);

  // useEffect(() => {
  //   const fetchRatings = async () => {
  //     try {
  //       const res = await axiosInstance.get(
  //         endpoints['ratings']
  //         (jobId));
  //       setRatingsList(Array.isArray(response.data) ? response.data : []);
  //     } catch (error) {
  //       console.error('Error fetching ratings:', error.response ? error.response.data : error.message);
  //     }
  //   };
  //   fetchRatings();
  // }, [jobId]);

  // const handleRating = async (selectedRating) => {
  //   setIsSubmitting(true); // Set isSubmitting to true before starting the request
  //   try {
  //     const token = await getToken(); 
  //     let form = new FormData;
  //     form.append('rating', selectedRating)
  //     console.log(selectedRating);
  //     const response = await authAPI(token).post(
  //       endpoints["ratings"](jobId),
  //       form,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     );

  //     if (response.status === 201) { 
  //       setSubmittedRating(selectedRating); 
  //       setRatingsList([...ratingsList, response.data]); // Update ratings list
  //     } else {r
  //       console.error('Failed to add rating');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error.response ? error.response.data : error.message);
  //   } finally {
  //     setIsSubmitting(false); // Set isSubmitting to false after request completes
  //   }
  // };

  const handleSubmit = () => {
    // handleRating(rating); 
  };

  return (
    <View style={styles.ratingContainer}>
      <Text>Đánh giá công việc:</Text>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.starsContainer}>
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
        <View style={styles.submitButtonContainer}>
          <Button
            title={isSubmitting ? "Đang gửi..." : "Gửi"}
            disabled={isSubmitting}
            onPress={handleSubmit}
            color="#00b14f"
          />
        </View>
      </View>
      
      {submittedRating !== null && (
        <View style={styles.submittedRatingContainer}>
          <Text>Đã đánh giá: {submittedRating} sao</Text>
          {user && <Text>Bởi: {user.username}</Text>}
        </View>
      )}

      {ratingsList.map((item) => (
          <View key={item.id} style={styles.ratingItem}>
            <Text>{item.user.username} đã đánh giá: </Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  name="star"
                  size={20}
                  color={star <= item.rating ? "#FFD700" : "#C0C0C0"}
                />
              ))}
            </View>
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center', 
    marginRight: 10
  },
  submitButtonContainer: {
    marginBottom: 8,
    width: 50,
  },
  submittedRatingContainer: {
    marginTop: 8,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default Ratings;