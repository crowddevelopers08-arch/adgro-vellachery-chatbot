"use client";

import BrandLogo from "./BrandLogo";
import { revealDelay } from "./reveal";

export default function ThankYouScreen({ name, phone }: { name: string; phone: string }) {
  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-white px-[7vw] py-16 text-center text-ink">
      <BrandLogo />
      <div className="max-w-[560px]">
        <h1 className="reveal-in text-[clamp(28px,4vw,48px)] leading-[1.15] font-bold" style={revealDelay(0)}>Thank you{name ? `, ${name}` : ""}!</h1>
        <p className="reveal-in mt-[clamp(10px,2svh,18px)] text-[clamp(15px,1.6vw,22px)] leading-[1.4] text-ink/80" style={revealDelay(1)}>Our Velachery team will call you shortly{phone ? <> on <b className="font-semibold text-ink">{phone}</b></> : ""} to confirm your consultation slot.</p>
        <p className="reveal-in mt-[clamp(22px,4svh,36px)] flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[clamp(13px,1.15vw,17px)] text-ink/70" style={revealDelay(2)}>
          <span>Phone: <a className="text-brand hover:underline" href="tel:+918390856789">+91 83908 56789</a></span>
          <span className="text-ink/20" aria-hidden="true">|</span>
          <span>Email: <a className="text-brand hover:underline" href="mailto:customercare@adgrohairvelachery.in">customercare@adgrohairvelachery.in</a></span>
        </p>
        <p className="reveal-in mt-[clamp(24px,4svh,36px)] text-[clamp(13px,1.1vw,16px)] font-semibold text-ink" style={revealDelay(3)}>Advanced GroHair — Velachery</p>
        <p className="reveal-in mt-[clamp(14px,2.4svh,22px)] text-sm text-ink/50" style={revealDelay(4)}>Restarting in a few seconds…</p>
      </div>
    </main>
  );
}
