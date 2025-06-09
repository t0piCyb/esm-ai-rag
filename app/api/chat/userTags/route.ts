import { route } from "@/lib/safe-route";
import { NextResponse } from "next/server";

export const GET = route.handler(
  async (req, { params, ctx }): Promise<NextResponse<{ name: string }[]>> => {
    return NextResponse.json([{ name: "default" }]);
  },
);
