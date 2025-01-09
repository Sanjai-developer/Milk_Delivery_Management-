import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerList from './pages/CustomerList';
import AddCustomer from './pages/AddCustomer';
import EditCustomer from './pages/EditCustomer';
import CustomerHistory from './pages/CustomerHistory';
import DailyDelivery from './pages/DailyDelivery';
import DeliveryHistory from './pages/DeliveryHistory';
import Billing from './pages/Billing';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <CustomerList />
                </ProtectedRoute>
              } />
              <Route path="/customers/add" element={
                <ProtectedRoute>
                  <AddCustomer />
                </ProtectedRoute>
              } />
              <Route path="/customers/edit/:id" element={
                <ProtectedRoute>
                  <EditCustomer />
                </ProtectedRoute>
              } />
              <Route path="/customers/history/:id" element={
                <ProtectedRoute>
                  <CustomerHistory />
                </ProtectedRoute>
              } />
              <Route path="/daily-delivery" element={
                <ProtectedRoute>
                  <DailyDelivery />
                </ProtectedRoute>
              } />
              <Route path="/delivery-history" element={
                <ProtectedRoute>
                  <DeliveryHistory />
                </ProtectedRoute>
              } />
              <Route path="/billing" element={
                <ProtectedRoute>
                  <Billing />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;