import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { createLeaveRequest } from "../../axios/employee";

// Popup Component
const NotificationPopup = ({ type, message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const isSuccess = type === 'success';
  const icon = isSuccess ? (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
  ) : (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Content */}
        <div className="flex items-center space-x-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
            isSuccess 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'
          }`}>
            {icon}
          </div>

          {/* Message */}
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${
              isSuccess ? 'text-green-800' : 'text-red-800'
            }`}>
              {isSuccess ? 'Success!' : 'Error!'}
            </h3>
            <p className={`text-sm mt-1 ${
              isSuccess ? 'text-green-600' : 'text-red-600'
            }`}>
              {message}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-5000 ease-linear ${
              isSuccess ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ animation: 'shrink 5s linear forwards' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default function RequestDayoff({ onViewList }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    type: '',
    message: '',
    isVisible: false
  });

  const toggleDate = (date) => {
    const isSelected = selectedDates.some(d => d.toDateString() === date.toDateString());
    if (isSelected) {
      setSelectedDates(selectedDates.filter(d => d.toDateString() !== date.toDateString()));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const showNotification = (type, message) => {
    setNotification({
      type,
      message,
      isVisible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  // Hàm xử lý submit
  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset về 00:00:00
    return date > today;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedDates.length === 0) {
      showNotification('error', 'Please select at least one day off.');
      return;
    }
    if (!reason.trim()) {
      showNotification('error', 'Please enter a reason.');
      return;
    }
    // Validate: tất cả ngày phải là ngày trong tương lai
    const invalidDate = selectedDates.find(date => !isFutureDate(date));
    if (invalidDate) {
      showNotification('error', 'All selected days off must be in the future.');
      return;
    }

    setLoading(true);
    try {
      const leave_dates = selectedDates
        .sort((a, b) => a - b)
        .map(date => format(date, "yyyy-MM-dd"));

      const res = await createLeaveRequest({ leave_dates, reason });
      if (res.success) {
        showNotification('success', 'Your leave request has been submitted successfully!');
        setSelectedDates([]);
        setReason("");
      } else {
        showNotification('error', res.message || 'Failed to submit request.');
      }
    } catch (err) {
      showNotification('error', 'Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="">
        {/* Header */}
        <div className="bg-blue-100 text-center py-3 rounded mb-6">
          <h1 className="text-[#13467E] font-semibold text-lg">Request Day Off</h1>
        </div>

        {/* Calendar */}
        <div className="flex justify-center relative z-10 mb-[200px]" style={{ minHeight: "420px" }}>
          <div className="inline-block scale-[1.7] origin-top">
            <DatePicker
              selected={null}
              onChange={toggleDate}
              inline
              highlightDates={selectedDates}
              minDate={new Date()} // chỉ cho chọn từ hôm nay trở đi
              dayClassName={date =>
                selectedDates.find(d => d.toDateString() === date.toDateString())
                  ? "bg-blue-300 rounded-full"
                  : undefined
              }
            />
          </div>
        </div>

        {/* Selected Dates + Reason */}
        <div className="mb-6">
          <h1 className="text-[#13467E] font-semibold text-lg mb-1">Selected day-off</h1>
          <div className="selected-dayoff text-sm text-gray-700 mb-4">
            {selectedDates.length > 0 ? (
              <ul className="list-inside text-lg">
                {selectedDates
                  .sort((a, b) => a - b)
                  .map((date, index) => (
                    <li key={index}>{format(date, "dd/MM/yyyy")}</li>
                  ))}
              </ul>
            ) : (
              <p className="text-lg">No days selected.</p>
            )}
          </div>

          <h1 className="text-[#13467E] font-semibold text-lg mb-1">Reason</h1>
          <textarea
            id="reason"
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter your reason for the day(s) off"
          />
        </div>

        {/* Buttons */}
        <div className="flex w-full gap-4">
          <button
            type="button"
            className="flex-1 border-2 border-[#2F8AC3] text-[#2F8AC3] font-medium py-3 rounded hover:bg-blue-50 text-center transition-colors"
            onClick={onViewList}
            disabled={loading}
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#2F8AC3] text-white font-medium py-3 rounded hover:bg-blue-500 text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>

      {/* Notification Popup */}
      <NotificationPopup
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        .animate-in {
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}