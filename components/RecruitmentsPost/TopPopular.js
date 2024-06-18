
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchPopularJobs } from '../../configs/APIs';

const TopPopular = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();

  const fetchJobs = async () => {
    setLoading(true);
    let allJobs = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        const data = await fetchPopularJobs(currentPage);
        if (data && Array.isArray(data.results)) {
          allJobs = [...allJobs, ...data.results];
          currentPage++;
          if (data.next === null) {
            hasMorePages = false;
          }
        } else {
          console.error('API response does not contain a results array');
          hasMorePages = false;
        }
      } catch (error) {
        console.error(error);
        hasMorePages = false;
      }
    }

    const sortedJobs = allJobs.slice(0, 4);
    setJobs(sortedJobs);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const renderJobItem = ({ item }) => (
    <TouchableOpacity
      style={styles.jobItem}
      onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.jobImage} />
      <View style={styles.jobDetails}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobDeadline}>Deadline: {item.deadline}</Text>
        <Text style={styles.jobContent}>{item.experience}</Text>
        <Text style={styles.jobContent}>{item.area.name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && jobs.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
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
    marginRight: 20,
    marginLeft: 20,
    backgroundColor: '#8fbc8f',
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
  jobContent: {
    fontSize: 14,
    color: '#000000',
  },
  jobDeadline: {
    fontSize: 14,
    color: '#a52a2a',
  },
  jobCreatedDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default TopPopular;