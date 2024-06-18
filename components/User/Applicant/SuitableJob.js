
import React, { useContext, useState } from 'react';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MyUserContext } from '../../../configs/Contexts';
import { View, Text } from 'react-native';

const SuitableJob = () => {
  const navigation = useNavigation();
  const user = useContext(MyUserContext);
  const _goBack = () => navigation.navigate("ProfileApplicant");

  const _handleSearch = () => console.log('Searching');

  console.log(user.applicant.career.name);
  
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title="Gợi ý việc làm phù hợp" />
        <Appbar.Action icon="magnify" onPress={_handleSearch} />
      </Appbar.Header>
      <View>
        <Text></Text>
      </View>
      
    </>
   
  );
};

export default SuitableJob;