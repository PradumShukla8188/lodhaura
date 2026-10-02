import api from "./api";
import { 
  type InvestorContactFormData, 
  type ComplaintFormData, 
  type SuggestionFormData, 
  type ContactFormData 
} from "./auth-schemas";

export interface ApiImage {
  _id: string;
  title?: string;
  url: string;
  caption?: string;
  category?: string;
  likes?: number;
  comments?: number;
  status?: string;
  createdAt?: string;
}

export interface ApiBlog {
  _id: string;
  title: string;
  slug?: string;
  content: string;
  status?: string;
  createdAt?: string;
  featuredImage?: string;
}

export interface ApiVideo {
  _id: string;
  title: string;
  url: string;
  thumbnail?: string;
  status?: string;
  createdAt?: string;
}

export interface ProfileData {
  user: Record<string, unknown>;
  stats: { blogs: number; images: number; videos: number };
  blogs: ApiBlog[];
  images: ApiImage[];
  videos: ApiVideo[];
}

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/onBoarding/login", data),
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/onBoarding/register", {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.password,
    }),
  forgotPassword: (data: { email: string }) =>
    api.post("/onBoarding/forgot-password", data),
  resetPassword: (data: { token: string; password: string; confirmPassword: string }) =>
    api.post("/onBoarding/reset-password", data),
  registerResident: (data: any) =>
    api.post("/onBoarding/register-resident", data),
};

export const residentApi = {
  getProfile: () => api.get("/residents/profile"),
  updateProfile: (data: any) => api.put("/residents/profile", data),
  getFamilyMembers: () => api.get("/residents/family"),
  addFamilyMember: (data: any) => api.post("/residents/family", data),
  getDocuments: () => api.get("/residents/documents"),
  updateDocumentStatus: (data: { templateId: string; status: string; uploadedFileUrl?: string }) => 
    api.put("/residents/documents", data),
};

export const profileApi = {
  getMe: () => api.get<{ data: ProfileData }>("/profile/me"),
  updateProfile: (data: { name?: string; phone?: string; bio?: string; avatar?: string }) =>
    api.patch("/profile/me", data),
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => api.post("/profile/change-password", data),
};

export const adminApi = {
  getDashboard: () => api.get("/admin/dashboard"),
  getPending: () => api.get("/admin/pending"),
  getUsers: (params?: { page?: number; limit?: number; search?: string }) => api.get("/admin/users", { params }),
  getContent: () => api.get("/admin/content"),
  toggleUserStatus: (id: string) => api.patch(`/admin/users/${id}/toggle-status`),
  approveContent: (type: string, id: string) =>
    api.patch(`/admin/approve/${type}/${id}`),
  updateContentStatus: (type: string, id: string, status: string) =>
    api.patch(`/admin/content/${type}/${id}/status`, { status }),
};

export const contentApi = {
  getImages: () => api.get<{ data: ApiImage[] }>("/images"),
  getVideos: () => api.get("/videos"),
  getBlogs: () => api.get<{ data: ApiBlog[] }>("/blog"),
  getMyBlogs: () => api.get<{ data: ApiBlog[] }>("/blog/my"),
  getEvents: () => api.get("/events"),
  getNews: () => api.get("/news"),
  getSchemes: () => api.get("/schemes"),
  search: (q: string) => api.get("/search", { params: { q } }),
  getEmergencyContacts: () => api.get("/emergency-contacts"),
  getLocalServices: (category?: string, search?: string) => 
    api.get("/local-services", { params: { category, search } }),
  registerLocalService: (data: any) => api.post("/local-services", data),
  getAgricultureServices: (type?: string, search?: string) =>
    api.get("/agriculture-services", { params: { type, search } }),
  registerAgricultureService: (data: any) => api.post("/agriculture-services", data),
  getJobs: (search?: string) => api.get("/jobs", { params: { search } }),
  createJob: (data: any) => api.post("/jobs", data),
  getMarketplaceItems: (category?: string, search?: string) => 
    api.get("/marketplace", { params: { category, search } }),
  createMarketplaceItem: (data: any) => api.post("/marketplace", data),
};

export const donationApi = {
  getRazorpayConfig: () => api.get<{ data: { enabled: boolean; keyId: string } }>("/donations/razorpay-config"),
  createOrder: (data: {
    amount: number;
    donorName: string;
    email?: string;
    phone?: string;
    purpose?: string;
  }) => api.post("/donations/create-order", data),
  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    donationId: string;
  }) => api.post("/donations/verify-payment", data),
};

export const formApi = {
  submitInvestorInquiry: (data: InvestorContactFormData) => api.post("/investors", {
    name: data.fullName,
    organization: data.organization,
    email: data.email,
    phone: data.phone,
    investmentType: data.investmentType,
    website: data.website,
    message: data.message,
  }),
  submitComplaint: (data: ComplaintFormData) => api.post("/complaints", data),
  submitSuggestion: (data: SuggestionFormData) => api.post("/suggestions", data),
  submitContact: (data: ContactFormData) => api.post("/contacts", data),
  subscribeNewsletter: (data: { email: string }) => api.post("/newsletters/subscribe", data),
};

