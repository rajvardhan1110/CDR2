import React from "react";

export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-4 focus:ring-cyan-200 focus:outline-none border border-white/20 hover:border-white/30 ${className}`}
    >
      {children}
    </button>
  );
}