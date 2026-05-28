"use client";

import { useParams } from "next/navigation";
import { blogs } from "@/data/blogs";

export default function BlogDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const blog = blogs.find((b) => b.id === id);


  if (!blog) {
    return (
      <div className="p-10 text-center text-red-400">
        Blog not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* IMAGE */}
      <div className="w-full h-[400px]">
        <img
          src={blog.featuredImg}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto p-8">

        <h1 className="text-3xl font-bold mb-4">
          {blog.title}
        </h1>

        <div className="text-gray-400 text-sm mb-6 flex items-center gap-3">
          <img
            src={blog.ownerImg}
            className="w-8 h-8 rounded-full"
          />
          <span>{blog.ownerName}</span>
          <span>•</span>
          <span>{blog.date}</span>
        </div>

        <p className="text-gray-300 leading-relaxed">
          {blog.content}
        </p>

      </div>
    </div>
  );
}