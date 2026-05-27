const API_URL = "http://localhost:8000/api";

/* ================================
   HELPERS
================================ */

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const getHeaders = (isJson = true) => {
  const token = getToken();

  return {
    ...(isJson && { "Content-Type": "application/json" }),
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};



/* ================================
   TYPES
================================ */

export interface Billboard {
  id: number;
  title?: string;
  location?: string;
  category?: string;
  price?: number;
  status?: "pending" | "approved" | "rejected";
  owner?: {
    id: number;
    name: string;
    email: string;
  };
  image?: string;
  rejection_reason?: string;
}

/* ================================
   AUTH
================================ */
// types.ts
export interface BillboardFilter {
  status?: string;
} 
export const login = async (data: any) => {
  const result = await safeFetch(`${API_URL}/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.user)); // ✅ IMPORTANT

  return result;
};

export const register = async (data: any) => {
  return safeFetch(`${API_URL}/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
};

/* ================================
   BILLBOARDS
================================ */

export const safeFetch = async (url: string, options: any = {}) => {
  const res = await fetch(url, options);
  const text = await res.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    console.error("NON-JSON RESPONSE:", text);
    throw new Error("Server returned invalid response");
  }

  // ✅ HANDLE ERRORS PROPERLY
  if (!res.ok) {
    console.error("API ERROR:", data);
    throw new Error(data.message || "Request failed");
  }

  return data;
};

// ✅ GET BILLBOARDS
// export const getBillboards = async (params?: {
//   mine?: boolean;
//   status?: string;
// }) => {
//   let url = `${API_URL}/billboards`;

//   const query = [];

//   if (params?.mine) query.push("mine=1");
//   if (params?.status) query.push(`status=${params.status}`);

//   if (query.length > 0) {
//     url += `?${query.join("&")}`;
//   }

//   return safeFetch(url, {
//     headers: getHeaders(false),
//   });
// };


/* =========================
   OWNER BILLBOARDS
========================= */
// api.ts or wherever it's defined
export async function getBillboards(filter?: BillboardFilter) {
  const query = filter?.status ? `?status=${filter.status}` : "";
  
  const res = await fetch(`/api/billboards${query}`);
  return res.json();
}

/* =========================
   ADMIN BILLBOARDS (🔥 FIX)
========================= */
/* =========================
   ADMIN BILLBOARDS (🔥 FIX)
========================= */
export const getAdminBillboards = async () => {
  return safeFetch(`${API_URL}/admin/billboards/pending`, {
    headers: getHeaders(false),
  });
};

export const getPendingBillboards = async () => {
  return safeFetch(`${API_URL}/admin/billboards/pending`, {
    headers: getHeaders(false),
  });
};

/* =========================
   APPROVE / REJECT
========================= */
export const approveBillboard = async (id: number) => {
  return safeFetch(`${API_URL}/admin/billboards/${id}/approve`, {
    method: "POST",
    headers: getHeaders(true),
  });
};

export const rejectBillboard = async (id: number, reason: string) => {
  return safeFetch(`${API_URL}/admin/billboards/${id}/reject`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify({ reason }),
  });
};



export const getBillboardById = async (id: number) => {
  return safeFetch(`${API_URL}/billboards/${id}`, {
    headers: getHeaders(false),
  });
};
export const createBillboard = async (data: FormData) => {
  return safeFetch(`${API_URL}/billboards`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`, // ✅ REQUIRED
    },
    body: data,
  });
};

export const updateBillboard = async (id: number, data: FormData) => {
  data.append("_method", "PUT");

  return safeFetch(`${API_URL}/billboards/${id}`, {
    method: "POST",
    headers: {
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    },
    body: data,
  });
};

export const deleteBillboard = async (id: number) => {
  return safeFetch(`${API_URL}/billboards/${id}`, {
    method: "DELETE",
    headers: getHeaders(false),
  });
};



/* ================================
   BOOKINGS
================================ */

export const createBooking = async (id: number, data: any) => {
  return safeFetch(`${API_URL}/bookings/${id}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
};

export const getMyBookings = async () => {
  return safeFetch(`${API_URL}/my-bookings`, {
    headers: getHeaders(),
  });
};

/* ================================
   DASHBOARD
================================ */

export async function getOwnerDashboard() {
  return safeFetch(`${API_URL}/owner/dashboard`, {
    headers: getHeaders(), // ✅ FIXED
  });
}

export async function getDashboardStats() {
  return safeFetch(`${API_URL}/admin/dashboard`, {
    headers: getHeaders(),
  });
}

/* ================================
   NOTIFICATIONS
================================ */

export async function getNotifications() {
  return safeFetch(`${API_URL}/notifications`, {
    headers: getHeaders(),
  });
}

/* ================================
   MESSENGER
================================ */

export async function getConversations() {
  return safeFetch(`${API_URL}/conversations`, {
    headers: getHeaders(),
  });
}

export async function getMessages(conversationId: number) {
  return safeFetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      headers: getHeaders(),
    }
  );
}

export async function sendMessage(data: {
  conversation_id: number;
  message: string;
}) {
  return safeFetch(`${API_URL}/messages`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
}

/* ================================
   ORDERS
================================ */

export async function getOrders() {
  const res = await fetch(`${API_URL}/orders`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch orders");

  return res.json();
}

/* SETTINGS
================================ */

export async function getSettings() {
  const res = await fetch(`${API_URL}/settings`, {
    headers: getHeaders(),
  });
  return res.json();
}

export async function updateSettings(data: any) {
  const res = await fetch(`${API_URL}/settings`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

/* ================================
   SUBMISSIONS
================================ */

export async function getSubmissions() {
  const res = await fetch(`${API_URL}/submissions`, {
    headers: getHeaders(),
  });
  return res.json();
}

export async function updateSubmissionStatus(id: string, status: string) {
  const res = await fetch(`${API_URL}/submissions/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
}

/* ================================
   ADMIN (FIX MISSING EXPORTS)
================================ */

/* ================================
   ADMIN USERS (🔥 FIX)
================================ */

export async function getAdmins() {
  return safeFetch(`${API_URL}/admins`, {
    headers: getHeaders(),
  });
}

export async function createAdmin(data: any) {
  return safeFetch(`${API_URL}/admins`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteAdmin(id: string) {
  return safeFetch(`${API_URL}/admins/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
}

export async function toggleAdminStatus(id: string) {
  return safeFetch(`${API_URL}/admins/toggle/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
  });
}

/* ================================
   ADMIN BOOKINGS (🔥 FIX)
================================ */

export async function getBookings() {
  return safeFetch(`${API_URL}/admin/bookings`, {
    headers: getHeaders(),
  });
}


export const getUnreadCount = () =>
  safeFetch(`${API_URL}/notifications/unread-count`, {
    headers: getHeaders(false),
  });

export const markAsRead = (id: number) =>
  safeFetch(`${API_URL}/notifications/${id}/read`, {
    method: "POST",
    headers: getHeaders(false),
  });

export const markAllAsRead = () =>
  safeFetch(`${API_URL}/notifications/read-all`, {
    method: "POST",
    headers: getHeaders(false),
  });

