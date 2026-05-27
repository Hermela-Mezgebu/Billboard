import axios from "axios";

const API = "http://127.0.0.1:8000/api";

/* ================= AXIOS INSTANCE ================= */
const axiosInstance = axios.create({
  baseURL: API,
  headers: {
    Accept: "application/json",
  },
});

// 🔥 Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= AUTH ================= */
export const authService = {
  login: (data: { email: string; password: string }) =>
    axiosInstance.post("/login", data),

  register: (data: any) => axiosInstance.post("/register", data),

  // ✅ FIXED (was /me ❌)
  me: () => axiosInstance.get("/user"),

  logout: () => {
    localStorage.removeItem("token");
  },
};

/* ================= BILLBOARD ================= */
export const billboardService = {
  getPublicBillboards: async () => {
    // ✅ ONLY FETCH APPROVED BILLBOARDS FOR CLIENTS
    const res = await axiosInstance.get("/billboards?status=approved");
    return res.data;
  },

  getOwnerBillboards: async (ownerId: string) => {
    // ✅ FETCH ALL BILLBOARDS FOR OWNER (includes pending)
    const res = await axiosInstance.get(`/billboards?owner_id=${ownerId}`);
    return res.data;
  },

  getPending: async () => {
    // ✅ FETCH PENDING BILLBOARDS FOR ADMIN
    const res = await axiosInstance.get("/billboards?status=pending");
    return res.data;
  },

  updateStatus: async (id: string, status: string) => {
    // ✅ UPDATE BILLBOARD STATUS
    return axiosInstance.put(`/billboards/${id}`, { status });
  },

  approveBillboard: async (id: string) => {
    // ✅ APPROVE A BILLBOARD
    return axiosInstance.post(`/billboards/${id}/approve`, {});
  },

  rejectBillboard: async (id: string, reason: string) => {
    // ✅ REJECT A BILLBOARD
    return axiosInstance.post(`/billboards/${id}/reject`, { reason });
  },
};

/* ================= BOOKINGS ================= */
export const bookingService = {
  // ✅ CREATE BOOKING (THIS WAS MISSING)
  createBooking: async (id: string, formData: FormData) => {
    const res = await axiosInstance.post(`/bookings/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // ✅ Return the entire response data
    return res.data.data || res.data;
  },

  getOwnerBookings: async (ownerId: string) => {
    const res = await axiosInstance.get(`/bookings?owner_id=${ownerId}`);
    return res.data;
  },

  getClientBookings: async () => {
    const res = await axiosInstance.get(`/my-bookings`);
    return res.data;
  },
};


