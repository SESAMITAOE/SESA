import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseConfiguration } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

export async function updateSupabaseSession(request: NextRequest) {
  const configuration = getSupabaseConfiguration();
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (!configuration) {
    if (!isLoginRoute) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "configuration");
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(
    configuration.url,
    configuration.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLoginRoute) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}
