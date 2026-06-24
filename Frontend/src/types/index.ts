export type UserRole = "client" | "owner" | "admin";

/* ✅ OWNER TYPE */
export interface Owner {
  id?: number;
  name: string;
  description?: string;
  logo?: string;
  profile_image?: string;
  company_name?: string;
  email?: string;
  joined_date?: string;
  total_billboards?: number;
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
   title?: string; // ✅ OPTIONAL TITLE
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
latitude?: number;
longitude?: number;
  // ✅ PRICING
  pricePerMonth: number;

  // ✅ EXTRA
  category: string;

  // ✅ OWNER
  owner?: Owner;
}

/* ✅ CLEAN DATA (FIXED) */
export const billboardData: Billboard[] = [
  {
    id: 1,
    location: "Addis Ababa",
    neighborhood: "Piyasa",
    description:
      "Prime location in the heart of Addis with high foot traffic and massive visibility.",

    image:
      "/img/billboard-1.jpg",

    additionalImages: [
       "/public/img/billboard-1.jpg",
        "/public/img/billboard-6.jpg"
    ],

    screens: 2,
    width: 4,
    height: "2m",
    lighting: "High Power",

    pricePerMonth: 47,
    category: "Digital",
    placement: "High Traffic Area",
    reach: "60,000 - 100,000",

    owner: {
      id: 2,
      name: "Esayas General Advertising",
      description: "Leader in outdoor advertising",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=EG",
    },
  },

  {
    id: 2, // ✅ FIXED
    location: "Addis Ababa",
    neighborhood: "Megenagna",
    description:
      "Busy intersection connecting major routes, ideal for brand awareness.",

    image:
      "/img/billboard-6.jpg",

    additionalImages: [
      "/img/billboard-2.jpg",
      "/img/billboard-7.jpg",
    ],

    screens: 2,
    width: 4,
    height: "2m",
    lighting: "Wide Spot",

    pricePerMonth: 77,
    category: "Static",
    placement: "Roundabout Hub",
    reach: "80,000 - 150,000",

    owner: {
      id: 2,
      name: "Esayas General Advertising",
      description: "Leader in outdoor advertising",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=EG",
    },
  },

  {
    id: 3, // ✅ FIXED
    location: "Addis Ababa",
    neighborhood: "4 Kilo",
    description:
      "Close to government offices and universities, reaching a diverse audience.",

    image:
      "/img/billboard-6.jpg",

    additionalImages: [
      "/img/billboard-3-additional-1.jpg",
      "/img/billboard-3-additional-2.jpg"
    ],

    screens: 2,
    width: 4,
    height: "2m",
    lighting: "Multi-Color",

    pricePerMonth: 56,
    category: "Digital",
    placement: "Institutional District",
    reach: "40,000 - 90,000",

    owner: {
      id: 6,
      name: "Bright Media Solutions",
      description: "Specializing in digital displays",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=BM",
    },
  },
];

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
  title?: string;
  description: string;
  featuredImg: string;
  date: string;
  ownerName: string;
  ownerImg: string;
  category: string;
  content: string;
  owner_id?: number;
}