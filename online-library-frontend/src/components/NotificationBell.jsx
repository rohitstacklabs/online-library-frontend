import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { connectSocket } from "../services/socket";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = connectSocket(token);

    if (socket) {
      socket.onmessage = (event) => {
        console.log("📩 Raw message from server:", event.data);

        try {
          const notification = JSON.parse(event.data);
          console.log("✅ Parsed notification:", notification);

          setNotifications((prev) => [notification, ...prev]);
        } catch (err) {
          console.error("❌ Invalid notification data:", err);
        }
      };
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("🔌 Closing socket on unmount");
        socket.close();
      }
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-50">
          <h3 className="text-sm font-semibold mb-2">Notifications</h3>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n, idx) => (
                <li
                  key={idx}
                  className="p-2 border-b last:border-none text-sm"
                >
                  {n.message || JSON.stringify(n)}
                </li>
              ))
            ) : (
              <li className="p-2 text-sm text-gray-500">
                No notifications yet
              </li>
            )}
          </ul>

          <button
            onClick={() =>
              setNotifications((prev) => [
                { message: "🔔 Test notification" },
                ...prev,
              ])
            }
            className="mt-2 w-full px-3 py-1 bg-blue-500 text-white text-sm rounded"
          >
            Add Test Notification
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
