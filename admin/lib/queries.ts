import type { FilterQuery } from "mongoose";
export type Query = {
  q?: string;
  status?: string;
  page?: string;
  source?: string;
  favorite?: string;
  type?: string;
  action?: string;
  from?: string;
  to?: string;
  deleted?: string;
  saved?: string;
  created?: string;
  denied?: string;
};
export const pageSize = 10;
export function requestedPage(query: Query) {
  return Math.min(100000, Math.max(1, Math.floor(Number(query.page) || 1)));
}
export function searchFilter(query: Query, fields: string[]): FilterQuery<any> {
  const q = (query.q || "").trim().slice(0, 120);
  return q
    ? {
        $or: fields.map((field) => ({
          [field]: {
            $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $options: "i",
          },
        })),
      }
    : {};
}
export function href(
  path: string,
  query: Query,
  changes: Record<string, string>,
) {
  const params = new URLSearchParams();
  Object.entries({ ...query, ...changes }).forEach(([k, v]) => {
    if (v && !["deleted", "saved", "created", "denied"].includes(k))
      params.set(k, v);
  });
  return `${path}?${params}`;
}
