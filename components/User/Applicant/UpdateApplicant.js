import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Appbar, TouchableRipple } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import Experiences from './Experiences';
import axiosInstance, {authApi, endpoints } from '../../../configs/APIs'; 
import { getToken } from '../../../utils/storage';
import { MyUserContext, MyDispatchContext  } from '../../../configs/Contexts';
import CV from './CV';


const UpdateApplicant = () => {
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);

    const [experience, setExperience] = useState('');
    const [salary_expectation, setSalary] = useState('');

    const [isCareerModal, setCareerModal] = useState(false);
    const [selectedCareer, setSelectedCareer] = useState(null);
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
   
    const [isExperienceModal, setExperienceModal] = useState(false);
    const [position, setPosition] = useState('');
    const [isCVModal, setCVModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);  

    const handleGoBack = () => {
        navigation.navigate("ProfileApplicant");
    };

    // Lấy danh sách lĩnh vực công việc
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


    //lưu lĩnh vực công việc được chọn
    const handleCareerSave = (selectedCareer) => {
        setSelectedCareer(selectedCareer);
        setCareerModal(false);
    };

    //console.log(selectedCareer);

    //lưu kinh nghiệm được chọn
    const handleExperienceSave = (selectedExperience) => {
        setExperience(selectedExperience);
        setExperienceModal(false);
    };

    const toggleCVModal = () => {
        setCVModal(!isCVModal);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri); 
        }
    };

    // update-PUT Info Applicant
    const updateApplicantInfo = async () => {
        if (!experience || !selectedCareer || !position || !salary_expectation || !selectedImage) {
            Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin!');
            return;
        }
        try {
            let form = new FormData();
            form.append('experience', experience);
            form.append('career', selectedCareer.id); 
            form.append('position', position);
            form.append('salary_expectation', salary_expectation);
            form.append('cv', {
                uri: selectedImage,
                name: 'cv.jpg',
                type: 'image/jpg'
            });

            const token = await getToken();
            const res = await authApi(token).put(
                endpoints["update-applicant"](user.applicant.id), 
                form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (res.status === 200) {
                Alert.alert('Thông báo', 'Cập nhật thông tin thành công!');
                //
                dispatch({
                    type: 'update_applicant',
                    payload: res.data 
                    
                });
                navigation.navigate("ProfileApplicant");
            } else {
                console.error('Lỗi khi cập nhật thông tin');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
        }
    };

    // cập nhật
    const handleSubmit = () => {
        updateApplicantInfo();
    };


    return (
        <>
            <Appbar.Header style={{backgroundColor: '#00b14f', height: 30, marginBottom: 7}}>
                <Appbar.BackAction onPress={handleGoBack} />
                <Appbar.Content title="Cài đặt gợi ý việc làm" style={{ alignItems: 'center', justifyContent: 'center', color: "#fff" }} />
            </Appbar.Header>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.heading}>CẬP NHẬT THÔNG TIN</Text>
                    <Text style={styles.subheading}>Bạn vui lòng hoàn thiện các thông tin dưới đây:</Text>

                    {/* Lĩnh vực công việc - CAREER */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Lĩnh vực công việc *</Text>
                        <TouchableOpacity 
                            style={styles.dropdown}
                            onPress={() => setCareerModal(true)}
                        >
                            <Text style={styles.dropdownText}>{selectedCareer ? selectedCareer.name : 'Chọn lĩnh vực'}</Text>
                            <Text style={styles.arrow}>▼</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Vị trí muốn ứng tuyển */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Vị trí *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập vị trí muốn ứng tuyển"
                            value={position}
                            onChangeText={setPosition}
                            keyboardType="default"
                        />
                    </View>

                    {/* Mức lương mong muốn */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Mức lương mong muốn *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập mức lương mong muốn"
                            value={salary_expectation}
                            onChangeText={setSalary}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Kinh nghiệm */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Kinh nghiệm *</Text>
                        <TouchableOpacity 
                            style={styles.dropdown}
                            onPress={() => setExperienceModal(true)}
                        >
                            <Text style={styles.dropdownText}>{experience || 'Chọn kinh nghiệm'}</Text>
                            <Text style={styles.arrow}>▼</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Upload CV */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Upload CV *</Text>
                        <TouchableRipple onPress={pickImage}>
                            <View style={styles.uploadContainer}>
                                <Text style={styles.uploadText}>Click to upload CV</Text>
                            </View>
                        </TouchableRipple>
                        {selectedImage && (
                            <Image source={{ uri: selectedImage }} style={styles.image} />
                        )}
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Cập nhật</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Modal kinh nghiệm */}
            <Experiences
                visible={isExperienceModal}
                onClose={() => setExperienceModal(false)}
                onSave={handleExperienceSave}
            />

            {/* Modal CHỌN lĩnh vực công việc */}
            <Modal
                transparent={true}
                visible={isCareerModal}
                onRequestClose={() => setCareerModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.pickerContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setCareerModal(false)}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <Text style={styles.pickerTitle}>Chọn lĩnh vực của bạn</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#00b14f" />
                        ) : (
                            <ScrollView style={styles.scrollView}>
                                {careers.map((career) => (
                                    <TouchableOpacity
                                        key={career.id}
                                        style={[
                                            styles.careerItem,
                                            selectedCareer && selectedCareer.id === career.id ? styles.selectedCareer : null
                                        ]}
                                        onPress={() => setSelectedCareer(career)}
                                    >
                                        <Text style={styles.careerText}>{career.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                        <TouchableOpacity 
                            style={styles.modalButton} 
                            onPress={() => { 
                                handleCareerSave(selectedCareer); 
                            }}
                        >
                            <Text style={styles.modalButtonText}>Xong</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal upload CV */}
            <Modal
                transparent={true}
                visible={isCVModal}
                onRequestClose={toggleCVModal}
            >
                <CV onClose={toggleCVModal} />
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subheading: {
        fontSize: 16,
        marginBottom: 16,
    },
    section: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#00b14f',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: 16,
    },
    arrow: {
        fontSize: 20,
        color: '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    uploadContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadText: {
        fontSize: 16,
        color: '#00b14f',
    },
    image: {
        width: '100%',
        height: 200,
        marginTop: 16,
        borderRadius: 8,
    },
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
    scrollView: {
        maxHeight: 200,
    },
    careerItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    careerText: {
        fontSize: 16,
    },
    selectedCareer: {
        backgroundColor: 'rgba(0, 177, 79, 0.1)',
    },
});

export default UpdateApplicant;