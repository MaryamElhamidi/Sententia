import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import AssessmentCenter from './pages/AssessmentCenter';
import AdminAnalytics from './pages/AdminAnalytics';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="assessment" element={<AssessmentCenter />} />
          <Route path="admin" element={<AdminAnalytics />} />
          <Route path="compliance" element={<div style={{ padding: '2rem' }}>Compliance & Data Privacy Page Placeholder</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
