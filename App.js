import "react-native-gesture-handler";
import { StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { MyDispatchContext, MyUserContext } from "./configs/Contexts";
import {
  useContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
} from "react";
import MyUserReducer from "./configs/Reducers";
import { authAPI, endpoints } from "./configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./components/Home/HomeScreen";
import ProfileApplicant from "./components/User/Applicant/ProfileApplicant";
import ProfileEmployer from "./components/User/Employer/ProfileEmployer";
import ProfileAdmin from "./components/User/Admin/ProfileAdmin";
import Login from "./components/User/Login";
import Register from "./components/User/Register/Register";
import RegisterRole from "./components/User/Register/RegisterRole";
import RegisterApplicant from "./components/User/Register/RegisterApplicant";
import RegisterEmployer from "./components/User/Register/RegisterEmployer";
import PostDetail from "./components/RecruitmentsPost/PostDetail";
import NewPost from "./components/RecruitmentsPost/NewPost";
import ApplyJob from "./components/RecruitmentsPost/ApplyJob";
import FavoriteJobs from "./components/RecruitmentsPost/FavoriteJobs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Profile from "./components/User/Normal User/Profile";
import ForgotPassword from "./components/User/ForgotPassword";
import UpdateUser from "./components/User/UpdateUser";
import AllJobs from "./components/RecruitmentsPost/AllJobs";
import PopularJobs from "./components/RecruitmentsPost/PopularJobs";
import { Provider as PaperProvider } from "react-native-paper";
import UpdateApplicant from "./components/User/Applicant/UpdateApplicant";
import SuitableJob from "./components/User/Applicant/SuitableJob";
import UpdateEmployer from "./components/User/Employer/UpdateEmployer";
import CreateRecruitment from "./components/User/Employer/CreateRecruitment";
import ListJobPost from "./components/User/Employer/ListJobPost";
import ListApply from "./components/User/Applicant/ListApply";
import FindApplicant from "./components/User/Employer/FindApplicant";
import Splash from "./components/SplashScreen/Splash";
import Onbroading from "./components/SplashScreen/Onbroading";
import { getToken, getOnboarded, storeOnboarded } from "./utils/storage";
import TermsOfService from "./components/Rules/TermsOfService";
import PrivacyPolicy from "./components/Rules/PrivacyPolicy";
import PasswordReset from "./components/User/PasswordReset";
// Cài đặt stack
const Stack = createStackNavigator();

const MyHome = () => {
  return (
    <PaperProvider>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="JobDetail" component={PostDetail} />
        <Stack.Screen name="NewPost" component={NewPost} />
        <Stack.Screen name="ApplyJob" component={ApplyJob} />
        <Stack.Screen name="FavoriteJobs" component={FavoriteJobs} />
        <Stack.Screen name="AllJobs" component={AllJobs} />
        <Stack.Screen name="PopularJobs" component={PopularJobs} />
      </Stack.Navigator>
    </PaperProvider>
  );
};

// Màn hình bên đăng ký
const MyRegister = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Register"
    >
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="RegisterRole" component={RegisterRole} />
      <Stack.Screen name="RegisterApplicant" component={RegisterApplicant} />

      <Stack.Screen name="RegisterEmployer" component={RegisterEmployer} />
    </Stack.Navigator>
  );
};

const MyLogin = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="PasswordReset" component={PasswordReset} />
    </Stack.Navigator>
  );
};
const MyProfileApplicant = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileApplicant" component={ProfileApplicant} />
      <Stack.Screen name="UpdateUser" component={UpdateUser} />
      <Stack.Screen name="UpdateApplicant" component={UpdateApplicant} />
      <Stack.Screen name="SuitableJob" component={SuitableJob} />
      <Stack.Screen name="ListApply" component={ListApply} />
    </Stack.Navigator>
  );
};

