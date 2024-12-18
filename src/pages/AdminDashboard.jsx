import React, { useState } from "react";
import { useNotifications } from "../contexts/NotificationContext";
import { BaseUrl } from "../../utils/constants";

function AdminDashboard() {
  const { socket } = useNotifications();
  const [userList, setuserList] = useState([]);
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    userId: "",
    role: "all",
    scheduledAt: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${BaseUrl}/api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: notification.title,
        message: notification.message,
        role: notification.role,
        userId: parseInt(notification.userId),
        scheduledAt: notification.scheduledAt,
      }),
    });
    setNotification({
      title: "",
      message: "",
      role: "all",
      scheduledAt: "",
      userId: null,
    });
    setuserList([]);
  };

  const getUsers = async (value) => {
    setNotification({ ...notification, role: value });
    if (value === "USER" || value === "ADMIN") {
      const url = new URL(`${BaseUrl}/api/auth/users`);
      url.searchParams.append("role", value);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setuserList(data?.users ?? []);
      } else {
        console.error("Error fetching users:", response.statusText);
      }
    } else {
      setuserList([]);
      setNotification({ ...notification, userId: null });
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-12">
          Admin Dashboard
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Create Notification
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={notification.title}
                onChange={(e) =>
                  setNotification({ ...notification, title: e.target.value })
                }
                placeholder="Enter notification title"
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                value={notification.message}
                onChange={(e) =>
                  setNotification({ ...notification, message: e.target.value })
                }
                placeholder="Write your notification message here"
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Role
              </label>
              <select
                value={notification.role}
                required
                onChange={(e) => getUsers(e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
              >
                <option value="" disabled>
                  {" "}
                  -- Choose One --{" "}
                </option>
                <option value="USER">Regular Users</option>
                <option value="ADMIN">Admins Only</option>
              </select>
            </div>

            {userList?.length ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select User
                  </label>
                  <select
                    value={notification.userId}
                    onChange={(e) =>
                      setNotification({
                        ...notification,
                        userId: e.target.value,
                      })
                    }
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                  >
                    <option value="">All</option>
                    {userList?.map((value, key) => (
                      <option key={key} value={value.id}>
                        {value?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              ""
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Schedule (Optional)
              </label>
              <input
                type="datetime-local"
                value={notification.scheduledAt}
                onChange={(e) =>
                  setNotification({
                    ...notification,
                    scheduledAt: e.target.value,
                  })
                }
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-md text-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Send Notification
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
