import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar } from 'react-native-paper';

const FavoriteJobs = () => {
  const navigation = useNavigation();
  const [favoriteJobs, setFavoriteJobs] = useState([]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const fetchFavoriteJobs = async () => {
      try {
        const storedFavoriteJobs = JSON.parse(await AsyncStorage.getItem('favoriteJobs')) || [];
        setFavoriteJobs(storedFavoriteJobs);
      } catch (error) {
        console.error('Error fetching favorite jobs: ', error);
      }
    };

    fetchFavoriteJobs();
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title="Danh sách bài viết yêu thích" style={{alignItems: 'center', fontSize: 8}}/>
      </Appbar.Header>

      <FlatList
        data={favoriteJobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.jobItem}
            onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.jobImage} />
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.jobCompany}>{item.employer.companyName}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  jobItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  jobImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  jobInfo: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobCompany: {
    fontSize: 16,
    color: '#888',
  },
});

export default FavoriteJobs;