import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { useNotifications } from "../contexts/NotificationContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BaseUrl } from "../../utils/constants";

function NotificationList() {
  const { notifications, markAsRead, getNotifications } = useNotifications();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleFilterChange = () => {
    const filters = new URLSearchParams();

    if (fromDate) {
      filters.append("fromDate", fromDate.toISOString().split("T")[0]);
    }
    if (toDate) {
      filters.append("toDate", toDate.toISOString().split("T")[0]);
    }

    const url = `${BaseUrl}/api/notifications/?${filters.toString()}`;
    getNotifications(url);
  };

  const resetData = () => {
    setFromDate(null);
    setToDate(null);
    const url = `${BaseUrl}/api/notifications`;
    getNotifications(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            From Date
          </label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            className="mt-1 p-2 border border-gray-300 rounded"
            placeholderText="Select from date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            To Date
          </label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="yyyy-MM-dd"
            minDate={fromDate ?? null}
            maxDate={new Date()}
            className="mt-1 p-2 border border-gray-300 rounded"
            placeholderText="Select to date"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleFilterChange}
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Apply Filters
          </button>
          <button
            onClick={() => resetData()}
            className="mt-6 bg-red-500 mx-2 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Reset
          </button>
        </div>
      </div>

      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow ${
              notification.read
                ? "bg-white cursor-not-allowed"
                : "bg-blue-50 cursor-pointer"
            }`}
            onClick={() => !notification.read && markAsRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-gray-600">{notification.message}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 py-8">
          No notifications found
        </div>
      )}
    </div>
  );
}

export default NotificationList;
