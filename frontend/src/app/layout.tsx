// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css"; // <--- ¡IMPORTANTE!

export const metadata: Metadata = {
  title: "Mi App de E-commerce",
  description: "Proyecto final de Base de Datos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}