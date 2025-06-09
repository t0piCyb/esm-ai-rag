import { OrganizationTag } from "@/generated/prisma";
import { getOrgsTagsCache } from "@/lib/react/cache";
import { adminOwnerRoute } from "@/lib/safe-route";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = adminOwnerRoute
  .params(
    z.object({
      orgId: z.string(),
    }),
  )
  .handler(
    async (req, { params, ctx }): Promise<NextResponse<OrganizationTag[]>> => {
      const tags = await getOrgsTagsCache(params.orgId);
      return NextResponse.json(tags);
    },
  );
