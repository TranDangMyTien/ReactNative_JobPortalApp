import axios from "axios";
const BASE_URL = "https://tdmtien.pythonanywhere.com/";


export const endpoints = {
    'register': '/users/', //Phần tạo user 
    'login': '/o/token/', //Phần xin token để đăng nhập 
    'current-user': '/users/current-user/', //Xem trạng thái user 

    // Phần tạo application 
    //https://tdmtien.pythonanywhere.com/users/{id}/create_applicant/
    'create-applicant': (userId) => `/users/${userId}/create_applicant/`,


    // Phần tạo employer 
    //https://tdmtien.pythonanywhere.com/users/{id}/create_employer/
    'create-employer': (userId) => `/users/${userId}/create_employer/`,

    //Lấy danh sách các model phụ 
    'skills': '/skills/',
    'areas':'/areas/',
    'careers':'/careers/',

    
};





//Xác thực người dùng 
export const authApi = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
  }

export default axios.create({
    baseURL: BASE_URL,
  });