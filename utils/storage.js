import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error storing the auth token', error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error retrieving the auth token', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error removing the auth token', error);
  }
};

// Lưu trạng thái rằng người dùng đã hoàn thành Onboarding
export const storeOnboarded = async () => {
  try {
    await AsyncStorage.setItem('hasOnboarded', 'true');
  } catch (error) {
    console.error('Error storing onboarding status', error);
  }
};

// Lấy trạng thái rằng người dùng đã hoàn thành Onboarding hay chưa.
export const getOnboarded = async () => {
  try {
    const onboarded = await AsyncStorage.getItem('hasOnboarded');
    return onboarded === 'true';
  } catch (error) {
    console.error('Error retrieving onboarding status', error);
    return false;
  }
};