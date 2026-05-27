export type UserRole = "client" | "owner" | "admin";

/* ✅ OWNER TYPE */
export interface Owner {
  id?: number;
  name: string;
  description?: string;
  logo?: string;
}

/* ✅ BILLBOARD TYPE (FIXED TO MATCH DATA) */
export interface Billboard {
  id: number;

  // ✅ IMAGES
  image?: string;
 // fallback for old data
  additionalImages?: string[];
  // ✅ ADD THIS
  videoUrl?: string;
  // ✅ BASIC INFO
  location: string;
  neighborhood: string;
  description: string;

  // ✅ SPECS (MATCH YOUR DATA)
  size?: string;
  width?: number;
  height?: number | string;
  screens?: number;
  no_of_screens?: number;
  lighting?: string;
  light_type?: string;
  placement?: string;
  reach?: string;
latitude: number;
longitude: number;
  // ✅ PRICING
  pricePerMonth: number;

  // ✅ EXTRA
  category?: string;

  // ✅ OWNER
  owner?: Owner;
}

const billboardData: Billboard[] = [];

/* ✅ BOOKING */
export interface Booking {
  id: string;
  totalPrice: number;
  status: "pending" | "approved" | "rejected";
  startDate: string;
  endDate: string;
}

/* ✅ BLOG */
export interface Blog {
  id: number;
  title: string;
  description: string;
  featuredImg: string;
  date: string;
  ownerName: string;
  ownerImg: string;
  category: string;
  content: string;
}