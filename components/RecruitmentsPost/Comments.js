import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axiosInstance, { authAPI, authApi, endpoints } from '../../configs/APIs';
import { MyUserContext } from '../../configs/Contexts';
import { getToken } from '../../utils/storage';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Comments = ({ jobId, comments, setComments }) => {
  const [comment, setComment] = useState('');
  const [menuVisible, setMenuVisible] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const user = useContext(MyUserContext);
  const navigation = useNavigation();
  const userId = user ? user.id : null;

  // method GET comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(endpoints['read-comment'](jobId));
        setComments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [jobId]);

  // method POST comment
  const handleAddComment = async () => {
    if (!comment) {
      Alert.alert('Thông báo', 'Hãy cho tôi 1 vài góp ý nhận xét của bạn về công việc này nhé!.');
      return;
    }
    if (!user) {
      Alert.alert(
        'Thông báo',
        '🔒 Bạn cần đăng nhập để bình luận',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MyLogin'),
          },
        ],
        { cancelable: false }
      );
      return;
    }

    let form = new FormData();
    form.append('content', comment);
    form.append('user', user.id);

    try {
      const authToken = await AsyncStorage.getItem("token");
      let response = await authApi(authToken).post(endpoints["add-comments"](jobId, userId), form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`,
        },
      });

      setComments(prevComments => [...prevComments, response.data]);
      setComment('');
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  // method DELETE comment
  const handleDeleteComment = async (commentId) => {
    Alert.alert(
      'Xóa bình luận',
      'Bạn có chắc chắn muốn xóa bình luận này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
              const token = await getToken();
              await authAPI(token).delete(endpoints['del-comment'](jobId, commentId));
            } catch (error) {
              console.error('Error deleting comment:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditCommentId(commentId);
    setEditContent(currentContent);
    setMenuVisible(null);
  };

  // method EDIT comment
  const handleSaveEditComment = async () => {
    if (!editContent) {
      Alert.alert('Thông báo', 'Nội dung bình luận không được để trống.');
      return;
    }
    try {
      const token = await getToken();
      const response = await authAPI(token).patch(endpoints['patch-comment'](jobId, editCommentId), {
        content: editContent,
      });

      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === editCommentId ? { ...comment, content: response.data.content } : comment
        )
      );
      setEditCommentId(null);
      setEditContent('');
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  if (!Array.isArray(comments)) {
    return null;
  }

  return (
    <View>
      {comments.map((item, index) => {
        const { user: commentUser } = item;
        if (!commentUser) return null; // Nếu user null thì bỏ qua bình luận này
        return (
          <View key={item.id} style={styles.commentItem}>
            <View style={styles.commentHeader}>
              <Image
                source={
                  commentUser.avatar
                    ? { uri: user.avatar }
                    : require('../../assets/job.png')
                }
                style={styles.userAvatar}
              />
              <View style={styles.commentInfo}>
                <Text style={styles.commentAuthor}>
                  By: {user.username}
                </Text>
                <Text style={styles.commentTimestamp}>{moment(item.created_date).format('DD/MM/YYYY HH:mm')}</Text>
              </View>

              {user && user.username === commentUser.username && (
                <View>
                  <TouchableOpacity onPress={() => setMenuVisible(menuVisible === index ? null : index)}>
                    <Icon name="more-vert" size={24} color="#888" />
                  </TouchableOpacity>
                  {menuVisible === index && (
                    <View style={styles.menu}>
                      <TouchableOpacity onPress={() => handleEditComment(item.id, item.content)}>
                        <Text style={styles.menuItem}>Sửa</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                        <Text style={styles.menuItem}>Xóa</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
            {editCommentId === item.id ? (
              <View>
                <TextInput
                  style={styles.commentInput}
                  value={editContent}
                  onChangeText={setEditContent}
                />
                <View style={{ flexDirection: 'row', justifyContent: "flex-end" }}>
                  <TouchableOpacity onPress={handleSaveEditComment} style={styles.sendSave}>
                    <Text style={styles.sendButtonText}>Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { setEditCommentId(null); setEditContent(''); }} style={styles.cancelButton}>
                    <Text style={styles.sendButtonText}>Hủy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={{ fontSize: 16, marginBottom: 5 }}>{item.content}</Text>
            )}
          </View>
        );
      })}
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 50 }}>
        <TextInput
          style={styles.commentInput}
          placeholder="Nhập bình luận của bạn"
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
          <Text style={styles.sendButtonSubmit}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sendSave: {
    backgroundColor: '#00b14f',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginRight: 5
  },
  cancelButton: {
    backgroundColor: '#f00',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentItem: {
    padding: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  commentInfo: {
    flex: 1,
    marginLeft: 8,
  },
  commentAuthor: {
    fontSize: 16,
    color: '#888',
  },
  commentTimestamp: {
    fontSize: 14,
    color: '#aaa',
  },
  commentInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 20,
    marginTop: 20,
    width: "80%"
  },
  sendButton: {
    backgroundColor: '#00b14f',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 10
  },
  sendButtonText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
  },
  sendButtonSubmit: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  menu: {
    position: 'absolute',
    top: 24,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 2,
    zIndex: 1,
    width: 100,
  },
  menuItem: {
    padding: 8,
    fontSize: 16,
    color: '#000',
  },
});

export default Comments;
