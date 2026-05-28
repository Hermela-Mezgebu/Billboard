"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function ProtectedRoute({ children }: any) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth");
    }
  }, []);

  return children;
}