export const governanceApi = {
  getDepartments: () => api.get("/departments"),
  createDepartment: (data: any) => api.post("/departments", data),
  updateDepartment: (id: string, data: any) => api.put(`/departments/${id}`, data),
  deleteDepartment: (id: string) => api.delete(`/departments/${id}`),

  getRoles: (params?: { page?: number; limit?: number; search?: string }) => api.get("/roles", { params }),
  createRole: (data: any) => api.post("/roles", data),
  updateRole: (id: string, data: any) => api.put(`/roles/${id}`, data),
  deleteRole: (id: string) => api.delete(`/roles/${id}`),

  getUsers: (params?: { page?: number; limit?: number; search?: string }) => api.get("/user", { params }),
  createUser: (data: any) => api.post("/user", data),
  updateUser: (id: string, data: any) => api.patch(`/user/${id}`, data),
  deleteUser: (id: string) => api.delete(`/user/${id}`),

  getGovUsers: () => api.get("/gov-users"),
  createGovUser: (data: any) => api.post("/gov-users", data),
  updateGovUser: (id: string, data: any) => api.put(`/gov-users/${id}`, data),
  deleteGovUser: (id: string) => api.delete(`/gov-users/${id}`),

  getSchemes: () => api.get("/schemes"),
  createScheme: (data: any) => api.post("/schemes", data),
  updateScheme: (id: string, data: any) => api.patch(`/schemes/${id}`, data),
  deleteScheme: (id: string) => api.delete(`/schemes/${id}`),

  getProjects: () => api.get("/projects"),
  getProjectById: (id: string) => api.get(`/projects/${id}`),
  createProject: (data: any) => api.post("/projects", data),
  updateProject: (id: string, data: any) => api.put(`/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/projects/${id}`),
  getProjectProgress: (id: string) => api.get(`/projects/${id}/progress`),
  addProjectProgress: (id: string, data: any) => api.post(`/projects/${id}/progress`, data),

  getDocuments: () => api.get("/documents"),
  createDocument: (data: any) => api.post("/documents", data),
  updateDocument: (id: string, data: any) => api.put(`/documents/${id}`, data),
  deleteDocument: (id: string) => api.delete(`/documents/${id}`),

  getTransactions: () => api.get("/funds"),
  getProjectTransactions: (projectId: string) => api.get(`/funds/project/${projectId}`),
  createTransaction: (data: any) => api.post("/funds", data),

  getAuditLogs: () => api.get("/audit"),

  getTasks: () => api.get("/tasks"),

  getAdminEmergencyContacts: (params?: { page?: number; limit?: number; search?: string }) => api.get("/emergency-contacts/admin", { params }),
  createEmergencyContact: (data: any) => api.post("/emergency-contacts", data),
  updateEmergencyContact: (id: string, data: any) => api.put(`/emergency-contacts/${id}`, data),
  deleteEmergencyContact: (id: string) => api.delete(`/emergency-contacts/${id}`),
  
  getAdminWorkers: (params?: { page?: number; limit?: number; search?: string }) => api.get("/workers/admin", { params }),
  verifyWorker: (id: string, isVerified: boolean) => api.patch(`/workers/admin/${id}/verify`, { isVerified }),
  deleteWorker: (id: string) => api.delete(`/workers/admin/${id}`),

  getAdminJobs: (params?: { page?: number; limit?: number; search?: string }) => api.get("/jobs/admin", { params }),
  updateJobStatusAdmin: (id: string, status: string) => api.patch(`/jobs/admin/${id}/status`, { status }),
  deleteJobAdmin: (id: string) => api.delete(`/jobs/admin/${id}`),

  getAdminMarketplaceItems: (params?: { page?: number; limit?: number; search?: string }) => api.get("/marketplace/admin", { params }),
  updateMarketplaceItemStatusAdmin: (id: string, status: string) => api.patch(`/marketplace/admin/${id}/status`, { status }),
  deleteMarketplaceItemAdmin: (id: string) => api.delete(`/marketplace/admin/${id}`),

  getAdminLocalServices: (params?: { page?: number; limit?: number; search?: string }) => api.get("/local-services/admin", { params }),
  updateLocalServiceStatusAdmin: (id: string, verificationStatus: string) => api.patch(`/local-services/admin/${id}/status`, { verificationStatus }),
  deleteLocalServiceAdmin: (id: string) => api.delete(`/local-services/admin/${id}`),

  getAdminResidents: (params?: { page?: number; limit?: number; search?: string }) => api.get("/residents/admin", { params }),
  deleteResidentAdmin: (id: string) => api.delete(`/residents/admin/${id}`),

  getVillageInfo: () => api.get("/village/info"),
  updateVillageInfo: (data: any) => api.patch("/village/info", data),
  getMyTasks: () => api.get("/tasks/my-tasks"),
  createTask: (data: any) => api.post("/tasks", data),
  updateTask: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),

  getMeetings: () => api.get("/meetings"),
  createMeeting: (data: any) => api.post("/meetings", data),
  updateMeeting: (id: string, data: any) => api.put(`/meetings/${id}`, data),
  deleteMeeting: (id: string) => api.delete(`/meetings/${id}`),

  getComplaints: () => api.get("/complaints"),
  getMyComplaints: () => api.get("/complaints/my-complaints"),
  updateComplaint: (id: string, data: any) => api.put(`/complaints/${id}`, data),

  getGovernanceAnalytics: () => api.get("/analytics"),
  getExportUrl: (type: 'projects' | 'transactions' | 'complaints') => `${process.env.NEXT_PUBLIC_API_URL}/api/v1/analytics/export/${type}`,

  // Event Management
  getEvents: (admin = false) => api.get(`/events${admin ? '?admin=true' : ''}`),
  getEventById: (id: string) => api.get(`/events/${id}`),
  createEvent: (data: any) => api.post("/events", data),
  updateEvent: (id: string, data: any) => api.put(`/events/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/events/${id}`),
  registerForEvent: (id: string, data: any) => api.post(`/events/${id}/register`, data),
  donateToEvent: (id: string, data: any) => api.post(`/events/${id}/donate`, data),
  getEventParticipants: (id: string) => api.get(`/events/${id}/participants`),
  updateParticipantStatus: (eventId: string, regId: string, data: any) => api.put(`/events/${eventId}/participants/${regId}`, data),
  getEventDonations: (id: string) => api.get(`/events/${id}/donations`),
};
