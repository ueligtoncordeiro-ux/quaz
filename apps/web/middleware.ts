import { NextResponse, type NextRequest } from "next/server";
import { brand } from "@quaz/config";

const canonicalHost = brand.primaryDomain;
const redirectedHosts = new Set([
  brand.secondaryDomain,
  `www.${brand.primaryDomain}`,
  `www.${brand.secondaryDomain}`
]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();

  if (host && redirectedHosts.has(host)) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = canonicalHost;

    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.png).*)"]
};
