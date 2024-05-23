import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import {Stack} from 'expo-route';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecruitmentsPost from './components/RecruitmentsPost/RecruitmentsPost';

//Cài đăt stack 
const Stack = createNativeStackNavigator();

//Chia màn hình 
const MyStack = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={RecruitmentsPost} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack/> 
    </NavigationContainer>
  );
}





