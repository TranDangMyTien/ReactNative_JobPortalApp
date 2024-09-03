import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MyDispatchContext } from '../../../configs/Contexts'; // Adjust the import path if necessary
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const heightWindow = Dimensions.get("window").height;

// Example logo image source
const logoSource = 'https://example.com/logo.png'; // Replace with your logo URL

const ProfileAdmin = ({ navigation }) => {
  const dispatch = useContext(MyDispatchContext);

  const logout = () => { 
    dispatch({ type: "logout" });
    // navigation.navigate("Login"); // Uncomment if you want to navigate after logout
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.buttonLogOut} onPress={logout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
          <MaterialIcons name="logout" color="black" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  profileInfo: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonLogOut: {
    flexDirection: 'row',
    height: 50,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  logoutText: {
    fontSize: 14,
    color: '#333',
    marginRight: 24,
  },
});

export default ProfileAdmin;
