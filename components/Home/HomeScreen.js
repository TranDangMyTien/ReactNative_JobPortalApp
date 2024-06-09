import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Searchbar } from 'react-native-paper';
import NewPost from '../RecruitmentsPost/NewPost';
// import NewPost from './NewPost'; 
// import Company from './Company';


const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = React.useState('Full-time');
  const [searchQuery, setSearchQuery] = React.useState('');
  

  const renderOption = (option, optionText) => (
    <TouchableOpacity
      style={[
        styles.option,
        selectedOption === option && styles.selectedOption,
      ]}
      onPress={() => setSelectedOption(option)}
    >
      <Text style={styles.optionText}>{optionText}</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Công việc mới nhất</Text>
      <TouchableOpacity onPress={() => navigation.navigate('JobList')}>
        <Text style={styles.viewAllButton}>All Jobs</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top các công ty nổi bật</Text>
        <TouchableOpacity onPress={() => navigation.navigate('JobList')}>
          <Text style={styles.viewAllButton}>All Jobs</Text>
        </TouchableOpacity>
      </View>
      {/* component danh sách công ty nổi bật */}
      {/* <Company /> */}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Banner Image */}
      <View style={styles.banner}>
        <Image
          source={require('../Images/careers-banner.webp')}
          style={styles.bannerImage}
        />
      </View>
      
      <View style={styles.searchContainer}>
        <Text style={styles.searchLabel}>What are you looking for?</Text>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      <Card style={{margin: 5}}>
        <Card.Actions>
          <View style={styles.optionsContainer}>
            {renderOption('Full-time', 'Full-time')}
            {renderOption('Part-time', 'Part-time')}
            {renderOption('Contractor', 'Contractor')}
          </View>
        </Card.Actions>
      </Card>
      </View>
      <FlatList
        data={[]}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={null}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponentStyle={{ marginBottom: 10 }}
        ListFooterComponentStyle={{ marginTop: 10 }}
        ListEmptyComponent={<NewPost/>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />    
    </View>  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    marginTop: 8,
  },
  searchLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    color: '#008000',
  },
  optionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: "center"
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#006400',
    borderRadius: 20,
    marginRight: 8,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    color: '#333',
    fontWeight: 'bold',
  },
  jobsContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    padding: 5,
  },
  viewAllButton: {
    color: '#008000',
    fontWeight: 'bold',
  },
  banner: {
    width: '100%',
    height: '15%',
  },
  bannerImage: {
    resizeMode: 'cover',
    marginBottom: 10, 
    width: '100%',
    height: '100%',
  },
});


export default HomeScreen;