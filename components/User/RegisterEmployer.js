import { View, Text, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Button, HelperText, TextInput, TouchableRipple } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from 'react-native';

// Đóng warning
LogBox.ignoreLogs([
    'Warning: TextInput.Icon: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.'
]);

const RegisterEmployer = ({route}) => {
    const [employer, setEmployer] = useState({});
    const [err, setErr] = useState(false);
    const { userId } = route.params;
    const fields = [{
        "label": "Tên công ty",
        "icon": "domain",
        "name": "companyName"
    }, {
        "label": "Vị trí tuyển dụng",
        "icon": "briefcase",
        "name": "position"
    }, {
        "label": "Thông tin công ty",
        "icon": "information",
        "name": "information",
        "multiline": true
    }, {
        "label": "Địa chỉ",
        "icon": "map-marker",
        "name": "address"
    }, {
        "label": "Website",
        "icon": "web",
        "name": "company_website",
        "keyboardType": "url"
    }, {
        "label": "Loại hình công ty",
        "icon": "briefcase-variant",
        "name": "company_type",
        "keyboardType": "numeric"
    }];
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);

    const updateState = (field, value) => {
        setEmployer(current => {
            return {...current, [field]: value}
        });
    }

    const register = async () => {
        setErr(false);

        let form = new FormData();
        for (let key in employer) {
            form.append(key, employer[key]);
        }

        // Lấy id từ user (Mẫu trên cùng để tạo)
        form.append('user', (userId));

        console.info(form);
        setLoading(true);
        try {
            let res = await APIs.post(endpoints['create-employer'](userId), form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 201)
                nav.navigate("Login");  //Đăng ký xong thì chuyển qua login 
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[MyStyles.container, MyStyles.margin]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView>
                <Text style={MyStyles.subject}>ĐĂNG KÝ NHÀ TUYỂN DỤNG</Text>

                {fields.map(c => <TextInput
                    secureTextEntry={c.secureTextEntry}
                    value={employer[c.name]}
                    onChangeText={t => updateState(c.name, t)}
                    style={MyStyles.margin}
                    key={c.name}
                    label={c.label}
                    right={<TextInput.Icon icon={c.icon} />}
                    multiline={c.multiline}
                    keyboardType={c.keyboardType}
                />)}

                <HelperText type="error" visible={err}>
                    Có lỗi xảy ra!
                </HelperText>

                <Button icon="briefcase-plus" loading={loading} mode="contained" onPress={register}>ĐĂNG KÝ</Button>
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

export default RegisterEmployer;