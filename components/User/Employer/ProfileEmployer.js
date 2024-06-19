
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View, ScrollView, FlatList, Alert, TextInput } from 'react-native'; 
import { MyUserContext } from '../../../configs/Contexts';
import { useNavigation } from '@react-navigation/native';
import Logout from '../Logout';
import { IconButton, Surface, Divider, Appbar, Title } from 'react-native-paper';
import { endpoints, authApi } from '../../../configs/APIs';
import { getToken } from '../../../utils/storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const ProfileEmployer = () => {
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    
    const [profileImage, setProfileImage] = useState(user.avatar);
    const [selectedImage, setSelectedImage] = useState(null);

    const [companyName, setCompanyName] = useState(user.employer.companyName || '');
    const [editingCompanyName, setEditingCompanyName] = useState(false);

    const [position, setPosition] = useState(user.employer.position || '');
    const [EditingPosition, setEditingPosition] = useState(false);

    const [address, setAddress] = useState(user.employer.address || '');
    const [EditingAddress, setEditingAdress] = useState(false);

    const [company_type, setCompanyType] = useState(user.employer.company_type || "");
    const [EditingCompanyType, setEditingCompanyType] = useState(false);

    const [company_website, setWebsite] = useState(user.employer.company_website || '');
    const [EditingWebsite, setEditingWebsite] = useState(false);
    
    const [information, setInformation] = useState(user.employer.information || '');
    const [EditingInformation, setEditingInformation] = useState(false);

    const companyTypeMap = {
        0: 'Công ty TNHH',
        1: 'Công ty Cổ phần',
        2: 'Công ty trách nhiệm hữu hạn một thành viên',
        3: 'Công ty tư nhân',
        4: 'Công ty liên doanh',
        5: 'Công ty tập đoàn'
    };

    const handleGoBack = () => {
        navigation.navigate("HomeScreen");
    };

    const dataList = [
        { id: 1, title: 'Cập nhật nhà tuyển dụng', icon: 'update' },
        { id: 2, title: 'Đăng tin tuyển dụng',  icon: 'favorite' },
        { id: 3, title: 'Tìm kiếm ứng viên',  icon: 'search' },
        { id: 4, title: 'Quản lý bài đăng tuyển dụng', icon: 'work'},
    ];

    const dataAccount = [
        { id: 1, title: 'Cập nhật thông tin tài khoản', icon: 'update' },
        { id: 1, title: 'Xóa tài khoản', icon: 'delete' },
        { id: 2, title: 'Xóa thông tin NTD',  icon: 'clear' },

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
          navigation.navigate('UpdateEmployer'); 
        } else if (item.id === 2) {
          navigation.navigate('CreateRecruitment'); 
        }
        else if (item.id === 3) {
            navigation.navigate('DetailApply'); 
        }
        else if (item.id === 4) {
            navigation.navigate('ListJobPost'); 
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
    
    //HÀM CHỌN ẢNH TỪ THƯ VIỆN
    const handleChooseImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImage = result.assets[0];
            // Hiển thị cửa sổ cảnh báo xác nhận chọn ảnh
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

    const updateCompanyName = async () => {
        try {
            let form = new FormData();
            form.append('companyName', companyName);
            const token = await getToken();
            const res = await authApi(token).patch(
                endpoints["update-employer"](user.employer.id),
                form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (res.status === 200) {
                Alert.alert('Thông báo', 'Cập nhật tên công ty thành công');
            } else {
                console.error('Lỗi khi cập nhật tên công ty');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
        } finally {
            setEditingCompanyName(false);
        }
    };
    
    const updatePosition = async () => {
        try {
            let form = new FormData();
            form.append('position', position);
            const token = await getToken();
            const res = await authApi(token).patch(
                endpoints["update-employer"](user.employer.id),
                form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (res.status === 200) {
                Alert.alert('Thông báo', 'Cập nhật vị trí tuyển dụng thành công');
            } else {
                console.error('Lỗi khi cập nhật');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
        } finally {
            setEditingPosition(false);
        }
    };

    const updateAddress = async () => {
        try {
            let form = new FormData();
            form.append('address', address);
            const token = await getToken();
            const res = await authApi(token).patch(
                endpoints["update-employer"](user.employer.id),
                form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (res.status === 200) {
                Alert.alert('Thông báo', 'Cập nhật địa chỉ thành công');
            } else {
                console.error('Lỗi khi cập nhật');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
        } finally {
            setEditingAdress(false);
        }
    };

    const updateCompayType = async () => {
        try {
            let form = new FormData();
            form.append('company_type', company_type);
            const token = await getToken();
            const res = await authApi(token).patch(
                endpoints["update-employer"](user.employer.id),
                form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (res.status === 200) {
                Alert.alert('Thông báo', 'Cập nhật loại hình công ty thành công');
            } else {
                console.error('Lỗi khi cập nhật');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
        } finally {
            setEditingCompanyType(false);
        }
    };

    const updateWebsite = async () => {
        try {
            let form = new FormData();
            form.append('company_website', company_website);
            const token = await getToken();
            const res = await authApi(token).patch(
                endpoints["update-employer"](user.employer.id),
                form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (res.status === 200) {
                Alert.alert('Thông báo', 'Cập nhật website thành công');
            } else {
                console.error('Lỗi khi cập nhật');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
        } finally {
            setEditingWebsite(false);
        }
    };

    const updateInformation = async () => {
        try {
            let form = new FormData();
            form.append('information', information);
            const token = await getToken();
            const res = await authApi(token).patch(
                endpoints["update-employer"](user.employer.id),
                form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (res.status === 200) {
                Alert.alert('Thông báo', 'Cập nhật thông tin thành công');
            } else {
                console.error('Lỗi khi cập nhật');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
        } finally {
            setEditingInformation(false);
        }
    };


    return (
        <>
            <Appbar.Header style={{backgroundColor: '#28A745', height: 30}}>
                    <Appbar.BackAction onPress={handleGoBack} color="white"  />
                    <Appbar.Content title="Thông tin cá nhân" 
                        style={{ alignItems: 'center', justifyContent: 'center'}} 
                        titleStyle={{ color: 'white' }}
                    />
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
                            <Text style={styles.userId}>Mã ứng viên: {user.employer.id}</Text>
                        </View>
                    </View>
                </Surface>
            </View>

            <ScrollView style={{ flex: 1, marginTop: 15 }}>
                <View style={styles.formInfor}>
                    {/* Tên công ty */}
                    <View style={styles.experience}>
                        <View style={styles.title}>
                            <View style={{flexDirection: "row"}}>
                                <Ionicons name="business" size={24} color="black" style={{ paddingTop: 10 }} />
                                <Text style={{ fontWeight: 'bold', fontSize: 16, padding: 10 }}>Tên công ty</Text>
                            </View>
                            {editingCompanyName ? (
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={updateCompanyName}>
                                        <Text style={{ color: '#00b14f', marginRight: 10 }}>Lưu</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setEditingCompanyName(false)}>
                                        <Text style={{ color: '#ff0000' }}>Hủy</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity onPress={() => setEditingCompanyName(true)}>
                                    <Text style={{ color: '#00b14f' }}>Sửa</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={styles.content}>
                            {editingCompanyName ? (
                                <TextInput
                                    style={styles.input}
                                    value={companyName}
                                    onChangeText={setCompanyName}
                                />
                            ) : (
                                <Text style={styles.item}>
                                    {companyName ? companyName : 'Bạn chưa cập nhật'}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={{ width: '90%', height: 1, backgroundColor: '#333' }} />

                    {/* Vị trí  */}
                    <View style={styles.experience}>
                        <View style={styles.title}>
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons name="briefcase" size={24} color="black" style={{paddingTop: 10 }} />
                                <Text style={{ fontWeight: 'bold', padding: 10, fontSize: 16 }}>Vị trí tuyển dụng</Text>
                            </View>
                            {EditingPosition ? (
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={updatePosition}>
                                        <Text style={{ color: '#00b14f', marginRight: 10 }}>Lưu</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setEditingPosition(false)}>
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
                                    />
                                ) : (
                                    <Text style={styles.item}>
                                        {position ? position : 'Bạn chưa cập nhật'}
                                    </Text>
                                )}
                            </View>
                    </View>     
                    <View style={{ width: '90%', height: 1, backgroundColor: '#333' }} />

                    {/* Địa chỉ  */}
                    <View style={styles.experience}>
                        <View style={styles.title}>
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons name="location" size={24} color="black" style={{paddingTop: 10 }} />
                                <Text style={{ fontWeight: 'bold', padding: 10, fontSize: 16 }}>Địa chỉ</Text>
                            </View>
                            {EditingAddress ? (
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={updateAddress}>
                                        <Text style={{ color: '#00b14f', marginRight: 10 }}>Lưu</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setEditingAdress(false)}>
                                        <Text style={{ color: '#ff0000' }}>Hủy</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity onPress={() => setEditingAdress(true)}>
                                    <Text style={{ color: '#00b14f' }}>Sửa</Text>
                                </TouchableOpacity>
                            )}
                            </View>
                            <View style={styles.content}>
                                {EditingAddress ? (
                                    <TextInput
                                        style={styles.input}
                                        value={address}
                                        onChangeText={setAddress}
                                    />
                                ) : (
                                    <Text style={styles.item}>
                                        {address ? address : 'Bạn chưa cập nhật'}
                                    </Text>
                                )}
                            </View>
                    </View>     
                    <View style={{ width: '90%', height: 1, backgroundColor: '#333' }} />

                    {/*   */}
                    <View style={styles.experience}>
                        <View style={styles.title}>
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons name="contract" size={24} color="black" style={{paddingTop: 10 }} />
                                <Text style={{ fontWeight: 'bold', padding: 10, fontSize: 16 }}>Loại hình công ty</Text>
                            </View>
                            {EditingCompanyType ? (
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={updateCompayType}>
                                        <Text style={{ color: '#00b14f', marginRight: 10 }}>Lưu</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setEditingCompanyType(false)}>
                                        <Text style={{ color: '#ff0000' }}>Hủy</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity onPress={() => setEditingCompanyType(true)}>
                                    <Text style={{ color: '#00b14f' }}>Sửa</Text>
                                </TouchableOpacity>
                            )}
                            </View>
                            <View style={styles.content}>
                                {EditingCompanyType ? (
                                    <>
                                        <TextInput
                                            style={styles.input}
                                            value={company_type}
                                            onChangeText={setCompanyType}
                                            keyboardType="numeric"
                                            placeholder="Nhập số từ 0 đến 5"
                                        />
                                        <View style={{height: "30%"}}>
                                            <Text>0 - Công ty TNHH</Text>
                                            <Text>1 - Công ty Cổ phần</Text>
                                            <Text>2 - Công ty trách nhiệm hữu hạn một thành viên</Text>
                                            <Text>3 - Công ty tư nhân</Text>
                                            <Text>4 - Công ty liên doanh</Text>
                                            <Text>5 - Công ty tập đoàn</Text>
                                        </View>
                                    </>
                                ) : (
                                    <Text style={styles.item}>
                                        {company_type !== null ? companyTypeMap[company_type] : 'Bạn chưa cập nhật'}
                                    </Text>
                                )}
                            </View>
                    </View>     

                    <View style={{ width: '90%', height: 1, backgroundColor: '#333' }} />

                    {/*  WEBSITE  */}
                    <View style={styles.experience}>
                        <View style={styles.title}>
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons name="link" size={24} color="black" style={{paddingTop: 10 }} />
                                <Text style={{ fontWeight: 'bold', padding: 10, fontSize: 16 }}>Website</Text>
                            </View>
                            {EditingWebsite ? (
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={updateWebsite}>
                                        <Text style={{ color: '#00b14f', marginRight: 10 }}>Lưu</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setEditingWebsite(false)}>
                                        <Text style={{ color: '#ff0000' }}>Hủy</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity onPress={() => setEditingWebsite(true)}>
                                    <Text style={{ color: '#00b14f' }}>Sửa</Text>
                                </TouchableOpacity>
                            )}
                            </View>
                            <View style={styles.content}>
                                {EditingWebsite ? (
                                    <TextInput
                                        style={styles.input}
                                        value={company_website}
                                        onChangeText={setWebsite}
                                    />
                                ) : (
                                    <Text style={styles.item}>
                                        {company_website ? company_website : 'Bạn chưa cập nhật'}
                                    </Text>
                                )}
                            </View>
                    </View>   

                    <View style={{ width: '90%', height: 1, backgroundColor: '#333' }} /> 

                    {/*   */}
                    <View style={styles.experience}>
                        <View style={styles.title}>
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons name="information-circle" size={24} color="black" style={{paddingTop: 10 }} />
                                <Text style={{ fontWeight: 'bold', padding: 10, fontSize: 16 }}>Thông tin</Text>
                            </View>
                            {EditingInformation ? (
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={updateInformation}>
                                        <Text style={{ color: '#00b14f', marginRight: 10 }}>Lưu</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setEditingInformation(false)}>
                                        <Text style={{ color: '#ff0000' }}>Hủy</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity onPress={() => setEditingInformation(true)}>
                                    <Text style={{ color: '#00b14f' }}>Sửa</Text>
                                </TouchableOpacity>
                            )}
                            </View>
                            <View style={styles.content}>
                                {EditingInformation ? (
                                    <TextInput
                                        style={styles.input}
                                        value={information}
                                        onChangeText={setInformation}
                                    />
                                ) : (
                                    <Text style={styles.item}>
                                        {information ? information : 'Bạn chưa cập nhật'}
                                    </Text>
                                )}
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

                <Logout navigation={navigation} />
            </ScrollView>
            
            
        
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
      },
      itemTitle2: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#f5fffa',
      },
    surface: {
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
    },
    content: {
        marginTop: 3,
    },
    item: {
        fontSize: 15,
        paddingRight: 14,
    },
});

export default ProfileEmployer;