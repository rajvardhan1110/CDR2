import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-white/80 backdrop-blur-md border-t border-gray-200/60 py-6 px-4 text-center">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright text */}
          <div className="flex items-center gap-2 text-gray-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-500">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-medium">
              © {new Date().getFullYear()} All Right Reserved
            </span>
          </div>
          
          {/* Tagline with medical theme */}
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Built with Care
            </span>
          </div>
          
          {/* Quick links */}
          {/* <div className="flex items-center gap-4 text-xs">
            <span className="text-gray-500 hover:text-cyan-600 transition-colors duration-300 cursor-pointer">
              Privacy
            </span>
            <span className="text-gray-500 hover:text-cyan-600 transition-colors duration-300 cursor-pointer">
              Terms
            </span>
            <span className="text-gray-500 hover:text-cyan-600 transition-colors duration-300 cursor-pointer">
              Support
            </span>
          </div> */}
        </div>
        
      
      </div>
    </footer>
  );
}