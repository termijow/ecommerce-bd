"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ModalRegistro from "@/components/ModalRegistro"; // Asegúrate que la ruta sea correcta

const navItems = [
  { name: "Inicio", href: "/" },
  { name: "Nosotros", href: "#nosotros" },
  { name: "Servicios", href: "#servicios" },
  { name: "Proyectos", href: "#proyectos" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* MODAL REGISTRO */}
      <ModalRegistro isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 12 }}
        className="fixed top-0 left-0 right-0 z-50 shadow-lg bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 animate-gradient-x"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* LOGO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-3"
          >
            <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              MMAGVOS SAS
            </h1>
          </motion.div>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.08 }}
                className="relative group transition"
              >
                <Link href={item.href} className="text-white font-medium">
                  {item.name}
                </Link>
                <span className="absolute left-0 bottom-[-4px] h-[2px] w-0 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
              </motion.div>
            ))}
            <Link href="/login" className="text-white hover:text-green-300 font-medium">
              Ingresar
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-blue-600 px-3 py-1 rounded-xl hover:bg-yellow-300 hover:text-blue-800 transition font-medium"
            >
              Registrarse
            </button>
          </nav>

          {/* BOTÓN MENÚ MÓVIL */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={28} />
          </button>
        </div>

        {/* MENÚ RESPONSIVE */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-0 bg-blue-800 z-50 flex flex-col px-6 py-8 space-y-6 text-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Menú</h2>
                <button onClick={() => setIsOpen(false)} aria-label="Cerrar menú">
                  <X size={28} />
                </button>
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg hover:text-yellow-300 transition"
                >
                  {item.name}
                </Link>
              ))}

              <hr className="border-blue-300" />

              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="hover:text-green-300"
              >
                Ingresar
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="bg-white text-blue-600 px-4 py-2 rounded-xl w-fit hover:bg-yellow-300 hover:text-blue-800 transition"
              >
                Registrarse
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
