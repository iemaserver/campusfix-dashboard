import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for development
const mockDashboardStats = {
  totalComplaints: 47,
  pendingIssues: 12,
  resolvedIssues: 30,
  inProgress: 5,
};

const mockComplaints = [
  {
    _id: '1',
    category: 'Electricity',
    location: { building: 'Block A', floor: '2nd Floor', room: '201' },
    description: 'Power outlet not working in classroom 201. Students unable to charge laptops during lectures.',
    status: 'Submitted',
    date: '2026-03-05',
    photo: null,
    assignedTo: null,
  },
  {
    _id: '2',
    category: 'Water',
    location: { building: 'Block B', floor: '1st Floor', room: 'Washroom' },
    description: 'Water leakage from the ceiling pipe in the ground floor washroom near the library entrance.',
    status: 'Assigned',
    date: '2026-03-04',
    photo: null,
    assignedTo: 'John Clerk',
  },
  {
    _id: '3',
    category: 'Internet',
    location: { building: 'Library', floor: '3rd Floor', room: 'Study Hall' },
    description: 'WiFi signal is extremely weak in the study hall area. Multiple students have reported connectivity issues.',
    status: 'In Progress',
    date: '2026-03-03',
    photo: null,
    assignedTo: 'Jane Clerk',
  },
  {
    _id: '4',
    category: 'Furniture',
    location: { building: 'Block C', floor: 'Ground Floor', room: '102' },
    description: 'Three chairs and one desk are broken in lecture hall 102. Safety hazard for students.',
    status: 'Completed',
    date: '2026-03-01',
    photo: null,
    assignedTo: 'John Clerk',
  },
  {
    _id: '5',
    category: 'Cleanliness',
    location: { building: 'Cafeteria', floor: 'Ground Floor', room: 'Main Hall' },
    description: 'Cafeteria tables not being cleaned regularly. Food waste found on tables during lunch hours.',
    status: 'Submitted',
    date: '2026-03-06',
    photo: null,
    assignedTo: null,
  },
  {
    _id: '6',
    category: 'Infrastructure',
    location: { building: 'Block A', floor: '3rd Floor', room: 'Corridor' },
    description: 'Ceiling tiles are falling in the corridor. Immediate repair needed to prevent injuries.',
    status: 'In Progress',
    date: '2026-03-02',
    photo: null,
    assignedTo: 'Jane Clerk',
  },
];

// Use mock data when API is unavailable
export const login = async (email: string, password: string) => {
  try {
    const res = await API.post('/login', { email, password });
    return res.data;
  } catch {
    // Mock response
    return { token: 'mock-token', user: { name: 'Student User', role: 'student', email } };
  }
};

export const getDashboardStats = async () => {
  try {
    const res = await API.get('/dashboard');
    return res.data;
  } catch {
    return mockDashboardStats;
  }
};

export const getComplaints = async () => {
  try {
    const res = await API.get('/complaints');
    return res.data;
  } catch {
    return mockComplaints;
  }
};

export const getComplaintById = async (id: string) => {
  try {
    const res = await API.get(`/complaints/${id}`);
    return res.data;
  } catch {
    return mockComplaints.find(c => c._id === id) || mockComplaints[0];
  }
};

export const createComplaint = async (data: FormData) => {
  try {
    const res = await API.post('/complaints', data);
    return res.data;
  } catch {
    return { success: true, message: 'Complaint submitted successfully (mock)' };
  }
};

export const getAdminComplaints = async () => {
  try {
    const res = await API.get('/admin/complaints');
    return res.data;
  } catch {
    return mockComplaints;
  }
};

export const updateComplaintStatus = async (id: string, status: string) => {
  try {
    const res = await API.put(`/complaints/${id}/status`, { status });
    return res.data;
  } catch {
    return { success: true, message: `Status updated to ${status} (mock)` };
  }
};

export default API;
