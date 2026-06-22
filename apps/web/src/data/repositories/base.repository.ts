import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

type RefreshResponse = { accessToken: string; refreshToken: string };
type QueueItem = { resolve: (token: string) => void; reject: (err: unknown) => void };

// Module-level state shared across all repository instances to prevent parallel refreshes
let isRefreshing = false;
let refreshQueue: QueueItem[] = [];

function processQueue(token: string | null, error: unknown = null) {
  refreshQueue.forEach(({ resolve, reject }) => (token ? resolve(token) : reject(error)));
  refreshQueue = [];
}

export abstract class BaseRepository {
  protected readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
      headers: { 'Content-Type': 'application/json' },
    });

    this.http.interceptors.request.use(this.attachToken);
    this.http.interceptors.response.use(undefined, this.handleUnauthorized);
  }

  private attachToken(config: InternalAxiosRequestConfig) {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }

  private handleUnauthorized = async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Queue concurrent 401s while a refresh is already in progress
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return this.http(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');

      // Use a bare axios call to avoid triggering the response interceptor again
      const { data } = await axios.post<RefreshResponse>(
        `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/auth/refresh`,
        { refreshToken },
      );

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      processQueue(data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return this.http(original);
    } catch (err) {
      processQueue(null, err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  };
}
