import axiosInstance from './platform';

// Lấy thông tin nhân viên
export const getEmployeeProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  const res = await axiosInstance.get(`/auth/profile`, {
    headers: { 
      'Authorization': `Bearer ${token}` 
    }
  });
  return res.data;
};

// Lấy số ngày phép còn lại
export const getLeaveBalance = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  const res = await axiosInstance.get(`/leave-balance/left`, {
    headers: { 
      'Authorization': `Bearer ${token}` 
    }
  });
  return res.data;
};

export const createLeaveRequest = async ({ leave_dates, reason }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  try {
    const res = await axiosInstance.post(
      '/leave-requests',
      { leave_dates, reason },
      { 
        headers: { 
          'Authorization': `Bearer ${token}` 
        } 
      }
    );
    return res.data;
  } catch (err) {
    // Log lỗi chi tiết từ backend
    if (err.response) {
      console.error('Backend error:', err.response.data);
      throw new Error(err.response.data.message || "Error submitting request");
    }
    throw err;
  }
};

export const getLeaveRequests = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  const res = await axiosInstance.get('/leave-requests', {
    headers: { 
      'Authorization': `Bearer ${token}` 
    }
  });
  return res.data;
};