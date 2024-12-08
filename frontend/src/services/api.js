import axios from 'axios';

const API = axios.create({ baseURL: '/api', withCredentials: true });

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

export const getCourses = (token) => API.get(
  '/courses', 
  { headers: { Authorization: `Bearer ${token}` } }
);

export const getCourse = (courseId, token) => API.get(
  `/courses/${courseId}`, 
  { headers: { Authorization: `Bearer ${token}` } }
);

export const enrollCourse = (courseId, token, orderToken) => API.post(
  `/courses/${courseId}/enroll`, 
  { orderToken }, 
  { headers: { Authorization: `Bearer ${token}` } }
);

export const createCourse = (data, token) => API.post(
  '/courses', data,
  { headers: { Authorization: `Bearer ${token}` } }
);

export const deleteCourse = (courseId, token) => API.delete(
  `/courses/${courseId}`, 
  { headers: { Authorization: `Bearer ${token}` } }
);

export const createOrder = (amount, token) => API.post(
  '/orders',
  { amount }, 
  { headers: { Authorization: `Bearer ${token}` } }
);

export const uploadFile = (courseId, file, title, token) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  return API.post(`/courses/${courseId}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};