const MyProfileEmployer = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileEmployer" component={ProfileEmployer} />
      <Stack.Screen name="UpdateUser" component={UpdateUser} />
      <Stack.Screen name="UpdateEmployer" component={UpdateEmployer} />
      <Stack.Screen name="CreateRecruitment" component={CreateRecruitment} />
      <Stack.Screen name="ListJobPost" component={ListJobPost} />
      <Stack.Screen name="FindApplicant" component={FindApplicant} />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MyTab"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MyTab" component={MyTab} />
      <Stack.Screen name="TermsOfService" component={TermsOfService} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const MyTab = () => {
  const user = useContext(MyUserContext);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "MyHome") {
            iconName = "home";
            return <FontAwesome name={iconName} size={size} color={color} />;
          } else if (route.name === "MyRegister") {
            iconName = "account-plus";
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "MyLogin") {
            iconName = "login";
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "MyProfileApplicant") {
            iconName = "account";
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "MyProfileEmployer") {
            iconName = "office-building";
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Admin") {
            iconName = "shield-account";
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          }

          // Không tìm thấy iconName phù hợp, trả về null
          return null;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="MyHome"
        component={MyHome}
        options={{ title: "Home" }}
      />

      {user === null ? (
        <>
          <Tab.Screen
            name="MyRegister"
            component={MyRegister}
            options={{ title: "Register" }}
          />
          <Tab.Screen
            name="MyLogin"
            component={MyLogin}
            options={{ title: "Log in" }}
          />
        </>
      ) : (
        <>
          {user.applicant !== null && (
            <Tab.Screen
              name="MyProfileApplicant"
              component={MyProfileApplicant}
              options={{ title: "Ứng viên" }}
            />
          )}
          {user.employer !== null && (
            <Tab.Screen
              name="MyProfileEmployer"
              component={MyProfileEmployer}
              options={{ title: "Nhà tuyển dụng" }}
            />
          )}
          {(user.is_staff || user.is_superuser) && (
            <Tab.Screen
              name="Admin"
              component={ProfileAdmin}
              options={{ title: "Quản trị viên" }}
            />
          )}
          {user.applicant === null &&
            user.employer === null &&
            !user.is_staff &&
            !user.is_superuser && (
              <Tab.Screen
                name="Profile"
                component={Profile}
                options={{ title: "Profile" }}
              />
            )}
        </>
      )}
    </Tab.Navigator>
  );
};

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  //Phần Splash
  const [isShowSplash, serIsShowSplash] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkOnboardingAndLogin = async () => {
      const onboarded = await getOnboarded();
      const token = await getToken();
      setHasOnboarded(onboarded);
      setIsLoggedIn(!!token);
    };

    checkOnboardingAndLogin();
  }, []);

  // Set up thời gian chạy cho Splash
  useEffect(() => {
    const timeout = setTimeout(() => {
      serIsShowSplash(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Kiểm tra người dùng đăng nhập hay chưa
  //- Kiểm tra bằng cách xem token từ AsyncStorage
  //- Nếu có token thì gọi API để lấy thông tin người dùng
  //- Nếu không có token, nó sẽ đăng xuất bằng cách gọi dispatch({ type: "logout" })
  const alreadyLogin = async (retryCount = 0) => {
    try {
      // AsyncStorage.getItem để lấy giá trị của authToken từ bộ nhớ cục bộ của thiết bị
      // => Xác thực người dùng sau khi họ đăng nhập thành công
      const authToken = await AsyncStorage.getItem("authToken");

      // Kiểm tra sự tồn tại của authToken
      // Nếu authToken không tồn tại (false): Người dùng chưa đăng nhập/ authToken đã hết hạn
      //=> dispatch({ type: "logout" }) để đăng xuất người dùng và trả về ngay sau đó.
      if (!authToken) {
        dispatch({ type: "logout" });
        return;
      }
      // Gọi API để lấy thông tin người dùng hiện tại
      try {
        const currentUser = await authAPI(authToken).get(
          endpoints["current-user"]
        );
        dispatch({ type: "login", payload: currentUser.data });
        // Xử lý các trường hợp lỗi khi gọi API
      } catch (error) {
        let errorStatus;
        if (error.response) {
          errorStatus = error.response.status;
          if ((errorStatus !== 401 && errorStatus !== 403) || retryCount > 3) {
            dispatch({ type: "logout" });
            return;
          }
        } else if (error.request) {
          console.error(error.request);
        } else {
          console.error(`Error message: ${error.message}`);
        }
      }
      // Xử lý lỗi của AsyncStorage
    } catch (error) {
      console.error(`AsyncStorage error: ${error.message}`);
    }
  };

  useEffect(() => {
    alreadyLogin();
  }, []);

  // Hàm này được gọi khi người dùng hoàn thành Onboarding và sẽ lưu trạng thái đã onboarded vào AsyncStorage và state của ứng dụng.
  const completeOnboarding = useCallback(async () => {
    await storeOnboarded();
    setHasOnboarded(true);
  }, []);

  return (
    // Status bar (thanh có số tin, wifi,...)
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {isShowSplash ? (
        <Splash />
      ) : (
        <NavigationContainer>
          <MyUserContext.Provider value={user}>
            <MyDispatchContext.Provider value={dispatch}>
              {!hasOnboarded && !isLoggedIn ? (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name="Onbroading"
                    options={{ headerShown: false }}
                  >
                    {(props) => (
                      <Onbroading {...props} onComplete={completeOnboarding} />
                    )}
                  </Stack.Screen>
                </Stack.Navigator>
              ) : (
                <MainStack />
              )}

              {/* DEMO PHẦN ONBROADING */}

              {/* <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen
                  name="Onbroading"
                  options={{ headerShown: false }}
                >
                  {(props) => (
                    <Onbroading {...props} onComplete={completeOnboarding} />
                  )}
                </Stack.Screen>
              </Stack.Navigator> */}
            </MyDispatchContext.Provider>
          </MyUserContext.Provider>
        </NavigationContainer>
      )}
    </>
  );
}
