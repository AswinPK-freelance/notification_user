import React, { createContext, useState, useContext, useEffect } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";
import { BaseUrl } from "../../utils/constants";

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [user]);

  // useEffect(() => {
  //   if (user) {
  //     const newSocket = io("http://localhost:3000", {
  //       auth: {
  //         token: localStorage.getItem("token"),
  //       },
  //     });

  //     newSocket.on("notification", (notification) => {
  //       setNotifications((prev) => [notification, ...prev]);
  //       setUnreadCount((prev) => prev + 1);
  //     });

  //     setSocket(newSocket);

  //     return () => newSocket.close();
  //   }
  // }, [user]);

  useEffect(() => {
    if (user) {
      getUnreadCount();
      var url = null;
      if (user?.role === "ADMIN") {
        url = `${BaseUrl}/admin`;
      } else {
        url = `${BaseUrl}/user`;
      }
      const newSocket = io(url, {
        auth: {
          token: localStorage.getItem("token"),
        },
      });

      // Check connection
      newSocket.on("connect", () => {
        console.log("User Socket connected:", newSocket.id);
        console.log("Connected to namespace:", newSocket.nsp);
      });

      newSocket.on("notification", (notification) => {
        console.log("Received notification:", notification);
        setNotifications((prev) => [notification, ...prev]);
        getUnreadCount();
      });

      // Error handling
      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user]);

  const getNotifications = async (url) => {
    if (!url) {
      url = `${BaseUrl}/api/notifications/`;
    }
    try {
      // Fetch notifications from the API
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Parse JSON response
      const notifications = await response.json();

      // Set the notifications in your state or process them
      setNotifications(notifications); // Replace this with your state update logic
      console.log("Notifications fetched successfully:", notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    }
  };
  const getUnreadCount = async () => {
    try {
      // Fetch notifications from the API
      const response = await fetch(
        `${BaseUrl}/api/notifications//unread/count`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const unread = await response.json();

      setUnreadCount(unread?.count ?? 0);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${BaseUrl}/api/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      getUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    socket,
    getNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
