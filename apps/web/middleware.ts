import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { brand } from "@quaz/config";

const canonicalHost = brand.primaryDomain;
const redirectedHosts = new Set([
  brand.secondaryDomain,
  `www.${brand.primaryDomain}`,
  `www.${brand.secondaryDomain}`
]);

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();

  // Redirect secondary domains to canonical
  if (host && redirectedHosts.has(host)) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = canonicalHost;
    return NextResponse.redirect(url, 308);
  }

  const { pathname, searchParams } = request.nextUrl;

  // Catch Supabase magic link code landing on homepage and redirect to callback
  if (pathname === "/" && searchParams.has("code")) {
    const url = request.nextUrl.clone();
    url.pathname = "/parceiros/auth/callback";
    return NextResponse.redirect(url);
  }

  // Auth guard for partner panel
  if (pathname.startsWith("/parceiros/painel") || pathname === "/parceiros/entrar") {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (pathname.startsWith("/parceiros/painel") && !user) {
      return NextResponse.redirect(new URL("/parceiros/entrar", request.url));
    }
    if (pathname === "/parceiros/entrar" && user) {
      return NextResponse.redirect(new URL("/parceiros/painel", request.url));
    }

    return supabaseResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.png).*)"]
};
