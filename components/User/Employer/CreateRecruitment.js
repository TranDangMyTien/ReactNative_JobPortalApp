import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useEffect, useState } from "react";
import {
	Alert,
	Image,
	Keyboard,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import {
	Appbar,
	Button,
	HelperText,
	Text,
	TextInput,
} from "react-native-paper";
import axiosInstance, { authApi, endpoints } from "../../../configs/APIs";
import { MyUserContext } from "../../../configs/Contexts";
import { getToken } from "../../../utils/storage";

const CreateRecruitment = () => {
	const [job, setJob] = useState({});
	const [err, setErr] = useState(false);

	const user = useContext(MyUserContext);
	const nav = useNavigation();
	const [loading, setLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);

	const [areas, setAreas] = useState([]);
	const [employmentTypes, setEmploymentTypes] = useState([]);
	const [careers, setCareers] = useState([]);

	const [gender, setGender] = useState("");
	const [genderError, setGenderError] = useState(false);

	const [date, setDate] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);

	const handleGoBack = () => {
		nav.navigate("ProfileEmployer");
	};

	const fields = [
		{
			label: "Tiêu đề",
			name: "title",
			keyboardType: "default",
		},
		{
			label: "Số lượng",
			name: "quantity",
			keyboardType: "numeric",
		},
		{
			label: "Địa điểm",
			name: "location",
		},
		{
			label: "Mức lương",
			name: "salary",
			keyboardType: "numeric",
		},
		{
			label: "Vị trí",
			name: "position",
		},
		{
			label: "Mô tả công việc",
			name: "description",
			multiline: true,
		},
		{
			label: "Kinh nghiệm",
			name: "experience",
		},
		{
			label: "Hạn chót",
			name: "deadline",
		},
		{
			label: "Hình ảnh",
			name: "image",
		},
	];

	const updateState = (field, value) => {
		setJob((current) => {
			return { ...current, [field]: value };
		});
	};

	const showDatePickerModal = () => {
		setShowDatePicker(true);
	};

	const hideDatePickerModal = () => {
		setShowDatePicker(false);
	};

	const handleDateChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		hideDatePickerModal();
		setDate(currentDate);
		updateState("deadline", currentDate.toISOString().split("T")[0]);
	};

	const handleGender = (value) => {
		setGender(value);
		setGenderError(false);
		updateState("gender", value);
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
			updateState("image", {
				uri: result.assets[0].uri,
				type: result.assets[0].mimeType,
				name: result.assets[0].fileName,
			});
		}
	};

	//kiểm tra trường null
	const validateFields = () => {
		for (let field of fields) {
			if (!job[field.name]) {
				console.log(`Trường ${field.name}: null`);
				return false;
			}
		}
		return true;
	};

	useEffect(() => {
		// GET AREA
		const fetchAreas = async () => {
			try {
				const res = await axiosInstance.get(endpoints["areas"]);
				setAreas(res.data);
			} catch (err) {
				console.error(err);
			}
		};
		// GET EmploymentType
		const fetchEmploymentTypes = async () => {
			try {
				const res = await axiosInstance.get(
					endpoints["employment-types"]
				);
				setEmploymentTypes(res.data);
			} catch (err) {
				console.error(err);
			}
		};
		// GET CAREER
		const fetchCareers = async () => {
			try {
				const res = await axiosInstance.get(endpoints["careers"]);
				setCareers(res.data);
			} catch (err) {
				console.error(err);
			}
		};

		fetchAreas();
		fetchEmploymentTypes();
		fetchCareers();
	}, []);

	//POST BÀI TUYỂN DỤNG
	const postJob = async () => {
		setErr(false);

		if (!validateFields()) {
			Alert.alert("Lỗi", "Vui lòng điền đầy đủ tất cả các trường.");
			return;
		}

		let form = new FormData();
		for (let key in job) {
			form.append(key, job[key]);
		}
		form.append("reported", "False");
		form.append("active", "True");
		form.append("employer", user.employer.id);
		setLoading(true);
		try {
			const token = await getToken();
			const res = await authApi(token).post(
				endpoints["create-recruitment"],
				form,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (res.status === 201) {
				Alert.alert("Thành công", "Bài đăng đã được tạo thành công.");
				setJob({});
				setGender("");
				setDate(new Date());
				setSelectedImage(null);
				nav.navigate("ListJobPost"); //Điều hướng tới Quản lý bài đăng tuyển dụng
			}
		} catch (ex) {
			console.error(ex.response);
			setErr(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Appbar.Header
				style={{
					backgroundColor: "#28A745",
					height: 30,
					marginBottom: 7,
				}}>
				<Appbar.BackAction onPress={handleGoBack} color="white" />
				<Appbar.Content
					title="Đăng tin tuyển dụng"
					style={{
						alignItems: "center",
						justifyContent: "center",
					}}
					titleStyle={{ color: 'white' }}
				/>
			</Appbar.Header>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.container}>
					<Text style={styles.subject}>TẠO BÀI TUYỂN DỤNG</Text>
					<ScrollView>
						{fields.map((c) => {
							if (c.name === "deadline") {
								return (
									<View
										key={c.name}
										style={{ marginVertical: 5 }}>
										<View style={{ flexDirection: "row" }}>
											<Text
												style={{
													padding: 10,
													fontSize: 16,
													marginRight: 25,
												}}>
												Deadline:{" "}
											</Text>
											<Button
												onPress={showDatePickerModal}
												mode="outlined"
												style={{
													justifyContent:
														"flex-start",
												}}>
												{
													date
														.toISOString()
														.split("T")[0]
												}
											</Button>
										</View>

										{showDatePicker && (
											<DateTimePicker
												value={date}
												mode="date"
												display="default"
												onChange={handleDateChange}
											/>
										)}
									</View>
								);
							} else if (c.name === "image") {
								return (
									<View
										key={c.name}
										style={{ marginVertical: 5 }}>
										<Button
											icon="image"
											mode="outlined"
											onPress={pickImage}
											style={{
												justifyContent: "flex-start",
											}}>
											{selectedImage
												? "Ảnh đã chọn"
												: "Chọn ảnh"}
										</Button>
										{selectedImage && (
											<Image
												source={{ uri: selectedImage }}
												style={{
													width: 200,
													height: 200,
													marginTop: 10,
													alignSelf: "center",
												}}
											/>
										)}
									</View>
								);
							} else {
								return (
									<TextInput
										secureTextEntry={c.secureTextEntry}
										value={job[c.name] ? job[c.name] : ""}
										onChangeText={(t) =>
											updateState(c.name, t)
										}
										style={styles.input}
										key={c.name}
										label={c.label}
										multiline={c.multiline}
										keyboardType={c.keyboardType}
									/>
								);
							}
						})}

						<Text style={styles.pickerLabel}>Chọn giới tính</Text>
						<Picker
							selectedValue={gender}
							onValueChange={(value) => handleGender(value)}
							style={styles.picker}>
							<Picker.Item label="Chọn giới tính" value="" />
							<Picker.Item label="Male" value="0" />
							<Picker.Item label="Female" value="1" />
							<Picker.Item
								label="Both male and Female"
								value="2"
							/>
							<Picker.Item label="Gender unknown" value="3" />
						</Picker>
						{genderError && (
							<HelperText type="error" visible={genderError}>
								Vui lòng chọn giới tính hợp lệ.
							</HelperText>
						)}

						<Text style={styles.pickerLabel}>
							Chọn loại hình công việc
						</Text>
						<Picker
							selectedValue={job.employmentType}
							onValueChange={(value) =>
								updateState("employmentType", value)
							}
							style={styles.picker}>
							{employmentTypes.map((type) => (
								<Picker.Item
									key={type.id}
									label={type.type}
									value={type.id}
								/>
							))}
						</Picker>

						<Text style={styles.pickerLabel}>Chọn khu vực</Text>
						<Picker
							selectedValue={job.area}
							onValueChange={(value) =>
								updateState("area", value)
							}
							style={styles.picker}>
							{areas.map((area) => (
								<Picker.Item
									key={area.id}
									label={area.name}
									value={area.id}
								/>
							))}
						</Picker>

						<Text style={styles.pickerLabel}>Chọn lĩnh vực</Text>
						<Picker
							selectedValue={job.career}
							onValueChange={(value) =>
								updateState("career", value)
							}
							style={styles.picker}>
							{careers.map((career) => (
								<Picker.Item
									key={career.id}
									label={career.name}
									value={career.id}
								/>
							))}
						</Picker>

						<HelperText type="error" visible={err}>
							Có lỗi xảy ra!
						</HelperText>

						<Button
							icon="briefcase-plus"
							loading={loading}
							mode="contained"
							onPress={postJob}
							style={styles.button}>
							ĐĂNG BÀI
						</Button>
					</ScrollView>
				</View>
			</TouchableWithoutFeedback>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F5F5",
		padding: 10,
	},
	subject: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 10,
		marginTop: 10,
		alignContent: "center",
	},
	input: {
		marginVertical: 5,
		backgroundColor: "white",
		borderRadius: 8,
		paddingHorizontal: 15,
		fontSize: 16,
	},
	button: {
		backgroundColor: "#28A745",
		marginVertical: 10,
		marginBottom: 30,
		padding: 5,
	},
	picker: {
		height: 50,
		marginVertical: 5,
		backgroundColor: "white",
	},
	pickerLabel: {
		marginTop: 15,
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default CreateRecruitment;