import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import Button from "./ui/Button";
import Card from "./ui/Card";

export default function ResultPage() {
  const { token } = useContext(AuthContext);
  const { testId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [domains, setDomains] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  useEffect(() => {
    if (!token) return navigate("/signin");
    const fetchResult = async () => {
      try {
        const userId = searchParams.get('userId');
        // if admin context (we rely on backend admin routes) and a userId is present, fetch via admin endpoint
        if (userId) {
          try {
            const res = await api.get(`/admin/users/${userId}/tests/${testId}`);
            setResult(res.data.test);
            // try fetch user info for display
            try {
              const usersRes = await api.get('/admin/users');
              const u = (usersRes.data.users || []).find((x) => String(x._id) === String(userId) || String(x.id) === String(userId));
              if (u) setUserInfo(u);
            } catch (e) {
              // ignore
            }
            return;
          } catch (e) {
            // fallback to normal endpoint
            console.warn('admin fetch failed, falling back', e);
          }
        }

        const res = await api.get(`/test/results/${testId}`);
        setResult(res.data.test);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResult();
  }, [token, testId, navigate]);

  // when result is loaded, fetch domain/question metadata to compute per-domain analytics
  useEffect(() => {
    if (!result) return;

    const fetchDomainsAndCompute = async () => {
      try {
        const res = await api.get("/domains");
        const domainList = res.data || [];
        setDomains(domainList);

        // flatten questions with domain info
        const qMap = {};
        let totalQ = 0;
        domainList.forEach((d) => {
          (d.questions || []).forEach((q) => {
            qMap[q.id] = { text: q.text, domain: d.domain };
            totalQ += 1;
          });
        });

        setTotalQuestions(totalQ);

        const answers = result.answers || [];
        setAnsweredCount(answers.filter((a) => a.rating !== undefined && a.rating !== null).length);

        // compute per-domain analytics
        const byDomain = domainList.map((d) => {
          const qIds = (d.questions || []).map((q) => q.id);
          const domainAnswers = answers.filter((a) => qIds.includes(a.qId));
          const answered = domainAnswers.length;
          const score = domainAnswers.reduce((s, a) => s + (Number(a.rating) || 0), 0);
          const maxScore = qIds.length * 3; // each question max 3
          const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

          // severity for domain based on percent
          const getDomSeverity = () => {
            if (percent <= 15) return { label: "None / Normal", className: "bg-green-100 text-green-800 border border-green-200", color: "green" };
            if (percent <= 40) return { label: "Questionable / Very Mild", className: "bg-yellow-100 text-yellow-800 border border-yellow-200", color: "yellow" };
            if (percent <= 60) return { label: "Mild", className: "bg-orange-100 text-orange-800 border border-orange-200", color: "orange" };
            if (percent <= 85) return { label: "Moderate", className: "bg-red-100 text-red-800 border border-red-200", color: "red" };
            return { label: "Severe", className: "bg-red-800 text-white border border-red-900", color: "red" };
          };

          // top concerning questions (highest ratings)
          const topQuestions = domainAnswers
            .slice()
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3)
            .map((a) => ({ qId: a.qId, rating: a.rating, text: qMap[a.qId]?.text || a.qId }));

          return {
            domain: d.domain,
            totalQuestions: qIds.length,
            answered,
            score,
            maxScore,
            percent,
            severity: getDomSeverity(),
            topQuestions,
          };
        });

        setAnalytics(byDomain);
      } catch (err) {
        console.error("Failed to fetch domains for analytics", err);
      }
    };

    fetchDomainsAndCompute();
  }, [result]);

  if (!result)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium text-lg">Loading assessment results...</p>
        </div>
      </div>
    );

  const { score = 0, answers = [] } = result;

  const overallSeverity = () => {
    if (score <= 9) return { label: "None / Normal", className: "bg-green-100 text-green-800 border border-green-200", color: "green" };
    if (score <= 22) return { label: "Questionable / Very Mild", className: "bg-yellow-100 text-yellow-800 border border-yellow-200", color: "yellow" };
    if (score <= 45) return { label: "Mild", className: "bg-orange-100 text-orange-800 border border-orange-200", color: "orange" };
    if (score <= 67) return { label: "Moderate", className: "bg-red-100 text-red-800 border border-red-200", color: "red" };
    return { label: "Severe", className: "bg-red-800 text-white border border-red-900", color: "red" };
  };

  const overall = overallSeverity();

  const getSeverity = () => {
    if (score <= 9) return { label: "None / Normal", className: "bg-green-100 text-green-800 border border-green-200" };
    if (score <= 22) return { label: "Questionable / Very Mild", className: "bg-yellow-100 text-yellow-800 border border-yellow-200" };
    if (score <= 45) return { label: "Mild", className: "bg-orange-100 text-orange-800 border border-orange-200" };
    if (score <= 67) return { label: "Moderate", className: "bg-red-100 text-red-800 border border-red-200" };
    return { label: "Severe", className: "bg-red-800 text-white border border-red-900" };
  };

  const severity = getSeverity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-6 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M12 3C13.1819 3 14.3522 3.23279 15.4442 3.68508C16.5361 4.13738 17.5282 4.80031 18.364 5.63604C19.1997 6.47177 19.8626 7.46392 20.3149 8.55585C20.7672 9.64778 21 10.8181 21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3Z" 
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-4">
            Assessment Complete
          </h1>
          <p className="text-lg text-gray-600">Clinical Dementia Rating Results & Analysis</p>
        </div>

        <Card className="p-8 bg-white/90 backdrop-blur-sm border border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in-up">
          {/* Overall Score Section */}
          <div className="text-center mb-12">
            {userInfo ? (
              <div className="mb-6 p-4 bg-cyan-50 border border-cyan-200 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  
                  {/* User Info */}
                  <div className="text-left md:text-left">
                    <div className="font-semibold text-cyan-800 text-lg">
                      {userInfo.name}
                    </div>
                    <div className="text-sm text-cyan-600">{userInfo.email}</div>
                  </div>

                  {/* Caretaker Info */}
                  <div className="bg-white border border-cyan-100 rounded-xl p-4 shadow-sm w-full md:w-auto">
                      <div className="text-medium text-gray-500 mb-3 text-left">Caretaker</div>

                      {result?.caretaker ? (
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-left">
                          <div className="font-medium text-gray-800">Name:</div>
                          <div>{result.caretaker.name || "-"}</div>

                          <div className="font-medium text-gray-800">Gender:</div>
                          <div>{result.caretaker.gender || "-"}</div>

                          <div className="font-medium text-gray-800">Age:</div>
                          <div>{result.caretaker.age || "-"}</div>

                          <div className="font-medium text-gray-800">Mobile:</div>
                          <div>{result.caretaker.mobile || "-"}</div>

                          <div className="font-medium text-gray-800">Email:</div>
                          <div>{result.caretaker.email || "-"}</div>

                          <div className="font-medium text-gray-800">Relation:</div>
                          <div>{result.caretaker.relation || "-"}</div>
                        </div>
                      ) : (
                        <div className="text-gray-600">-</div>
                      )}
                    </div>

                </div>
              </div>
            ) : null}



            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">{score}</div>
                <div className="text-sm font-medium text-blue-700">Total Score</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-teal-50 to-green-50 border border-teal-200 rounded-2xl">
                <div className="text-3xl font-bold text-teal-600 mb-2">{answeredCount}/{totalQuestions || "?"}</div>
                <div className="text-sm font-medium text-teal-700">Questions Answered</div>
              </div>
              <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
                <div className={`text-xl font-bold px-4 py-2 rounded-full ${overall.className}`}>
                  {overall.label}
                </div>
                <div className="text-sm font-medium text-amber-700 mt-2">Overall Severity</div>
              </div>
            </div>
          </div>

          {/* Domain Analysis Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Domain Analysis
              </h2>
              {result?.caretaker?.name && (
                <div className="text-sm text-gray-600">
  <span className="font-bold text-gray-800">CareTaker:</span>{" "}
  <span className="font-medium text-gray-800">{result.caretaker.name}</span>
</div>

              )}
              <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-teal-700">
                  {analytics.length} Domain{analytics.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {analytics.map((d, index) => (
                <Card 
                  key={d.domain} 
                  className="p-6 bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/60 hover:border-cyan-300/50 transition-all duration-300 hover:shadow-lg animate-fade-in-up"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">{d.domain}</h3>
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
                          <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" 
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Key Concerns
                          </h4>
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

          {/* All Answers Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
              Detailed Responses
            </h2>
            <div className="space-y-3">
              {answers.map((a, index) => {
                const domainObj = domains.find((d) => d.questions && d.questions.find((q) => q.id === a.qId));
                const questionObj = domainObj?.questions.find((q) => q.id === a.qId);
                const questionText = questionObj?.text || `Question ${a.qId}`;
                const domainName = domainObj?.domain || null;

                return (
                  <Card 
                    key={a.qId} 
                    className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:border-cyan-300/50 transition-all duration-300 hover:shadow-md animate-fade-in-up"
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

          {/* Back to Dashboard */}
          <div className="text-center pt-6 border-t border-gray-200/40">
            <Button
              onClick={() => {
                const userId = searchParams.get('userId');
                if (userId) return navigate(`/admin/user/${userId}`);
                return navigate('/dashboard');
              }}
              className="px-8 py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Return to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}