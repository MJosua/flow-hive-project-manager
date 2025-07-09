import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/sourceConfig';
import { loginSuccess } from '@/store/slices/authSlice';
import { useAppDispatch } from './useAppDispatch';

interface UseAuthCheckProps {
  userToken2?: string;
  setIsTokenExpiredModalOpen: (open: boolean) => void;
}

export const useAuthCheck = ({ userToken2, setIsTokenExpiredModalOpen }: UseAuthCheckProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userToken = userToken2 || localStorage.getItem('tokek');
  const hasRunRef = useRef(false);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const keepLogin = async () => {
      if (isRunningRef.current || hasRunRef.current) {
        console.log('[useAuthCheck] Already running or completed');
        return;
      }

      if (userToken && window.location.pathname !== '/login') {
        console.log('[useAuthCheck] Validating token...');
        isRunningRef.current = true;
        hasRunRef.current = true;

        try {
          const res = await axios.get(`${API_URL}/hots_auth/keepLogin`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });

          const tokek = res.data.tokek;
          const userData = res.data.userData;
          console.log('[useAuthCheck] keepLogin success:', userData);

          const normalizedUser = {
            user_id: userData.user_id,
            uid: userData.uid,
            username: userData.username ?? '',
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            role_name: userData.role_name ?? '',
            role_id: userData.role_id ?? 0,
            department_name: userData.department_name ?? '',
            department_id: userData.department_id ?? 0,
          };

          dispatch(loginSuccess({ user: normalizedUser, token: tokek }));
          localStorage.setItem('tokek', tokek);
          localStorage.setItem('user', JSON.stringify(normalizedUser));
        } catch (err) {
          console.error('[useAuthCheck] Token validation failed:', err);
          if (window.location.pathname !== '/login') {
            setIsTokenExpiredModalOpen(true);
          }
        } finally {
          isRunningRef.current = false;
        }
      }
    };

    if (!hasRunRef.current && window.location.pathname !== '/login') {
      keepLogin();
    }
  }, []);
};
