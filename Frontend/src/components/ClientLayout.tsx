"use client";

import { useState, useEffect } from "react";
import {Navbar}  from "@/components/Navbar";
import { AuthModal } from "@/components/AuthModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PageTransition from "./PageTransition";
import { AnimatePresence } from "framer-motion";
import Footer from "./Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // 🔥 IMPORTANT: must match AuthModal type
  const [authMode, setAuthMode] = useState<"login" | "signup" | "role">("role");

  const openAuth = (mode: "login" | "signup" | "role") => {
    if (mode === "role") {
      router.push("/choose-role");
      return;
    }

    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // ✅ HANDLE QUERY PARAMS
  useEffect(() => {
    const auth = searchParams.get("auth");

    if (auth === "signup") {
      setAuthMode("signup");
      setIsAuthOpen(true);
    }
  }, [searchParams]);

  return (
    <>
     <Navbar 
  onOpenAuth={openAuth} 
  onNavigate={(page) => router.push(`/${page}`)} 
/>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}          // ✅ FIX
        setMode={setAuthMode}    // ✅ FIX
      />

      <AnimatePresence mode="wait">
        <PageTransition key={pathname}>
          {children}
        </PageTransition>
      </AnimatePresence>

      <Footer />
    </>
  );
}