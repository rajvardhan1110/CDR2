import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import Button from "./ui/Button";
import Card from "./ui/Card";
import getSeverityForScore from '../utils/severity';

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return navigate("/signin");

    const fetchTests = async () => {
      try {
        setLoading(true);
        const res = await api.get("/test/my-tests");
        setTests(res.data.tests || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [token, navigate]);

  const startTest = async () => {
    if (!token) return navigate("/signin");
    // Navigate to guidelines page where caretaker details are collected before starting
    navigate("/guidelines");
  };

  const hasPending = tests.some((t) => !t.finishedAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-6">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M12 3C13.1819 3 14.3522 3.23279 15.4442 3.68508C16.5361 4.13738 17.5282 4.80031 18.364 5.63604C19.1997 6.47177 19.8626 7.46392 20.3149 8.55585C20.7672 9.64778 21 10.8181 21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3Z" 
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent mb-4">
            Clinical Assessment Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage cognitive assessment tests and track progress with comprehensive clinical insights.
          </p>
        </div>

        {/* Start Test Section */}
        <div className="text-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Card className="p-8 bg-gradient-to-br from-white to-blue-50/50 border border-blue-100/50 max-w-2xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Begin New Assessment</h2>
              <p className="text-gray-600">
                Start a comprehensive clinical dementia rating evaluation.
              </p>
              <Button
                onClick={startTest}
                disabled={hasPending}
                className={`px-12 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  hasPending 
                    ? "bg-gray-400 cursor-not-allowed opacity-60" 
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {hasPending ? "Complete Pending Test First" : "Start New Assessment"}
              </Button>
              {hasPending && (
                <p className="text-sm text-amber-600 font-medium mt-2">
                  ⚠️ You have an ongoing assessment that needs completion
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Previous Tests Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Assessment History
              </h2>
              <p className="text-gray-600 mt-2">Review previous clinical evaluations and results</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-200 rounded-full">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-cyan-700">
                {tests.length} Assessment{tests.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading assessments...</p>
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
                Start your first clinical dementia rating assessment to begin tracking patient cognitive performance.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {tests.map((t, index) => (
                <Card 
                  key={t._id || t.id} 
                  className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:border-cyan-300/50 transition-all duration-300 hover:shadow-lg animate-fade-in-up"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
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
                        <p className="font-semibold text-gray-800">
                          Assessment • {new Date(t.startedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(t.startedAt).toLocaleTimeString()} • 
                          {t.finishedAt ? (
                            <span className="text-green-600 font-medium"> Completed</span>
                          ) : (
                            <span className="text-amber-600 font-medium"> In Progress</span>
                          )}
                        </p>
                        {t.finishedAt && t.score !== undefined && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                              Score: {t.score}
                            </span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getSeverityForScore(t.score).className}`}>
                              {getSeverityForScore(t.score).label}
                            </span>
                          </div>
                        )}
                        {t.caretaker?.name && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-teal-800">Caretaker: {t.caretaker.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {t.finishedAt ? (
                        <Button
                          onClick={() => navigate(`/result/${t._id || t.id}`)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                          View Results
                        </Button>
                      ) : (
                        <Button
                          onClick={() => navigate(`/test/${t._id || t.id}`)}
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                          Continue Assessment
                        </Button>
                      )}
                    </div>
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