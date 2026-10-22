import Image from "next/image";

const phone = { display: "+91 83908 56789", href: "tel:+918390856789" };

export default function BrandLogo() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 border-b border-brand/10 bg-brand-tint px-4 py-2 sm:px-25">
      <Image src="/ambatur-logo.jpg" alt="Advanced GroHair – Hair Regrowth Forever" width={300} height={126} priority className="h-[clamp(40px,7svh,60px)] w-auto mix-blend-multiply" />
      <a href={phone.href} className="flex h-[clamp(38px,5.5svh,46px)] shrink-0 items-center gap-2 rounded-full bg-brand px-4 text-[clamp(13px,1.1vw,16px)] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink max-sm:w-[clamp(38px,5.5svh,46px)] max-sm:justify-center max-sm:px-0" aria-label={`Call Advanced GroHair on ${phone.display}`}>
        <svg viewBox="0 0 24 24" className="size-[18px] shrink-0 fill-current" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" /></svg>
        <span className="max-sm:sr-only">{phone.display}</span>
      </a>
    </header>
  );
}
