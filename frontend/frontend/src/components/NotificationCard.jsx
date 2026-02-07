import React from "react";

function NotificationCard({ notification, onMarkAsRead, onDelete }) {
  const isRead = notification.read;

  // Get icon based on notification type
  const getIcon = () => {
    const iconClass = "w-6 h-6";
    switch (notification.type) {
      case "appointment_created":
        return (
          <svg
            className={`${iconClass} text-blue-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "confirmed":
      case "appointment_confirmed":
        return (
          <svg
            className={`${iconClass} text-green-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "cancelled":
      case "appointment_cancelled":
        return (
          <svg
            className={`${iconClass} text-red-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case "completed":
      case "appointment_completed":
        return (
          <svg
            className={`${iconClass} text-purple-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "status_update":
        return (
          <svg
            className={`${iconClass} text-amber-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={`${iconClass} text-gray-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        );
    }
  };

  // Format time
  const formatTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        isRead
          ? "bg-gray-50 border-gray-200"
          : "bg-blue-50 border-blue-200 shadow-sm"
      }`}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4
                className={`font-semibold ${isRead ? "text-gray-700" : "text-gray-900"}`}
              >
                {notification.title || "Notification"}
              </h4>
              <p
                className={`text-sm mt-1 ${isRead ? "text-gray-600" : "text-gray-700"}`}
              >
                {notification.message}
              </p>
            </div>

            {!isRead && (
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            )}
          </div>

          {/* Footer with time and actions */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">
              {formatTime(notification.createdAt)}
            </span>

            <div className="flex gap-2">
              {!isRead && (
                <button
                  onClick={() => onMarkAsRead(notification._id)}
                  className="text-xs px-3 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors font-medium"
                >
                  Mark as read
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(notification._id)}
                  className="text-xs px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
