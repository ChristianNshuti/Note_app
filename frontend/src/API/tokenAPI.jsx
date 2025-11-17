import axios from 'axios';

const api = axios.create({
  baseURL: 'https://note-app-backend-rh2b.onrender.com',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  })
  failedQueue = [];
}

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({resolve, reject});
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        api.post('/auth/renewAccessToken', {}, { withCredentials: true })
         .then(({ data }) => {
          localStorage.setItem('accessToken', data.accessToken);
          api.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
          originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
          processQueue(null, data.accessToken);
          
          // Retry the original request
          api(originalRequest).then(response => {
            resolve(response);
            // Reload after the retry is successful
            window.location.reload();
          }).catch(err => {
            reject(err);
          });
        })

          .catch((err) => {
            processQueue(err, null);
            const response = err?.response?.data;

            // If refresh failed due to expired/missing refresh token
            if (response?.tokenExpired || response?.authenticated === false) {
              localStorage.removeItem('accessToken');
              window.location.href = '/login';
            }
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
