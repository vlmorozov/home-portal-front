import type { FetchError } from 'ofetch';
import { useApiFetch } from '~/services/api-client';

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  phone?: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

type Profile = {
  userId: string;
  email: string;
  username: string;
};

export const useAuth = () => {
  const apiFetch = useApiFetch();
  const accessToken = useState<string | null>('auth_access_token', () => null);
  const profile = useState<Profile | null>('auth_profile', () => null);
  const refreshToken = useCookie<string | null>('refresh_token', {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    default: () => null
  });

  const setTokens = (payload: LoginResponse) => {
    accessToken.value = payload.accessToken;
    refreshToken.value = payload.refreshToken;
  };

  const loginWithEmail = async (payload: LoginPayload) => {
    const response = await apiFetch<LoginResponse>('/auth/login/email', {
      method: 'POST',
      body: payload
    });
    setTokens(response);
    await fetchProfile();
    return response;
  };

  const registerUser = async (payload: RegisterPayload) => {
    await apiFetch('/auth/register', {
      method: 'POST',
      body: payload
    });
  };

  const refreshAccessToken = async () => {
    if (!refreshToken.value) return null;
    const response = await apiFetch<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken: refreshToken.value }
    });
    accessToken.value = response.accessToken;
    return response.accessToken;
  };

  const fetchProfile = async () => {
    if (!accessToken.value && refreshToken.value) {
      await refreshAccessToken();
    }
    if (!accessToken.value) return null;
    try {
      const data = await apiFetch<Profile>('/profile');
      profile.value = data;
      return data;
    } catch (error) {
      const fetchError = error as FetchError;
      if (fetchError?.response?.status === 401) {
        await refreshAccessToken();
        if (accessToken.value) {
          const retry = await apiFetch<Profile>('/profile');
          profile.value = retry;
          return retry;
        }
      }
      throw error;
    }
  };

  const logout = async () => {
    const token = refreshToken.value;
    refreshToken.value = null;
    accessToken.value = null;
    profile.value = null;
    if (!token) return;
    await apiFetch('/auth/logout', {
      method: 'POST',
      body: { refreshToken: token }
    }).catch(() => {});
  };

  return {
    accessToken,
    profile,
    loginWithEmail,
    registerUser,
    refreshAccessToken,
    fetchProfile,
    logout
  };
};
