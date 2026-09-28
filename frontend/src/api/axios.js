const rawApiUrl = String(import.meta.env.VITE_API_URL || '').trim();

const normalizeApiUrl = (value) => {
  if (!value) return window.location.origin + '/api';
  if (/^https?:\/\//i.test(value)) return value.replace(/\/$/, '');
  if (value.startsWith('/')) {
    return new URL(value, window.location.origin).toString().replace(/\/$/, '');
  }
  return 'https://' + value.replace(/\/$/, '');
};

const API_URL = normalizeApiUrl(rawApiUrl);

const getToken = () =>
  localStorage.getItem('rideFlexToken') || sessionStorage.getItem('rideFlexToken');

const buildUrl = (path, params) => {
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  const url = new URL(API_URL + normalizedPath);
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
};

const request = async (method, path, { params, data, headers = {} } = {}) => {
  const token = getToken();
  let response;
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      headers: {
        ...(data !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
        ...headers,
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  } catch (error) {
    const message = error instanceof TypeError
      ? 'Unable to reach the Ride Flex API. Check VITE_API_URL and make sure the backend is deployed.'
      : error?.message || 'Unable to reach the Ride Flex API.';
    const apiError = new Error(message);
    apiError.cause = error;
    throw apiError;
  }

  let responseData;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) responseData = await response.json();
  else responseData = await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('rideFlexToken');
      localStorage.removeItem('rideFlexUser');
      sessionStorage.removeItem('rideFlexToken');
      sessionStorage.removeItem('rideFlexUser');
      window.location.href = '/auth';
    }
    const error = new Error(responseData?.message || responseData?.error || ('Request failed with status ' + response.status));
    error.response = { status: response.status, data: responseData };
    throw error;
  }
  return { data: responseData, status: response.status, headers: response.headers };
};

const api = {
  get: (path, config = {}) => request('GET', path, config),
  post: (path, data, config = {}) => request('POST', path, { ...config, data }),
  put: (path, data, config = {}) => request('PUT', path, { ...config, data }),
  patch: (path, data, config = {}) => request('PATCH', path, { ...config, data }),
  delete: (path, config = {}) => request('DELETE', path, config),
};

export default api;