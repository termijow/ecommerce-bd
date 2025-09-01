// ecommerce_bd/frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css"; // <--- ¡IMPORTANTE!

// ... (tus fuentes si las importas aquí)
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ecommerce_bd Project",
  description: "Tutorials and e-commerce for electronics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Si usas next/font, aplicarías la clase de la fuente aquí */}
      {/* <body className={inter.className}>{children}</body> */}
      <body>{children}</body> {/* El body ya recibe estilos de globals.css */}
    </html>
  );
}