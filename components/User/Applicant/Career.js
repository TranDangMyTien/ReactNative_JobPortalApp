import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axiosInstance, { endpoints } from '../../../configs/APIs';

const Career = ({ visible, onClose, onSave }) => {
    const [selectedCareer, setSelectedCareer] = useState(null); 
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);

    //console.log(selectedCareer);
    
    useEffect(() => {
        const fetchCareers = async () => {
            try {
                const response = await axiosInstance.get(endpoints["careers"]);
                if (response.status === 200) {
                    setCareers(response.data);
                } else {
                    console.error('Failed to fetch careers:', response.status);
                }
            } catch (error) {
                console.error('Error fetching careers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCareers();
    }, []);

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
                    <Text style={styles.pickerTitle}>Chọn lĩnh vực của bạn</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#00b14f" />
                    ) : (
                        <Picker
                            selectedValue={selectedCareer}
                            onValueChange={(itemValue, itemIndex) => {
                                const selected = careers[itemIndex]; 
                                setSelectedCareer(selected);
                            }}
                        >
                            {careers.map((career) => (
                                <Picker.Item key={career.id} label={career.name} value={career} /> 
                            ))}
                        </Picker>
                    )}
                    
                    <TouchableOpacity 
                        style={styles.modalButton} 
                        onPress={() => { 
                            onSave(selectedCareer); 
                            onClose(); 
                        }}
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
    selectedCareerText: {
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
});

export default Career;