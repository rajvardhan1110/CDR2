import React from "react";

export default function Card({ children, className = "", style = {} }) {
  return (
    <div
  className={`theme-card w-full shadow-lg rounded-2xl p-6 transition-all duration-500 ease-in-out hover:shadow-2xl bg-white/90 border border-white/60 hover:border-blue-200/80 hover:bg-white ${className}`}
      style={{ ...style }}
    >
      {children}
    </div>
  );
}