import { Billboard } from "../types";

export const billboardData = [
  {
    id: 1,
    location: "Addis Ababa, Stadium",
    neighborhood: "Stadium",
    latitude: 8.9806,
    longitude: 38.7578,
    image: "/images/b1.jpg",
    pricePerMonth: 500,
    category: "Digital",
    description: "Prime Bole billboard",
    owner: { name: "Ad Corp", logo: "/logo.png", description: "Top ads" }
  },
  {
    id: 2,
    location: "Addis Ababa, Kazanchis",
    neighborhood: "Kazanchis",
    latitude: 8.991,
    longitude: 38.76,
    image: "/images/b2.jpg",
    pricePerMonth: 450,
    category: "Static",
    description: "Kazanchis area",
    owner: { name: "Ad Corp", logo: "/logo.png", description: "Top ads" }
  },
  {
    id: 3,
    location: "Addis Ababa, Megenagna",
    neighborhood: "Megenagna",
    latitude: 9.01,
    longitude: 38.8,
    image: "/images/b3.jpg",
    pricePerMonth: 600,
    category: "Digital",
    description: "Busy intersection",
    owner: { name: "Ad Corp", logo: "/logo.png", description: "Top ads" }
  }
];