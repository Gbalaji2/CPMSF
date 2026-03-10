import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timersRef = useRef({});

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const addNotification = useCallback(
    (message, type = "info", duration = 3000) => {
      const id = crypto.randomUUID();

      const newNotification = {
        id,
        message,
        type,
      };

      setNotifications((prev) => {
        const updated = [...prev, newNotification];
        return updated.slice(-3); // max 3 toasts at a time
      });

      if (duration) {
        const timer = setTimeout(() => {
          removeNotification(id);
        }, duration);

        timersRef.current[id] = timer;
      }
    },
    [removeNotification]
  );

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ addNotification, removeNotification }}
    >
      {children}

      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-50 space-y-3">
        {notifications.map((n) => (
          <Toast
            key={n.id}
            notification={n}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

function Toast({ notification, onClose }) {
  const { message, type } = notification;

  const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`min-w-[250px] px-4 py-3 rounded-xl shadow-lg text-white flex items-center justify-between animate-slide-in ${typeStyles[type]}`}
    >
      <span className="text-sm">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 font-bold"
      >
        ×
      </button>
    </div>
  );
}