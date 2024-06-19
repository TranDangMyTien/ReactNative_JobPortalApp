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
import ProfileApplicant from './components/User/Applicant/ProfileApplicant';
import ProfileEmployer from './components/User/Employer/ProfileEmployer';
import ProfileAdmin from './components/User/Admin/ProfileAdmin';
import Login from './components/User/Login';
import Register from './components/User/Register/Register';
import RegisterRole from './components/User/Register/RegisterRole';
import RegisterApplicant from './components/User/Register/RegisterApplicant';
import RegisterEmployer from './components/User/Register/RegisterEmployer';
import PostDetail from './components/RecruitmentsPost/PostDetail';
import NewPost from './components/RecruitmentsPost/NewPost';
import ApplyJob from './components/RecruitmentsPost/ApplyJob';
import FavoriteJobs from './components/RecruitmentsPost/FavoriteJobs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Profile from './components/User/Normal User/Profile';
import ForgotPassword from './components/User/ForgotPassword';
import UpdateUser from './components/User/UpdateUser';
import AllJobs from './components/RecruitmentsPost/AllJobs';
import PopularJobs from './components/RecruitmentsPost/PopularJobs';
import { Provider as PaperProvider } from 'react-native-paper'; 
import UpdateApplicant from './components/User/Applicant/UpdateApplicant';
import SuitableJob from './components/User/Applicant/SuitableJob';
import UpdateEmployer from './components/User/Employer/UpdateEmployer';
import CreateRecruitment from './components/User/Employer/CreateRecruitment';
import ListJobPost from './components/User/Employer/ListJobPost';
// Cài đặt stack
const Stack = createStackNavigator();

const MyHome = () => {
  return (
    <PaperProvider>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="JobList" component={PostList} />
        <Stack.Screen name="JobDetail" component={PostDetail} />
        <Stack.Screen name="NewPost" component={NewPost} />
        <Stack.Screen name="ApplyJob" component={ApplyJob} />
        <Stack.Screen name="FavoriteJobs" component={FavoriteJobs} />
        <Stack.Screen name="AllJobs" component={AllJobs} />
        <Stack.Screen name="PopularJobs" component={PopularJobs} />
      </Stack.Navigator>
    </PaperProvider>
  );
}

// Màn hình bên đăng ký
const MyRegister = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="RegisterRole" component={RegisterRole} />
      <Stack.Screen name="RegisterApplicant" component={RegisterApplicant} />
      <Stack.Screen name="RegisterEmployer" component={RegisterEmployer} />
    
    </Stack.Navigator>
  )
}

const MyLogin = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  )
}
const MyProfileApplicant = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileApplicant" component={ProfileApplicant} />
      <Stack.Screen name="UpdateUser" component={UpdateUser} />
      <Stack.Screen name="UpdateApplicant" component={UpdateApplicant} />
      <Stack.Screen name="SuitableJob" component={SuitableJob} />

    </Stack.Navigator>
  )
}

const MyProfileEmployer = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileEmployer" component={ProfileEmployer} />
      <Stack.Screen name="UpdateUser" component={UpdateUser} />
      <Stack.Screen name="UpdateEmployer" component={UpdateEmployer} />
      <Stack.Screen name="CreateRecruitment" component={CreateRecruitment} />
      <Stack.Screen name="ListJobPost" component={ListJobPost} />
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
          } else if (route.name === 'MyRegister') {
            iconName = 'account-plus';
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'MyLogin') {
            iconName = 'login';
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'MyProfileApplicant') {
            iconName = 'account';
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'MyProfileEmployer') {
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
          <Tab.Screen name="MyRegister" component={MyRegister} options={{ title: 'Đăng ký' }} />
          <Tab.Screen name="MyLogin" component={MyLogin} options={{ title: 'Đăng nhập' }} />
          
        </>
      ) : (
        <>
          {user.is_applicant && (
            <Tab.Screen name="MyProfileApplicant" component={MyProfileApplicant} options={{ title: 'Ứng viên' }} />
          )}
          {user.is_employer && (
            <Tab.Screen name="MyProfileEmployer" component={MyProfileEmployer} options={{ title: 'Nhà tuyển dụng' }} />
          )}
          {(user.is_staff || user.is_superuser) && (
            <Tab.Screen name="Admin" component={ProfileAdmin} options={{ title: 'Quản trị viên' }} />
          )}
          {!user.is_applicant && !user.is_employer && !user.is_staff && !user.is_superuser && (
            <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
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