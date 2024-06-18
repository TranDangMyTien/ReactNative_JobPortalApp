import { View, Text, Alert, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button, HelperText, TextInput, Card, Paragraph } from "react-native-paper";
import MyStyles from "../../../styles/MyStyles";
import React, { useState } from "react";
import APIs, { endpoints } from "../../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from 'react-native';

// Đóng warning
LogBox.ignoreLogs([
    'Warning: TextInput.Icon: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.'
]);

const RegisterEmployer = ({ route }) => {
    const [employer, setEmployer] = useState({});
    const [err, setErr] = useState(false);
    const [companyTypeError, setCompanyTypeError] = useState(false); // Thêm state để lưu trữ lỗi loại hình công ty
    const { userId } = route.params;

    // // TEST BẰNG TAY - Tạo EMPLOYER 
    // const userId = 73;

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
    const [companyType, setCompanyType] = useState(""); // State mới để lưu trữ giá trị số của loại hình công ty

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
            setCompanyTypeError(false); // Xóa lỗi nếu có
            updateState("company_type", parsedValue); // Cập nhật vào employer state
        } else {
            // Nếu không phải số hợp lệ, đặt giá trị của companyType thành null hoặc một giá trị khác để biểu thị giá trị không hợp lệ
            setCompanyType("");
            setCompanyTypeError(true); // Hiển thị lỗi
            updateState("company_type", ""); // Cập nhật vào employer state
        }
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
            setErr(true);  // Hiển thị lỗi nếu có lỗi xảy ra
        } finally {
            setLoading(false);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[MyStyles.container, MyStyles.margin]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView>
                    <Text style={styles.subject}>ĐĂNG KÝ NHÀ TUYỂN DỤNG</Text>

                    {fields.map(c => { 
                        if (c.name === "company_type") {
                            return (
                                <View key={c.name} style={margin = 5}>
                                    <TextInput
                                        value={companyType !== null ? companyType.toString() : ''} // Chuyển đổi giá trị số thành chuỗi khi hiển thị
                                        onChangeText={handleCompanyTypeChange} // Sử dụng hàm xử lý riêng để xác nhận giá trị nhập vào là số
                                        label={c.label}
                                        right={<TextInput.Icon icon={c.icon} />}
                                        keyboardType={c.keyboardType}
                                        error={companyTypeError}
                                        style={styles.input}
                                         // Đánh dấu lỗi trên TextInput
                                    />
                                    {companyTypeError && (
                                        <HelperText type="error" visible={companyTypeError}>
                                            Vui lòng nhập giá trị từ 0 đến 5.
                                        </HelperText>
                                    )}
                                    <Card style={{ marginTop: 5 }}>
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

                    <Button icon="briefcase-plus" loading={loading} mode="contained" onPress={register} style={styles.button}>ĐĂNG KÝ</Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    subject: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        marginVertical: 5, // Slightly increased margin
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 15, // Slightly increased padding
        height: 50, // Slightly increased height
        fontSize: 16, // Slightly increased font size
    },
    avatarPicker: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
        alignItems: 'center',
    },
    avatarPickerText: {
        color: '#333',
        fontSize: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginVertical: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    linkText: {
        color: 'green',
        textDecorationLine: 'underline',
    },
    linkTextCentered: {
        color: 'green',
        textAlign: 'center',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#28A745',
        marginVertical: 0,
    },cancelCVContainer: {
      alignItems: 'center',
      marginTop: 10,
    },
    cancelCVText: {
        color: 'red',
        fontSize: 16,
        textDecorationLine: 'underline',
    },

});
export default RegisterEmployer;
