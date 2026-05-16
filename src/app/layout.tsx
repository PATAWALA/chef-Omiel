// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chef Omiel | Écosystème Digital - Maquette Pédagogique",
  description:
    "Votre empire culinaire mérite mieux que Facebook. Découvrez comment transformer votre art en machine à cash 24h/24.",
  openGraph: {
    title: "Chef Omiel | Votre Écosystème Digital",
    description:
      "Boutique, Menu, Réservations : tout ce que votre art mérite.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}