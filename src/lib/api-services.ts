import api from "./api";

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
  getUsers: () => api.get("/admin/users"),
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
