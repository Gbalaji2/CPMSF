import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "./useAuth";

export default function useSocket() {
  const { user } = useAuth();
  const socketRef = useRef(null);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(import.meta.env.VITE_API_SOCKET || "http://localhost:5000", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("notification", (payload) => {
      setNotifications((prev) => [payload, ...prev]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  return { socket: socketRef.current, notifications };
}