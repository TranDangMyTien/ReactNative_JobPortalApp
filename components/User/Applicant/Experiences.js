import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Experiences = ({ visible, onClose, onSave }) => {
    const [selectedExperience, setSelectedExperience] = useState('');

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.pickerContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    <Text style={styles.pickerTitle}>Chọn số năm đi làm</Text>
                    <Picker
                        selectedValue={selectedExperience}
                        onValueChange={(itemValue) => setSelectedExperience(itemValue)}
                    >
                        <Picker.Item label="Sắp đi làm" value="Sắp đi làm" />
                        <Picker.Item label="Dưới 1 năm" value="Dưới 1 năm" />
                        <Picker.Item label="1 năm" value="1 năm" />
                        <Picker.Item label="2 năm" value="2 năm" />
                        <Picker.Item label="3 năm" value="3 năm" />
                        <Picker.Item label="4 năm" value="4 năm" />
                        <Picker.Item label="5 năm" value="5 năm" />
                        <Picker.Item label="Trên 5 năm" value="Trên 5 năm" />
                    </Picker>
                    <TouchableOpacity 
                        style={styles.modalButton} 
                        onPress={() => { onSave(selectedExperience); onClose(); }}
                    >
                        <Text style={styles.modalButtonText}>Xong</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pickerContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        position: 'relative',
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalButton: {
        marginTop: 20,
        backgroundColor: 'rgb(0, 177, 79)',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Experiences;