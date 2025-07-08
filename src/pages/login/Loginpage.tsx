
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { resetLoginAttempts } from '@/store/slices/authSlice';
import Loginform from './form/Loginform';
import Forgotpassform from './form/Forgotpassform';
import Lockedaccount from './form/Lockedaccount';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [forgotToggle, setForgotToggle] = useState(false);
  const [lockedAccount, setLockedAccount] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null);

  // Single redirect logic - only redirect once when authenticated
  useEffect(() => {
    if (isAuthenticated && !hasRedirected) {
      setHasRedirected(true);
      
      // Clear any existing timeout
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
      
      // Use setTimeout to prevent multiple rapid navigation calls
      const timeout = setTimeout(() => {
        console.log('Redirecting to dashboard...');
        navigate('/', { replace: true });
      }, 500); // Slightly longer delay to ensure state is settled
      
      setRedirectTimeout(timeout);
    }
  }, [isAuthenticated, hasRedirected, navigate, redirectTimeout]);

  // Reset login attempts when going back to login
  useEffect(() => {
    if (!forgotToggle && !lockedAccount) {
      dispatch(resetLoginAttempts());
    }
  }, [forgotToggle, lockedAccount, dispatch]);

  // Reset redirect flag when authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      setHasRedirected(false);
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
        setRedirectTimeout(null);
      }
    }
  }, [isAuthenticated, redirectTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [redirectTimeout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-0 to-blue-100 flex items-center justify-center p-4">
      {!forgotToggle && !lockedAccount && (
        <Loginform
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          credentials={credentials}
          setCredentials={setCredentials}
          setForgotToggle={setForgotToggle}
          setLockedAccount={setLockedAccount}
        />
      )}

      {forgotToggle && !lockedAccount && (
        <Forgotpassform
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          credentials={credentials}
          setCredentials={setCredentials}
          setForgotToggle={setForgotToggle}
        />
      )}

      {lockedAccount && (
        <Lockedaccount
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          credentials={credentials}
          setCredentials={setCredentials}
          setForgotToggle={setForgotToggle}
          setLockedAccount={setLockedAccount}
        />
      )}
    </div>
  );
};

export default Login;
