import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Settings from './pages/Settings';
import UserDetail from './pages/UserDetail';
import QuotationsList from './pages/QuotationsList';
import QuotationDetail from './pages/QuotationDetail';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/users/:id" element={<UserDetail />} />
          <Route path="/quotations/:clientId" element={<QuotationsList />} />
          <Route path="/quotations/:clientId/new" element={<QuotationDetail />} />
          <Route path="/quotations/:clientId/:id" element={<QuotationDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
