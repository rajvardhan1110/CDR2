import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import TestPage from "./components/TestPage";
import ResultPage from "./components/ResultPage";
import Guidelines from "./components/Guidelines";
import { AuthContext } from "./context/AuthContext";
import Profile from "./components/Profile";
import Analytics from "./components/Analytics";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUserDetail from "./components/admin/AdminUserDetail";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const { token, loading } = useContext(AuthContext);
  const { user, logout } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // small guard to hide header on specific public auth routes
  function HeaderGuard(props) {
    const location = useLocation();
    const hideOn = ["/", "/signin", "/signup"];
    if (hideOn.includes(location.pathname)) return null;
    return <Header {...props} />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <HeaderGuard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1">
          {token && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />}
          <main className="flex-1 p-4">
            <Routes>
                <Route
                  path="/"
                  element={
                    token ? (
                      user?.email === 'admin@gmail.com' ? (
                        <Navigate to="/admin" />
                      ) : (
                        <Navigate to="/dashboard" />
                      )
                    ) : (
                      <Home />
                    )
                  }
                />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/signin" />} />
              <Route path="/guidelines" element={token ? <Guidelines /> : <Navigate to="/signin" />} />
              <Route path="/profile" element={token ? <Profile /> : <Navigate to="/signin" />} />
              <Route path="/analytics" element={token ? <Analytics /> : <Navigate to="/signin" />} />
              <Route path="/test/:testId?" element={token ? <TestPage /> : <Navigate to="/signin" />} />
              <Route path="/result/:testId" element={token ? <ResultPage /> : <Navigate to="/signin" />} />
              <Route path="/admin" element={token ? <AdminDashboard /> : <Navigate to="/signin" />} />
              <Route path="/admin/user/:userId" element={token ? <AdminUserDetail /> : <Navigate to="/signin" />} />
              <Route path="/admin/user/:userId/test/:testId" element={token ? <AdminUserDetail /> : <Navigate to="/signin" />} />
              <Route path="*" element={<Navigate to={token ? "/dashboard" : "/signin"} />} />
            </Routes>
          </main>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
