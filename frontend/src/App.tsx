import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import PatientsList from './pages/PatientsList.tsx';
import NewPatient from './pages/NewPatient.tsx';
import PatientDetails from './pages/PatientDetails.tsx';
import Reports from './pages/Reports.tsx';
import DailyEntry from './pages/DailyEntry.tsx';
import LabEntry from './pages/LabEntry.tsx';
import DailyRecordDetails from './pages/DailyRecordDetails.tsx';
import LabRecordDetails from './pages/LabRecordDetails.tsx';
import axios from 'axios';

// Set up global axios request interceptor to attach JWT token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('icu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Setup React Query client
const queryClient = new QueryClient();

// Protected Route Guard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('icu_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Secure Portal Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patients" 
            element={
              <ProtectedRoute>
                <PatientsList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/new-patient" 
            element={
              <ProtectedRoute>
                <NewPatient />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/:id" 
            element={
              <ProtectedRoute>
                <PatientDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/daily-entry" 
            element={
              <ProtectedRoute>
                <DailyEntry />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/lab-entry" 
            element={
              <ProtectedRoute>
                <LabEntry />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/daily-record/:id" 
            element={
              <ProtectedRoute>
                <DailyRecordDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/lab-record/:id" 
            element={
              <ProtectedRoute>
                <LabRecordDetails />
              </ProtectedRoute>
            } 
          />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
