import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import Card from './ui/Card';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
              Clinical Dementia Rating
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              A comprehensive clinical tool to assess cognitive and functional performance. 
              Designed for healthcare professionals to efficiently evaluate and monitor patient outcomes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signin" className="group">
              <Button className="px-10 py-4 rounded-xl text-lg font-semibold shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                Sign In
              </Button>
            </Link>
            <Link to="/signup" className="group">
              <Button className="px-10 py-4 rounded-xl text-lg font-semibold bg-white/80 text-cyan-600 border-2 border-cyan-200 hover:bg-white hover:border-cyan-300 hover:shadow-2xl transition-all duration-300">
                Sign Up
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm text-cyan-600 font-medium">
            <span className="flex items-center gap-2 hover:text-cyan-700 cursor-pointer transition-colors">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              Start New Assessment
            </span>
            <span className="flex items-center gap-2 hover:text-cyan-700 cursor-pointer transition-colors">
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              Resume Saved
            </span>
            <span className="flex items-center gap-2 hover:text-cyan-700 cursor-pointer transition-colors">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              View Results
            </span>
          </div>
        </div>

        {/* Right Card */}
       {/* Right Card */}
      <div className="flex justify-center animate-float">
        <Card className="p-10 w-full max-w-md bg-gradient-to-br from-white to-blue-50/50 border border-blue-100/50">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* CDR Icon */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 16H10M12 14V18M8 20H16C17.1046 20 18 19.1046 18 18V6C18 4.89543 17.1046 4 16 4H8C6.89543 4 6 4.89543 6 6V18C6 19.1046 6.89543 20 8 20Z" 
                        stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 4V3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V4" 
                        stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Alzimer Test
              </h3>

              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                6 Main Domains of CDR
              </h3>
              <ul className="text-gray-600 leading-relaxed text-left space-y-2 list-disc list-inside">
                <li>Memory</li>
                <li>Orientation</li>
                <li>Judgment & Problem Solving</li>
                <li>Community Affairs</li>
                <li>Home & Hobbies</li>
                <li>Personal Care</li>
              </ul>
            </div>
            
            <div className="flex gap-4 text-sm font-medium">
              <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full">Patient</span>
              <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full">Caretaker</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Clinician</span>
            </div>
          </div>
        </Card>
      </div>

      </div>
    </div>
  );
}