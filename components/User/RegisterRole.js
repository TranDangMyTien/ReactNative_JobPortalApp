import React, { useState } from 'react';
import { Alert, View, StyleSheet, Text } from 'react-native';
import { Button, Title, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const RegisterRole = ({ route }) => {
  const navigation = useNavigation();
  const { userId, is_employer } = route.params; // Receive from Register => Continue passing to RegisterApplicant and RegisterEmployer
  const [loading, setLoading] = useState(false);

  const handleApplicantPress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('RegisterApplicant', { userId });
    }, 3000); // 3000 milliseconds = 3 seconds
  };

  const handleEmployerPress = () => {
    if (is_employer === true) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('RegisterEmployer', { userId });
      }, 3000); // 3000 milliseconds = 3 seconds
    } else {
      Alert.alert("Thông báo", "Chờ admin xét duyệt");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>OU Job</Text>
      <Title style={styles.title}>Chọn vai trò của bạn</Title>
      <Button
        mode="contained"
        style={styles.button}
        onPress={handleApplicantPress}
        disabled={loading}
      >
        Ứng viên
      </Button>
      <Button
        mode="contained"
        style={styles.button}
        onPress={handleEmployerPress}
        disabled={loading}
      >
        Nhà tuyển dụng
      </Button>
      {loading && <ActivityIndicator size="large" style={styles.loading} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#28A745',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    marginVertical: 10,
    paddingVertical: 10,
    width: '80%',
    backgroundColor: '#28A745',
  },
  loading: {
    marginTop: 20,
  },
});

export default RegisterRole;
