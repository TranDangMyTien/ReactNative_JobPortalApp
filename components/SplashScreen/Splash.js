import { ActivityIndicator, Image, View, StyleSheet, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { appInfo } from "../constants/appInfos";

const Splash = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/Images/BG_JobPortalApp_min.webp")}
        style={[styles.backgroundImage, { opacity: fadeAnim }]}
      />
      <View style={styles.contentContainer}>
        <Image
          source={require("../../assets/Images/Logo_JobPortalApp_Green.png")}
          style={styles.logo}
        />
        
        <ActivityIndicator color='#807A7A' size={22} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  logo: {
    width: appInfo.sizes.WIDTH * 0.7,
    resizeMode: "contain",
  },
});

export default Splash;