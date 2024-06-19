import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Searchbar, Appbar } from 'react-native-paper';
import { fetchListApplyJobs } from '../../../configs/APIs'; 
import { MyUserContext } from '../../../configs/Contexts';

const ListApply = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const user = useContext(MyUserContext);

  const handleGoBack = () => {
    navigation.navigate("HomeScreen");
  };

  const fetchJobs = async (pageNum = 1, isRefreshing = false) => {
    if (loading && !isRefreshing) return;
    setLoading(true);

    try {
      const data = await fetchListApplyJobs(user.applicant.id, pageNum);
      if (data && Array.isArray(data.results)) {
        if (pageNum === 1) {
          setJobs(data.results);
          setFilteredJobs(data.results);
        } else {
          setJobs(prevJobs => [...prevJobs, ...data.results]);
          setFilteredJobs(prevJobs => [...prevJobs, ...data.results]);
        }
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
    fetchJobs();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchJobs(1, true);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !loading) {
      fetchJobs(page + 1);
    }
  };

  // Tìm kiếm theo tiêu đề công việc
  const search = (query) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter((job) =>
        job.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  };

  const renderJobItem = ({ item }) => (
    <TouchableOpacity
      style={styles.jobItem}
      onPress={() => navigation.navigate('DetailApply', { jobId: item.id.toString() })}
    >
      <Image source={{ uri: item.image }} style={styles.jobImage} />
      <View style={styles.jobDetails}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobDeadline}>Deadline: {item.deadline}</Text>
        <Text style={styles.jobExperience}>{item.experience}</Text>
        <Text style={styles.jobArea}>{item.area.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#28A745', height: 45 }}>
        <Appbar.BackAction onPress={handleGoBack} color="white" />
        <Appbar.Content title="Tất cả bài tuyển dụng"
          style={{ alignItems: 'center', justifyContent: 'center' }}
          titleStyle={{ color: 'white' }}
        />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={{ marginBottom: 10, marginTop: 10 }}>
          <Searchbar
            placeholder="Nhập từ khóa..."
            onChangeText={search}
            value={searchQuery}
          />
        </View>
        {loading && page === 1 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <FlatList
            contentContainerStyle={styles.flatListContentContainer}
            data={filteredJobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id.toString()}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading && hasNextPage ? <ActivityIndicator size="large" color="#0000ff" /> : null}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  flatListContentContainer: {
    alignItems: 'center', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2.5,
    borderColor: '#006400',
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#add8e6',
    width: "90%"
  },
  jobImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  jobDeadline: {
    fontSize: 14,
    color: '#8b0000',
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

export default ListApply;
