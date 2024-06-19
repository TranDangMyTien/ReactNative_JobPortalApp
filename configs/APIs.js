import axios from "axios";
const BASE_URL = "https://tdmtien.pythonanywhere.com/";


export const endpoints = {
    'register': '/users/', //Phần tạo user 
    'login': '/o/token/', //Phần xin token để đăng nhập 
    'current-user': '/users/current-user/', //Xem trạng thái user 
    'patch_current_user': (userId) => `/users/${userId}/patch-current-user/`,
    'patch-avatar': (id) => `/users/${id}/patch-current-user/`,
    'update-applicant': (userId) => `/applicants/${userId}/`,
    'update-employer': (userId) => `/employers/${userId}/`,
    // Phần tạo application 
    'create-applicant': (userId) => `/users/${userId}/create_applicant/`,
    // Phần tạo employer 
    'create-employer': (userId) => `/users/${userId}/create_employer/`,
    //Lấy danh sách các model phụ 
    'skills': '/skills/',
    'areas':'/areas/',
    'careers':'/careers/',
    'employmenttypes' : '/employmenttypes/',
    'recruitments_post' : '/recruitments_post/',

    // thông tin applicant
    'applicant-detail': (id) => `/applicants/${id}/`,

    'jobs-list': '/recruitments_post/',  // tất cả bài tuyển dụng công việc
    'fetch-job-list': (pageNum) => `/recruitments_post/?page=${pageNum}`, //phân trang

    //tìm kiếm ứng viên theo tiêu chí
    'search_applicant' : `/applicants/search_applicant/`,
    
    'all-jobs': (pageNum) => `/recruitments_post/newest/?page=${pageNum}`,
    'popular-jobs': (pageNum) => `/recruitments_post/popular/?page=${pageNum}`,
    'job-detail': (id) => `/recruitments_post/${id}/`,  
    'apply-job': (id) => `/recruitments_post/${id}/apply/`, 
    'create-recruitment': `/recruitments_post/`,
    'list-createpost': (id, pageNum) => `/employers/${id}/recruitment_posts/?page=${pageNum}`,
    'delete-post': (id, post_id ) => `/employers/${id}/recruitment_posts/${post_id}/delete/`,
    'detail-apply': (id) => `/recruitments_post/${id}/list_apply/`,
    'list-apply': (id, pageNum) => `/applicants/${id}/applied_jobs/?page=${pageNum}`,


    
    //Phần JobApply 
    "job-apply": (jobId, applicantId) => `/recruitments_post/${jobId}/applicant/${applicantId}/apply/`,

    'list-comment': (id) => `/recruitments_post/${id}/read-comments/`,
    'add-comments' : (id) => `/recruitments_post/${id}/comments/`,
    'del-comment': (id, commentId) => `/recruitments_post/${id}/comments/${commentId}/delete/`,
    'patch-comment': (id, commentId) => `/recruitments_post/${id}/comments/${commentId}/partial-update/`,
    //
    'ratings': (id) => `/recruitments_post/${id}/ratings/`,
    'delete-rating': (id, ratingId) => `/recruitments_post/${id}/ratings/${ratingId}/delete/`,
    'patch-rating': (id, ratingId) => `/recruitments_post/${id}/ratings/${ratingId}/partial-update/`
    
};


export const fetchApplyPost = (id) => {
    return axios.get(BASE_URL + endpoints['apply-job'](id));
  }
  

//Chi tiết danh sách công việc 
export const fetchJobDetail = (id) => {
    return axios.get(BASE_URL + endpoints['job-detail'](id));
}
  
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
  
// DANH SÁCH CÁC CÔNG VIỆC MÀ APPLICANT ĐÃ APPLY
export const fetchListApplyJobs = async (id, pageNum = 1) => {
    try {
        const response = axios.get(BASE_URL + endpoints['list-apply'](id, pageNum));
        return response.data;
    } catch (error) {
        console.error('Error fetching apply job:', error);
        throw error;
    }
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

const axiosInstance = axios.create({
baseURL: BASE_URL
});


export default axiosInstance;