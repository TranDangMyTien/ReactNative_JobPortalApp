import React, { useState } from 'react';
import { Alert, View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Button, Title, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const RegisterRole = ({ route }) => {
  const navigation = useNavigation();
  const { userId, is_employer } = route.params || {}; // Đảm bảo nhận được tham số
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 2000); // 2000 milliseconds = 2 giây
  };

  const handleApplicantPress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('RegisterApplicant', { userId });
    }, 3000); // 3000 milliseconds = 3 giây
  };

  const handleEmployerPress = () => {
    if (is_employer === true) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('RegisterEmployer', { userId });
      }, 3000); // 3000 milliseconds = 3 giây
    } else {
      Alert.alert("Thông báo", "Chờ admin xét duyệt");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Image
            source={require('../../../assets/icons/left.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn ứng tuyển</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.header}>OU Job</Text>
        <Title style={styles.title}>Chọn vai trò của bạn</Title>
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleApplicantPress}
          disabled={loading}
          labelStyle={styles.buttonText}
        >
          Ứng viên
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleEmployerPress}
          disabled={loading}
          labelStyle={styles.buttonText}
        >
          Nhà tuyển dụng
        </Button>
        {loading && <ActivityIndicator size="large" style={styles.loading} />}
      </View>
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
    fontSize: 40,
    fontWeight: 'bold',
    color: '#28A745',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 35,
    color: '#333',
  },
  button: {
    marginVertical: 10,
    paddingVertical: 10,
    width: '80%',
    backgroundColor: '#28A745',
  },
  buttonText: {
    fontSize: 16, // Điều chỉnh kích thước font để nhỏ hơn
  },
  loading: {
    marginTop: 20,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#00b14f',
    position: 'relative',
  },
  backIcon: {
    width: 40, // Điều chỉnh kích thước biểu tượng quay lại
    height: 40, // Điều chỉnh kích thước biểu tượng quay lại
    tintColor: 'white',
  },
  backButton: {
    padding: 8, // Thêm lề cho vùng chạm
  },
  headerTitle: {
    flex: 1, // Đảm bảo tiêu đề chiếm hết không gian còn lại
    textAlign: 'center',
    fontSize: 24, // Điều chỉnh kích thước chữ
    fontWeight: 'bold',
    color: 'white',
  },
});

export default RegisterRole;
