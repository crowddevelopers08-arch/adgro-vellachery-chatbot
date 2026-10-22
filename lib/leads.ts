import "server-only";
import { prisma } from "./prisma";
import { questions } from "./form-options";

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  city: string;
  answers: number[];
  locationComfortable: boolean;
};

const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

// Anyone can POST to the API, so validate everything before saving.
export async function createLead(input: Partial<LeadInput> | null): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const name = clean(input?.name, 120);
  const phone = clean(input?.phone, 20);
  const email = clean(input?.email, 120);
  const city = clean(input?.city, 120);
  const answers = Array.isArray(input?.answers) ? input.answers : [];
  const digits = phone.replace(/\D/g, "");

  if (!name) return { ok: false, status: 400, error: "Please enter your name." };
  if (digits.length < 10 || digits.length > 13 || !/^[+\d\s()-]+$/.test(phone)) return { ok: false, status: 400, error: "Please enter a valid phone number." };
  if (!city) return { ok: false, status: 400, error: "Please enter your city / area." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, status: 400, error: "Please enter a valid email address." };
  if (questions.some((question, i) => !Number.isInteger(answers[i]) || !question.options[answers[i]])) return { ok: false, status: 400, error: "Please answer all the questions." };

  try {
    await prisma.lead.create({
      data: {
        name,
        phone,
        email: email || null,
        city,
        budget: questions[0].options[answers[0]],
        planning: questions[1].options[answers[1]],
        concern: questions[2].options[answers[2]],
        locationComfortable: input?.locationComfortable === true,
      },
    });
    return { ok: true };
  } catch (error) {
    console.error("Failed to save lead", error);
    return { ok: false, status: 500, error: "Something went wrong. Please try again or call us." };
  }
}
