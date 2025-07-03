import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import EmailVerificationInput from '../components/EmailVerificationInput';
import axios from 'axios';
import { API_BASE_URL } from "../lib/constants";

const EmailVerificationPage: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email;
  const [isLoading, setIsLoading] = useState(false);
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  if (!email) {
    navigate('/register');
    return null;
  }

  const handleComplete = async (code: string) => {
    setIsLoading(true);
    try {
      await verifyEmail(email, code);
      toast.success('Email Verified!', {
        description: 'You can now log in with your credentials.',
      });
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.message || 'Verification failed. Please try again.';
      toast.error('Verification Failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/resend-verification`, { email });
      toast.success('A new verification code has been sent!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <EmailVerificationInput
        onComplete={handleComplete}
        onResend={handleResend}
        email={email}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EmailVerificationPage; 