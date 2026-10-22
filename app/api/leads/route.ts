import { createLead } from "@/lib/leads";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await createLead(body);
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });
  return Response.json({ ok: true }, { status: 201 });
}
