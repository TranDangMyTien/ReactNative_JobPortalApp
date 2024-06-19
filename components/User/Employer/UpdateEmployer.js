import { View, Text, Alert, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Button, HelperText, TextInput, Card, Paragraph, Appbar } from "react-native-paper";
import React, { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { getToken } from '../../../utils/storage';
import { MyUserContext, MyDispatchContext  } from '../../../configs/Contexts';
import {authApi, endpoints } from '../../../configs/APIs'; 
import { LogBox } from 'react-native';


// Đóng warning
LogBox.ignoreLogs([
    'Warning: TextInput.Icon: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.'
])

const UpdateEmployer = () => {
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
    

    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const nav = useNavigation();

    const [employer, setEmployer] = useState({});
    const [err, setErr] = useState(false);
    const [companyTypeError, setCompanyTypeError] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [companyType, setCompanyType] = useState(""); 

    const handleGoBack = () => {
        nav.navigate("ProfileEmployer");
    };

    const updateState = (field, value) => {
        setEmployer(current => {
            return { ...current, [field]: value }
        });
    }

    const handleCompanyTypeChange = (value) => {
        // Kiểm tra xem giá trị nhập vào có phải là số không và nằm trong khoảng 0-5
        const parsedValue = parseInt(value);
        if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 5) {
            // Nếu là số hợp lệ trong khoảng 0-5, cập nhật giá trị của companyType
            setCompanyType(parsedValue);
            setCompanyTypeError(false); 
            updateState("company_type", parsedValue); 
        } else {
            // Nếu không phải số hợp lệ, đặt giá trị của companyType thành null hoặc một giá trị khác để biểu thị giá trị không hợp lệ
            setCompanyType("");
            setCompanyTypeError(true); 
            updateState("company_type", ""); 
        }
    }

    const updateUser = async () => {
        setErr(false);

        let form = new FormData();
        for (let key in employer) {
            form.append(key, employer[key]);
        }
        form.append('user', user.employer.id);

        console.info(form);

        setLoading(true);
        try {
            const token = await getToken();
            const res = await authApi(token).put(endpoints['update-employer'](user.employer.id), 
            form, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.status === 200) {
                Alert.alert('Thông báo', 'Cập nhật thông tin thành công!');
                dispatch({
                    type: 'update_employer',
                    payload: res.data 
                    
                });
                nav.navigate("Profile"); 
            } else {
                console.error('Lỗi khi cập nhật thông tin');
            }
        } catch (ex) {
            console.error(ex);
            setErr(true);  
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Appbar.Header style={{backgroundColor: '#28A745', height: 30, marginBottom: 7}}>
                <Appbar.BackAction onPress={handleGoBack} />
                <Appbar.Content title="Cập nhật thông tin" style={{ alignItems: 'center', justifyContent: 'center', color: "#fff" }} />
            </Appbar.Header>
            <View>
                <Text style={styles.subject}>CẬP NHẬT NHÀ TUYỂN DỤNG</Text>
            </View>
            <View style={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView>
                        {fields.map(c => {
                            if (c.name === "company_type") {
                                return (
                                    <View key={c.name} style={margin = 5}>
                                        <TextInput
                                            value={companyType !== null ? companyType.toString() : ''} // Chuyển đổi giá trị số thành chuỗi khi hiển thị
                                            onChangeText={handleCompanyTypeChange} 
                                            label={c.label}
                                            right={<TextInput.Icon icon={c.icon} />}
                                            keyboardType={c.keyboardType}
                                            error={companyTypeError}
                                            style={styles.input}
                                           
                                        />
                                        {companyTypeError && (
                                            <HelperText type="error" visible={companyTypeError}>
                                                Vui lòng nhập giá trị từ 0 đến 5.
                                            </HelperText>
                                        )}
                                        <Card style={{ marginTop: 5, backgroundColor: "#8fbc8f", borderRadius: 20 }}>
                                            <Card.Content>
                                                <Paragraph style={{ fontWeight: 'bold' }}>Loại hình công ty (nhập số):</Paragraph>
                                                <Paragraph>0 - Công ty TNHH</Paragraph>
                                                <Paragraph>1 - Công ty Cổ phần</Paragraph>
                                                <Paragraph>2 - Công ty trách nhiệm hữu hạn một thành viên</Paragraph>
                                                <Paragraph>3 - Công ty tư nhân</Paragraph>
                                                <Paragraph>4 - Công ty liên doanh</Paragraph>
                                                <Paragraph>5 - Công ty tập đoàn</Paragraph>
                                            </Card.Content>
                                        </Card>
                                    </View>
                                );
                            } else {
                                return (
                                    <TextInput
                                        secureTextEntry={c.secureTextEntry}
                                        value={employer[c.name]}
                                        onChangeText={t => updateState(c.name, t)}
                                        style={styles.input}
                                        key={c.name}
                                        label={c.label}
                                        right={<TextInput.Icon icon={c.icon} />}
                                        multiline={c.multiline}
                                        keyboardType={c.keyboardType}
                                    />
                                );
                            }
                        })}

                        <HelperText type="error" visible={err}>
                            Có lỗi xảy ra!
                        </HelperText>

                        <Button icon="briefcase-check" loading={loading} mode="contained" onPress={updateUser} style={styles.button}>CẬP NHẬT</Button>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5fffa',
        margin: 20,
    },
    subject: {
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 20,
        color: '#333',
    },
    input: {
        marginVertical: 5,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 15, 
        height: 50, 
        fontSize: 16, 
    },
    button: {
        backgroundColor: '#28A745',
        marginVertical: 0,
    },
});
export default UpdateEmployer;
