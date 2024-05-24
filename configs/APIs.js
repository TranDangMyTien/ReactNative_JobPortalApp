import axios from "axios";
const BASE_URL = "https://tdmtien.pythonanywhere.com/";



export const endpoints = {
    'register': '/users/', //Phần đăng ký user 
    'login': '/o/token/', //Phần xin token để đăng nhập 
    'current-user': '/users/current-user/' //Xem trạng thái user 
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