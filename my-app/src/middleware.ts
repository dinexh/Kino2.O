import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { verifyJWT } from "./lib/verfiyJWT";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isPublic = "/";

  const cookieStore = cookies();

  const JWT = cookieStore.get("JWT")?.value;

  const decodedToken = jwt.decode(cookieStore.get("jwt")?.value as string, {
    complete: true,
  });

  const userData: any = decodedToken?.payload;

  const { valid, payload } = await verifyJWT();

  console.log(userData)
  const role = userData?.role;

  if (!valid && path !== isPublic && path !== "/auth/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);  
  }

  if (path === "/auth/login" && valid) {

    if (role === "Admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/home";
      return NextResponse.redirect(url)
    }
    else {
      const url = req.nextUrl.clone();
      url.pathname = "/lead/home";
      return NextResponse.redirect(url)
    }
  }

  // admin pages
  if (path.includes("/admin") && role !== "Admin") {
    return NextResponse.json(
      { message: "You are not authorized to view this page" },
      { status: 401 }
    );
  }
  // lead pages
  else if (
    path.includes("/lead") &&
    role !== "club_lead" &&
    role !== "Admin"
  ) {
    return NextResponse.json(
      { message: "You are not authorized to view this page" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ["/", "/", "/auth/login", "/admin/:path*", "/lead/:path*"],
};