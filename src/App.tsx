import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster as Sonner } from "./components/ui/sonner";
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from "./components/theme-provider";
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import TournamentsPage from './pages/TournamentsPage';
import TransactionsPage from './pages/TransactionsPage';
import SettingsPage from './pages/SettingsPage';
import HandHistoryPage from './pages/HandHistoryPage';
import TournamentDetailPage from './pages/TournamentDetailPage';
import SendNotificationPage from './pages/SendNotificationPage';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Sonner />
          <Router>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<EmailVerificationPage />} />
                
                {/* Protected admin routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<DashboardPage />} />
                    <Route path="/admin/users" element={<UsersPage />} />
                    <Route path="/admin/tournaments" element={<TournamentsPage />} />
                    <Route path="/admin/transactions" element={<TransactionsPage />} />
                    <Route path="/admin/settings" element={<SettingsPage />} />
                    <Route path="/admin/hand-history" element={<HandHistoryPage />} />
                    <Route path="/admin/tournaments/:id" element={<TournamentDetailPage />} />
                    <Route path="/admin/send-notification" element={<SendNotificationPage />} />
                  </Route>
                </Route>
                
                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </AuthProvider>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
