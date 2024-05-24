import { View, Text, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Button, HelperText, TextInput, TouchableRipple } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from 'react-native';

// Đóng waring
LogBox.ignoreLogs([
    'Warning: TextInput.Icon: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.'
]);

const Register = () => {
    const [user, setUser] = useState({});
    const [err, setErr] = useState(false);
    const fields = [{
        "label": "Tên",
        "icon": "text",
        "name": "first_name"
    }, {
        "label": "Họ và tên lót",
        "icon": "text",
        "name": "last_name"
    }, {
        "label": "Tên đăng nhập",
        "icon": "account",
        "name": "username"
    }, {
        "label": "Mật khẩu",
        "icon": "eye",
        "name": "password",
        "secureTextEntry": true //Bật dấu sao khi đăng nhập => Bảo mật
    }, {
        "label": "Xác nhận mật khẩu",
        "icon": "eye",
        "name": "confirm",
        "secureTextEntry": true
    }];
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') //Nếu không cho phép truy cập vào nguồn tài nguyên máy tính 
            Alert.alert("iCourseApp", "Permissions Denied!");
        else { //Được truy cập vào nguồn tài nguyên 
            let res = await ImagePicker.launchImageLibraryAsync(); //Cho phép chọn ảnh 
            if (!res.canceled) {
                updateSate("avatar", res.assets[0]);
            }
        }
    }


    // field: Tên của trường (field) trong đối tượng trạng thái mà bạn muốn cập nhật.
    // value: Giá trị mới mà bạn muốn gán cho trường đó.

    const updateSate = (field, value) => {
        // setUser cập nhật trạng thái
        setUser(current => {
            return {...current, [field]: value}
        });
    }

    const register = async () => {
        if (user['password'] !== user['confirm']) //Nếu password và confirm không giống nhau => Show err
            setErr(true);
        else {
            setErr(false);

            let form = new FormData(); //Tạo form để gửi lên server 
            for (let key in user)
                if (key !== 'confirm')
                    if (key === 'avatar') { //Thêm trường avatar vào form 
                        form.append(key, {
                            uri: user.avatar.uri,
                            name: user.avatar.fileName,
                            type: user.avatar.type
                        });
                    } else
                        form.append(key, user[key]); //Thêm từng trường vào form trừ trường avatar
            
            console.info(form);
            setLoading(true);
            try {
                let res = await APIs.post(endpoints['register'], form, {
                    headers: { //Vì đăng ký nên trong headers phải có Content-Type
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                if (res.status === 201) //Nếu dư liệu trả về 201 là tạo mới thành công 
                    nav.navigate("Login"); //Tạo mới thàng công sẽ chuyển qua đăng nhập 
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }
    

    return (
        <View style={[MyStyles.container, MyStyles.margin]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView>
                <Text style={MyStyles.subject}>ĐĂNG KÝ NGƯỜI DÙNG</Text>

                {fields.map(c => <TextInput secureTextEntry={c.secureTextEntry} value={user[c.name]} onChangeText={t => updateSate(c.name, t)} style={MyStyles.margin} key={c.name} label={c.label} right={<TextInput.Icon icon={c.icon} />} />)}

                <HelperText type="error" visible={err}>
                    Mật khẩu không khớp!
                </HelperText>
                
                {/* Chọn avatar */}
                <TouchableRipple style={MyStyles.margin} onPress={picker}>
                    <Text>Chọn ảnh đại diện...</Text>
                </TouchableRipple>

                {user.avatar && <Image source={{uri: user.avatar.uri}} style={MyStyles.avatar} />}

                <Button icon="account" loading={loading} mode="contained" onPress={register}>ĐĂNG KÝ</Button>
            </ScrollView>
            </KeyboardAvoidingView>
            
        </View>
    );
}

export default Register;