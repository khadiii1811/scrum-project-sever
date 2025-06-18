import React, { useState, useEffect } from "react";
import { Outlet, Link } from 'react-router-dom';
import { getLeaveBalance, getEmployeeProfile } from "../../axios/employee";

export default function EmployeeInfo() {
  const [employee, setEmployee] = useState({});
  const [totalDays, setTotalDays] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    // Decode token để lấy user_id
    const decodedToken = decodeToken(token);
    if (!decodedToken || !decodedToken.user_id) {
      setError("Invalid token or missing user_id");
      setLoading(false);
      return;
    }

    setUserId(decodedToken.user_id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gọi API lấy thông tin nhân viên
        const profileData = await getEmployeeProfile();
        if (profileData.success) {
          setEmployee(profileData.data);
        }

        // Gọi API lấy thông tin ngày phép
        const balanceData = await getLeaveBalance();
        if (balanceData.success) {
          setTotalDays(balanceData.data.total_days);
          setRemainingDays(balanceData.data.remaining_days);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="bg-blue-100 text-center py-3 rounded mb-6">
        <h1 className="text-[#13467E] font-semibold text-lg">
          Employee Leave Management System
        </h1>
      </div>
      {/* Thông tin nhân viên */}
      <div className="flex items-start w-ful">
        <div className="flex-1">
          <ul className="space-y-4 mb-6 ml-3">
            <li className="flex justify-between items-center">
              {/* Cột trái: icon + nhãn */}
              <div className="flex items-center space-x-2">
                {/* SVG icon */}
                <img src="/user.png" alt="Company Logo" id="companyLogo" width="20px" className="mr-3" />
                <span className="font-medium">Employee</span>
              </div>
              {/* Cột phải: giá trị */}
            </li>

            {/* Hai dòng còn lại tương tự */}
            <li className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <img src="/calendar.png" alt="Company Logo" id="companyLogo" width="20px" className="mr-3" />
                <span className="font-medium">Number total day‑off</span>
              </div>
            </li>

            <li className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <img src="/calendar.png" alt="Company Logo" id="companyLogo" width="20px" className="mr-3" />
                <span className="font-medium">Number left day‑off</span>
              </div>
            </li>
          </ul>
        </div>
        <div className="flex-1">
          <ul className="space-y-4 mb-6 ml-3">
            <li className="flex justify-between items-center">
              <span className="text-black-600 font-semibold">{employee.name || "Loading..."}</span>
            </li>
            {/* Hai dòng còn lại tương tự */}
            <li className="flex justify-between items-center">
              <span className="text-green-600 font-semibold">{totalDays}</span>
            </li>

            <li className="flex justify-between items-center">
              <span className="text-red-600 font-semibold">{remainingDays}</span>
            </li>
          </ul>
        </div>
      </div>
      {/* Nút hành động */}
      <div className="flex gap-4 mb-6">
        <Link
          to="request"
          className="flex-1 bg-[#2F8AC3] text-white font-medium py-3 rounded hover:bg-blue-500 text-center"
        >
          Request Dayoff
        </Link>
        <Link
          to="list"
          className="flex-1 border-2 border-[#2F8AC3] text-[#2F8AC3] font-medium py-3 rounded hover:bg-blue-50 text-center"
        >
          View Dayoff List
        </Link>
      </div>
    </div>
  );
} 