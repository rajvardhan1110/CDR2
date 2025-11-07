import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from './ui/Button';

export default function Sidebar({ open = true, setOpen = () => {} }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const isAdmin = user?.email === 'admin@gmail.com';

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // if closed, render nothing (completely hidden)
  if (!open) return null;

  return (
    <aside className="bg-white/90 backdrop-blur-md border-r border-gray-200/60 h-screen p-6 w-72 shadow-xl transition-all duration-300">
      {/* User Profile Section */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200/40">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          {isAdmin ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="2"/>
              <path d="M19.4 15C19.2669 14.515 19.1338 14.0375 19.0007 13.5676C18.5297 12.011 17.8315 10.5554 16.9362 9.25278C16.7347 8.91649 16.5332 8.58776 16.3317 8.2666C15.6329 7.13347 14.7987 6.10736 13.8563 5.21753C13.3916 4.77258 12.9018 4.35766 12.3899 3.97578C12.1564 3.79159 11.9194 3.61279 11.6791 3.43937C10.7129 2.68296 9.63714 2.101 8.5 1.71796C8.04363 1.57129 7.57761 1.44896 7.10419 1.35229C6.372 1.20203 5.62083 1.12778 4.8667 1.13128C4.00183 1.13546 3.15008 1.27204 2.33337 1.53576C2.33337 3.30952 2.77778 5.04762 3.61111 6.57143C4.44444 8.09524 5.63333 9.35476 7.05556 10.2222C8.47778 11.0897 10.0889 11.5333 11.7222 11.5111C13.3556 11.4889 14.9556 10.0016 16.3334 10.2222C16.6987 10.2825 17.0586 10.3676 17.4111 10.4766C18.1778 10.7079 18.9111 11.0317 19.6 11.4444" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="white" strokeWidth="2"/>
              <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="white" strokeWidth="2"/>
            </svg>
          )}
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{isAdmin ? 'Administrator' : 'Clinical User'}</h3>
          <p className="text-sm text-cyan-600 font-medium">{user?.email}</p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
          {isAdmin ? 'Administration' : 'Clinical Tools'}
        </div>
        
        <nav className="flex flex-col gap-2">
          {!isAdmin && (
            <>
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-md'
                  }`
                }
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Dashboard
              </NavLink>

              <NavLink 
                to="/profile" 
                className={({isActive}) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-md'
                  }`
                }
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                  <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Profile
              </NavLink>

              <NavLink 
                to="/analytics" 
                className={({isActive}) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-md'
                  }`
                }
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                  <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 15L11 9L15 13L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Analytics
              </NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink 
              to="/admin" 
              className={({isActive}) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-md'
                }`
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M19.4 15C19.2669 14.515 19.1338 14.0375 19.0007 13.5676C18.5297 12.011 17.8315 10.5554 16.9362 9.25278C16.7347 8.91649 16.5332 8.58776 16.3317 8.2666C15.6329 7.13347 14.7987 6.10736 13.8563 5.21753C13.3916 4.77258 12.9018 4.35766 12.3899 3.97578C12.1564 3.79159 11.9194 3.61279 11.6791 3.43937C10.7129 2.68296 9.63714 2.101 8.5 1.71796C8.04363 1.57129 7.57761 1.44896 7.10419 1.35229C6.372 1.20203 5.62083 1.12778 4.8667 1.13128C4.00183 1.13546 3.15008 1.27204 2.33337 1.53576C2.33337 3.30952 2.77778 5.04762 3.61111 6.57143C4.44444 8.09524 5.63333 9.35476 7.05556 10.2222C8.47778 11.0897 10.0889 11.5333 11.7222 11.5111C13.3556 11.4889 14.9556 10.0016 16.3334 10.2222C16.6987 10.2825 17.0586 10.3676 17.4111 10.4766C18.1778 10.7079 18.9111 11.0317 19.6 11.4444" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Admin Dashboard
            </NavLink>
          )}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="mt-auto pt-6 border-t border-gray-200/40">
        <Button 
          onClick={handleLogout} 
          className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Logout
        </Button>
      </div>
    </aside>
  );
}