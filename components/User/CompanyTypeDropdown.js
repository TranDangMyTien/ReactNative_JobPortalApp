import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Menu, Divider } from 'react-native-paper';

const COMPANY_CHOICES = [
    { label: 'Công ty TNHH', value: 0 },
    { label: 'Công ty Cổ phần', value: 1 },
    { label: 'Công ty trách nhiệm hữu hạn một thành viên', value: 2 },
    { label: 'Công ty tư nhân', value: 3 },
    { label: 'Công ty liên doanh', value: 4 },
    { label: 'Công ty tập đoàn', value: 5 },
];

const CompanyTypeDropdown = ({ value, onValueChange }) => {
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleSelect = (selectedValue) => {
        onValueChange(selectedValue);
        closeMenu();
    };

    const selectedItem = COMPANY_CHOICES.find((item) => item.value === value);

    return (
        <View style={styles.container}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<Button onPress={openMenu}>{selectedItem?.label || 'Chọn loại hình công ty'}</Button>}
            >
                {COMPANY_CHOICES.map((item) => (
                    <Menu.Item
                        key={item.value}
                        onPress={() => handleSelect(item.value)}
                        title={item.label}
                    />
                ))}
            </Menu>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CompanyTypeDropdown;