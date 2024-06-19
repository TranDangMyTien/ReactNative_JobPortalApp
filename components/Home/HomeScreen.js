import React, { useState, useEffect } from "react";
import { Chip, List, ActivityIndicator, Searchbar } from "react-native-paper";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import NewPost from "../RecruitmentsPost/NewPost";
import TopPopular from '../RecruitmentsPost/TopPopular';
import APIs, { endpoints } from "../../configs/APIs";
import "moment/locale/vi";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from "../Footer/Footer";
const Stack = createStackNavigator();

const HomeScreen = () => {
  const navigation = useNavigation();
  const [employmentTypes, setEmploymentTypes] = useState(null);
  const [post, setPost] = useState([]);
  const [typeId, setTypeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);

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
      <TouchableOpacity onPress={() => navigation.navigate("AllJobs")}>
        <Text style={styles.viewAllButton}>All Jobs</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top công việc phổ biến</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PopularJobs')}>
          <Text style={styles.viewAllButton}>All Jobs</Text>
        </TouchableOpacity>
      </View>
      {/* component danh sách top công việc được apply nhiều nhất */}
      <TopPopular />
    </View>
  );

  const loadTypes = async () => {
    try {
      let res = await APIs.get(endpoints["employmenttypes"]);
      setEmploymentTypes(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const loadPost = async () => {
    if (page > 0) {
      let url = `${endpoints["recruitments_post"]}?title=${title}&type_id=${typeId}&page=${page}`;
      try {
        setLoading(true);
        let res = await APIs.get(url);
        if (page === 1) setPost(res.data.results);
        else if (page > 1)
          setPost((current) => {
            return [...current, ...res.data.results];
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
  };

  const search = (value, callback) => {
    setPage(1);
    callback(value);
  };

  useEffect(() => {
    loadTypes();
  }, []);

  useEffect(() => {
    loadPost();
  }, [title, typeId, page]);

  const loadMore = () => {
    if (!loading && page > 0) {
      setPage(page + 1);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("JobDetail", { jobId: item.id })} style={styles.itemContainer}>
      <Image style={styles.avatar} source={{ uri: item.image }} />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.jobDeadline}>Deadline: {item.deadline}</Text>
        <Text style={styles.jobContent}>{item.experience}</Text>
        <Text style={styles.jobContent}>{item.area.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Image source={require("../Images/Job_Portal_Mtie.png")} style={styles.bannerImage} />
      </View>
      <Text style={styles.title}>OU Job đồng hành cùng bạn</Text>
      <View style={styles.chipContainer}>
        <FlatList
          data={employmentTypes}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Chip
              mode={item.id === typeId ? "outlined" : "flat"}
              key={item.id}
              onPress={() => search(item.id, setTypeId)}
              style={[styles.chip, item.id === typeId ? styles.chipSelected : null]}
              icon={() => <MaterialCommunityIcons name="tag-heart" size={20} color="white" />}
            >
              <Text style={[styles.chipText, item.id === typeId ? styles.chipTextSelected : null]}>
                {item.type}
              </Text>
            </Chip>
          )}
          ListHeaderComponent={() => (
            <Chip
              mode={!typeId ? "outlined" : "flat"}
              style={[styles.chip, !typeId ? styles.chipSelected : null]}
              onPress={() => search("", setTypeId)}
              icon={() => <MaterialCommunityIcons name="heart-outline" size={20} color="white" />}
            >
              <Text style={[styles.chipText, !typeId ? styles.chipTextSelected : null]}>Tất cả</Text>
            </Chip>
          )}
          ListFooterComponent={employmentTypes === null ? <ActivityIndicator /> : null}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContentContainer}
        />
      </View>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Tìm kiếm bài đăng tuyển dụng..."
          value={title}
          onChangeText={(t) => search(t, setTitle)}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#ff4500"
        />
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={post}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={() => {
              setPage(1);
              loadPost();
            }} />
          }
          contentContainerStyle={{ columnGap: 16 }}
          ListFooterComponent={loading && page > 1 ? <ActivityIndicator /> : null}
        />
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
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  searchBar: {
    borderRadius: 25, 
    height: 50,
    backgroundColor: "#f0f0f0", 
  },
  searchInput: {
    fontSize: 16,
  },
  chipContainer: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  chipContentContainer: {
    paddingVertical: 8,
  },
  chip: {
    marginRight: 8,
    borderRadius: 16, // More rounded corners
    backgroundColor: "#f0f0f0",
    borderColor: "#00838f",
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  chipText: {
    color: "#000000", // Default color for all types
  },
  chipTextSelected: {
    color: "#FFFFFF", // Text color when selected
  },
  row: {
    flexDirection: "row",
  },
  wrap: {
    flexWrap: "wrap",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
  },
  banner: {
    width: "100%",
    height: "25%",
  },
  bannerImage: {
    resizeMode: "cover",
    marginBottom: 10,
    width: "100%",
    height: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    padding: 5,
  },
  viewAllButton: {
    color: "#008000",
    fontWeight: "bold",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    width: 400,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  itemContent: {
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  jobContent: {
    fontSize: 14,
    color: "#666",
  },
  jobDeadline: {
    fontSize: 14,
    color: "#a52a2a",
  },
  
});

export default HomeScreen;
