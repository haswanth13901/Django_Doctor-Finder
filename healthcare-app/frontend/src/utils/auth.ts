import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/token/`, {
      username,
      password,
    });

    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    if (axios.isAxiosError(err)) {
      console.error('Login failed:', err.response?.data || err.message);
    } else {
      console.error('Login error:', err);
    }
    throw error;
  }
};

export const getAccessToken = (): string | null =>
  localStorage.getItem('access_token');

export const getRefreshToken = (): string | null =>
  localStorage.getItem('refresh_token');

export const refreshAccessToken = async (): Promise<string> => {
  const refresh_token = getRefreshToken();
  if (!refresh_token) throw new Error("No refresh token available");

  try {
    const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
      refresh: refresh_token,
    });

    localStorage.setItem('access_token', response.data.access);
    return response.data.access;
  } catch (error) {
    const err = error as AxiosError;
    if (axios.isAxiosError(err)) {
      console.error('Refresh failed:', err.response?.data || err.message);
    } else {
      console.error('Refresh error:', err);
    }
    logout();
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const fetchWithAuth = async (url: string, config: AxiosRequestConfig = {}) => {
  let access_token = getAccessToken();

  try {
    const response = await axios.get(url, {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      try {
        access_token = await refreshAccessToken();
        const retry = await axios.get(url, {
          ...config,
          headers: {
            ...(config.headers || {}),
            Authorization: `Bearer ${access_token}`,
          },
        });
        return retry.data;
      } catch (refreshErr) {
        const refErr = refreshErr as AxiosError;
        console.error('Retry failed after refresh:', refErr.response?.data || refErr.message);
        throw refreshErr;
      }
    } else {
      console.error('Fetch failed:', err.response?.data || err.message);
      throw error;
    }
  }
};

export const postWithAuth = async (url: string, data: any, config: AxiosRequestConfig = {}) => {
  let access_token = getAccessToken();

  try {
    const response = await axios.post(url, data, {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      try {
        access_token = await refreshAccessToken();
        const retry = await axios.post(url, data, {
          ...config,
          headers: {
            ...(config.headers || {}),
            Authorization: `Bearer ${access_token}`,
          },
        });
        return retry.data;
      } catch (refreshErr) {
        const refErr = refreshErr as AxiosError;
        console.error('Retry POST failed after refresh:', refErr.response?.data || refErr.message);
        throw refreshErr;
      }
    } else {
      console.error('POST failed:', err.response?.data || err.message);
      throw error;
    }
  }
};
