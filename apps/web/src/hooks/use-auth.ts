import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Role = 'USER' | 'ADMIN';

export type AuthUser = {
  sub: string;
  email: string;
  role: Role;
};

function decodeToken(token: string): AuthUser | null {
  try {
    return JSON.parse(atob(token.split('.')[1])) as AuthUser;
  } catch {
    return null;
  }
}

export function useAuth(requiredRole?: Role): AuthUser | null {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const user = token ? decodeToken(token) : null;

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (requiredRole && user.role !== requiredRole) {
      navigate('/albums', { replace: true });
    }
  }, [user, navigate, requiredRole]);

  return user;
}
