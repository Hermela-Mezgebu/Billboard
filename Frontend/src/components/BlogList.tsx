"use client";

import BlogCard from "./BlogCard";
import { Blog } from "@/types";

export default function BlogList({ blogs }: { blogs: Blog[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} {...blog} />
      ))}
    </div>
  );
}