"use client";

import { use } from "react";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function DashboardSubjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  return <DashboardContent initialTab="subjects" />;
}

