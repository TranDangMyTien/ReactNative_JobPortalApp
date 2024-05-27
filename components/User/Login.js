import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { MyDispatchContext } from "../../configs/Contexts";
import MyStyles from "../../styles/MyStyles";

const Login = () => {
    const fields = [{
        label: "Tên đăng nhập",
        icon: "account",
        field: "username"
    }, {
        label: "Mật khẩu",
        icon: "eye",
        field: "password",
        secureTextEntry: true
    }];

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const dispatch = useContext(MyDispatchContext);

    const change = (value, field) => {
        setUser(current => {
            return {...current, [field]: value}
        })
    }

    const login = async () => {
        setLoading(true);
        try {
            let res = await APIs.post(endpoints['login'], { //Lấy access_token
                ...user, 
                'client_id': 'NeVC6qnpHJRgsBLyvgsRH9sxHyjMvp0PwvbsTzMD',
                'client_secret': 'ivNEzYwTq6gGqjXBDw9bACnfWraPZGSyDm8y5Jr1opAt52JCvGuVoePOP3w3PRBDWZ1LnP9jYdIxWESY2nP05lmRApwmbT3pVq8UmK3CckRPzFU4SlNOLgcZg6foYGPw',
                'grant_type': 'password'
            });

            //Lưu trữ mã token (access token) vào bộ nhớ cục bộ của thiết bị sử dụng AsyncStorage với tên là "token"
            //token: là key 
            //res.data.access_token: value
            await AsyncStorage.setItem("token", res.data.access_token); 
            

            //Gọi giữa 2 trang cho độ trễ 
            setTimeout(async () => { //khi đăng nhập phải cho độ trễ nếu không sẽ lỗi 
                let user = await authApi(res.data.access_token).get(endpoints['current-user']);
                console.info(user.data); //Xuất dưới console để dev thấy 
                //user.data 

                dispatch({
                    "type": "login",
                    "payload": user.data
                })

                nav.navigate("Home");
            }, 100);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[MyStyles.container, MyStyles.margin]}>
            <Text style={MyStyles.subject}>ĐĂNG NHẬP NGƯỜI DÙNG</Text>
            {fields.map(f => <TextInput value={user[f.field]} onChangeText={t => change(t, f.field)} key={f.field} style={MyStyles.margin} label={f.label} secureTextEntry={f.secureTextEntry} right={<TextInput.Icon icon={f.icon} />} />)}
            <Button loading={loading} icon="account" mode="contained" onPress={login}>ĐĂNG NHẬP</Button>
        </View>
    );
}

export default Login;

//AsyncStorage là một API trong React Native được sử dụng để lưu trữ dữ liệu cục bộ (local data) trên thiết bị di động của người dùng. 

//setItem là một phương thức được sử dụng để lưu trữ dữ liệu vào bộ nhớ cục bộ của thiết bị.
//Phương thức này cho phép bạn lưu trữ một cặp key-value
//Key là một chuỗi đại diện cho "tên" của dữ liệu bạn muốn lưu trữ.
//Value là giá trị dữ liệu bạn muốn lưu trữ


//authApi(res.data.access_token) : Hàm nhận mã token truy cập (access token)
//authApi(res.data.access_token) kểt hợp với BASE_URL/

//.get(endpoints['current-user']): Sau khi xác thực API, 
//chúng ta sử dụng phương thức .get() để thực hiện một yêu cầu HTTP GET đến đường dẫn được chỉ định bởi endpoints['current-user']



