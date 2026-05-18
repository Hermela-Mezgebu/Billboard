"use client";

import Image from "next/image";

export default function Contact() {
  return (
    <section className="py-20 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">

          {/* 🔥 LEFT IMAGE + CONTACT INFO */}
          <div className="w-full h-full">
            <div className="relative h-full group">

              {/* IMAGE */}
              <Image
                src="/img/billboard-6.jpg"
                alt="Contact"
                width={800}
                height={600}
                className="w-full h-full object-cover rounded-2xl lg:rounded-l-2xl"
              />

              {/* OVERLAY INFO */}
              <div className="absolute bottom-0 w-full p-5 lg:p-10">
                <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 space-y-6">

                  {/* PHONE */}
                  <div className="flex items-center gap-4">
                    <IconPhone />
                    <span className="text-sm">+251913444130</span>
                  </div>

                  {/* EMAIL */}
                  <div className="flex items-center gap-4">
                    <IconMail />
                    <span className="text-sm">info@seeksonic.com</span>
                  </div>

                  {/* LOCATION */}
                  <div className="flex items-center gap-4">
                    <IconLocation />
                    <span className="text-sm">
                      Lagare, Addis Ababa, Ethiopia
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* 🔥 RIGHT FORM */}
          <div className="p-5 lg:p-11 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">

            <h2 className="text-blue-500 text-4xl font-semibold mb-10">
              Send Us A Message
            </h2>

            <form className="space-y-6">

              <input
                type="text"
                placeholder="Name"
                className="w-full h-12 bg-transparent border border-white/20 rounded-full px-4 text-white placeholder-gray-400 focus:outline-none"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full h-12 bg-transparent border border-white/20 rounded-full px-4 text-white placeholder-gray-400 focus:outline-none"
              />

              <input
                type="tel"
                placeholder="Phone"
                className="w-full h-12 bg-transparent border border-white/20 rounded-full px-4 text-white placeholder-gray-400 focus:outline-none"
              />

              <textarea
                placeholder="Message"
                className="w-full h-28 bg-transparent border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
              />

              <button
                type="submit"
                className="w-full h-12 bg-blue-600 rounded-full font-semibold hover:bg-blue-700 transition"
              >
                Send
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

//////////////////////////////////////////////////////
// 🔥 ICONS (clean reusable)
//////////////////////////////////////////////////////

function IconPhone() {
  return (
    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.1 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.81.37 1.6.72 2.34a2 2 0 0 1-.45 2.11L9.03 10.97a16 16 0 0 0 6 6l1.8-1.35a2 2 0 0 1 2.11-.45c.74.35 1.53.6 2.34.72A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function IconMail() {
  return (
    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M4 4h16v16H4z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

function IconLocation() {
  return (
    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z"/>
      <circle cx="12" cy="11" r="2"/>
    </svg>
  );
}