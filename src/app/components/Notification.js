import React from "react";

export default function Notification({ message, type = "success", onClose }) {
  if (!message) return null;

  return (
    <div className={`fixed top-4 sm:top-6 left-4 right-4 sm:left-1/4 z-50 min-w-[220px] px-3 sm:px-4 py-2 sm:py-3 rounded shadow-lg flex items-center
      ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}
      sm:max-w-md`}
      style={{ left: "30%" }} // Adjust 30% as needed for your preference
    >
      <span className="flex-1 text-sm sm:text-base">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 sm:ml-4 text-white hover:text-gray-200 font-bold text-lg sm:text-xl"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}