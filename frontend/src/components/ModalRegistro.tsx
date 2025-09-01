// src/components/ModalRegistro.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalRegistro({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full relative"
          >
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
              Registro
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Crear cuenta
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
