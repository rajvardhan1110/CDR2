import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "./ui/Button";
import Card from "./ui/Card";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", dob: "", age: "", bloodGroup: "", gender: "", otherHealthIssues: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Enhanced change handler: auto-calc age from DOB when DOB changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dob') {
      // compute age in years
      const dob = value ? new Date(value) : null;
      if (dob && !isNaN(dob.getTime())) {
        const diff = Date.now() - dob.getTime();
        const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        setForm({ ...form, dob: value, age: String(age) });
        return;
      }
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // client-side password constraints: minimum 8 characters
    if (!form.password || form.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    setIsLoading(true);
    try {
      // prepare payload with correct types (age as Number or undefined)
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        dob: form.dob || undefined,
        age: form.age ? Number(form.age) : undefined,
        bloodGroup: form.bloodGroup,
        gender: form.gender,
        otherHealthIssues: form.otherHealthIssues,
      };

      await axios.post("http://localhost:5000/api/auth/signup", payload);
      alert("Signup successful! Please sign in.");
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border border-white/60 shadow-2xl">
          {/* Medical-themed header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="white" strokeWidth="2"/>
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="white" strokeWidth="2"/>
                <path d="M19 10V7C19 5.34315 17.6569 4 16 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M5 10V7C5 5.34315 6.34315 4 8 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-green-700 bg-clip-text text-transparent">
              Join Our Platform
            </h2>
            <p className="text-gray-600 mt-2">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-400 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-400 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Create Password"
                  value={form.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-400 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm"
                />
                <p className="text-xs text-gray-500 mt-2">Password must be at least 8 characters. Use a mix of letters and numbers for better security.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    readOnly
                    aria-readonly="true"
                    title="Auto-calculated from DOB"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
                  />
                  {/* <p className="text-xs text-gray-400 mt-1">Age is auto-calculated from Date of Birth.</p> */}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:outline-none"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Gender</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Other health issues (diabetes, BP, etc.)</label>
                <textarea
                  name="otherHealthIssues"
                  value={form.otherHealthIssues}
                  onChange={handleInputChange}
                  placeholder="List any relevant medical conditions"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center animate-shake">
                <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-lg font-semibold transition-all duration-300 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/signin" 
                className="text-teal-600 hover:text-teal-700 font-semibold transition-colors duration-300 hover:underline"
              >
                Sign In Here
              </Link>
            </p>
          </div>

          {/* User features highlight */}
          {/* <div className="mt-6 space-y-3">
            <div className="flex items-center text-sm text-teal-700">
              <svg className="w-4 h-4 mr-2 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Access patient assessment tools
            </div>
            <div className="flex items-center text-sm text-teal-700">
              <svg className="w-4 h-4 mr-2 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Save and track patient progress
            </div>
            <div className="flex items-center text-sm text-teal-700">
              <svg className="w-4 h-4 mr-2 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Generate clinical reports
            </div>
          </div> */}
        </Card>
      </div>
    </div>
  );
}