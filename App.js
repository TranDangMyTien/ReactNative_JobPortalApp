import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MyDispatchContext, MyUserContext } from './configs/Contexts';
import { useContext, useReducer, useEffect } from 'react';
import MyUserReducer from './configs/Reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './components/Home/HomeScreen';
import PostList from './components/RecruitmentsPost/PostList';
import ProfileApplicant from './components/User/ProfileApplicant';
import ProfileEmployer from './components/User/ProfileEmployer';
import ProfileAdmin from './components/User/ProfileAdmin';
import Login from './components/User/Login';
import Register from './components/User/Register';
import RegisterRole from './components/User/RegisterRole';
import RegisterApplicant from './components/User/RegisterApplicant';
import RegisterEmployer from './components/User/RegisterEmployer';
import RecruitmentsPost from './components/RecruitmentsPost/RecruitmentsPost';
import PostDetail from './components/RecruitmentsPost/PostDetail';
import NewPost from './components/RecruitmentsPost/NewPost';
import ApplyJob from './components/RecruitmentsPost/ApplyJob';
import FavoriteJobs from './components/RecruitmentsPost/FavoriteJobs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Cài đặt stack
const Stack = createStackNavigator();

const MyHome = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="JobList" component={PostList} />
      <Stack.Screen name="JobDetail" component={PostDetail} />
      <Stack.Screen name="NewPost" component={NewPost} />
      <Stack.Screen name="ApplyJob" component={ApplyJob} />
      <Stack.Screen name="FavoriteJobs" component={FavoriteJobs} />
    </Stack.Navigator>
  );
}

// Màn hình bên đăng ký
const MyRegister = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyRegister" component={Register} />
      <Stack.Screen name="RegisterRole" component={RegisterRole} />
      <Stack.Screen name="RegisterApplicant" component={RegisterApplicant} />
      <Stack.Screen name="RegisterEmployer" component={RegisterEmployer} />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator();
const MyTab = () => {
  const user = useContext(MyUserContext);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'MyHome') {
            iconName = 'home';
            return <FontAwesome name={iconName} size={size} color={color} />;
          } else if (route.name === 'Register') {
            iconName = 'account-plus';
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Login') {
            iconName = 'login';
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'ProfileApplicant') {
            iconName = 'account';
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'ProfileEmployer') {
            iconName = 'office-building';
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Admin') {
            iconName = 'shield-account';
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          }

          // Không tìm thấy iconName phù hợp, trả về null
          return null;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="MyHome" component={MyHome} options={{ title: 'Trang chủ' }} />

      {user === null ? (
        <>
          <Tab.Screen name="Register" component={MyRegister} options={{ title: 'Đăng ký' }} />
          <Tab.Screen name="Login" component={Login} options={{ title: 'Đăng nhập' }} />
        </>
      ) : (
        <>
          {user.is_applicant && (
            <Tab.Screen name="ProfileApplicant" component={ProfileApplicant} options={{ title: 'Ứng viên' }} />
          )}
          {user.is_employer && (
            <Tab.Screen name="ProfileEmployer" component={ProfileEmployer} options={{ title: 'Nhà tuyển dụng' }} />
          )}
          {(user.is_staff || user.is_superuser) && (
            <Tab.Screen name="Admin" component={ProfileAdmin} options={{ title: 'Quản trị viên' }} />
          )}
        </>
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  const alreadyLogin = async (retryCount = 0) => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");

      if (!authToken) {
        dispatch({ type: "logout" });
        return;
      }

      try {
        const currentUser = await authAPI(authToken).get(
          endpoints["current-user"]
        );
        dispatch({ type: "login", payload: currentUser.data });
      } catch (error) {
        let errorStatus;
        if (error.response) {
          errorStatus = error.response.status;
          if (
            (errorStatus !== 401 && errorStatus !== 403) ||
            retryCount > 3
          ) {
            dispatch({ type: "logout" });
            return;
          }
        } else if (error.request) {
          console.error(error.request);
        } else {
          console.error(`Error message: ${error.message}`);
        }
      }
    } catch (error) {
      console.error(`AsyncStorage error: ${error.message}`);
    }
  };

  useEffect(() => {
    alreadyLogin();
  }, []);

  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <MyTab />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
}