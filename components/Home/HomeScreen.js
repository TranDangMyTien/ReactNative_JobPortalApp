import React, { useState, useEffect } from "react";
import { Chip, List } from "react-native-paper";
import { ActivityIndicator, Searchbar } from 'react-native-paper';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NewPost from '../RecruitmentsPost/NewPost';
import APIs, { endpoints } from "../../configs/APIs";
import { isCloseToBottom } from '../../utils/utils';
import moment from "moment";
import "moment/locale/vi";
// import Item from "../../utils/item";



const HomeScreen = () => {
  const navigation = useNavigation();
  const [employmentTypes, setEmploymentTypes] = useState(null);
  const [post, setPost] = useState([]);
  const [typeId, setTypeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(""); 
  const [page, setPage] = useState(1);

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

  const loadTypes = async () => {
    try {
      let res = await APIs.get(endpoints['employmenttypes']);
      setEmploymentTypes(res.data);
    } catch (ex) {
      console.error(ex);
    }
  }

  const loadPost = async () => {
    if (page > 0) {
      //Trước mắt xây dựng phần tìm kiếm bằng tiêu đề và id của loại hình công việc 
      let url = `${endpoints['recruitments_post']}?title=${title}&type_id=${typeId}&page=${page}`;
      try {
        setLoading(true);
        let res = await APIs.get(url);
        if (page === 1)
          setPost(res.data.results);
        else if (page > 1)
          setPost(current => {
            return [...current, ...res.data.results]
          });

        if (res.data.next === null) { 
          setPage(0); 
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  }

  const search = (value, callback) => {
    setPage(1);
    callback(value);
  }

  useEffect(() => {
    loadTypes();
  }, []);

  useEffect(() => {
    loadPost();
  }, [title, typeId, page]);

  const loadMore = ({ nativeEvent }) => {
    if (loading === false && page > 0 && isCloseToBottom(nativeEvent)) { //Khi page > 0 thì mới tiến hành cập nhật dữ liệu 
      setPage(page + 1);
    }
  }

  return (
    <View style={styles.container} >
      {/* Banner Image */}
      <View style={styles.banner}>
        <Image
          source={require('../Images/careers-banner.webp')}
          style={styles.bannerImage}
        />
      </View>
      
      <Text style={styles.title}>OU Job đồng hành cùng bạn </Text>
      <View style={[styles.row, styles.wrap]}>
        <Chip mode={!typeId ? "outlined" : "flat"} style={styles.margin} icon="tag" onPress={() => search("", setTypeId)}>Tất cả</Chip>
        {employmentTypes === null ? <ActivityIndicator /> : <>
          {employmentTypes.map(c => <Chip mode={c.id === typeId ? "outlined" : "flat"} key={c.id} onPress={() => search(c.id, setTypeId)} style={styles.margin} icon="shape-outline">{c.type}</Chip>)}
        </>}
      </View>

      <View>
        <Searchbar
          placeholder="Tìm kiếm bài đăng tuyển dụng..."
          value={title}
          onChangeText={(t) => search(t, setTitle)}
        />
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView
          onScroll={loadMore}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={() => loadPost()} />
          }
          contentContainerStyle={styles.scrollViewContent}
        >
          {post.length > 0 && post.map(c => (
            <TouchableOpacity key={c.id} onPress={() => navigation.navigate("JobDetail", { jobId: c.id })}>
              <List.Item
                title={c.title}
                description={moment(c.created_date).fromNow()}
                left={() => <Image style={styles.avatar} source={{ uri: c.image }} />}
              />
              {/* <Item instance={c} /> */}
            </TouchableOpacity>
          ))}
          {loading && page > 1 && <ActivityIndicator />}
        </ScrollView>

        <FlatList
          data={[]}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          renderItem={null}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponentStyle={{ marginBottom: 10 }}
          ListFooterComponentStyle={{ marginTop: 10 }}
          ListEmptyComponent={<NewPost />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
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
  row: {
    flexDirection: "row",
  },
  wrap: {
    flexWrap: "wrap"
  },
  margin: {
    margin: 8
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    textAlign: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  scrollViewContent: {
    padding: 10,
  },
});

export default HomeScreen;
