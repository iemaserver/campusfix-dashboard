import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email: string, password: string) => {
  const res = await API.post('/login', { email, password });
  return res.data;
};

export const getDashboardStats = async () => {
  const res = await API.get('/dashboard');
  return res.data;
};

export const getComplaints = async () => {
  const res = await API.get('/complaints');
  return res.data;
};

export const getComplaintById = async (id: string) => {
  const res = await API.get(`/complaints/${id}`);
  return res.data;
};

export const createComplaint = async (data: FormData) => {
  const res = await API.post('/complaints', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getAdminComplaints = async () => {
  const res = await API.get('/admin/complaints');
  return res.data;
};

export const updateComplaintStatus = async (id: string, status: string) => {
  const res = await API.put(`/complaints/${id}/status`, { status });
  return res.data;
};

export const upvoteComplaint = async (id: string) => {
  const res = await API.post(`/complaints/${id}/upvote`);
  return res.data;
};

export const getRecurringComplaints = async () => {
  const res = await API.get('/complaints/recurring');
  return res.data;
};

export default API;
