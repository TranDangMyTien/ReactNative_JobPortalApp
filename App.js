import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "./components/User/Register";
import Login from "./components/User/Login";
import { Icon } from "react-native-paper";
import RecruitmentsPost from "./components/RecruitmentsPost/RecruitmentsPost";
import { MyDispatchContext, MyUserContext } from "./configs/Contexts";
import { useContext, useReducer } from "react";
import Profile from "./components/User/Profile";
import MyUserReducer from "./configs/Reducers";


//Cài đăt stack 
const Stack = createStackNavigator();

//Màn hình của HOME 
const MyStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="RecruitmentsPost" component={RecruitmentsPost} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const MyTab = () => {
  const user = useContext(MyUserContext);
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={MyStack} options={{title: 'Trang chủ', tabBarIcon: () => <Icon size={30} color="blue" source="home" />}} />

      {user===null?<>
        <Tab.Screen name="Register" component={Register} options={{title: 'Đăng ký', tabBarIcon: () => <Icon size={30} color="blue" source="account" />}} />
        <Tab.Screen name="Login" component={Login} options={{title: 'Đăng nhập', tabBarIcon: () => <Icon size={30} color="blue" source="login" />}} />
      </>:<>
        <Tab.Screen name="Profile" component={Profile} options={{title: user.username, tabBarIcon: () => <Icon size={30} color="blue" source="account" />}} />
      </>}
      
    </Tab.Navigator>
  );
}


export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);
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





