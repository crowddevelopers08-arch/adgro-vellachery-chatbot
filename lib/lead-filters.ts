import type { Prisma } from "./generated/prisma/client";

type Params = Record<string, string | string[] | undefined>;

export const dateRanges = [["today", "Today"], ["7d", "Last 7 days"], ["30d", "Last 30 days"]] as const;
const rangeDays: Record<string, number> = { today: 0, "7d": 6, "30d": 29 };

const text = (params: Params, key: string) => typeof params[key] === "string" ? params[key].trim() : "";
const oneOf = (value: string, options: readonly string[]) => options.includes(value) ? value : "";

// Reads dashboard filters from the URL, ignoring anything that isn't a real option.
export function parseLeadFilters(params: Params) {
  return {
    q: text(params, "q").slice(0, 100),
    range: oneOf(text(params, "range"), dateRanges.map(([value]) => value)),
    location: oneOf(text(params, "location"), ["yes", "no"]),
  };
}

export type LeadFilters = ReturnType<typeof parseLeadFilters>;

// Start of the day `daysAgo` days back, in India time.
export function startOfDayInIndia(daysAgo = 0) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const start = new Date(`${today}T00:00:00+05:30`);
  start.setUTCDate(start.getUTCDate() - daysAgo);
  return start;
}

export function leadWhere({ q, range, location }: LeadFilters): Prisma.LeadWhereInput {
  return {
    ...(q && { OR: [{ name: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }, { email: { contains: q, mode: "insensitive" } }] }),
    ...(range && { createdAt: { gte: startOfDayInIndia(rangeDays[range]) } }),
    ...(location && { locationComfortable: location === "yes" }),
  };
}

export function filterQuery(filters: LeadFilters) {
  return new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
}
