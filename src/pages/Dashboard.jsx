import React from "react";
import NotificationList from "../components/NotificationList";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";

function Dashboard() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-600 mt-2">
          You have {unreadCount} unread notifications <br />
          <b> Click the notification to mark as read.</b>
        </p>
      </div>
      <NotificationList />
    </div>
  );
}

export default Dashboard;
