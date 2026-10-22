import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Advanced GroHair Velachery | Hair Transplant Consultation",
  description: "Hair transplant at Advanced GroHair, Velachery: ₹1,29,000 with unlimited follicles and 6 months of free maintenance.",

    icons: {
    icon: [
      {
        url: "/ambatur-logo.jpg",
        sizes: "any",
      },
      {
        url: "/ambatur-logo.jpg",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/ambatur-logo.jpg",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/ambatur-logo.jpg",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "icon",
        url: "/ambatur-logo.jpg",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/ambatur-logo.jpg",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full bg-white text-ink antialiased scheme-light`}
    >
      <body className="min-h-full flex flex-col font-[var(--font-poppins)]">{children}</body>
    </html>
  );
}
