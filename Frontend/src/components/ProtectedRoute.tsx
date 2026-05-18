"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 🔒 Not logged in
    if (!loading && !user) {
      router.push("/login");
    }

    // 🚫 Role not allowed
    if (
      !loading &&
      user &&
      allowedRoles &&
      role &&
      !allowedRoles.includes(role)
    ) {
      router.push("/"); // or better: redirect to their own dashboard
    }
  }, [user, role, loading]);

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-3 text-gray-500">Checking access...</p>
      </div>
    );
  }

  // 🚫 Block render while redirecting
  if (!user) return null;

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}