import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Trash2,
  Eye,
  Tag,
  Newspaper,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Article {
  id: string;
  title: string;
  category: string;
  status: 'Published' | 'Draft';
  date: string;
  views: number;
}

export function ContentManager() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ SAFE REAL LOGIC (NO FAKE API)
  const fetchData = async () => {
    try {
      setLoading(true);

      // 👉 Replace this with real API later
      const data: Article[] = []; // empty until backend ready

      setNews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ SAFE DELETE (NO API YET)
  const handleDelete = async (id: string) => {
    try {
      // 👉 Replace with delete API later
      setNews(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const publishedCount = news.filter(n => n.status === 'Published').length;
  const draftCount = news.filter(n => n.status !== 'Published').length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">
            Marketplace Intelligence
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Manage news, updates, and platform announcements
          </p>
        </div>

        <button className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-500/40 hover:-translate-y-0.5 hover:shadow-indigo-500/60 transition-all flex items-center gap-3">
          <Plus size={20} />
          Create Article
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-brand-card rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
            <h3 className="text-sm font-black dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Newspaper size={18} className="text-indigo-600" />
              Content Library
            </h3>

            <div className="flex gap-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 text-[10px] font-black rounded-full uppercase">
                {publishedCount} Published
              </span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black rounded-full uppercase">
                {draftCount} Draft
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                Loading content...
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50 dark:border-slate-800">
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Article Details
                    </th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Category
                    </th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Engagement
                    </th>
                    <th className="p-6"></th>
                  </tr>
                </thead>

                <tbody>
                  {news.map(item => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors group"
                    >
                      <td className="p-6">
                        <h4 className="text-sm font-bold dark:text-white group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                          Modified {new Date(item.date).toLocaleDateString()}
                        </p>
                      </td>

                      <td className="p-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
                          <Tag size={10} className="text-slate-400" />
                          <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase">
                            {item.category}
                          </span>
                        </div>
                      </td>

                      <td className="p-6">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          item.status === 'Published'
                            ? "text-green-500"
                            : "text-amber-500"
                        )}>
                          {item.status}
                        </span>
                      </td>

                      <td className="p-6">
                        <div className="flex items-center gap-2 text-slate-500 font-black text-xs">
                          <Eye size={14} />
                          {item.views}
                        </div>
                      </td>

                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Plus size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && news.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                No articles yet
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE (UNCHANGED) */}
        <div className="space-y-8">
          <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-500/40 relative overflow-hidden group">
            <Newspaper className="absolute -right-8 -top-8 text-white/10 group-hover:rotate-12 transition-transform duration-700" size={180} />

            <h3 className="text-2xl font-black uppercase tracking-tighter relative z-10">
              Live Updates
            </h3>

            <p className="text-indigo-100 text-sm font-medium mt-2 relative z-10">
              Keep your audience informed about network changes and trends.
            </p>

            <div className="mt-10 space-y-4 relative z-10">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <p className="text-[10px] font-black uppercase text-indigo-200">
                  Tip of the day
                </p>
                <p className="text-xs font-medium mt-1">
                  Articles with case studies have 4.2x higher engagement.
                </p>
              </div>
            </div>

            <button className="mt-10 w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
              View Marketplace
            </button>
          </div>

          <div className="bg-white dark:bg-brand-card rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black dark:text-white uppercase tracking-wider">
                Asset Library
              </h3>
              <ImageIcon size={20} className="text-slate-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center group cursor-pointer hover:border-indigo-600 transition-all">
                  <Plus size={20} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}