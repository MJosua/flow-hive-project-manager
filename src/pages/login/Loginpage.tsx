import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { resetLoginAttempts } from '@/store/slices/authSlice';
import Loginform from './form/Loginform';
import Forgotpassform from './form/Forgotpassform';
import Recoveryform from './form/Recoveryform';
import Lockedaccount from './form/Lockedaccount';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [forgotToggle, setForgotToggle] = useState(false);
  const [recoveryToggle, setRecoveryToggle] = useState(false);
  const [lockedAccount, setLockedAccount] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/service-catalog');
    }
  }, [isAuthenticated, navigate]);

  // Reset login attempts when toggling back to login
  useEffect(() => {
    if (!forgotToggle && !lockedAccount && !recoveryToggle) {
      dispatch(resetLoginAttempts());
    }
  }, [forgotToggle, lockedAccount, recoveryToggle, dispatch]);

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
