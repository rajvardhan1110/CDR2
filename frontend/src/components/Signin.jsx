import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Button from "./ui/Button";
import baseURL from "../config";
import Card from "./ui/Card";

export default function Signin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await axios.post(`${baseURL}/auth/signin`, form);
      // pass user object to login so AuthContext stores user immediately
      const userObj = res.data.user;
      login(res.data.token, userObj);
      // if admin, go to admin dashboard directly
      if (userObj && userObj.email === 'admin@gmail.com') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || "Signin failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border border-white/60 shadow-2xl">
          {/* Medical-themed header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7C16 6.44772 15.5523 6 15 6H9C8.44772 6 8 6.44772 8 7C8 7.55228 8.44772 8 9 8H15C15.5523 8 16 7.55228 16 7Z" fill="white"/>
                <path d="M17 11C17 10.4477 16.5523 10 16 10H8C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12H16C16.5523 12 17 11.5523 17 11Z" fill="white"/>
                <path d="M16 15C16 14.4477 15.5523 14 15 14H9C8.44772 14 8 14.4477 8 15C8 15.5523 8.44772 16 9 16H15C15.5523 16 16 15.5523 16 15Z" fill="white"/>
                <path d="M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-600 mt-2">Access your clinical dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm"
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
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors duration-300 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Quick role hint */}
          {/* <div className="mt-6 p-4 bg-cyan-50 rounded-xl border border-cyan-100">
            <p className="text-sm text-cyan-700 text-center">
              <strong>Clinician Access:</strong> Sign in with your registered credentials
            </p>
          </div> */}
        </Card>
      </div>
    </div>
  );
}