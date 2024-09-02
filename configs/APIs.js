import axios from "axios";
// const BASE_URL = "https://tdmtien.pythonanywhere.com/";
const BASE_URL = "http://192.168.1.7:8000/";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from '../utils/storage';

export const endpoints = {
    'register': '/users/', //Phần tạo user 
    'login': '/o/token/', //Phần xin token để đăng nhập 
    'current-user': '/users/current-user/', //Xem trạng thái user 
    'patch_current_user': (userId) => `/users/${userId}/patch-current-user/`,
    'patch-avatar': (id) => `/users/${id}/patch-current-user/`,
    'update-applicant': (userId) => `/applicants/${userId}/`,
    'update-employer': (userId) => `/employers/${userId}/`,
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
    'employmenttypes' : '/employmenttypes/',
    'recruitments_post' : '/recruitments_post/',

    // thông tin applicant
    'applicant-detail': (id) => `/applicants/${id}/`,

    // Gợi ý 
    'find-applicant-suggestions': (employerId) =>`/employers/${employerId}/find_applicants/`,

    'search-applicant': '/applicants/search_applicant/',
    
    'all-jobs': (pageNum) => `/recruitments_post/newest/?page=${pageNum}`,
    'popular-jobs': (pageNum) => `/recruitments_post/popular/?page=${pageNum}`,
    'job-detail': (id) => `/recruitments_post/${id}/`,  
    'apply-job': (id) => `/recruitments_post/${id}/apply/`, 
    'create-recruitment': '/recruitments_post/',
    'list-createpost': (id, pageNum) => `/employers/${id}/recruitment_posts/?page=${pageNum}`,
    'delete-post': (id, post_id ) => `/employers/${id}/recruitment_posts/${post_id}/delete/`,
    'detail-apply': (id) => `/recruitments_post/${id}/list_apply/`,
    'list-apply': (id, pageNum) => `/applicants/${id}/applied_jobs/?page=${pageNum}`,

    
    //Phần JobApply 
    "job-apply": (jobId, applicantId) => `/recruitments_post/${jobId}/applicant/${applicantId}/apply/`,

    'read-comment': (id) => `/recruitments_post/${id}/read-comments/`,
    "add-comments" : (id,userId) => `/recruitments_post/${id}/comments/${userId}/user/`,
    'del-comment': (id, commentId) => `/recruitments_post/${id}/comments/${commentId}/delete/`,
    'patch-comment': (id, commentId) => `/recruitments_post/${id}/comments/${commentId}/partial-update/`,
    //
    'ratings': (id) => `/recruitments_post/${id}/ratings/`,
    'delete-rating': (id, ratingId) => `/recruitments_post/${id}/ratings/${ratingId}/delete/`,
    'patch-rating': (id, ratingId) => `/recruitments_post/${id}/ratings/${ratingId}/partial-update/`,
    

    // Phần kiểm tra email đã tồn tại 
    'check_email_exists':  `/check-email/`,
    // Phần lấy mã code để đổi mật khẩu 
    'password-reset' : `/password-reset/`,
    // Kiểm tra sự tồn tại của token 
    'check-token': `/check-token/`, 
    // Đổi mật khẩu mới 
    'change-password' :`/password-reset-confirm/`, 

    // Phần tạo review 
    'create-review': (id) => `/recruitments_post/${id}/review/`,
    // Phần lấy danh sách reviews 
    'job-reviews': (jobId) => `/recruitments_post/${jobId}/reviews/`,


};


  
// TẤT CẢ CÁC CÔNG VIỆC
export const fetchAllJobs = async (pageNum = 1) => {
    try {
        const response = await axios.get(BASE_URL + endpoints['all-jobs'](pageNum));
        return response.data;
    } catch (error) {
        console.error('Error fetching all job:', error);
        throw error;
    }
  };

//  CÁC CÔNG VIỆC PHỔ BIẾN DỰA VÀO SỐ NGƯỜI APPLY
export const fetchPopularJobs = async (pageNum = 1) => {
    try {
        const response = await axios.get(BASE_URL + endpoints['popular-jobs'](pageNum));
        return response.data;
    } catch (error) {
        console.error('Error fetching popular job:', error);
        throw error;
    }
  };
  
export const fetchListApplyJobs = async (id, pageNum = 1) => {
    try {
        const authToken = await AsyncStorage.getItem("token");
        const response = authAPI(authToken).get(endpoints['list-apply'](id, pageNum));
        return response.data;
    } catch (error) {
        console.error('Error fetching apply job:', error);
        throw error;
    }
};


//Xác thực người dùng 
export const authAPI = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
  }

const APIs = axios.create({
    baseURL: BASE_URL
  });
  
export default APIs;




  

