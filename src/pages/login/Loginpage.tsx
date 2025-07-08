
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

  // Clear any existing token validation when entering login page
  useEffect(() => {
    console.log('Login page mounted, auth state:', isAuthenticated);
  }, []);

  // Handle redirect only once when authenticated
  useEffect(() => {
    if (isAuthenticated && !hasRedirected) {
      console.log('User is authenticated, redirecting to dashboard...');
      setHasRedirected(true);
      
      // Use a timeout to ensure state is settled before navigation
      const timeoutId = setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, hasRedirected, navigate]);

  // Reset login attempts when going back to login
  useEffect(() => {
    if (!forgotToggle && !lockedAccount) {
      dispatch(resetLoginAttempts());
    }
  }, [forgotToggle, lockedAccount, dispatch]);

  // Reset redirect flag when leaving authentication
  useEffect(() => {
    if (!isAuthenticated) {
      setHasRedirected(false);
    }
  }, [isAuthenticated]);

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
