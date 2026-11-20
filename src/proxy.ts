import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

type Locale = (typeof routing.locales)[number];

function isSupportedLocale(
  value: string | undefined,
): value is Locale {
  return routing.locales.some(
    (locale) => locale === value,
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const firstSegment = pathname.split("/")[1];

  // Explicit locale prefixes always take priority.
  if (isSupportedLocale(firstSegment)) {
    return handleI18nRouting(request);
  }

  // Use the previously selected locale when available.
  const savedLocale = request.cookies.get("NEXT_LOCALE")?.value;

  const locale = isSupportedLocale(savedLocale)
    ? savedLocale
    : routing.defaultLocale;

  // Redirect unprefixed routes to the selected locale.
  const url = request.nextUrl.clone();

  url.pathname =
    `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);

  // Persist the locale preference for one year.
  response.cookies.set("NEXT_LOCALE", locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};