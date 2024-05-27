import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const RegisterRole = ({route}) => {
  const navigation = useNavigation();
  const { userId, is_employer } = route.params; // Nhận từ Register => Tiếp tục đóng gói chuyển qua RegisterApplicant và RegisterEmployer


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
      }, 3000); // 5000 milliseconds = 5 seconds
    } else {
      Alert.alert("Thông báo", "Chờ admin xét duyệt");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Title>Select your role</Title>
      <Button
        mode="contained"
        style={{ marginVertical: 10 }}
        onPress={handleApplicantPress}
        disabled={loading}
      >
        Applicant
      </Button>
      <Button
        mode="contained"
        style={{ marginVertical: 10 }}
        onPress={handleEmployerPress}
        disabled={loading}
      >
        Employer
      </Button>
    </View>
  );
};

export default RegisterRole;
