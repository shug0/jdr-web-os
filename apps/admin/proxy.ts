import type { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@workspace/data/server";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { response } = await updateSession(request);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
