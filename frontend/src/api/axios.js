const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const getToken = () =>
  localStorage.getItem('rideFlexToken') || sessionStorage.getItem('rideFlexToken');

const buildUrl = (path, params) => {
  const url = new URL(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`);
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
  const response = await fetch(buildUrl(path, params), {
    method,
    headers: {
      ...(data !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  let responseData;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('rideFlexToken');
      localStorage.removeItem('rideFlexUser');
      sessionStorage.removeItem('rideFlexToken');
      sessionStorage.removeItem('rideFlexUser');
      window.location.href = '/auth';
    }

    const error = new Error(
      responseData?.message || responseData?.error || `Request failed with status ${response.status}`
    );
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
