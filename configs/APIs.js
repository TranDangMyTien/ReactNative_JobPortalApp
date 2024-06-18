import axios from "axios";
const BASE_URL = "https://tdmtien.pythonanywhere.com/";


export const endpoints = {
    'register': '/users/', //Phần tạo user 
    'login': '/o/token/', //Phần xin token để đăng nhập 
    'current-user': '/users/current-user/', //Xem trạng thái user 
    // 'patch_current_user' : '/users/patch-current-user/',
    'patch_current_user': (userId) => `/users/${userId}/patch-current-user/`,

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
    //Lấy danh sách các loại hình công việc (full-part-...)
    'employmenttypes' : '/employmenttypes/',


    // thông tin applicant
    'applicant-detail': (id) => `/applicants/${id}/`,

    'jobs-list': '/recruitments_post/',  // tất cả bài tuyển dụng công việc
    'fetch-job-list': (pageNum) => `/recruitments_post/?page=${pageNum}`, //phân trang
    'job-detail': (id) => `/recruitments_post/${id}/`,  // Endpoint chi tiết công việc

    
    //Phần hiện danh sách các bài đăng tuyển dụng 
    'recruitments_post' : '/recruitments_post/',
    //Phần JobApply 
    "job-apply": (jobId, applicantId) => `/recruitments_post/${jobId}/applicant/${applicantId}/apply/`,

    
};


export const fetchApplyPost = (id) => {
    return axios.get(BASE_URL + endpoints['apply-job'](id));
  }
  
  
  //dùng cho ds các bài tuyển dụng mới nhất
  export const fetchJobList = async (pageNum = 1) => {
      try {
          const response = await axios.get(BASE_URL + endpoints['fetch-job-list'](pageNum));
          return response.data;
      } catch (error) {
          console.error('Error fetching job list:', error);
          throw error;
      }
  };
  
  //chi tiết bài tuyển dụng công việc
  export const fetchJobDetail = (id) => {
      return axios.get(BASE_URL + endpoints['job-detail'](id));
  }
  


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


