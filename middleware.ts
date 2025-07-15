import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Example: Add CORS headers for iframe embedding
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  // Allow embedding in iframe from your deployment domain (handled globally in next.config.js)
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export const config = {
  matcher: ["/widget", "/widget/:path*"],
};
