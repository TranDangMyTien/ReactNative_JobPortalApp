import React, { useState } from "react";
import { View, Text, Alert, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button, HelperText, TextInput, TouchableRipple, Checkbox } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import { LogBox } from 'react-native';
import APIs, { endpoints } from "../../../configs/APIs";

// Ignore specific warning
LogBox.ignoreLogs([
    'Warning: TextInput.Icon: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.'
]);

const Register = () => {
    const [user, setUser] = useState({});
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const nav = useNavigation();

    const fields = [{
        "label": "Tên",
        "icon": "account",
        "name": "first_name"
    }, {
        "label": "Họ và tên lót",
        "icon": "account",
        "name": "last_name"
    }, {
        "label": "Tên đăng nhập",
        "icon": "account",
        "name": "username"
    }, {
        "label": "Mật khẩu",
        "icon": "lock",
        "name": "password",
        "secureTextEntry": true // Secure entry for password fields
    }, {
        "label": "Xác nhận mật khẩu",
        "icon": "lock",
        "name": "confirm",
        "secureTextEntry": true
    }];

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("JobPortalApp", "Quyền truy cập bị từ chối!");
        } else {
            let res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled) {
                updateState("avatar", res.assets[0]);
            }
        }
    }

    const updateState = (field, value) => {
        setUser(current => ({ ...current, [field]: value }));
    }

    const register = async () => {
        if (user['password'] !== user['confirm']) {
            setErr(true);
        } else {
            setErr(false);
            let form = new FormData();
            for (let key in user) {
                if (key !== 'confirm') {
                    if (key === 'avatar') {
                        form.append(key, {
                            uri: user.avatar.uri,
                            name: user.avatar.fileName,
                            type: user.avatar.type
                        });
                    } else {
                        form.append(key, user[key]);
                    }
                }
            }

            setLoading(true);
            try {
                let res = await APIs.post(endpoints['register'], form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (res.status === 201 && res.data) {
                    // Clear user state to reset input fields
                    setUser({});
                    // Navigate to next screen after a delay
                    setTimeout(() => {
                        nav.navigate("RegisterRole", { userId: res.data.id, is_employer: res.data.is_employer });
                    }, 3000);
                    // Show success alert
                    Alert.alert("Success", "Đăng ký thành công!");
                } else {
                    Alert.alert("Error", res.data?.message || "Something went wrong");
                }

            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.innerContainer}>
                    <Text style={styles.subject}>ĐĂNG KÝ TÀI KHOẢN</Text>

                    {fields.map(c => (
                        <TextInput
                            secureTextEntry={c.secureTextEntry}
                            value={user[c.name] || ''} // Ensure the text input value resets
                            onChangeText={t => updateState(c.name, t)}
                            style={styles.input}
                            key={c.name}
                            label={c.label}
                            left={<TextInput.Icon name={c.icon} />}
                        />
                    ))}

                    <HelperText type="error" visible={err}>
                        Mật khẩu không khớp!
                    </HelperText>

                    <TouchableRipple style={styles.avatarPicker} onPress={picker}>
                        <Text style={styles.avatarPickerText}>Chọn ảnh đại diện...</Text>
                    </TouchableRipple>

                    {user.avatar && <Image source={{ uri: user.avatar.uri }} style={styles.avatar} />}

                    <TouchableOpacity style={styles.checkboxContainer} onPress={() => setChecked(!checked)}>
                        <Checkbox
                            status={checked ? 'checked' : 'unchecked'}
                            onPress={() => setChecked(!checked)}
                        />
                        <View style={{ flex: 1 }}>
                            <Text>
                                Tôi đã đọc và đồng ý với{' '}
                                <Text style={styles.linkText}>
                                    Điều khoản dịch vụ
                                </Text>
                                {' '}và{' '}
                                <Text style={styles.linkText}>
                                    Chính sách bảo mật
                                </Text>
                                {' '}của OU Job!
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <Button icon="account" loading={loading} mode="contained" onPress={register} disabled={!checked} style={styles.button}>
                        ĐĂNG KÝ
                    </Button>
                    
                    <TouchableRipple onPress={() => nav.navigate("Login")}>
                        <Text style={styles.linkTextCentered}>
                            Bạn đã có tài khoản? Đăng nhập ngay
                        </Text>
                    </TouchableRipple>

                    <TouchableRipple onPress={() => nav.navigate("HomeScreen")}>
                        <Text style={styles.linkTextCentered}>
                            Trải nghiệm không cần đăng nhập
                        </Text>
                    </TouchableRipple>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
        marginVertical: 10, // Slightly increased margin
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
        marginVertical: 10,
    },
});

export default Register;
