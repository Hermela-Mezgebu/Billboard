import { blogData } from "@/data/blogData";
import Image from "next/image";
import { notFound } from "next/navigation";

export default function BlogDetails({ params }: { params: { id: string } }) {
  const blog = blogData.find((b) => b.id === Number(params.id));

  if (!blog) return notFound();

  return (
    <section className="min-h-screen bg-slate-950 text-white px-6 py-24">
      
      <div className="max-w-4xl mx-auto space-y-10">

        {/* IMAGE */}
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
          <Image
            src={blog.featuredImg}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>

        {/* META */}
        <div className="flex items-center gap-4 text-sm text-white/60">
          <span>{blog.date}</span>
          <span>•</span>
          <span>{blog.ownerName}</span>
          <span className="bg-indigo-600 px-2 py-1 rounded text-xs">
            {blog.category}
          </span>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold">{blog.title}</h1>

        {/* CONTENT */}
        <p className="text-white/80 leading-relaxed whitespace-pre-line">
          {blog.content}
        </p>

      </div>
    </section>
  );
}