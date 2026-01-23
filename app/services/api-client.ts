import { $fetch } from 'ofetch';

export const useApiFetch = () => {
  const config = useRuntimeConfig();
  const accessToken = useState<string | null>('auth_access_token', () => null);

  return $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    onRequest({ options }) {
      const existingHeaders = (options.headers || {}) as Record<string, string>;
      options.headers = {
        ...existingHeaders,
        ...(accessToken.value ? { Authorization: `Bearer ${accessToken.value}` } : {})
      };
    }
  });
};
