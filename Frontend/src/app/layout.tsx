import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from "@/components/ClientLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-900 text-gray-400 py-12" suppressHydrationWarning>
        <AuthProvider>
          {/* ✅ ONLY ONE WRAPPER */}
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}