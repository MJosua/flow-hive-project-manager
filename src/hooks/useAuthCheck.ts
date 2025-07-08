
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
        return;
      }

      if (userToken) {
        isRunningRef.current = true;
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
            hasRunRef.current = true;
          }
        } catch (err) {
          console.error('Keep login error:', err);
          setIsTokenExpiredModalOpen(true);
        } finally {
          isRunningRef.current = false;
        }
      }
    };

    // Only run once when component mounts
    if (!hasRunRef.current) {
      keepLogin();
    }
  }, []); // Remove dependencies to prevent re-runs

  // Reset when token changes
  useEffect(() => {
    hasRunRef.current = false;
  }, [userToken]);
};
