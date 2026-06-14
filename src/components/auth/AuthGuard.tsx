import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../utils/storage';

/**
 * AuthGuard — Protects dashboard routes.
 *
 * Uses AuthContext's reactive isAuthenticated state as the primary signal,
 * with a localStorage fallback for the initial page load before the context
 * has mounted (e.g. on a hard refresh).
 */
export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // On hard refresh, context reads from localStorage in its initializer,
  // so this is always consistent — no flicker needed.
  const hasToken = isAuthenticated || !!storage.get<string>('accessToken');

  if (!hasToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
