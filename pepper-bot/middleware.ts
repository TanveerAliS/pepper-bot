import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Example: Add CORS headers for iframe embedding
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  // Allow embedding in iframe from any origin (customize for security)
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("X-Frame-Options", "ALLOWALL");
  return response;
}

export const config = {
  matcher: ["/widget", "/widget/:path*"],
};
