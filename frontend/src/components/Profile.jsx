import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import Card from './ui/Card';
import Button from './ui/Button';
import getSeverityForScore from '../utils/severity';

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState(user);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get('/test/my-tests');
        setTests(res.data.tests || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  // Ensure we have the latest full user profile (includes DOB, age, bloodGroup, gender, otherHealthIssues)
  useEffect(() => {
    if (!token) {
      setProfileUser(null);
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data?.user) setProfileUser(res.data.user);
      } catch (err) {
        // keep existing user if call fails
        console.error('Failed to load profile:', err?.response?.data || err.message);
      }
    };

    // If we don't have patient fields locally, fetch fresh profile
    if (!user || !user.dob || !user.bloodGroup) {
      loadProfile();
    } else {
      // keep context user as baseline
      setProfileUser(user);
    }
  }, [token, user]);

  const completedTests = tests.filter(t => t.finishedAt).length;
  const avgScore = completedTests > 0 
    ? (tests.reduce((sum, t) => sum + (t.score || 0), 0) / completedTests).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="white" strokeWidth="2"/>
              <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent mb-4">
            User Profile
          </h1>
          <p className="text-lg text-gray-600">Your clinical assessment overview and performance metrics</p>
        </div>

        {/* Profile Overview Card */}
        <Card className="p-8 bg-white/90 backdrop-blur-sm border border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 mb-8 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{tests.length}</div>
              <div className="text-sm font-medium text-blue-700">Total Assessments</div>
            </div>
            <div className="text-center p-6 bg-linear-to-br from-teal-50 to-green-50 border border-teal-200 rounded-2xl">
              <div className="text-3xl font-bold text-teal-600 mb-2">{completedTests}</div>
              <div className="text-sm font-medium text-teal-700">Completed</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
              <div className="text-3xl font-bold text-amber-600 mb-2">{avgScore}</div>
              <div className="text-sm font-medium text-amber-700">Avg Score</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Personal Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-600">Full Name</span>
                  <span className="font-semibold text-gray-800">{profileUser?.name}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-600">Email Address</span>
                  <span className="font-semibold text-gray-800">{profileUser?.email}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-600">Account Type</span>
                  <span className="font-semibold text-purple-600">patient+caretaker</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-600">Date of Birth</span>
                  <span className="font-semibold text-gray-800">{profileUser?.dob ? new Date(profileUser.dob).toLocaleDateString() : '-'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-600">Age</span>
                  <span className="font-semibold text-gray-800">{profileUser?.age ?? '-'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-600">Blood Group</span>
                  <span className="font-semibold text-gray-800">{profileUser?.bloodGroup || '-'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-600">Gender</span>
                  <span className="font-semibold text-gray-800">{profileUser?.gender || '-'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-600">Other Health Issues</span>
                  <span className="font-semibold text-gray-800">{profileUser?.otherHealthIssues || '-'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M12 3C13.1819 3 14.3522 3.23279 15.4442 3.68508C16.5361 4.13738 17.5282 4.80031 18.364 5.63604C19.1997 6.47177 19.8626 7.46392 20.3149 8.55585C20.7672 9.64778 21 10.8181 21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3Z" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                User Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="font-medium text-blue-600">Member Since</span>
                  <span className="font-semibold text-blue-800">{new Date().getFullYear()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-teal-50 rounded-xl">
                  <span className="font-medium text-teal-600">Completion Rate</span>
                  <span className="font-semibold text-teal-800">
                    {tests.length > 0 ? Math.round((completedTests / tests.length) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                  <span className="font-medium text-purple-600">Active Assessments</span>
                  <span className="font-semibold text-purple-800">{tests.length - completedTests}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Tests Section */}
        <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Assessment History
              </h2>
              <p className="text-gray-600 mt-2">Your recent clinical evaluations and results</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-purple-700">
                {tests.length} Assessment{tests.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading assessment history...</p>
              </div>
            </div>
          ) : tests.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                        stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Assessments Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Start your first clinical dementia rating assessment to build your professional portfolio.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tests.map((t, index) => (
                <Card 
                  key={t._id || t.id} 
                  className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:border-purple-300/50 transition-all duration-300 hover:shadow-lg animate-fade-in-up"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                        t.finishedAt 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                          : 'bg-gradient-to-br from-amber-500 to-orange-600'
                      }`}>
                        {t.finishedAt ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M12 3C13.1819 3 14.3522 3.23279 15.4442 3.68508C16.5361 4.13738 17.5282 4.80031 18.364 5.63604C19.1997 6.47177 19.8626 7.46392 20.3149 8.55585C20.7672 9.64778 21 10.8181 21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3Z" 
                                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12L14 14M12 3C13.1819 3 14.3522 3.23279 15.4442 3.68508C16.5361 4.13738 17.5282 4.80031 18.364 5.63604C19.1997 6.47177 19.8626 7.46392 20.3149 8.55585C20.7672 9.64778 21 10.8181 21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3Z" 
                                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {new Date(t.startedAt).toLocaleDateString()} • {new Date(t.startedAt).toLocaleTimeString()}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          {t.finishedAt ? (
                            <>
                              <span className="text-sm font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                Score: {t.score}
                              </span>
                              <span className="text-sm text-green-600 font-medium">Completed</span>
                            </>
                          ) : (
                            <span className="text-sm text-amber-600 font-medium">In Progress</span>
                          )}
                          {t.caretaker?.name && (
                            <div className="ml-3">
                              <span className="text-sm font-medium text-blue-800">
  <span className="font-bold">CareTaker:</span> {t.caretaker.name}
</span>

                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => window.location.href = `/result/${t._id || t.id}`}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      View Details
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