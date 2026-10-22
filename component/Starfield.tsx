import type { CSSProperties } from "react";

export default function Starfield({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const dotClass = tone === "dark" ? "bg-[#dce8ff] shadow-[0_0_5px_1px_#93baff55]" : "bg-[#8a6a3a] shadow-[0_0_5px_1px_#8a6a3a33]";
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {Array.from({ length: 300 }, (_, i) => {
        const baseOpacity = .12 + (i % 8) * .075;
        const duration = 2.4 + (i % 11) * .35;
        const delay = -(((i * 137) % 1000) / 100);
        return <i
          className={`twinkle absolute block rounded-full ${dotClass}`}
          key={i}
          style={{
            left: `${((i * 7919 + 1237) % 10000) / 100}%`,
            top: `${((i * 6271 + 431) % 10000) / 100}%`,
            width: i % 19 === 0 ? 5 : i % 5 === 0 ? 3 : 1.5,
            height: i % 19 === 0 ? 6 : i % 5 === 0 ? 3 : 1.5,
            filter: `blur(${i % 3 === 0 ? 1.6 : .6}px)`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            "--o-max": baseOpacity,
            "--o-min": baseOpacity * .15,
          } as CSSProperties}
        />;
      })}
    </div>
  );
}
