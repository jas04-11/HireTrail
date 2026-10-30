import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { notificationApi } from "../../api/notificationApi";
import { formatDistanceToNow } from "../../utils/formatDate";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationApi.list();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (e) {
      // ignore, bell just stays empty
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = async () => {
    setOpen((o) => !o);
    if (!open && unreadCount > 0) {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 card p-2 max-h-96 overflow-y-auto">
          <p className="px-2 py-1.5 text-xs font-semibold uppercase text-gray-500">Notifications</p>
          {notifications.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-gray-400">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n._id}
                to={n.link || "#"}
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-2.5 text-sm hover:bg-gray-50"
              >
                <p className={n.isRead ? "text-gray-600" : "text-gray-900 font-medium"}>{n.message}</p>
                <p className="mt-0.5 text-xs text-gray-400">{formatDistanceToNow(n.createdAt)}</p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
