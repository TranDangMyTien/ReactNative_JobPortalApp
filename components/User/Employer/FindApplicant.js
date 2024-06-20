import React, { useState, useEffect, useContext } from "react";
import { Chip, List, ActivityIndicator, Searchbar } from "react-native-paper";
import { View, Text, StyleSheet, TouchableOpacity, Image, RefreshControl, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { authApi, endpoints } from "../../../configs/APIs";
import "moment/locale/vi";
import Footer from "../../Footer/Footer";
import { isCloseToBottom } from "../../../utils/utils";
import "moment/locale/vi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from '../../../configs/Contexts';

const FindApplicant = () => {
  const navigation = useNavigation();

  const [applicant, setApplicant] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const user = useContext(MyUserContext);
  const employerId = user.employer.id;

  const loadApplicant = async () => {
    if (page > 0) {
      const authToken = await AsyncStorage.getItem("token");
      const url = `${endpoints["find-applicant-suggestions"](employerId)}?q=${q}&page=${page}`;

      try {
        setLoading(true);
        let res = await authApi(authToken).get(url);

        if (page === 1) setApplicant(res.data.results);
        else if (page > 1)
          setApplicant((current) => {
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
    loadApplicant();
  }, [q, page]);

  const loadMore = ({ nativeEvent }) => {
    if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
      setPage(page + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Image source={require("../../Images/Job_Portal_Mtie.png")} style={styles.bannerImage} />
      </View>
      <Text style={styles.title}>OU Job đồng hành cùng bạn</Text>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Tìm kiếm ứng viên ..."
          value={q}
          onChangeText={(t) => search(t, setQ)}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#ff4500"
        />
      </View>

      <ScrollView onScroll={loadMore} refreshControl={<RefreshControl onRefresh={() => loadApplicant()} />}>
        {loading && <ActivityIndicator />}
        {applicant.length > 0 && applicant.map((c) => (
          <TouchableOpacity key={c.id} style={styles.itemContainer}>
            <List.Item
              title={c.user.first_name || c.user.last_name ? `${c.user.first_name} ${c.user.last_name}`.trim() : "No name provided"}
              description={() => (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText}><Text style={styles.descriptionLabel}>Vị trí:</Text> {c.position}</Text>
                  <Text style={styles.descriptionText}><Text style={styles.descriptionLabel}>Kỹ năng:</Text> {c.skills ? c.skills.map(skill => skill.name).join(', ') : 'N/A'}</Text>
                  <Text style={styles.descriptionText}><Text style={styles.descriptionLabel}>Khu vực:</Text> {c.areas ? c.areas.map(area => area.name).join(', ') : 'N/A'}</Text>
                  <Text style={styles.descriptionText}><Text style={styles.descriptionLabel}>Mức lương mong muốn:</Text> {c.salary_expectation}</Text>
                  <Text style={styles.descriptionText}><Text style={styles.descriptionLabel}>Kinh nghiệm:</Text> {c.experience}</Text>
                  <Text style={styles.descriptionText}><Text style={styles.descriptionLabel}>Ngành nghề:</Text> {c.career.name}</Text>
                  {c.cv ? (
                    <Text style={styles.cvLink} onPress={() => {/* add functionality to view CV */}}>View CV</Text>
                  ) : (
                    <Text style={styles.noCv}>No CV</Text>
                  )}
                </View>
              )}
              left={() =>
                c.user.avatar ? (
                  <Image style={styles.avatar} source={{ uri: c.user.avatar }} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarPlaceholderText}>{c.user.first_name.charAt(0) || c.user.last_name.charAt(0) || 'N/A'}</Text>
                  </View>
                )
              }
            />
          </TouchableOpacity>
        ))}
        {loading && page > 1 && <ActivityIndicator />}
      </ScrollView>

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
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    borderColor: "#00838f",
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  chipText: {
    color: "#000000",
  },
  chipTextSelected: {
    color: "#FFFFFF",
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
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderText: {
    fontSize: 24,
    color: "#757575",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  descriptionContainer: {
    marginLeft: -15,
    flex: 1,
    marginRight: 20,
    paddingVertical: 5,
    paddingHorizontal: 5,
    
    
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  descriptionLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  noCv: {
    fontSize: 14,
    color: "#a52a2a",
  },
  cvLink: {
    fontSize: 14,
    color: "#007bff",
    textDecorationLine: "underline",
    marginTop: 8,
  },
});

export default FindApplicant;
