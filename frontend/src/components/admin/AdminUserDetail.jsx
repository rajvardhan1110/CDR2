import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AuthContext } from '../../context/AuthContext';
import getSeverityForScore from '../../utils/severity';

export default function AdminUserDetail() {
  const { user } = useContext(AuthContext);
  const { userId, testId } = useParams();
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [domains, setDomains] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  useEffect(() => {
    if (!user || user.email !== 'admin@gmail.com') {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // fetch user info (admin endpoint)
        try {
          const uRes = await api.get(`/admin/users/${userId}`);
          setUserInfo(uRes.data.user || uRes.data);
        } catch (e) {
          console.warn('Failed to fetch admin user info', e);
        }

        // fetch tests for user
        try {
          const tRes = await api.get(`/admin/users/${userId}/tests`);
          const list = tRes.data.tests || tRes.data || [];
          setTests(list);

          if (testId) {
            // try to fetch specific test
            try {
              const single = await api.get(`/admin/users/${userId}/tests/${testId}`);
              setSelectedTest(single.data.test || single.data);
            } catch (e) {
              // fallback to selecting from list
              const found = list.find((x) => String(x._id) === String(testId) || String(x.id) === String(testId));
              if (found) setSelectedTest(found);
            }
          }
        } catch (e) {
          console.warn('Failed to fetch tests for user', e);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, userId, testId]);

  // use shared severity helper

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in-down">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              onClick={() => navigate('/admin')}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
               Back to Admin
            </Button>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="white" strokeWidth="2"/>
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent mb-2">
            User Profile
          </h1>
          <div className="mt-4">
            {userInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-4 md:col-span-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg text-white font-bold text-xl">
                    {userInfo.name ? (userInfo.name.split(' ').map(n=>n[0]).slice(0,2).join('')) : 'U'}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-800">{userInfo.name}</div>
                    <div className="text-sm text-gray-500">{userInfo.email}</div>
                    {/* <div className="text-xs text-gray-400 mt-1">Member ID: {String(userInfo._id || userInfo.id).slice(-6)}</div> */}
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white/80 border border-white/60 rounded-2xl">
                    <div className="text-xs text-gray-500">Date of Birth</div>
                    <div className="font-medium text-gray-800">{userInfo.dob ? new Date(userInfo.dob).toLocaleDateString() : '-'}</div>
                  </div>
                  <div className="p-3 bg-white/80 border border-white/60 rounded-2xl">
                    <div className="text-xs text-gray-500">Age</div>
                    <div className="font-medium text-gray-800">{userInfo.age ?? '-'}</div>
                  </div>
                  <div className="p-3 bg-white/80 border border-white/60 rounded-2xl">
                    <div className="text-xs text-gray-500">Blood Group</div>
                    <div className="font-medium text-gray-800">{userInfo.bloodGroup || '-'}</div>
                  </div>

                  <div className="p-3 bg-white/80 border border-white/60 rounded-2xl">
                    <div className="text-xs text-gray-500">Gender</div>
                    <div className="font-medium text-gray-800">{userInfo.gender || '-'}</div>
                  </div>
                  <div className="p-3 bg-white/80 border border-white/60 rounded-2xl sm:col-span-2">
                    <div className="text-xs text-gray-500">Other Health Issues</div>
                    <div className="font-medium text-gray-800">{userInfo.otherHealthIssues || '-'}</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-lg text-gray-600">User ID: {userId}</p>
            )}
          </div>
        </div>

        {/* When a test is selected, show two-column view; otherwise center the tests list */}
        {selectedTest ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-fade-in-up">
            {/* Tests List Sidebar */}
            <div className="xl:col-span-1">
              <Card className="p-6 bg-white/90 backdrop-blur-sm border border-white/60 shadow-xl sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Assessment History</h2>
                  <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-indigo-700">{tests.length}</span>
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {tests.map((t) => (
                      <Card 
                        key={t._id || t.id} 
                        className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/60 hover:border-indigo-300/50 transition-all duration-300 cursor-pointer"
                        onClick={() => navigate(`/result/${t._id || t.id}?userId=${userId}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 text-sm">
                              {new Date(t.startedAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-600">
                              {new Date(t.startedAt).toLocaleTimeString()}
                            </div>
                            {t.finishedAt && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                  Score: {t.score}
                                </span>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getSeverityForScore(t.score).className}`}>
                                  {getSeverityForScore(t.score).label}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className={`w-3 h-3 rounded-full ${
                            t.finishedAt ? 'bg-green-400' : 'bg-amber-400'
                          }`}></div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Test Details Main Content */}
            <div className="xl:col-span-3">
              <Card className="p-8 bg-white/90 backdrop-blur-sm border border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500">
                {/* Test Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M12 3C13.1819 3 14.3522 3.23279 15.4442 3.68508C16.5361 4.13738 17.5282 4.80031 18.364 5.63604C19.1997 6.47177 19.8626 7.46392 20.3149 8.55585C20.7672 9.64778 21 10.8181 21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3Z" 
                            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl">
                      <div className="text-2xl font-bold text-blue-600">{selectedTest.score}</div>
                      <div className="text-sm font-medium text-blue-700">Total Score</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-teal-50 to-green-50 border border-teal-200 rounded-2xl">
                      <div className="text-2xl font-bold text-teal-600">{answeredCount}/{totalQuestions || '?'}</div>
                      <div className="text-sm font-medium text-teal-700">Questions Answered</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
                      <div className={`text-lg font-bold px-4 py-2 rounded-full ${getSeverityForScore(selectedTest.score).className}`}>
                        {getSeverityForScore(selectedTest.score).label}
                      </div>
                      <div className="text-sm font-medium text-amber-700 mt-2">Overall Severity</div>
                    </div>
                  </div>
                </div>

                {/* Domain Analysis */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
                    Domain Analysis
                  </h3>
                  <div className="space-y-4">
                    {analytics.map((d, index) => (
                      <Card 
                        key={d.domain} 
                        className="p-6 bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/60 hover:border-indigo-300/50 transition-all duration-300 animate-fade-in-up"
                        style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <h4 className="text-lg font-semibold text-gray-800">{d.domain}</h4>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${d.severity.className}`}>
                                {d.severity.label}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="text-center p-3 bg-blue-50 rounded-xl">
                                <div className="text-lg font-bold text-blue-600">{d.answered}/{d.totalQuestions}</div>
                                <div className="text-xs text-blue-700">Questions</div>
                              </div>
                              <div className="text-center p-3 bg-teal-50 rounded-xl">
                                <div className="text-lg font-bold text-teal-600">{d.score}/{d.maxScore}</div>
                                <div className="text-xs text-teal-700">Score</div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Domain Progress</span>
                                <span>{d.percent}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                                    d.severity.color === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                    d.severity.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                                    d.severity.color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-amber-600' :
                                    'bg-gradient-to-r from-red-500 to-rose-600'
                                  }`}
                                  style={{ width: `${d.percent}%` }}
                                ></div>
                              </div>
                            </div>

                            {d.topQuestions && d.topQuestions.length > 0 && (
                              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                <h5 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" 
                                          stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                  </svg>
                                  Key Concerns
                                </h5>
                                <ul className="space-y-2">
                                  {d.topQuestions.map((t, idx) => (
                                    <li key={t.qId} className="text-sm text-amber-700 flex items-start gap-2">
                                      <span className="font-medium bg-amber-100 px-2 py-1 rounded text-xs mt-0.5">
                                        {t.rating}
                                      </span>
                                      <span>{t.text}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* All Answers */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
                    Detailed Responses
                  </h3>
                  <div className="space-y-3">
                    {(selectedTest.answers || []).map((a, index) => {
                      const domainObj = domains.find((d) => d.questions && d.questions.find((q) => q.id === a.qId));
                      const questionObj = domainObj?.questions.find((q) => q.id === a.qId);
                      const questionText = questionObj?.text || `Question ${a.qId}`;
                      const domainName = domainObj?.domain || null;

                      return (
                        <Card 
                          key={a.qId} 
                          className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:border-indigo-300/50 transition-all duration-300 animate-fade-in-up"
                          style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex-1">
                              <div className="font-medium text-gray-800 mb-1">{questionText}</div>
                              {domainName && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="px-2 py-1 bg-gray-100 rounded-full">{domainName}</span>
                                  <span>•</span>
                                  <span>{a.qId}</span>
                                </div>
                              )}
                            </div>
                            <div className={`px-4 py-2 rounded-full font-semibold text-center min-w-16 ${
                              a.rating === 0 ? 'bg-green-100 text-green-800 border border-green-200' :
                              a.rating === 0.5 ? 'bg-lime-100 text-lime-800 border border-lime-200' :
                              a.rating === 1 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              a.rating === 2 ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                              'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {a.rating}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div className="text-center pt-6 border-t border-gray-200/40">
                  <Button 
                    onClick={() => navigate(`/admin/user/${userId}`)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-3"
                  >
                    Back to User Profile
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          // Centered single-column list when no test selected
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <Card className="p-8 bg-white/90 backdrop-blur-sm border border-white/60 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">
                  Assessment History
                </h2>
                <p className="text-gray-600">Select an assessment to view detailed results</p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading assessment history...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {tests.map((t, index) => (
                    <Card 
                      key={t._id || t.id} 
                      className="p-6 bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/60 hover:border-indigo-300/50 transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in-up"
                      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                      onClick={() => navigate(`/result/${t._id || t.id}?userId=${userId}`)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                            t.finishedAt 
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                              : 'bg-gradient-to-br from-amber-500 to-orange-600'
                          }`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 8V12L14 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>

                          <div>
                            <div className="font-semibold text-gray-800">
                              {new Date(t.startedAt).toLocaleDateString()} • {new Date(t.startedAt).toLocaleTimeString()}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              {t.finishedAt ? (
                                <>
                                  <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                    Score: {t.score}
                                  </span>
                                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ml-2 ${getSeverityForScore(t.score).className}`}>
                                    {getSeverityForScore(t.score).label}
                                  </span>
                                  <span className="text-sm text-green-600 font-medium">Completed</span>
                                </>
                              ) : (
                                <span className="text-sm text-amber-600 font-medium">In Progress</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <Button 
                          onClick={() => navigate(`/result/${t._id || t.id}?userId=${userId}`)}
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                          View Assessment
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}