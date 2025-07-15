import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Example: Add CORS headers for iframe embedding
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  // Allow embedding in iframe from your deployment domain
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("X-Frame-Options", "ALLOWALL");
  response.headers.set(
    "Content-Security-Policy",
    "frame-src 'self' https://pepper-ofkzig7d8-tanveeralims-projects.vercel.app;"
  );
  return response;
}

export const config = {
  matcher: ["/widget", "/widget/:path*"],
};
