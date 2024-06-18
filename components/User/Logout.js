import React, { useContext } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const heightWindow = Dimensions.get("window").height;

const Logout = ({ navigation }) => {
    const dispatch = useContext(MyDispatchContext);

    const logout = () => { 
        dispatch({
            type: "logout",
        });
        // navigation.navigate("Login");
    };

    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.buttonLogOut} onPress={logout}>
                <Text style={{ fontSize: 14, color: '#333' }}>
                    Đăng xuất
                </Text>
                <MaterialIcons style={{ paddingLeft: 24 }} name="logout" color="black" size={30} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        
        width: '100%',
        backgroundColor: '#666',
        height: 0.10 * heightWindow,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonLogOut: {
        flexDirection: 'row',
        height: '50%',
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
    },
});

export default Logout;