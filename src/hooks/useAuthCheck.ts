
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import axios from 'axios';
import { API_URL } from '../config/sourceConfig';
import { loginSuccess } from '@/store/slices/authSlice';

interface UseAuthCheckProps {
  userToken2?: string;
  setIsTokenExpiredModalOpen: (open: boolean) => void;
}

export const useAuthCheck = ({ userToken2, setIsTokenExpiredModalOpen }: UseAuthCheckProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userToken = localStorage.getItem('tokek');
  const hasRunRef = useRef(false);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const keepLogin = async () => {
      // Prevent multiple simultaneous calls
      if (isRunningRef.current || hasRunRef.current) {
        console.log('keepLogin: already running or completed');
        return;
      }

      // Only run if we have a token and we're not on the login page
      if (userToken && window.location.pathname !== '/login') {
        console.log('keepLogin: starting token validation');
        isRunningRef.current = true;
        hasRunRef.current = true; // Mark as run immediately to prevent re-runs
        
        try {
          const res = await axios.get(`${API_URL}/hots_auth/keepLogin`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });

          localStorage.setItem("tokek", res.data.tokek);
          const userData = res.data.userData;

          if (userData.uid) {
            // Put user data to payload using the action creator
            dispatch(loginSuccess({
              user: userData,
              token: res.data.tokek
            }));
            console.log('keepLogin: token validated successfully');
          }
        } catch (err) {
          console.error('Keep login error:', err);
          // Only show modal if we're not on login page
          if (window.location.pathname !== '/login') {
            setIsTokenExpiredModalOpen(true);
          }
        } finally {
          isRunningRef.current = false;
        }
      }
    };

    // Only run once when component mounts and not on login page
    if (!hasRunRef.current && window.location.pathname !== '/login') {
      keepLogin();
    }
  }, []); // Remove all dependencies to prevent re-runs

  // Don't reset when token changes to prevent loops
};
