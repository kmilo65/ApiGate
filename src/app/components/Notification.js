import React from "react";

export default function Notification({ message, type = "success", onClose }) {
  if (!message) return null;

  return (
    <div className={`fixed top-6 left-1/4 z-50 min-w-[220px] px-4 py-3 rounded shadow-lg flex items-center
      ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
      style={{ left: "30%" }} // Adjust 30% as needed for your preference
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 font-bold"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}