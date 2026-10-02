import api from './api';

export interface WorkerProfile {
  _id: string;
  userId: any;
  name: string;
  mobileNumber: string;
  category: string;
  skills: string[];
  experience: string;
  description: string;
  address: string;
  serviceAreaRadius: number;
  pricePerDay: number;
  pricePerHour?: number;
  availabilityStatus: boolean;
  availableDays: string[];
  isVerified: boolean;
  status: string;
  averageRating: number;
  totalReviews: number;
  totalJobsCompleted: number;
}

export const workerService = {
  // Public
  getWorkers: async (params?: Record<string, string>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const res = await api.get(`/workers?${queryString}`);
    return res.data;
  },
  getWorkerById: async (id: string) => {
    const res = await api.get(`/workers/${id}`);
    return res.data;
  },
  getWorkerReviews: async (workerId: string) => {
    const res = await api.get(`/worker-reviews/worker/${workerId}`);
    return res.data;
  },

  // Protected (Worker Profile)
  registerWorker: async (data: any) => {
    const res = await api.post('/workers/register', data);
    return res.data;
  },
  getMyProfile: async () => {
    const res = await api.get('/workers/profile/me');
    return res.data;
  },
  updateProfile: async (data: any) => {
    const res = await api.patch('/workers/profile/me', data);
    return res.data;
  },

  // Protected (Requests & Jobs)
  createRequest: async (data: any) => {
    const res = await api.post('/worker-requests', data);
    return res.data;
  },
  getMyRequests: async () => {
    const res = await api.get('/worker-requests/me');
    return res.data;
  },
  getMyJobs: async () => {
    const res = await api.get('/worker-requests/jobs');
    return res.data;
  },
  updateRequestStatus: async (id: string, status: string) => {
    const res = await api.patch(`/worker-requests/${id}/status`, { status });
    return res.data;
  },
  
  // Reviews
  addReview: async (data: any) => {
    const res = await api.post('/worker-reviews', data);
    return res.data;
  }
};
