import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { questions } from "@/lib/form-options";
import { dateRanges, filterQuery, leadWhere, parseLeadFilters, startOfDayInIndia } from "@/lib/lead-filters";
import AutoRefresh from "./AutoRefresh";

export const metadata: Metadata = { title: "Leads | Advanced GroHair Velachery", robots: { index: false, follow: false } };

const PAGE_SIZE = 50;
const dateFormat = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
const questionLabels = questions.map(question => question.title.replace(/\*$/, ""));

const fieldClass = "h-10 w-full rounded-lg border border-ink/15 bg-white px-3 text-sm outline-none transition-colors focus:border-brand focus:ring-3 focus:ring-brand/15";
const labelClass = "mb-1.5 block text-xs font-medium text-ink/60";

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const params = await searchParams;
  const filters = parseLeadFilters(params);
  const where = leadWhere(filters);
  const page = Math.max(1, Number(params.page) || 1);
  const activeFilters = [...filterQuery(filters).keys()].length;

  const [total, today, comfortable, matching, leads] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: startOfDayInIndia() } } }),
    prisma.lead.count({ where: { locationComfortable: true } }),
    prisma.lead.count({ where }),
    prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }),
  ]);
  const pages = Math.max(1, Math.ceil(matching / PAGE_SIZE));
  const query = filterQuery(filters);
  const pageLink = (target: number) => `/admin?${new URLSearchParams([...query, ["page", String(target)]])}`;
  const exportHref = `/admin/export${query.size ? `?${query}` : ""}`;

  const stats = [
    { label: "Total leads", value: total, accent: "bg-ink" },
    { label: "Today", value: today, accent: "bg-brand" },
    { label: "OK with location", value: comfortable, accent: "bg-green-500" },
    { label: "Not OK with location", value: total - comfortable, accent: "bg-amber-500" },
  ];
  const selects = [
    { name: "range", label: "Date", value: filters.range, all: "All time", options: dateRanges },
    { name: "location", label: "Location", value: filters.location, all: "All", options: [["yes", "Comfortable"], ["no", "Not comfortable"]] },
  ];

  return (
    <main className="min-h-svh bg-[#f7f7f8] text-ink">
      <header className="sticky top-0 z-20 border-b border-brand/10 bg-brand-tint/95 backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 sm:px-8">
          <div className="flex items-center gap-4">
            <Image src="/ambatur-logo.jpg" alt="Advanced GroHair" width={300} height={126} priority className="h-11 w-auto mix-blend-multiply" />
            <span className="hidden border-l border-ink/15 pl-4 text-sm font-semibold text-ink/70 lg:block">Leads dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <AutoRefresh seconds={15} />
            <a href={exportHref} className="flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark" aria-label="Download CSV">
              <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" aria-hidden="true"><path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></svg>
              <span className="max-sm:sr-only">Download CSV</span>
            </a>
          </div>
        </div>
      </header>

      <div className="space-y-6 px-4 py-8 sm:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Consultation leads</h1>
          <p className="mt-1 text-sm text-ink/60">Every hair transplant form submission from the Velachery chatbot.</p>
        </div>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Summary">
          {stats.map(stat => <div key={stat.label} className="relative overflow-hidden rounded-2xl border border-ink/8 bg-white p-5 shadow-[0_1px_2px_#0000000a]">
            <span className={`absolute inset-y-0 left-0 w-1 ${stat.accent}`} aria-hidden="true" />
            <p className="text-sm text-ink/60">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{stat.value}</p>
          </div>)}
        </section>

        <form action="/admin" className="flex flex-wrap items-end gap-3 rounded-2xl border border-ink/8 bg-white p-4 shadow-[0_1px_2px_#0000000a]" aria-label="Filter leads">
          <label className="min-w-[220px] flex-1">
            <span className={labelClass}>Search</span>
            <span className="relative block">
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 fill-none stroke-ink/40 stroke-2 [stroke-linecap:round]" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input name="q" defaultValue={filters.q} placeholder="Name, phone or email" className={`${fieldClass} pl-9`} />
            </span>
          </label>
          {selects.map(select => <label key={select.name} className="w-full sm:w-48">
            <span className={labelClass}>{select.label}</span>
            <select name={select.name} defaultValue={select.value} className={`${fieldClass} cursor-pointer pr-8`}>
              <option value="">{select.all}</option>
              {select.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>)}
          <div className="flex gap-2">
            <button type="submit" className="h-10 cursor-pointer rounded-lg bg-ink px-5 text-sm font-semibold text-white hover:bg-ink/85">Apply</button>
            {activeFilters > 0 && <Link href="/admin" className="flex h-10 items-center rounded-lg border border-ink/15 px-4 text-sm font-medium hover:border-brand hover:text-brand">Clear</Link>}
          </div>
        </form>

        <section className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-[0_1px_2px_#0000000a]" aria-label="Leads">
          <div className="flex items-center justify-between gap-3 border-b border-ink/8 px-5 py-3.5">
            <h2 className="text-sm font-semibold">{activeFilters ? `${matching} of ${total} leads` : `${total} leads`}</h2>
            {pages > 1 && <span className="text-xs text-ink/50">Page {page} of {pages}</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-ink/[.025] text-xs text-ink/55">
                <tr>{["Date", "Name", "Phone", "Email", ...questionLabels, "Location"].map(h => <th key={h} className="max-w-[220px] px-4 py-3 align-bottom font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-ink/[.06]">
                {leads.map(lead => <tr key={lead.id} className="align-top transition-colors hover:bg-brand-tint/60">
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="block font-medium">{dateFormat.format(lead.createdAt)}</span>
                    <span className="text-xs text-ink/50">{timeFormat.format(lead.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3.5 font-medium">{lead.name}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap"><a href={`tel:${lead.phone}`} className="font-medium text-brand hover:underline">{lead.phone}</a></td>
                  <td className="px-4 py-3.5">{lead.email ? <a href={`mailto:${lead.email}`} className="hover:text-brand">{lead.email}</a> : <span className="text-ink/30">—</span>}</td>
                  <td className="max-w-[220px] px-4 py-3.5 text-ink/80">{lead.budget}</td>
                  <td className="max-w-[220px] px-4 py-3.5 text-ink/80">{lead.planning}</td>
                  <td className="max-w-[220px] px-4 py-3.5 text-ink/80">{lead.concern}</td>
                  <td className="px-4 py-3.5"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${lead.locationComfortable ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}><span className={`size-1.5 rounded-full ${lead.locationComfortable ? "bg-green-500" : "bg-amber-500"}`} aria-hidden="true" />{lead.locationComfortable ? "Comfortable" : "Not comfortable"}</span></td>
                </tr>)}
                {leads.length === 0 && <tr><td colSpan={8} className="px-4 py-16 text-center">
                  <p className="font-medium">{activeFilters ? "No leads match these filters" : "No leads yet"}</p>
                  <p className="mt-1 text-sm text-ink/50">{activeFilters ? "Try removing a filter or widening the dates." : "New form submissions will appear here automatically."}</p>
                </td></tr>}
              </tbody>
            </table>
          </div>
          {pages > 1 && <nav className="flex items-center justify-between gap-3 border-t border-ink/8 px-5 py-3 text-sm" aria-label="Pagination">
            <span className="text-ink/60">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, matching)} of {matching}</span>
            <div className="flex gap-2">
              {page > 1 && <Link href={pageLink(page - 1)} className="rounded-lg border border-ink/15 px-3 py-1.5 font-medium hover:border-brand hover:text-brand">← Previous</Link>}
              {page < pages && <Link href={pageLink(page + 1)} className="rounded-lg border border-ink/15 px-3 py-1.5 font-medium hover:border-brand hover:text-brand">Next →</Link>}
            </div>
          </nav>}
        </section>
      </div>
    </main>
  );
}
