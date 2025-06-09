import { z } from "zod";

export const PaginatedResultSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    results: z.array(itemSchema).nullable().optional(),
    count: z.number(),
    previous: z.string().nullable(),
    next: z.string().nullable(),
  });

// export type PaginatedResult<T extends z.ZodTypeAny> = z.infer<
//   ReturnType<typeof PaginatedResultSchema<T>>
// >;

export type PaginatedResult<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results?: T[] | null;
};

export const PaginationParamsSchema = z.object({
  search: z.string().optional(),
  filters: z.array(z.string()).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(10),
  sortBy: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
