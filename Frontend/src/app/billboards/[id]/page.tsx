import { notFound } from "next/navigation";
import { billboardData } from "@/data/billboardData";
import BillboardDetail  from "@/components/BillboardDetail";
import type { Billboard } from "@/types"; // ✅ FIXED

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BillboardPage({ params }: PageProps) {
  const { id } = await params;

  const billboard: Billboard | undefined = billboardData.find(
    (b) => b.id === Number(id)
  );

  if (!billboard) return notFound();

  return <BillboardDetail billboard={billboard} />;
}