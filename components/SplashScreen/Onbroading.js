import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Swiper from "react-native-swiper";
import { appInfo } from "../constants/appInfos";

const Onbroading = ({ onComplete }) => {
  const [index, setIndex] = useState(0);

  return (
    <View style={styles.container}>
      {/* showsPagination={false} : Ẩn đi nút khi chuyển ảnh */}
      <Swiper
        style={{}}
        showsPagination={false}
        loop={false}
        onIndexChanged={(num) => setIndex(num)}
        index={index}
      >
        <Image
          source={require("../../assets/Images/Onbroading4_min.webp")}
          style={styles.image}
        />

        <Image
          source={require("../../assets/Images/Onbroading5_min.webp")}
          style={styles.image}
        />
        <Image
          source={require("../../assets/Images/Onbroading6_min.webp")}
          style={styles.image}
        />
      </Swiper>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onComplete} style={[styles.button, styles.skipButton]}>
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.nextButton]}
          onPress={() => (index < 2 ? setIndex(index + 1) : onComplete())}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onbroading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    flex: 1,
    width: appInfo.sizes.WIDTH,
    height: appInfo.sizes.HEIGHT,
    resizeMode: "cover",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 60,
    position: "absolute",
    bottom: 20,
    right: 20,
    left: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  skipButton: {
    backgroundColor: "black",
  },
  nextButton: {
    backgroundColor: "green",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
