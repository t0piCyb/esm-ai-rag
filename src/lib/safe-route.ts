// app/api/hello/route.ts
import { createZodRoute } from "next-zod-route";
import { NextResponse } from "next/server";

export class RouteError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export const route = createZodRoute({
  handleServerError: (e: Error) => {
    if (e instanceof RouteError) {
      return NextResponse.json(
        { message: e.message, status: e.status },
        {
          status: e.status,
        },
      );
    }

    return NextResponse.json({ message: e.message }, { status: 500 });
  },
});

export const indexRoute = createZodRoute({
  handleServerError: (e: Error) => {
    return NextResponse.json({ message: e.message }, { status: 500 });
  },
});
