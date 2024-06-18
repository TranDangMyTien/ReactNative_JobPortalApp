import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Footer = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.footerContent, { opacity: 0.8 }]}
        activeOpacity={0.6}
      >
        <MaterialIcons name="info-outline" size={24} color="#666" />
        <Text style={styles.footerText}>Về chúng tôi</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.footerContent, { opacity: 0.8 }]}
        activeOpacity={0.6}
      >
        <MaterialIcons name="mail-outline" size={24} color="#666" />
        <Text style={styles.footerText}>Liên hệ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 4,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
});

export default Footer;