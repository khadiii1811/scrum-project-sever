import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Tạo axios instance với cấu hình mặc định
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm decode JWT token để lấy user_id
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Interceptor để tự động thêm user-id vào header từ token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.user_id) {
        config.headers['user-id'] = decodedToken.user_id;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Lấy thông tin ngày phép còn lại của nhân viên hiện tại
 * @returns {Promise<Object>} Thông tin ngày phép
 */
export const getLeaveBalance = async () => {
  try {
    const response = await api.get('/leave-balance/left');
    return response.data;
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    throw error;
  }
};

/**
 * Lấy thông tin profile của nhân viên hiện tại
 * @returns {Promise<Object>} Thông tin nhân viên
 */
export const getEmployeeProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    throw error;
  }
};

/**
 * Lấy danh sách yêu cầu nghỉ phép của nhân viên hiện tại
 * @returns {Promise<Object>} Danh sách yêu cầu nghỉ phép
 */
export const getLeaveRequests = async () => {
  try {
    const response = await api.get('/leave-requests');
    return response.data;
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    throw error;
  }
};

/**
 * Tạo yêu cầu nghỉ phép mới
 * @param {Object} requestData - Dữ liệu yêu cầu nghỉ phép
 * @returns {Promise<Object>} Kết quả tạo yêu cầu
 */
export const createLeaveRequest = async (requestData) => {
  try {
    const response = await api.post('/leave-requests', requestData);
    return response.data;
  } catch (error) {
    console.error('Error creating leave request:', error);
    throw error;
  }
};

export default api; 