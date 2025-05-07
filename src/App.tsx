import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StartupSubmission from './components/startup/StartupSubmission';
import StartupEvaluation from './components/evaluation/StartupEvaluation';
import InvestorDashboard from './components/investor/InvestorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/submit"
              element={
                <ProtectedRoute role="startup">
                  <StartupSubmission />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluation/:id"
              element={
                <ProtectedRoute role="startup">
                  <StartupEvaluation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/investor/dashboard"
              element={
                <ProtectedRoute role="investor">
                  <InvestorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App