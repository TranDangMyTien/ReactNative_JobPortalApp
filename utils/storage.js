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

// Phần thực hiện Remember me => Trong môi trường thực tế nên dùng react-native-keychain hoặc expo-secure-store
// Để lưu trữ thông tin người dùng đảm bảo an toàn 
export const storeCredentials = async (username, password) => {
  try {
    await AsyncStorage.setItem('rememberedUsername', username);
    await AsyncStorage.setItem('rememberedPassword', password); // Cân nhắc mã hóa mật khẩu trước khi lưu
  } catch (error) {
    console.error('Error storing credentials', error);
  }
};

export const getCredentials = async () => {
  try {
    const username = await AsyncStorage.getItem('rememberedUsername');
    const password = await AsyncStorage.getItem('rememberedPassword');
    return { username, password };
  } catch (error) {
    console.error('Error retrieving credentials', error);
    return { username: null, password: null };
  }
};

export const removeCredentials = async () => {
  try {
    await AsyncStorage.removeItem('rememberedUsername');
    await AsyncStorage.removeItem('rememberedPassword');
  } catch (error) {
    console.error('Error removing credentials', error);
  }
};
