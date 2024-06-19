import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import { Searchbar, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { endpoints } from '../../../configs/APIs';
import axiosInstance from '../../../configs/APIs';
import { MyUserContext } from '../../../configs/Contexts';

const ListJobPost = () => {
    const user = useContext(MyUserContext);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.navigate("HomeScreen");
    };

  const fetchPosts = async (pageNum = 1) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(endpoints['list-createpost'](user.employer.id, pageNum));
      const data = response.data;
      if (data && Array.isArray(data.results)) {
        const newPosts = data.results;
        setPosts(pageNum === 1 ? newPosts : [...posts, ...newPosts]);
        setFilteredPosts(pageNum === 1 ? newPosts : [...posts, ...newPosts]);
        setPage(pageNum);
        setHasNextPage(!!data.next);
      } else {
        console.error('API response does not contain a results array');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPosts(1);
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      fetchPosts(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchPosts(page - 1);
    }
  };

  const search = (query) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => navigation.navigate('JobDetail', { jobId: item.id.toString() })}
    >
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postDetails}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDeadline}>Deadline: {item.deadline}</Text>
        <Text style={styles.postExperience}>{item.experience}</Text>
        <Text style={styles.postArea}>{item.area.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
        <Appbar.Header style={{backgroundColor: '#28A745', height: 45}}>
            <Appbar.BackAction onPress={handleGoBack} color="white"  />
            <Appbar.Content title="Quản lý các bài đăng" 
                style={{ alignItems: 'center', justifyContent: 'center'}} 
                titleStyle={{ color: 'white' }}
            />
        </Appbar.Header>
        <View style={styles.container}>
            <View style={{ marginBottom: 10 }}>
                <Searchbar
                placeholder="Nhập từ khóa..."
                onChangeText={search}
                value={searchQuery}
                />
            </View>
            {loading && page === 1 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator 
                        size="large" color="#0000ff" 
                    />
                </View>
            ) : (
            <FlatList
                contentContainerStyle={styles.flatListContentContainer}
                data={filteredPosts}
                renderItem={renderPostItem}
                keyExtractor={(item) => item.id.toString()}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
            />
            )}
            <View style={styles.paginationContainer}>
            <TouchableOpacity
                style={[styles.button, page === 1 && styles.buttonDisabled]}
                onPress={handlePrevPage}
                disabled={page === 1}
            >
                <Text style={styles.buttonText}>Trang trước</Text>
            </TouchableOpacity>
                <Text style={styles.pageNumber}>Trang {page}</Text>
            <TouchableOpacity
                style={[styles.button, !hasNextPage && styles.buttonDisabled]}
                onPress={handleNextPage}
                disabled={!hasNextPage}
            >
                <Text style={styles.buttonText}>Trang tiếp theo</Text>
            </TouchableOpacity>
            </View>
        </View>
    </>    
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        marginTop: 10,
    },
    flatListContentContainer: {
        alignItems: 'center', // Căn giữa các thẻ bài viết
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 2.5,
        borderColor: '#006400',
        borderRadius: 20,
        padding: 10,
        width: "90%",
        backgroundColor: '#b0c4de',
    },
    postImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    postDetails: {
        flex: 1,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postDeadline: {
        fontSize: 14,
        color: '#a52a2a',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    pageNumber: {
        fontSize: 16,
    },
    button: {
        backgroundColor: '#00b14f',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
        buttonDisabled: {
        backgroundColor: '#ccc',
    },
        buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ListJobPost;