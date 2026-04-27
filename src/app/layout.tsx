import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CitaFácil — Reservaciones para tu negocio",
    template: "%s | CitaFácil",
  },
  description:
    "La plataforma más sencilla para que salones, médicos y dentistas gestionen sus citas online. Gratis para empezar.",
  keywords: ["citas", "reservaciones", "salón", "médico", "dentista", "agenda online"],
  authors: [{ name: "CitaFácil" }],
  openGraph: {
    title: "CitaFácil — Reservaciones para tu negocio",
    description: "Gestiona tus citas online de forma profesional",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}