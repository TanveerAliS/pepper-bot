import React from "react";
import { ChatWidget } from "@/components/ChatWidget";
import { cookies } from "next/headers";

// Helper to parse query params for widget config
function getWidgetConfig(searchParams: Record<string, string | string[] | undefined>) {
  return {
    primaryColor: typeof searchParams.primaryColor === "string" ? decodeURIComponent(searchParams.primaryColor) : undefined,
    logoUrl: typeof searchParams.logoUrl === "string" ? decodeURIComponent(searchParams.logoUrl) : undefined,
    fontFamily: typeof searchParams.fontFamily === "string" ? decodeURIComponent(searchParams.fontFamily) : undefined,
    darkMode: searchParams.darkMode === "true",
  };
}

export default function WidgetPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  // Optionally, pass auth token from cookies or parent page
  // const token = cookies().get('token')?.value;
  const config = getWidgetConfig(searchParams);
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <ChatWidget {...config} />
    </div>
  );
}
