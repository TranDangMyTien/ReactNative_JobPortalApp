
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Modal, Image, View, ScrollView, FlatList, Alert } from 'react-native'; 
import { MyUserContext } from '../../../configs/Contexts';
import { useNavigation } from '@react-navigation/native';
import Logout from '../Logout';
import { IconButton, Surface, Divider, Appbar, Title, TextInput } from 'react-native-paper';
import { endpoints, authApi } from '../../../configs/APIs';
import { getToken } from '../../../utils/storage';
import Experiences from './Experiences';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Career from './Career';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons  } from '@expo/vector-icons';


const ProfileApplicant = () => {
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const [profileImage, setProfileImage] = useState(user.avatar);
    const [selectedImage, setSelectedImage] = useState(null);

    const [uploadCV, setUploadCV] = useState(user.applicant.cv || '');
    const [selectedCV, setSelectedCV] = useState(null);

    const [experienceModal, setExperienceModal] = useState(false);
    const [experience, setExperience] = useState(user.applicant.experience || '');

    const [careerModal, setCareerModal] = useState(false);
    const [career, setCareer] = useState(user.applicant.career.name || '');

    const [salary_expectation, setSalary] = useState(user.applicant.salary_expectation || '');
    const [EditingSalary, setEditingSalary] = useState(false);
    
    const [position, setPosition] = useState(user.applicant.position || '');
    const [EditingPosition, setEditingPosition] = useState(false);
    
    const [modalVisible, setModalCV] = useState(false);

    const handleGoBack = () => {
        navigation.navigate("HomeScreen");
    };

    const dataList = [
        { id: 1, title: 'Cập nhật thông tin cá nhân', icon: 'update' },
        { id: 2, title: 'Việc làm yêu thích',  icon: 'favorite' },
        { id: 3, title: 'Việc làm phù hợp',  icon: 'check-circle' },
        { id: 4, title: 'Việc làm đã ứng tuyển', icon: 'work'},
    ];

    const dataAccount = [
        { id: 1, title: 'Cập nhật thông tin tài khoản', icon: 'update' },
        { id: 2, title: 'Xóa thông tin Applicant',  icon: 'clear' },
        { id: 3, title: 'Xóa tài khoản',  icon: 'delete' },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity
           onPress={() => navigateToDetail(item)}
           style={styles.itemContainer}
        >
          <Icon name={item.icon} size={24} color="#00b14f" />   
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemValue}>{item.value}</Text>
        </TouchableOpacity>
    );

    const renderItemAcc = ({ item }) => (
        <TouchableOpacity
           onPress={() => navigateToDetailAcc(item)}
           style={styles.itemAccount}
        >
          <Icon name={item.icon} size={24} color="#00b14f" />   
          <Text style={styles.itemTitle2}>{item.title}</Text>
          <Text style={styles.itemValue}>{item.value}</Text>
        </TouchableOpacity>
    );


    const navigateToDetail = (item) => {
        if (item.id === 1) {
          navigation.navigate('UpdateApplicant'); 
        } else if (item.id === 2) {
          navigation.navigate('FavoriteJobs'); //lưu trữ cái bài tuyển dụng yêu thích
        }
        else if (item.id === 3) {
            navigation.navigate('SuitableJob'); //gợi ý việc làm phù hợp
        }
        else if (item.id === 4) {
            navigation.navigate('ListApply'); //Việc làm đã ứng tuyển
        }
        
      };

    const navigateToDetailAcc = (item) => {
        if (item.id === 1) {
          navigation.navigate('UpdateUser'); 
        } else if (item.id === 2) {
          navigation.navigate(''); //xóa thông tin cá nhân
        }
        else if (item.id === 3) {
            navigation.navigate(''); //xóa tài khoản
        }
        
      };
    // console.log(user);

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }
    
    //PATCH CHUYÊN NGÀNH
    const updateCareer = async(selectedCareer) => {
        try {
            let form = new FormData();
            form.append('career', selectedCareer.id);
            const token = await getToken();
            const res = await authApi(token).patch(
                endpoints["update-applicant"](user.applicant.id), 
                form, 
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
      
            if (res.status === 200 ) {
                setCareer(selectedCareer.name);
                Alert.alert('Thông báo', 'Cập nhật kinh nghiệm thành công');
            } else {
                console.error('Lỗi khi cập nhật kinh nghiệm');
            }
          } catch (error) {
                console.error('Lỗi khi gửi yêu cầu:', error);
        }
    };
    

    //PATCH KINH NGHIỆM
    const updateExperience = async (selectedExperience) => {
        try {
            let form = new FormData();
            form.append('experience', selectedExperience);
            const token = await getToken();
            const res = await authApi(token).patch(
                endpoints["update-applicant"](user.applicant.id), 
                form, 
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
      
            if (res.status === 200 ) {
                setExperience(selectedExperience);
                Alert.alert('Thông báo', 'Cập nhật kinh nghiệm thành công');
                console.log(form);
            } else {
                console.error('Lỗi khi cập nhật kinh nghiệm');
            }
            } catch (error) {
                console.error('Lỗi khi gửi yêu cầu:', error);
        }
    };

    //CẬP NHẬT MỨC LƯƠNG MONG MUỐN
    const updateSalary = async () => {
        if (EditingSalary) {
            try {
                let form = new FormData();
                form.append('salary_expectation', salary_expectation);
                const token = await getToken();
                const res = await authApi(token).patch(
                    endpoints["update-applicant"](user.applicant.id), 
                    form, 
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });
          
                if (res.status === 200 ) {
                    Alert.alert('Thông báo', 'Cập nhật mức lương thành công');
                } else {
                    console.error('Lỗi khi cập nhật mức lương');
                }
                } catch (error) {
                    console.error('Lỗi khi gửi yêu cầu:', error);
            }
        }
        setEditingSalary(!EditingSalary);
    };

    const updatePosition = async () => {
        if (EditingPosition) {
            try {
                let form = new FormData();
                form.append('position', position);
                const token = await getToken();
                const res = await authApi(token).patch(
                    endpoints["update-applicant"](user.applicant.id), 
                    form, 
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });
          
                if (res.status === 200 ) {
                    Alert.alert('Thông báo', 'Cập nhật vị trí ứng tuyển thành công');
                } else {
                    console.error('Lỗi khi cập nhật vị trí ứng tuyển');
                }
                } catch (error) {
                    console.error('Lỗi khi gửi yêu cầu:', error);
            }
        }
        setEditingPosition(!EditingPosition);
    };

    const cancelPosition = () => {
        setPosition(position);
        setEditingPosition(false);
    };

    const cancelSalary = () => {
        setSalary(salary_expectation);
        setEditingSalary(false);
    };

    const updateAddress = () => {
        console.log('Update address');
    };

     // HÀM CHỌN ẢNH TỪ THƯ VIỆN
     const handleChooseImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImage = result.assets[0];
            Alert.alert(
                'Xác nhận',
                'Bạn có muốn chọn ảnh này?',
                [
                    {
                        text: 'Hủy',
                        style: 'cancel',
                    },
                    {
                        text: 'Xác nhận',
                        onPress: () => {
                            setSelectedImage(selectedImage),
                            handleUpdateAvatar(selectedImage);
                        },
                    },
                ],
                { cancelable: false }
            );
        }
    };

    // PATCH AVATAR
    const handleUpdateAvatar = async (selectedImage) => {
        if (!selectedImage) {
            Alert.alert('Thông báo', 'Vui lòng chọn một ảnh!');
            return;
        }
        try {
            let form = new FormData();
            form.append('avatar', {
                    uri: selectedImage.uri, 
                    name: selectedImage.fileName || 'avatar.jpg', 
                    type: selectedImage.mimeType ||'image/jpeg'
                });
            const token = await getToken();
            const res = await authApi(token).patch(
                endpoints["patch-avatar"](user.id), 
                form, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
      
            if (res.status === 200 ) {
                setProfileImage(selectedImage.uri);
                setSelectedImage(null); // Reset state sau khi cập nhật thành công
                Alert.alert('Thông báo', 'Cập nhật ảnh đại diện thành công!');
            } else {
                console.error('Lỗi khi cập nhật ảnh đại diện');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
        }
    };


    //UPDATE CV
    const handleUpdateCV = async (selectedCV) => {
        console.log(selectedCV);
        if (!selectedCV) {
            Alert.alert('Thông báo', 'Vui lòng chọn một ảnh!');
            return;
        }
        try {
            let form = new FormData();
            form.append('cv', {
                uri: selectedCV.uri, 
                name: selectedCV.fileName || 'cv.jpg', 
                type: selectedCV.mimeType || 'image/jpeg' 
 
            });
            const token = await getToken();
            const res = await authApi(token).patch(
                endpoints["update-applicant"](user.applicant.id),  
                form, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (res.status === 200 ) {
                setUploadCV(selectedCV.uri);
                setSelectedCV(null); // Reset state sau khi cập nhật thành công
                Alert.alert('Thông báo', 'Cập nhật ảnh CV thành công!');
            } else {
                console.error('Lỗi khi cập nhật ảnh CV');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
        }
    };

    // HÀM CHỌN ẢNH CV TỪ THƯ VIỆN
    const handleChooseCV = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            // Hiển thị cửa sổ cảnh báo xác nhận chọn ảnh
            const selectedCV = result.assets[0];
            Alert.alert(
                'Xác nhận',
                'Bạn có muốn chọn ảnh này?',
                [
                    {
                        text: 'Hủy',
                        style: 'cancel',
                    },
                    {
                        text: 'Xác nhận',
                        onPress: () => {
                            setSelectedCV(selectedCV),
                            handleUpdateCV(selectedCV);
                        },
                    },
                ],
                { cancelable: false }
            );
        }
    };


    return (
        <>
             <Appbar.Header style={{ backgroundColor: '#28A745', height: 30 }}>
                <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                }}>
                    <Appbar.BackAction onPress={handleGoBack} color="white" />
                    <Appbar.Content
                        title="Thông tin cá nhân"
                        titleStyle={{
                        color: 'white',
                        textAlign: 'center',
                        flex: 1,
                        }}
                    />
                </View>
            </Appbar.Header>
            <View style={{ backgroundColor: '#28A745', alignItems: 'center', zIndex: 1 }}>
                <Surface style={[styles.surface, { elevation: 10, top: 8}]}>
                    <View style={styles.header}>
                        <View>
                            <Image
                                source={profileImage ? { uri: profileImage } : require('../../../assets/job.png')}
                                style={styles.avatar}
                                imageStyle={styles.avatarImage}
                            />
                            <IconButton
                                icon="camera"
                                size={24}
                                style={styles.cameraIcon}
                                onPress={handleChooseImage}
                            />
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user.username}</Text>
                            <Text style={styles.userId}>Mã ứng viên: {user.applicant.id}</Text>
                        </View>
                    </View>
                </Surface>
            </View>

            <ScrollView style={{ flex: 1, marginTop: 15 }}>
                <View style={styles.formInfor}>
                    {/* Chuyên ngành */}
                    <View style={styles.experience}>
                        <View style={styles.title}>
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons name="color-filter" size={24} color="black" style={{paddingTop: 10 }} />
                                <Text style={{ fontWeight: 'bold', padding: 10, fontSize: 16 }}>Lĩnh vực - Chuyên ngành</Text>
                            </View>
                            <TouchableOpacity onPress={() => setCareerModal(true)}>
                                <Text style={{ color: '#00b14f' }}> Sửa</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.item}>
                                {career ? career : 'Bạn chưa cập nhật'}
                            </Text>
                        </View>
                    </View>

                    <View style={{ width: '90%', height: 1, backgroundColor: '#333' }} />

                    {/* Kinh nghiệm */}
                    <View style={styles.experience}>
                        <View style={styles.title}>
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons name="time-outline" size={24} color="black" style={{paddingTop: 10 }} />
                                <Text style={{ fontWeight: 'bold', padding: 10, fontSize: 16 }}>Kinh nghiệm</Text>
                            </View>
                            <TouchableOpacity onPress={() => setExperienceModal(true)}>
                                <Text style={{ color: '#00b14f' }}> Sửa</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.content}>
                            <Text style={styles.item}>
                                {experience ? experience : 'Bạn chưa cập nhật'}
                            </Text>
                        </View>
                    </View>     

                    <View style={{ width: '90%', height: 1, backgroundColor: '#333' }} />

                    {/* Mức lương */}
                    <View style={styles.experience}> 
                        <View style={styles.title}>
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons name="logo-euro" size={24} color="black" style={{paddingTop: 10 }} />
                                <Text style={{ fontWeight: 'bold', padding: 10, fontSize: 16 }}>Mức lương mong muốn</Text>
                            </View>
                                {EditingSalary ? (
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={updateSalary}>
                                            <Text style={{ color: '#00b14f', marginRight: 10 }}>Lưu</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={cancelSalary}>
                                            <Text style={{ color: '#ff0000' }}>Hủy</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={() => setEditingSalary(true)}>
                                        <Text style={{ color: '#00b14f' }}>Sửa</Text>
                                    </TouchableOpacity>
                                )}
                        </View>
                        <View style={styles.content}>
                            {EditingSalary ? (
                                <TextInput
                                    style={styles.input}
                                    value={salary_expectation}
                                    onChangeText={setSalary}
                                    keyboardType='numeric'
                                />
                            ) : (
                                <Text style={styles.item}>
                                    {salary_expectation ? `${salary_expectation} VNĐ` : 'Bạn chưa cập nhật'}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={{ width: '90%', height: 1, backgroundColor: '#333' }} />

                    {/* Apply vị trí công việc */}
                    <View style={styles.experience}>
                        <View style={styles.title}>
                            <View style={{ flexDirection: 'row' }}>
                            <Ionicons name="person-outline" size={24} color="black" style={{paddingTop: 10 }} />
                                <Text style={{ fontWeight: 'bold', padding: 10, fontSize: 16 }}>Vị trí ứng tuyển</Text>
                            </View>
                                {EditingPosition ? (
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={updatePosition}>
                                            <Text style={{ color: '#00b14f', marginRight: 10 }}>Lưu</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={cancelPosition}>
                                            <Text style={{ color: '#ff0000' }}>Hủy</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={() => setEditingPosition(true)}>
                                        <Text style={{ color: '#00b14f' }}>Sửa</Text>
                                    </TouchableOpacity>
                                )}
                        </View>
                        <View style={styles.content}>
                            {EditingPosition ? (
                                <TextInput
                                    style={styles.input}
                                    value={position}
                                    onChangeText={setPosition}
                                    keyboardType='default'
                                />
                            ) : (
                                <Text style={styles.item}>
                                    {position ? position: 'Bạn chưa cập nhật'}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={{ width: '90%', height: 1, backgroundColor: '#333' }} />

                    {/* Khu vực muốn làm việc */}
                    {/* <View style={styles.experience}>
                        <View style={styles.title}> 
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons name="map-sharp" size={24} color="black" style={{paddingTop: 10 }} />
                                <Text style={{ fontWeight: 'bold', padding: 10, fontSize: 16 }}>Khu vực làm việc</Text>
                            </View>
                            <TouchableOpacity onPress={updateAddress}>
                                <Text style={{ color: '#00b14f' }}> Sửa</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.item}>
                                {user.applicant.areas.map((area) => area.name).join(", ") ? user.applicant.areas.map((area) => area.name).join(", ") : 'Bạn chưa cập nhật'}
                            </Text>
                        </View>
                    </View>

                    <View style={{ width: '90%', height: 1, backgroundColor: '#333' }} /> */}

                   
                    {/* CV */}
                    <View style={styles.experience}>
                        <View style={styles.title}>
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons name="image-outline" size={24} color="black" style={{paddingTop: 10 }} />
                            <Text style={{ fontWeight: 'bold', padding: 10, fontSize: 16 }}> CV của bạn</Text>
                        </View>
                            <TouchableOpacity onPress={handleChooseCV}>
                                <Text style={{ color: '#00b14f' }}> Sửa</Text>
                            </TouchableOpacity>
                            
                        </View>
                        <View style={styles.contentCV}>
                            {user.applicant.cv ? (
                                <TouchableOpacity onPress={() => setModalCV(true)}>
                                    <Image source={{ uri: uploadCV }} style={styles.imageCV} />
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.itemCV}>Bạn chưa cập nhật</Text>
                            )}

                            {/* Xem CV */}
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => setModalCV(false)}
                            >
                                <View style={styles.modalContainer}>
                                    <Image source={{ uri: uploadCV }} style={styles.modalImage} />
                                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalCV(false)}>
                                        <Text style={styles.closeText}>Đóng</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </View>
                    </View>
                </View>
                <Divider />
                <View style={{marginBottom: 20}}>
                    <Title style={{fontWeight: "bold", marginTop: 20, marginLeft: 15}}>Quản lý công việc</Title>
                    <FlatList
                        scrollEnabled={false}
                        numColumns={2}
                        data={dataList}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>

                <Divider />
                <View style={{marginBottom: 20}}>
                    <Title style={{fontWeight: "bold", marginTop: 20, marginLeft: 15}}>Quản lý tài khoản</Title>
                    <FlatList
                        scrollEnabled={false}
                        numColumns={2}
                        data={dataAccount}
                        renderItem={renderItemAcc}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            </ScrollView>
            
            {/* Update Kinh Nghiệm */}
            <Experiences
                visible={experienceModal}
                onClose={() => setExperienceModal(false)}
                onSave={updateExperience}
            />

             {/* Modal Chọn Chuyên Ngành */}
            <Career
                visible={careerModal} //Prop điều khiển xem modal
                onClose={() => setCareerModal(false)}
                onSave={updateCareer} //lưu thông tin
            />
            
            <Logout navigation={navigation} />
        
        </>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        width: "45%",
        margin: 10,
        borderRadius: 10,
        //borderColor: "00b14f",
        borderWidth: 1,
        backgroundColor: "#8fbc8f"
      },
      itemAccount: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        width: "45%",
        margin: 10,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: "#2f4f4f"
      },
      itemTitle: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
      },
      itemValue: {
        fontSize: 16,
        color: '#00b14f',
      },
      itemTitle2: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#f5fffa',
      },
    surface: {
        padding: 8,
        height: 90,
        width: "85%",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#8fbc8f",
        borderRadius: 20,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 45,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        margin: 10,
    },
    avatarImage: {
        borderRadius: 45,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
    },
    userInfo: {
        alignItems: 'center',
        marginLeft: 20,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    userId: {
        fontSize: 14,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formInfor: {
        alignItems: 'center',
        backgroundColor: "#e6e6fa",
    },
    experience: {
        marginBottom: 10,
        width: '90%',
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    content: {
        marginTop: 5,
    },
    item: {
        fontSize: 16,
    },
    contentCV: {
        marginTop: 10,
        alignItems: 'center',
    },
    itemCV: {
        fontSize: 16,
        color: 'red',
    },
    imageCV: {
        width: 200,
        height: 200,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalImage: {
        width: '80%',
        height: '80%',
    },
    closeButton: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    closeText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    pickerContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
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
});

export default ProfileApplicant;