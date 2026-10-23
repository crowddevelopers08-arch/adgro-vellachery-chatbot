import "server-only";
import { prisma } from "./prisma";
import { questions } from "./form-options";

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  city: string;
  pageUrl: string;
  answers: number[];
  locationComfortable: boolean;
};

// TeleCRM wants the number with a country code; the form only collects Indian numbers.
function telecrmPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `+91${digits}` : `+${digits}`;
}

// The lead is already saved in our database, so a TeleCRM failure is logged and never shown to the visitor.
async function sendToTelecrm(lead: { pageUrl: string; name: string; phone: string; email: string; city: string; budget: string; planning: string; concern: string; locationComfortable: boolean }) {
  const url = process.env.TELECRM_API_URL;
  const key = process.env.TELECRM_API_KEY;
  if (!url || !key) { console.error("TeleCRM is not configured: set TELECRM_API_URL and TELECRM_API_KEY"); return; }
  // One note per field (each shows as its own row on the lead timeline) plus a one-line summary.
  const notes = [
    ["Source", "Velachery hair transplant"],
    ["Name", lead.name],
    ["Phone", telecrmPhone(lead.phone)],
    ["Email", lead.email || "Not provided"],
    ["City / Area", lead.city],
    ["Budget", lead.budget],
    ["Planning", lead.planning],
    ["Stopping them", lead.concern],
    ["Comfortable with location", lead.locationComfortable ? "Yes" : "No"],
    ["Page URL", lead.pageUrl || "Unknown"],
  ];
  const actions = [
    { type: "SYSTEM_NOTE", text: `Details: ${notes.map(([label, value]) => `${label}: ${value}`).join(" | ")}` },
    ...notes.map(([label, value]) => ({ type: "SYSTEM_NOTE", text: `${label}: ${value}` })),
  ];
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        fields: { name: lead.name, phone: telecrmPhone(lead.phone), ...(lead.email && { email: lead.email }) },
        actions,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) console.error("TeleCRM rejected lead", response.status, await response.text().catch(() => ""));
  } catch (error) {
    console.error("Failed to send lead to TeleCRM", error);
  }
}

const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

// Anyone can POST to the API, so validate everything before saving.
export async function createLead(input: Partial<LeadInput> | null): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const name = clean(input?.name, 120);
  const phone = clean(input?.phone, 20);
  const email = clean(input?.email, 120);
  const city = clean(input?.city, 120);
  const pageUrl = clean(input?.pageUrl, 500);
  const answers = Array.isArray(input?.answers) ? input.answers : [];
  const digits = phone.replace(/\D/g, "");

  if (!name) return { ok: false, status: 400, error: "Please enter your name." };
  if (digits.length < 10 || digits.length > 13 || !/^[+\d\s()-]+$/.test(phone)) return { ok: false, status: 400, error: "Please enter a valid phone number." };
  if (!city) return { ok: false, status: 400, error: "Please enter your city / area." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, status: 400, error: "Please enter a valid email address." };
  if (questions.some((question, i) => !Number.isInteger(answers[i]) || !question.options[answers[i]])) return { ok: false, status: 400, error: "Please answer all the questions." };

  try {
    const details = {
      budget: questions[0].options[answers[0]],
      planning: questions[1].options[answers[1]],
      concern: questions[2].options[answers[2]],
      locationComfortable: input?.locationComfortable === true,
    };
    await prisma.lead.create({ data: { name, phone, email: email || null, city, ...details } });
    await sendToTelecrm({ name, phone, email, city, pageUrl, ...details });
    return { ok: true };
  } catch (error) {
    console.error("Failed to save lead", error);
    return { ok: false, status: 500, error: "Something went wrong. Please try again or call us." };
  }
}
