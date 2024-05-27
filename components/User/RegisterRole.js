import React from 'react';
import { Alert, View } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const RegisterRole = ({route}) => {
  const navigation = useNavigation();
  const { userId, is_employer } = route.params; //Nhận từ Register => Tiếp tục đóng gói chuyển qua RegisterApplicant và RegisterEmployer

  const handleApplicantPress = () => {
    navigation.navigate('RegisterApplicant', { userId });
  };

  const handleEmployerPress = () => {
    if (is_employer === true){
      navigation.navigate('RegisterEmployer', { userId });
    } else{
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
      >
        Applicant
      </Button>
      <Button
        mode="contained"
        style={{ marginVertical: 10 }}
        onPress={handleEmployerPress}
      >
        Employer
      </Button>
    </View>
  );
};

export default RegisterRole;