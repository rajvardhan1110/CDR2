import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import Button from "./ui/Button";
import Card from "./ui/Card";

export default function TestPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { testId: routeTestId } = useParams();
  const [groupedQuestions, setGroupedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [testId, setTestId] = useState(routeTestId || null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!token) return navigate("/signin");

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await api.get("/test/questions");
        const domains = res.data.questions || [];
        const seen = new Set();

        const groups = domains.map((domainObj, dIdx) => {
          const domainName = domainObj.domain || `Domain ${dIdx + 1}`;
          const questions = (domainObj.questions || []).map((q, qIdx) => {
            let uniqueId = q.id || `q-${dIdx}-${qIdx}`;
            let suffix = 1;
            while (seen.has(uniqueId)) uniqueId = `${q.id}-${suffix++}`;
            seen.add(uniqueId);
            return { uniqueId, qId: q.id || uniqueId, text: q.text || "No text" };
          });
          return { domain: domainName, questions };
        });

        setGroupedQuestions(groups);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [token, navigate]);

  // reset current index whenever questions change
  useEffect(() => {
    setCurrentIndex(0);
  }, [groupedQuestions]);

  useEffect(() => {
    if (!token) return navigate("/signin");

    const startOrResume = async () => {
      try {
        if (testId) return; // already set from route
        const res = await api.get("/test/my-tests");
        const unfinished = res.data.tests.find((t) => !t.finishedAt);
        if (unfinished) setTestId(unfinished._id || unfinished.id);
        else {
          const newTest = await api.post("/test/start");
          setTestId(newTest.data.testId);
        }
      } catch (err) {
        console.error(err);
      }
    };

    startOrResume();
  }, [token, navigate, testId]);

  // when we have a testId and the questions are loaded, fetch any saved answers
  useEffect(() => {
    const loadSavedAnswers = async () => {
      if (!testId || !groupedQuestions.length) return;

      try {
        const res = await api.get(`/test/results/${testId}`);
        const saved = res.data.test?.answers || [];

        // build a map from qId -> rating
        const savedMap = {};
        saved.forEach((a) => { if (a && a.qId) savedMap[a.qId] = a.rating; });

        // map saved qIds to our uniqueIds and set answers state
        const flat = groupedQuestions.flatMap((g) => g.questions);
        const mapped = {};
        flat.forEach((q) => {
          // q.qId is the original question id
          if (savedMap[q.qId] !== undefined) mapped[q.uniqueId] = Number(savedMap[q.qId]);
        });

        setAnswers((prev) => ({ ...mapped, ...prev }));

        // set currentIndex to next unanswered question (i.e., last answered + 1)
        const all = groupedQuestions.flatMap((g) => g.questions.map((q) => q.uniqueId));
        let lastAnswered = -1;
        all.forEach((uId, idx) => {
          if (mapped[uId] !== undefined) lastAnswered = idx;
        });
        const startIndex = Math.min(lastAnswered + 1, all.length - 1);
        setCurrentIndex(startIndex < 0 ? 0 : startIndex);
      } catch (err) {
        console.error("Failed to load saved answers", err);
      }
    };

    loadSavedAnswers();
  }, [testId, groupedQuestions]);

  const handleChange = (uniqueId, value) => {
    const numeric = parseFloat(value);
    setAnswers((prev) => ({ ...prev, [uniqueId]: numeric }));

    // persist this single answer to the server (merge)
    (async () => {
      try {
        // find qId for this uniqueId
        const flat = groupedQuestions.flatMap((g) => g.questions);
        const q = flat.find((qq) => qq.uniqueId === uniqueId);
        const qId = q?.qId || uniqueId;
        await api.post("/test/save", { testId, answers: [{ qId, rating: numeric }] });
      } catch (err) {
        // non-fatal; keep working offline
        console.error("Failed to save answer", err);
      }
    })();
  };

  const handleSubmit = async () => {
    if (!testId) return alert("No active test found");
    const allQuestions = groupedQuestions.flatMap((g) => g.questions);

    // ensure every question has an answer
    const allAnswered = allQuestions.every((q) => answers[q.uniqueId] !== undefined && answers[q.uniqueId] !== null);
    if (!allAnswered) return alert("Please answer all questions before submitting");

    const payload = allQuestions.map((q) => ({ qId: q.qId, rating: answers[q.uniqueId] || 0 }));

    try {
      await api.post("/test/submit", { testId, answers: payload });
      navigate(`/result/${testId}`);
    } catch (err) {
      console.error(err);
      alert("Submit failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium text-lg">Loading assessment questions...</p>
        </div>
      </div>
    );

  if (!groupedQuestions.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
        <Card className="p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                    stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Questions Available</h3>
          <p className="text-gray-600">Please contact support if this issue persists.</p>
        </Card>
      </div>
    );

  // flattened questions for single-question navigation
  const allQuestions = groupedQuestions.flatMap((g) =>
    g.questions.map((q) => ({ ...q, domain: g.domain }))
  );

  const total = allQuestions.length;
  const currentQuestion = allQuestions[currentIndex];

  // answered count (0 is a valid answer so check for undefined)
  const answeredCount = allQuestions.filter((q) => answers[q.uniqueId] !== undefined).length;

  // domain and question-in-domain calculations
  let domainIndex = 0;
  let qNumberInDomain = 0;
  let domainQuestions = [];
  if (currentQuestion) {
    domainQuestions = allQuestions.filter((q) => q.domain === currentQuestion.domain);
    qNumberInDomain = domainQuestions.findIndex((q) => q.uniqueId === currentQuestion.uniqueId) + 1;
    domainIndex = groupedQuestions.findIndex((g) => g.domain === currentQuestion.domain) + 1;
  }

  const severityOptions = [
    { label: 'None', val: 0, color: 'from-green-500 to-emerald-600', bgColor: 'bg-gradient-to-br from-green-500 to-emerald-600' },
    { label: 'Questionable', val: 0.5, color: 'from-lime-500 to-green-600', bgColor: 'bg-gradient-to-br from-lime-500 to-green-600' },
    { label: 'Mild', val: 1, color: 'from-amber-500 to-yellow-600', bgColor: 'bg-gradient-to-br from-amber-500 to-yellow-600' },
    { label: 'Moderate', val: 2, color: 'from-orange-500 to-amber-600', bgColor: 'bg-gradient-to-br from-orange-500 to-amber-600' },
    { label: 'Severe', val: 3, color: 'from-red-500 to-rose-600', bgColor: 'bg-gradient-to-br from-red-500 to-rose-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        {/* Header with Progress */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-down">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M12 3C13.1819 3 14.3522 3.23279 15.4442 3.68508C16.5361 4.13738 17.5282 4.80031 18.364 5.63604C19.1997 6.47177 19.8626 7.46392 20.3149 8.55585C20.7672 9.64778 21 10.8181 21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3Z" 
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                Clinical Assessment
              </h1>
              <p className="text-gray-600">Cognitive Dementia Rating Evaluation</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-cyan-700">Progress: {answeredCount}/{total}</span>
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(answeredCount / total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Question Card */}
        {currentQuestion && (
          <div className="h-[70vh] flex items-center justify-center animate-fade-in-up">
            <Card className="w-full rounded-3xl shadow-2xl p-10 bg-white/90 backdrop-blur-sm border border-white/60 hover:shadow-3xl transition-all duration-500" style={{ minHeight: '56vh' }}>
              <div className="flex flex-col h-full">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                        Question {currentIndex + 1} of {total}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        Domain {domainIndex}: {currentQuestion.domain}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Question {qNumberInDomain} of {domainQuestions.length} in this domain
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>

                {/* Question Content */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="max-w-4xl text-center w-full">
                    <p className="text-3xl leading-relaxed mb-12 text-gray-800 font-medium">
                      {currentQuestion.text}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 max-w-4xl mx-auto">
                      {severityOptions.map((opt) => {
                        const selected = answers[currentQuestion.uniqueId] === opt.val;
                        return (
                          <button
                            key={opt.val}
                            onClick={() => handleChange(currentQuestion.uniqueId, opt.val)}
                            className={`py-6 px-4 rounded-2xl font-semibold focus:outline-none transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                              selected 
                                ? `bg-gradient-to-br ${opt.color} text-white shadow-xl scale-105 border-2 border-white` 
                                : 'bg-white/80 text-gray-700 border-2 border-gray-200/60 hover:border-cyan-300/50'
                            }`}
                          >
                            <div className="text-lg font-semibold mb-1">{opt.label}</div>
                            <div className={`text-sm ${selected ? 'text-white/90' : 'text-gray-500'}`}>
                              Score: {opt.val}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200/40">
                  <div>
                    <Button
                      onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                      className={`mr-3 px-8 py-3 rounded-xl transition-all duration-300 ${
                        currentIndex === 0 
                          ? 'opacity-50 cursor-not-allowed bg-gray-400' 
                          : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      }`}
                      disabled={currentIndex === 0}
                    >
                       Previous
                    </Button>
                  </div>

                  <div>
                    {currentIndex < total - 1 ? (
                      <Button
                        onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
                        className={`px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                          answers[currentQuestion?.uniqueId] === undefined 
                            ? 'opacity-50 cursor-not-allowed bg-gray-400' 
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                        }`}
                        disabled={answers[currentQuestion?.uniqueId] === undefined}
                      >
                        Next Question 
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSubmit} 
                        className="px-8 py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                         Submit Assessment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}