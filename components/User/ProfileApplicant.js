import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  View,
  ScrollView,
} from "react-native";
import { MyUserContext } from "../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import { IconButton } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure to install react-native-vector-icons

const ProfileApplicant = () => {
  const navigation = useNavigation();
  const user = useContext(MyUserContext);
  const [profileImage, setProfileImage] = useState(user.avatar);
  const [modalVisible, setModalVisible] = useState(false);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const updateMajor = () => {
    console.log("Update major");
  };

  const updateJob = () => {
    console.log("Update job");
  };

  const updateAddress = () => {
    console.log("Update address");
  };

  const chooseImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const avatarSource = profileImage
    ? { uri: profileImage }
    : user.avatar
    ? { uri: user.avatar }
    : require("../../assets/job.png");

  return (
    <>
      <View style={styles.header}>
        <View>
          <Image
            source={avatarSource}
            style={styles.avatar}
            imageStyle={styles.avatarImage}
          />
          <IconButton
            icon="camera"
            size={24}
            style={styles.cameraIcon}
            onPress={chooseImage}
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.username}</Text>
          <Text style={styles.userId}>Mã ứng viên: {user.id}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formInfo}>
          <ProfileSection
            title="Chuyên ngành"
            content={user.applicant.career.name}
            onEdit={updateMajor}
          />
          <ProfileSection
            title="Kinh nghiệm"
            content={user.applicant.experience}
            onEdit={updateJob}
          />
          <ProfileSection
            title="Mức lương mong muốn"
            content={user.applicant.salary_expectation}
            onEdit={updateJob}
          />
          <ProfileSection
            title="Vị trí muốn apply làm việc"
            content={user.applicant.position}
            onEdit={updateJob}
          />
          <ProfileSection
            title="Địa điểm làm việc mong muốn"
            content={user.applicant.areas.map((area) => area.name).join(", ")}
            onEdit={updateAddress}
          />
          <ProfileSection
            title="CV của bạn"
            content={
              user.applicant.cv ? (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Image
                    source={{ uri: user.applicant.cv }}
                    style={styles.imageCV}
                  />
                </TouchableOpacity>
              ) : (
                "Bạn chưa cập nhật"
              )
            }
            onEdit={updateAddress}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Image source={{ uri: user.applicant.cv }} style={styles.modalImage} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => Logout(navigation)}
        >
          <Icon name="logout" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const ProfileSection = ({ title, content, onEdit }) => (
  <View style={styles.profileSection}>
    <View style={styles.title}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onEdit}>
        <Text style={styles.editText}>Sửa</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.content}>
      <Text style={styles.item}>{content || "Bạn chưa cập nhật"}</Text>
    </View>
    <View style={styles.separator} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#008080",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
  },
  userInfo: {
    flex: 1,
    marginLeft: 20,
  },
  userName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
  userId: {
    fontSize: 18,
    color: "#fff",
    marginVertical: 5,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  formInfo: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  profileSection: {
    marginBottom: 20,
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  editText: {
    color: "#00b14f",
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    fontSize: 16,
    color: "#333",
    borderRadius: 5,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
    marginTop: 10,
  },
  contentCV: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageCV: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    bottom: 20, // Positioned at the bottom
  },
  closeText: {
    color: "white",
    fontSize: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00b14f",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 30, // Increased horizontal padding
    width: "90%", // Increased overall width
    justifyContent: "center", // Centering the content
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ProfileApplicant;
