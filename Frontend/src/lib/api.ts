const API_URL = "http://127.0.0.1:8000/api";

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
  neighborhood?: string;
  category?: string;
  price?: number;
  status?: "pending" | "approved" | "rejected";
  videoUrl?: string;
  additionalImages?: string[];
  owner?: {
    id: number;
    name: string;
    email: string;
  };
  image?: string;
  imageUrl?: string;

  rejection_reason?: string; // ✅ ADD THIS
}

/* ================================
   AUTH
================================ */

export const login = async (data: any) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  console.log("LOGIN RESPONSE:", result); // 👈 ADD THIS

  if (!res.ok) throw new Error(result.message || "Login failed");

  // ✅ SAVE TOKEN
  localStorage.setItem("token", result.token);

  return result;
};

export const register = async (data: any) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Register failed");

  return result;
};

/* ================================
   BILLBOARDS
================================ */

// ✅ GET ALL
export const getBillboards = async (): Promise<Billboard[]> => {
  const res = await fetch(`${API_URL}/billboards`);
  if (!res.ok) throw new Error("Failed to fetch billboards");
  return res.json();
};

// ✅ GET ONE
export const getBillboardById = async (id: number) => {
  const res = await fetch(`${API_URL}/billboards/${id}`);
  if (!res.ok) throw new Error("Failed to fetch billboard");
  return res.json();
};

// ✅ CREATE (FormData for image/video)
export const createBillboard = async (data: FormData) => {
  const res = await fetch(`${API_URL}/billboards`, {
    method: "POST",
    headers: {
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    }, // ❗ NO Content-Type (browser sets it)
    body: data,
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Create failed");

  return result;
};

// ✅ UPDATE
export const updateBillboard = async (id: number, data: FormData) => {
  data.append("_method", "PUT"); // Laravel trick

  const res = await fetch(`${API_URL}/billboards/${id}`, {
    method: "POST",
    headers: {
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    },
    body: data,
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Update failed");

  return result;
};

// ✅ DELETE
export const deleteBillboard = async (id: number) => {
  const res = await fetch(`${API_URL}/billboards/${id}`, {
    method: "DELETE",
    headers: getHeaders(false),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Delete failed");

  return result;
};

// ✅ APPROVE
export const approveBillboard = async (id: number) => {
  const res = await fetch(`${API_URL}/billboards/${id}/approve`, {
    method: "POST",
    headers: getHeaders(false),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Approve failed");

  return result;
};

// ✅ REJECT
export const rejectBillboard = async (id: number, message: string) => {
  const res = await fetch(`${API_URL}/billboards/${id}/reject`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ message }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Reject failed");

  return result;
};

/* ================================
   BOOKINGS
================================ */

export const getBookedDates = async (id: number) => {
  const res = await fetch(`${API_URL}/billboards/${id}/bookings`);
  if (!res.ok) throw new Error("Failed to fetch dates");
  return res.json();
};

export const createBooking = async (id: number, data: any) => {
  console.log("TOKEN:", localStorage.getItem("token")); // 👈 ADD HERE

  const res = await fetch(`${API_URL}/bookings/${id}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Booking failed");

  return result;
};

export const getMyBookings = async () => {
  const res = await fetch(`${API_URL}/my-bookings`, {
    headers: getHeaders(),
  });

  return res.json();
};

export const getAdminBookings = async () => {
  const res = await fetch(`${API_URL}/admin/bookings`, {
    headers: getHeaders(),
  });

  return res.json();
};

export const approveBooking = async (id: number) => {
  const res = await fetch(`${API_URL}/admin/bookings/${id}/approve`, {
    method: "POST",
    headers: getHeaders(),
  });

  return res.json();
};

/* ================================
   DASHBOARD
================================ */

export async function getDashboardStats() {
  const res = await fetch(`${API_URL}/admin/dashboard`);
  return res.json();
}

export async function getOwnerDashboard() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/owner/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("RAW ERROR:", text);
      throw new Error("Request failed");
    }

    return res.json();
  } catch (err) {
    console.error("FETCH ERROR:", err);
    throw err;
  }
}

/* ================================
   ADMIN (FIX MISSING EXPORTS)
================================ */

export async function getAdmins() {
  const res = await fetch(`${API_URL}/admins`, {
    headers: getHeaders(),
  });
  return res.json();
}

export async function createAdmin(data: any) {
  const res = await fetch(`${API_URL}/admins`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteAdmin(id: string) {
  await fetch(`${API_URL}/admins/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
}

export async function getBookings() {
  const res = await fetch(`${API_URL}/bookings`);
  return res.json();
}

// ---------------- MESSENGER ----------------
export async function getConversations() {
  const res = await fetch(`${API_URL}/conversations`);
  return res.json();
}

export async function getMessages(conversationId: number) {
  const res = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
  );
  return res.json();
}

export async function sendMessage(data: {
  conversation_id: number;
  message: string;
}) {
  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
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

export async function toggleAdminStatus(id: string) {
  const res = await fetch(`${API_URL}/admins/toggle/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  return res.json();
}
