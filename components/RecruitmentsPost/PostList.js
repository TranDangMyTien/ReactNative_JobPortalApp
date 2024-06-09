import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';
import { fetchJobList } from '../../configs/APIs';

const PostList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const fetchJobs = async (pageNum = 1) => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await fetchJobList(pageNum);
      if (data && Array.isArray(data.results)) {
        // Sắp xếp các công việc theo ngày deadline giảm dần
        const sortedJobs = data.results.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
        const newJobs = sortedJobs;        
        setJobs(newJobs);
        setFilteredJobs(newJobs); 
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
    fetchJobs(1);
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      fetchJobs(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchJobs(page - 1);
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
      // Sắp xếp các kết quả tìm kiếm theo ngày deadline giảm dần
      const sortedFiltered = filtered.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
      setFilteredJobs(sortedFiltered);
    }
  };

  const renderJobItem = ({ item }) => (
    <TouchableOpacity
      style={styles.jobItem}
      onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
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
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id.toString()}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      )}
      <View style={styles.paginationContainer}>
        <Button title="Trang trước" onPress={handlePrevPage} disabled={page === 1} />
        <Text style={styles.pageNumber}>Trang {page}</Text>
        <Button title="Trang tiếp theo" onPress={handleNextPage} disabled={!hasNextPage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: 40,
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
    borderWidth: 1,
    borderColor: '#00b14f',
    borderRadius: 10,
    padding: 10,
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
    color: '#666',
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
});

export default PostList;