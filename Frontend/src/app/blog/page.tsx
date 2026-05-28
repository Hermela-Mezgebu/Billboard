"use client";

import { useState } from "react";
import BlogCard from "@/components/BlogCard";
import { Pagination } from "@/components/Pagination";
import { motion } from "framer-motion";
import { blogs } from "@/data/blogs";
interface Blog {
  id: number;
  featuredImg: string;
  date: string;
  ownerImg: string;
  ownerName: string;
  title: string;
}

export default function BlogPage() {
  
  return (
    <div className="w-full pt-40 pb-28 min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* HEADER */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Latest Blogs
          </h2>

          <p className="mt-2 text-lg text-gray-300">
            Dive into the latest in outdoor advertising and marketing insights.
          </p>
        </motion.div>

        {/* BLOG GRID */}
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-8 sm:mt-12 lg:max-w-none lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              featuredImg={blog.featuredImg}
              date={blog.date}
              ownerImg={blog.ownerImg}
              ownerName={blog.ownerName}
              title={blog.title}
            />
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center mt-12">
          <Pagination />
        </div>

      </div>
    </div>
  );
}