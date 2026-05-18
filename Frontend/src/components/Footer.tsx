"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer>

      {/* 🔥 TOP SECTION */}
      <div className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between gap-10">

            {/* 🔥 BRAND */}
            <div className="w-full xl:w-1/5">
              <Link href="/" className="block w-48 mb-6">
                <h1 className="text-2xl font-bold text-white">
                  Billboard<span className="text-indigo-500">Pro</span>
                </h1>
              </Link>

              <p className="text-sm leading-6">
                A modern billboard rental platform helping businesses launch
                high-impact outdoor advertising campaigns with smart analytics
                and premium locations.
              </p>
            </div>

            {/* 🔥 LINKS */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 border-b border-indigo-500 pb-2">
                Useful Links
              </h2>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-indigo-400">About</Link></li>
                <li><Link href="/services" className="hover:text-indigo-400">Services</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-400">Contact</Link></li>
                <li><Link href="#" className="hover:text-indigo-400">Terms</Link></li>
                <li><Link href="#" className="hover:text-indigo-400">Privacy</Link></li>
                <li><Link href="/faqs" className="hover:text-indigo-400">FAQs</Link></li>
              </ul>
            </div>

            {/* 🔥 BLOG */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 border-b border-indigo-500 pb-2">
                Blog
              </h2>
              <ul className="space-y-2">
                <li><Link href="/blog/1" className="hover:text-indigo-400">Top Billboard Strategies</Link></li>
                <li><Link href="/blog/2" className="hover:text-indigo-400">Why Outdoor Ads Work</Link></li>
                <li><Link href="/blog/3" className="hover:text-indigo-400">Digital Billboard Trends</Link></li>
                <li><Link href="/blog" className="hover:text-indigo-400">See More</Link></li>
              </ul>
            </div>

            {/* 🔥 NEWSLETTER */}
            <div className="w-full xl:w-1/4">
              <h2 className="text-xl font-semibold text-white mb-4 border-b border-indigo-500 pb-2">
                Newsletter
              </h2>

              <p className="text-sm mb-4">
                Get updates on billboard deals, promotions, and marketing insights.
              </p>

              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 rounded-md bg-white text-black outline-none"
                />

                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
                >
                  Subscribe
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* 🔥 BOTTOM SECTION */}
      <div className="bg-black text-gray-400 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">

          <p className="text-sm text-center sm:text-left">
            © {new Date().getFullYear()} BillboardPro. All rights reserved.
          </p>

          {/* 🔥 SOCIALS */}
          <div className="flex gap-3">

            <SocialIcon>
              {/* Facebook */}
              <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
            </SocialIcon>

            <SocialIcon>
              {/* Twitter */}
              <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/>
            </SocialIcon>

            <SocialIcon>
              {/* Instagram */}
              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7z"/>
            </SocialIcon>

          </div>
        </div>
      </div>

    </footer>
  );
}

/* 🔥 SOCIAL ICON COMPONENT */
function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#"
      className="w-9 h-9 flex items-center justify-center border border-gray-500 rounded-full hover:border-indigo-400 hover:text-indigo-400 transition"
    >
      <svg
        className="w-4 h-4 fill-current"
        viewBox="0 0 512 512"
      >
        {children}
      </svg>
    </a>
  );
}