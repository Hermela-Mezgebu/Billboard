'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowLeft, ArrowUpRight, FileText, Eye, LayoutGrid, BookOpen } from 'lucide-react';
import { ownerService } from '@/services/api';

interface OwnerProfile {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
  company_name: string | null;
  description: string | null;
  joined_date: string;
  total_billboards: number;
}

interface BillboardItem {
  id: number;
  title?: string;
  location: string;
  image?: string;
  price?: number;
  category?: string;
  status?: string;
}

interface BlogItem {
  id: number;
  title: string;
  content: string;
  featured_img: string;
  category: string | null;
  created_at: string;
}

export default function OwnerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const ownerId = Number(params.id);

  const [owner, setOwner] = useState<OwnerProfile | null>(null);
  const [billboards, setBillboards] = useState<BillboardItem[]>([]);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) return;
    setLoading(true);
    Promise.all([
      ownerService.getProfile(ownerId),
      ownerService.getBillboards(ownerId),
      ownerService.getBlogs(ownerId),
    ])
      .then(([profile, billboardsData, blogsData]) => {
        setOwner(profile);
        setBillboards(Array.isArray(billboardsData) ? billboardsData : []);
        setBlogs(Array.isArray(blogsData) ? blogsData : []);
      })
      .catch((err) => console.error('Failed to load owner profile:', err))
      .finally(() => setLoading(false));
  }, [ownerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-brand-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Profile</p>
        </div>
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="min-h-screen bg-white dark:bg-brand-bg flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
            <FileText size={40} className="text-slate-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Owner Not Found</h2>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors mx-auto"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const displayName = owner.company_name || owner.name;
  const avatarSrc = owner.profile_image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(owner.name)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-brand-bg min-h-screen"
    >
      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md dark:bg-brand-bg/80 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 dark:bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.15),transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="shrink-0"
            >
              <div className="h-40 w-40 lg:h-48 lg:w-48 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-800">
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div>
                <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                  {displayName}
                </h1>
                <div className="flex items-center justify-center lg:justify-start gap-3 mt-4">
                  <span className="h-0.5 w-6 bg-indigo-600 rounded-full" />
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Network Partner</span>
                  <span className="h-0.5 w-6 bg-indigo-600 rounded-full" />
                </div>
              </div>

              {owner.description && (
                <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
                  {owner.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-500" />
                  <span className="font-semibold">Joined {owner.joined_date || 'N/A'}</span>
                </div>
                {owner.email && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{owner.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              icon={<LayoutGrid size={24} />}
              label="Total Billboards"
              value={owner.total_billboards}
            />
            <StatCard
              icon={<BookOpen size={24} />}
              label="Total Blogs"
              value={blogs.length}
            />
            <StatCard
              icon={<Eye size={24} />}
              label="Total Views"
              value="—"
            />
          </div>
        </div>
      </section>

      {/* Owner Billboards */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-0.5 w-12 bg-indigo-600" />
            <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.5em]">Inventory</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-16">
            {displayName}&apos;s Billboards
          </h2>

          {billboards.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 font-medium text-lg">No billboards available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {billboards.map((b) => (
                <motion.div
                  key={b.id}
                  whileHover={{ y: -8 }}
                  className="bg-white dark:bg-brand-card rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl group cursor-pointer"
                  onClick={() => router.push(`/billboards/${b.id}`)}
                >
                  <div className="h-52 relative overflow-hidden">
                    <img
                      src={b.image || '/fallback.jpg'}
                      alt={b.title || b.location}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-5 left-5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                      {b.category || 'Standard'}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">
                      {b.title || b.location}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <MapPin size={14} />
                      {b.location}
                    </div>
                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Rate</p>
                        <span className="text-xl font-black text-indigo-600">
                          ${b.price || '—'}
                          <span className="text-xs text-slate-400">/M</span>
                        </span>
                      </div>
                      <button className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <ArrowUpRight size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Owner Blogs */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-0.5 w-12 bg-indigo-600" />
            <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.5em]">Articles</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-16">
            From {displayName}
          </h2>

          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 font-medium text-lg">No blog posts yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <motion.article
                  key={blog.id}
                  whileHover={{ scale: 1.02 }}
                  className="relative isolate flex flex-col justify-end overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 pb-8 pt-72 sm:pt-56 shadow-xl border border-white/5 group cursor-pointer"
                  onClick={() => router.push(`/blog/${blog.id}`)}
                >
                  <img
                    src={blog.featured_img || '/fallback.jpg'}
                    alt={blog.title}
                    className="absolute inset-0 -z-10 object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  {blog.category && (
                    <span className="absolute top-5 left-5 bg-indigo-600 text-xs px-4 py-1.5 rounded-full font-bold tracking-wide">
                      {blog.category}
                    </span>
                  )}
                  <h3 className="mt-4 text-xl font-bold text-white leading-tight group-hover:text-indigo-400 transition">
                    {blog.title}
                  </h3>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition">
                    <span className="text-sm text-indigo-400 font-semibold">
                      Read Article →
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="bg-white dark:bg-brand-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-950 rounded-2xl flex items-center justify-center text-indigo-600">
          {icon}
        </div>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
        {value}
      </p>
    </div>
  );
}
