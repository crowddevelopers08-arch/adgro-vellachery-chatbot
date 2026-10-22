import { prisma } from "@/lib/prisma";
import { questions } from "@/lib/form-options";
import { leadWhere, parseLeadFilters } from "@/lib/lead-filters";

// Quote every cell, and neutralise leading = + - @ so spreadsheets don't run them as formulas
// (plain numbers like "+91 98765 43210" are left alone).
const cell = (value: string) => `"${value.replace(/^[=@]|^[+-](?![\d\s()-]+$)/, "'$&").replace(/"/g, '""')}"`;

// Exports the same leads the dashboard is currently filtered to.
export async function GET(request: Request) {
  const filters = parseLeadFilters(Object.fromEntries(new URL(request.url).searchParams));
  const leads = await prisma.lead.findMany({ where: leadWhere(filters), orderBy: { createdAt: "desc" } });
  const rows = [
    ["Date", "Name", "Phone", "Email", "City / Area", ...questions.map(question => question.title.replace(/\*$/, "")), "Comfortable with location"],
    ...leads.map(lead => [lead.createdAt.toISOString(), lead.name, lead.phone, lead.email ?? "", lead.city ?? "", lead.budget, lead.planning, lead.concern, lead.locationComfortable ? "Yes" : "No"]),
  ];
  const csv = "﻿" + rows.map(row => row.map(cell).join(",")).join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="grohair-velachery-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
