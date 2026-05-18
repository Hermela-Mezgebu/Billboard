"use client";

import React from "react";

interface Testimonial {
  name: string;
  username: string;
  image: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
}

const testimonials: Testimonial[] = [
  {
    name: "SynthGen AI",
    username: "@synthgenai",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    content:
      "Listing on EliteAI.tools gave us a 40% boost in signups! The quality of traffic is incredible.",
    likes: 143,
    comments: 24,
    time: "3:42 PM · Feb 12, 2025",
  },
  {
    name: "NeuralScribe",
    username: "@neuralscribe",
    image: "https://randomuser.me/api/portraits/men/24.jpg",
    content:
      "Fast-tracking our listing was the best decision. Went from zero to 500+ users in two weeks!",
    likes: 217,
    comments: 53,
    time: "11:28 AM · Jan 29, 2025",
  },
  {
    name: "QuantumWrite",
    username: "@quantumwriteai",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    content:
      "Boosted plan delivered incredible ROI. Demo requests increased 3x in the first month.",
    likes: 189,
    comments: 42,
    time: "4:15 PM · Feb 3, 2025",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 bg-gray-800 text-white rounded-lg shadow-md transition hover:shadow-lg hover:-translate-y-1"
            >
              {/* HEADER */}
              <div className="flex items-start mb-4">
                <img
                  src={t.image}
                  className="w-12 h-12 rounded-full mr-4"
                  alt="profile"
                />

                <div>
                  <h3 className="font-bold">{t.name}</h3>
                  <p className="text-sm text-gray-300">{t.username}</p>
                </div>

                {/* Twitter Icon */}
                <svg
                  className="w-6 h-6 text-blue-500 ml-auto"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                </svg>
              </div>

              {/* CONTENT */}
              <p className="text-gray-300">{t.content}</p>

              {/* FOOTER */}
              <div className="flex items-center mt-4 text-gray-400 text-sm">
                ❤️ {t.likes}
                <span className="mx-4">💬 {t.comments}</span>
                <span>{t.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}