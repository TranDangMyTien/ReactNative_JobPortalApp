import React, { useState } from "react";
import { View, Text, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, Image } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Footer from "../Footer/Footer";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();

    const handleGoBack = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            nav.goBack();
        }, 2000); // 2000 milliseconds = 2 seconds
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Vui lòng nhập email đã đăng ký");
            return;
        }
        // Xử lý gửi yêu cầu thay đổi mật khẩu qua API
        setLoading(true);
        try {
            // Giả sử có cuộc gọi API ở đây
            // await APIs.post(endpoints['forgot_password'], { email });
            setLoading(false);
            Alert.alert("Thành công", "Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn");
        } catch (error) {
            setLoading(false);
            Alert.alert("Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.headerBar}>
                    <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                        <Image
                            source={require('../../assets/icons/left.png')}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Quên mật khẩu</Text>
                </View>
                <KeyboardAvoidingView style={styles.innerContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                        <View style={styles.contentContainer}>
                            <Text style={styles.instructionText}>Vui lòng nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu.</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                                label="Email"
                                mode="outlined"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <Button
                                mode="contained"
                                loading={loading}
                                onPress={handleForgotPassword}
                                style={styles.button}
                                labelStyle={styles.buttonLabel}
                            >
                                Gửi yêu cầu đặt lại mật khẩu
                            </Button>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <Footer />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        backgroundColor: '#00b14f',
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: '#ffffff',
    },
    backButton: {
        padding: 10,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    innerContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 20,  // Thêm padding top để đẩy phần nội dung lên trên
    },
    contentContainer: {
        alignItems: 'center',
    },
    instructionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333333',
    },
    input: {
        width: '100%',
        marginVertical: 10,
        backgroundColor: '#ffffff',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#00b14f',
        width: '100%',
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default ForgotPassword;
