import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  authRepository,
  type AuthTokens,
  type LoginPayload,
  type RegisterPayload,
} from '@/data/repositories/auth.repository';

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<AuthTokens, Error, LoginPayload>({
    mutationFn: (payload) => authRepository.login(payload),
    onSuccess: ({ accessToken, refreshToken }) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      queryClient.invalidateQueries();
    },
  });
}

export function useRegister() {
  return useMutation<AuthTokens, Error, RegisterPayload>({
    mutationFn: (payload) => authRepository.register(payload),
    onSuccess: ({ accessToken, refreshToken }) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () => authRepository.logout(),
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
    },
  });
}
