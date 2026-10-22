"use server";

import { prisma } from "@/lib/prisma";
import { questions } from "@/lib/form-options";

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  answers: number[];
  locationComfortable: boolean;
};

const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

// Public endpoint: anyone can POST here, so validate everything before saving.
export async function saveLead(input: LeadInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const name = clean(input?.name, 120);
  const phone = clean(input?.phone, 20);
  const email = clean(input?.email, 120);
  const answers = Array.isArray(input?.answers) ? input.answers : [];
  const digits = phone.replace(/\D/g, "");

  if (!name) return { ok: false, error: "Please enter your name." };
  if (digits.length < 10 || digits.length > 13 || !/^[+\d\s()-]+$/.test(phone)) return { ok: false, error: "Please enter a valid phone number." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (questions.some((question, i) => !Number.isInteger(answers[i]) || !question.options[answers[i]])) return { ok: false, error: "Please answer all the questions." };

  try {
    await prisma.lead.create({
      data: {
        name,
        phone,
        email: email || null,
        budget: questions[0].options[answers[0]],
        planning: questions[1].options[answers[1]],
        concern: questions[2].options[answers[2]],
        locationComfortable: input.locationComfortable === true,
      },
    });
    return { ok: true };
  } catch (error) {
    console.error("Failed to save lead", error);
    return { ok: false, error: "Something went wrong. Please try again or call us." };
  }
}
