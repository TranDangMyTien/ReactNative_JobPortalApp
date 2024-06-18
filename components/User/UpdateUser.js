import React, { useState, useContext } from "react";
import { View, Text, Alert, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StyleSheet,TouchableOpacity } from "react-native";
import { Button, HelperText, TextInput, TouchableRipple } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation,useRoute } from "@react-navigation/native";
import { LogBox } from 'react-native';
import APIs, { endpoints } from "../../configs/APIs";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyUserContext } from '../../configs/Contexts';

// '../../context/MyUserContext';

// Ignore specific warning
LogBox.ignoreLogs([
    'Warning: TextInput.Icon: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.'
]);

const UpdateUser = () => {
    const [user, setUser] = useState({});
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const USER = useContext(MyUserContext);
    const userId = USER.id;
    const navigation = useNavigation();
    // const route = useRoute();
    // const { USERID } = route.params;


    const handleGoBack = () => {
        navigation.goBack();
      };
    const fields = [{
        "label": "Tên",
        "icon": "account",
        "name": "first_name",
        "maxLength": 150
    }, {
        "label": "Họ và tên lót",
        "icon": "account",
        "name": "last_name",
        "maxLength": 150
    }, {
        "label": "Tên đăng nhập",
        "icon": "account",
        "name": "username",
        "maxLength": 150,
        "regex": /^[\w.@+-]+$/
    }, {
        "label": "Email",
        "icon": "email",
        "name": "email",
        "maxLength": 254,
        "keyboardType": "email-address"
    }, {
        "label": "Số điện thoại(+84)",
        "icon": "phone",
        "name": "mobile",
        "maxLength": 128,
        "keyboardType": "phone-pad"
    }, {
        "label": "Mật khẩu",
        "icon": "lock",
        "name": "password",
        "secureTextEntry": true,
        "maxLength": 128
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

    const validateInput = (name, value) => {
        const field = fields.find(f => f.name === name);
        if (field) {
            if (field.maxLength && value.length > field.maxLength) {
                return false;
            }
            if (field.regex && !field.regex.test(value)) {
                return false;
            }
        }
        return true;
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
            console.info(USER.id)
            console.info(USERID)
            try {
                const authToken = await AsyncStorage.getItem("token");
                let res = await APIs.patch(endpoints['patch_current_user'](userId), form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    Authorization: `Bearer ${authToken}`,

                });

                if (res.status === 200 && res.data) {
                    // Clear user state to reset input fields
                    setUser({});
                    // Show success alert
                    Alert.alert("Success", "Cập nhật thành công!");
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
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Image
                    source={require("../../assets/icons/left.png")}
                    style={styles.backIcon}
                    />
                </TouchableOpacity>
            <Text style={styles.headerTitle}>Cập nhật thông tin cá nhân</Text>
            </View>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.subject}>CẬP NHẬT THÔNG TIN CÁ NHÂN</Text>

                        {fields.map(c => (
                            <TextInput
                                secureTextEntry={c.secureTextEntry}
                                value={user[c.name] || ''}
                                onChangeText={t => updateState(c.name, validateInput(c.name, t) ? t : user[c.name])}
                                style={styles.input}
                                key={c.name}
                                label={c.label}
                                left={<TextInput.Icon name={c.icon} />}
                                keyboardType={c.keyboardType}
                            />
                        ))}

                        <HelperText type="error" visible={err}>
                            Mật khẩu không khớp!
                        </HelperText>

                        <TouchableRipple style={styles.avatarPicker} onPress={picker}>
                            <Text style={styles.avatarPickerText}>Chọn ảnh đại diện...</Text>
                        </TouchableRipple>

                        {user.avatar && <Image source={{ uri: user.avatar.uri }} style={styles.avatar} />}

                        <Button icon="account" loading={loading} mode="contained" onPress={register} style={styles.button}>
                            CẬP NHẬT
                        </Button>
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
        marginVertical: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 15,
        height: 50,
        fontSize: 16,
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
    button: {
        backgroundColor: '#28A745',
        marginVertical: 10,
    },backIcon: {
    width: 24,
    height: 24,
    tintColor: "white",
  },
  backButton: {
    padding: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#00b14f",
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default UpdateUser;
