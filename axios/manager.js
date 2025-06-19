import axiosInstance from './platform';

// Lấy tất cả đơn nghỉ phép của nhân viên (dành cho manager)
export const getAllEmployeesLeaveRequests = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  const res = await axiosInstance.get('/api/manager/employees-leave-requests', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.data;
}; 