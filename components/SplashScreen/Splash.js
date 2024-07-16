import {
    ActivityIndicator,
    ImageBackground,
    Image,
    View,
    StyleSheet,
  } from "react-native";
  import React, { useState } from "react";
  import { appInfo } from "../constants/appInfos";
  import SpaceComponent from './SpaceComponent'; // Import default
  
  const Splash = () => {
    const [isLoading, setIsLoading] = useState(true);
  
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/Images/BG_JobPortalApp.png")}
          style={styles.backgroundImage}
          imageStyle={{ flex: 1 }}
          onLoadEnd={() => setIsLoading(false)}
        >
           
            <Image
              source={require("../../assets/Images/Logo_JobPortalApp_Green.png")}
              style={styles.logo}
            />
        
          <SpaceComponent height={16} />
          <ActivityIndicator style={styles.indicator} />
        </ImageBackground>
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
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    },
    logo: {
      width: appInfo.sizes.WIDTH * 0.7,
      resizeMode: "contain",
    },
    indicator: {
      color: '#807A7A',
      size: 22,
    },
  });
  
  export default Splash;
  