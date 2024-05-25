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
import RegisterRole from "./components/User/RegisterRole";
import RegisterApplicant from "./components/User/RegisterApplicant";
import RegisterEmployer from "./components/User/RegisterEmployer";

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

//Màn hình bên đăng ký 
const MyRegister = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
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
    <Tab.Navigator>
      <Tab.Screen name="Home" component={MyStack} options={{title: 'Trang chủ', tabBarIcon: () => <Icon size={30} color="blue" source="home" />}} />

      {user===null?<>
        <Tab.Screen name="Register" component={MyRegister} options={{title: 'Đăng ký', tabBarIcon: () => <Icon size={30} color="blue" source="account" />}} />
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



// useReducer là một hook của React cho phép bạn quản lý trạng thái phức tạp hơn bằng cách sử dụng một reducer.

//MyUserReducer là reducer mà chúng ta đã định nghĩa trước đó để xử lý các hành động liên quan đến người dùng, 
//như đăng nhập và đăng xuất.

//null là trạng thái ban đầu của người dùng. 

//rong trường hợp này, trạng thái ban đầu được thiết lập là null, tức là không có người dùng nào được đăng nhập khi ứng dụng khởi chạy.

//dispatch: Đây là một hàm được sử dụng để gửi các hành động tới reducer
//từ đó làm thay đổi trạng thái của người dùng