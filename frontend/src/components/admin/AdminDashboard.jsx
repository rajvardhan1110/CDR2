import React, { useEffect, useState, useContext } from 'react';
import api from '../../api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalTests: 0, avgScore: 0, activeUsers: 0 });

  useEffect(() => {
    if (!user || user.email !== 'admin@gmail.com') {
      navigate('/signin');
      return;
    }

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/users');
        const list = res.data.users || res.data || [];
        setUsers(list);

        // Calculate admin stats from the fetched list (not from state which may be stale)
        const totalTests = list.reduce((sum, u) => sum + (u.totalTests || 0), 0);
        const totalScore = list.reduce((sum, u) => sum + (u.avgScore || 0) * (u.totalTests || 0), 0);
        const avgScore = totalTests > 0 ? (totalScore / totalTests).toFixed(1) : 0;
        const activeUsers = list.filter((u) => (u.totalTests || 0) > 0).length;

        setStats({
          totalTests,
          avgScore,
          activeUsers,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="2"/>
              <path d="M19.4 15C19.2669 14.515 19.1338 14.0375 19.0007 13.5676C18.5297 12.011 17.8315 10.5554 16.9362 9.25278C16.7347 8.91649 16.5332 8.58776 16.3317 8.2666C15.6329 7.13347 14.7987 6.10736 13.8563 5.21753C13.3916 4.77258 12.9018 4.35766 12.3899 3.97578C12.1564 3.79159 11.9194 3.61279 11.6791 3.43937C10.7129 2.68296 9.63714 2.101 8.5 1.71796C8.04363 1.57129 7.57761 1.44896 7.10419 1.35229C6.372 1.20203 5.62083 1.12778 4.8667 1.13128C4.00183 1.13546 3.15008 1.27204 2.33337 1.53576C2.33337 3.30952 2.77778 5.04762 3.61111 6.57143C4.44444 8.09524 5.63333 9.35476 7.05556 10.2222C8.47778 11.0897 10.0889 11.5333 11.7222 11.5111C13.3556 11.4889 14.9556 10.0016 16.3334 10.2222C16.6987 10.2825 17.0586 10.3676 17.4111 10.4766C18.1778 10.7079 18.9111 11.0317 19.6 11.4444" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">
            Administration Dashboard
          </h1>
          <p className="text-lg text-gray-600">Manage healthcare and monitor clinical assessments</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-white to-indigo-50/50 border border-indigo-100/50 hover:border-indigo-200/80 transition-all duration-300 hover:shadow-xl animate-fade-in-up">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="white" strokeWidth="2"/>
                  <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{users.length}</div>
                <div className="text-sm font-medium text-indigo-700">Total Users</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-white to-purple-50/50 border border-purple-100/50 hover:border-purple-200/80 transition-all duration-300 hover:shadow-xl animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5C15 5.53043 14.7893 6.03914 14.4142 6.41421C14.0391 6.78929 13.5304 7 13 7H11C10.4696 7 9.96086 6.78929 9.58579 6.41421C9.21071 6.03914 9 5.53043 9 5Z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalTests}</div>
                <div className="text-sm font-medium text-purple-700">Total Assessments</div>
              </div>
            </div>
          </Card>
        </div>


        {/* Users List Section */}
        <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Clinical Users
              </h2>
              <p className="text-gray-600 mt-2">Manage clinical users and their assessment data</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-indigo-700">
                {users.length} User{users.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading User data...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                        stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Registered</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Healthcare professionals will appear here once they create accounts and start assessments.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {users.map((u, index) => (
                <Card 
                  key={u._id || u.email} 
                  className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:border-indigo-300/50 transition-all duration-300 hover:shadow-lg animate-fade-in-up"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="white" strokeWidth="2"/>
                          <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="white" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{u.name}</h3>
                            <p className="text-gray-600 text-sm">{u.email}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-center px-3 py-1 bg-blue-50 rounded-lg">
                              <div className="text-sm font-bold text-blue-600">{u.totalTests || 0}</div>
                              <div className="text-xs text-blue-700">Assessments</div>
                            </div>
                            <div className="text-center px-3 py-1 bg-teal-50 rounded-lg">
                              <div className="text-sm font-bold text-teal-600">{u.avgScore || 0}</div>
                              <div className="text-xs text-teal-700">Avg Score</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => navigate(`/admin/user/${u._id || u.email}`)}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 whitespace-nowrap"
                    >
                      View Profile
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}