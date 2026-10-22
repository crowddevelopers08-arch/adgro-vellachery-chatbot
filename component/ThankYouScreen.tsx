"use client";

import BrandLogo from "./BrandLogo";
import { revealDelay } from "./reveal";

export default function ThankYouScreen({ name, phone, locationComfortable, onHome }: { name: string; phone: string; locationComfortable: boolean; onHome: () => void }) {
  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-white px-[7vw] py-16 text-center text-ink">
      <BrandLogo />
      <div className="max-w-[560px]">
        <h1 className="reveal-in text-[clamp(28px,4vw,48px)] leading-[1.15] font-bold" style={revealDelay(0)}>Thank you{name ? `, ${name}` : ""}!</h1>
        <p className="reveal-in mt-[clamp(10px,2svh,18px)] text-[clamp(15px,1.6vw,22px)] leading-[1.4] text-ink/80" style={revealDelay(1)}>{locationComfortable
          ? <>Our Velachery team will call you shortly{phone ? <> on <b className="font-semibold text-ink">{phone}</b></> : ""} to confirm your consultation slot.</>
          : "We’ve noted that the Velachery location doesn’t suit you right now. If you change your mind, we’re just a call away."}</p>
        <p className="reveal-in mt-[clamp(22px,4svh,36px)] flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[clamp(13px,1.15vw,17px)] text-ink/70" style={revealDelay(2)}>
          <span>Phone: <a className="text-brand hover:underline" href="tel:+918390856789">+91 83908 56789</a></span>
          <span className="text-ink/20" aria-hidden="true">|</span>
          <span>Email: <a className="text-brand hover:underline" href="mailto:customercare@adgrohairvelachery.in">customercare@adgrohairvelachery.in</a></span>
        </p>
        <p className="reveal-in mt-[clamp(24px,4svh,36px)] text-[clamp(13px,1.1vw,16px)] font-semibold text-ink" style={revealDelay(3)}>Advanced GroHair — Velachery</p>
        <button type="button" onClick={onHome} className="reveal-in mt-[clamp(20px,3.5svh,32px)] inline-flex h-[46px] cursor-pointer items-center gap-2 rounded-lg border-0 bg-brand px-6 text-lg font-bold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink" style={revealDelay(4)}>
          <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 9.5V20h13V9.5" /></svg>
          Back to home
        </button>
      </div>
    </main>
  );
}
