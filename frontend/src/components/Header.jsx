import React from 'react';

export default function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen((s) => !s)} 
          className="p-3 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 border border-gray-200/50 hover:border-cyan-300 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 group"
        >
          <div className="space-y-1.5 transition-all duration-300 group-hover:space-y-1">
            <span className={`block w-6 h-0.5 bg-cyan-600 transition-all duration-300 ${sidebarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-cyan-600 transition-all duration-300 ${sidebarOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-cyan-600 transition-all duration-300 ${sidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 16H10M12 14V18M8 20H16C17.1046 20 18 19.1046 18 18V6C18 4.89543 17.1046 4 16 4H8C6.89543 4 6 4.89543 6 6V18C6 19.1046 6.89543 20 8 20Z" 
                    stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
              Clinical Dementia Rating
            </h1>
            <p className="text-sm text-gray-500 font-medium">Professional Assessment Tool</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-emerald-700">System Online</span>
        </div>
        
        {/* User profile placeholder */}
        {/* <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-full flex items-center justify-center shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#4B5563" strokeWidth="2"/>
            <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#4B5563" strokeWidth="2"/>
          </svg>
        </div> */}
      </div>
    </header>
  );
}