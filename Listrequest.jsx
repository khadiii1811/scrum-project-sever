import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CalendarDays, FileText, Clock, BadgeCheck } from "lucide-react";
import { getAllEmployeesLeaveRequests } from "./axios/manager";

export default function ListRequest() {
  const [employees, setEmployees] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    getAllEmployeesLeaveRequests()
      .then((res) => {
        // Map dữ liệu API về format FE đang dùng
        const employees = res.data.map((item) => ({
          id: item.id,
          name: item.user?.name || "N/A",
          email: item.user?.email || "",
          status: item.status,
          avatar: item.user?.avatar || "https://i.pravatar.cc/150?img=1",
          leaveDays: item.leave_dates,
          reason: item.reason,
          requestDate: item.created_at ? item.created_at.slice(0, 10) : "",
          approvedDate: item.updated_at ? item.updated_at.slice(0, 10) : undefined,
        }));
        setEmployees(employees);
      })
      .catch((err) => {
        setEmployees([]);
        toast.error("Không thể tải danh sách đơn nghỉ phép");
      });
  }, []);

  const filteredEmployees =
    filterStatus === "all"
      ? employees
      : employees.filter((emp) => emp.status === filterStatus);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDotStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleFilterClick = (status) => {
    setFilterStatus(status);
    setIsDropdownOpen(false);
  };

  const handleApprove = () => {
    toast.success("Approved");
    setSelectedEmployee(null);
  };

  const handleReject = () => {
    toast.error("Rejected");
    setSelectedEmployee(null);
  };

  return (
    
    <div className={`max-w-6xl mt-5 grid gap-6 transition-all duration-300 ${selectedEmployee ? "grid-cols-1 md:grid-cols-5" : "grid-cols-1"}`}>
      {/* LIST COLUMN */}
      <div className="md:col-span-3">
        <h1 className="text-2xl font-bold mb-2">List Request</h1> 
        {/* Filter */}
        <div className="mb-3 flex justify-start">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-1.5"
            >
              Filter: {filterStatus === "all" ? "All" : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              <svg className="w-2.5 h-2.5 ms-2.5" fill="none" viewBox="0 0 10 6">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-44 bg-white rounded-md shadow border">
                <ul className="py-1 text-sm text-gray-700">
                  {["all", "approved", "pending", "rejected"].map((s) => (
                    <li key={s}>
                      <button
                        onClick={() => handleFilterClick(s)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Employee List */}
        {filteredEmployees.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No employees found.</p>
        ) : (
          <div className="divide-y divide-gray-200 border border-gray-300 rounded-md overflow-hidden">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className="flex justify-between items-center p-4 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img className="w-10 h-10 rounded-full" src={emp.avatar} alt={emp.name} />
                  <div>
                    <div className="text-base font-semibold text-gray-900">{emp.name}</div>
                    <div className="text-sm text-gray-500">{emp.email}</div>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                    emp.status
                  )}`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${getDotStyle(emp.status)}`}></span>
                  {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL PANEL */}
      {selectedEmployee && (
        <div className="md:col-span-2 mt-20 animate-fade-in bg-white border border-gray-300 rounded-xl shadow p-4 space-y-4 w-full self-start">

          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <img src={selectedEmployee.avatar} className="w-12 h-12 rounded-md" alt={selectedEmployee.name} />
              <div>
                <div className="text-base font-semibold">{selectedEmployee.name}</div>
                <div className="text-sm text-gray-500">{selectedEmployee.email}</div>
              </div>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                selectedEmployee.status
              )}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${getDotStyle(selectedEmployee.status)}`}></span>
              {selectedEmployee.status.charAt(0).toUpperCase() + selectedEmployee.status.slice(1)}
            </div>
          </div>

          <div className="space-y-4">
            {/* Request Date */}
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm font-semibold">
              <div className="flex items-center gap-2 text-blue-700">
                <Clock size={18} />
                <span>REQUEST DATE</span>
              </div>
              <p className="text-sm text-gray-700 mt-1 ml-6">{selectedEmployee.requestDate}</p>
            </div>

            {/* Leave Days */}
            <div className="bg-violet-50 p-4 rounded-xl shadow-sm  font-semibold">
              <div className="flex items-center gap-2 text-violet-700">
                <CalendarDays size={18} />
                <span>LEAVE DAYS</span>
              </div>
              <ul className="text-sm text-gray-700 mt-1 ml-6">
                {selectedEmployee.leaveDays.map((day, idx) => (
                  <li key={idx}>{day}</li>
                ))}
              </ul>
            </div>

            {/* Approved Date (conditionally rendered) */}
            {(selectedEmployee.status === "approved" || selectedEmployee.status === "rejected") && selectedEmployee.approvedDate && (
              <div className="bg-green-50 p-4 rounded-xl shadow-sm font-semibold">
                <div className="flex items-center gap-2 text-green-700">
                  <BadgeCheck size={18} />
                  <span>RESPONSE DATE</span>
                </div>
                <p className="text-sm text-gray-700 mt-1 ml-6">{selectedEmployee.approvedDate}</p>
              </div>
            )}
          </div>

          {/* Reason */}
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 font-semibold text-yellow-700">
              <FileText size={18} />
              <span> REQUEST REASON</span>
            </div>
            <p className="text-sm text-gray-700 mt-1 ml-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit pariatur odit consequuntur sed ipsa nesciunt ab quo commodi facere! Odio cum voluptates ipsa, doloribus adipisci nesciunt architecto fugiat perspiciatis quod.</p>
          </div>

          {/* Action Buttons */}
          {selectedEmployee.status === "pending" && (
            <div className="flex justify-end gap-2">
              <button
                onClick={handleReject}
                className="bg-red-100 text-red-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-red-200"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="bg-green-100 text-green-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-green-200"
              >
                Approve
              </button>
            </div>
          )}
          {selectedEmployee.status === "rejected" && (
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 font-semibold text-red-700">
                <FileText size={18} />
                <span>REJECT REASON</span>
              </div>
              {/* <p className="text-sm text-gray-700 mt-1 ml-6">{selectedEmployee.rejectReason}</p> */}
              <p className="text-sm text-gray-700 mt-1 ml-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, non laboriosam delectus officiis dolorum earum quaerat asperiores cupiditate laudantium enim numquam architecto inventore obcaecati voluptatum nostrum? Soluta, voluptas! Exercitationem, repellendus!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
