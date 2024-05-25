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

const RegisterApplicant = ({route}) => {  //route: nhận ID từ user qua 
    const [applicant, setApplicant] = useState({});
    const [err, setErr] = useState(false);
    const { userId } = route.params;
    const fields = [{
        "label": "Vị trí ứng tuyển",
        "icon": "briefcase",
        "name": "position"
    }, {
        "label": "Kỹ năng",
        "icon": "tools",
        "name": "skills",
        "multiline": true
    }, {
        "label": "Vùng làm việc",
        "icon": "map-marker",
        "name": "areas",
        "multiline": true
    }, {
        "label": "Mức lương mong muốn",
        "icon": "currency-usd",
        "name": "salary_expectation",
        "keyboardType": "numeric"
    }, {
        "label": "Kinh nghiệm",
        "icon": "account-hard-hat",
        "name": "experience",
        "multiline": true
    }, {
        "label": "Nghề nghiệp",
        "icon": "briefcase",
        "name": "career",
        "keyboardType": "numeric"
    }];
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted')
            Alert.alert("JobPortalApp", "Permissions Denied!");
        else {
            let res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled) {
                updateState("cv", res.assets[0]);
            }
        }
    }

    const updateState = (field, value) => {
        setApplicant(current => {
            return {...current, [field]: value}
        });
    }

    const register = async () => {
        setErr(false);

        let form = new FormData();
        for (let key in applicant) {
            if (key === 'cv') {
                form.append(key, {
                    uri: applicant.cv.uri,
                    name: applicant.cv.fileName,
                    type: applicant.cv.type
                });
            } else {
                form.append(key, applicant[key]);
            }
        }

        

        form.append('user', (userId));

        console.info(form);
        setLoading(true);
        try {
            let res = await APIs.post(endpoints['create-applicant'](userId), form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 201)
                nav.navigate("Login"); //Đăng ký xong thì chuyển qua đăng nhập 
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
                <Text style={MyStyles.subject}>ĐĂNG KÝ ỨNG VIÊN</Text>

                {fields.map(c => <TextInput
                    secureTextEntry={c.secureTextEntry}
                    value={applicant[c.name]}
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
                
                {/* Chọn CV */}
                <TouchableRipple style={MyStyles.margin} onPress={picker}>
                    <Text>Tải lên CV...</Text>
                </TouchableRipple>

                {applicant.cv && <Image source={{uri: applicant.cv.uri}} style={MyStyles.avatar} />}

                <Button icon="account-plus" loading={loading} mode="contained" onPress={register}>ĐĂNG KÝ</Button>
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

export default RegisterApplicant;