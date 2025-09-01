"use client";

import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-blue-700 text-white pt-16 pb-8 px-6">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-800 via-blue-700 to-blue-600 opacity-60 animate-pulse z-0" />

      {/* Contenido */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left"
      >
        {/* Empresa */}
        <div>
          <h4 className="text-2xl font-bold mb-2">Mi Empresa</h4>
          <p className="text-sm text-blue-100 leading-relaxed">
            Impulsamos la innovación con soluciones tecnológicas que transforman ideas en realidad.
          </p>
        </div>

        {/* Enlaces */}
        <div>
          <h5 className="font-semibold mb-3">Enlaces</h5>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline hover:text-blue-200 transition">Inicio</a></li>
            <li><a href="#" className="hover:underline hover:text-blue-200 transition">Servicios</a></li>
            <li><a href="#" className="hover:underline hover:text-blue-200 transition">Proyectos</a></li>
            <li><a href="#" className="hover:underline hover:text-blue-200 transition">Contacto</a></li>
          </ul>
        </div>

        {/* Contacto / Redes */}
        <div>
          <h5 className="font-semibold mb-3">Contáctanos</h5>
          <p className="text-sm mb-3">correo@empresa.com</p>
          <div className="flex justify-center md:justify-start gap-4 text-xl">
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="#"
              className="transition"
            >
              <FaFacebookF />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="#"
              className="transition"
            >
              <FaInstagram />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="#"
              className="transition"
            >
              <FaLinkedin />
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Línea inferior */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
        className="relative z-10 mt-12 border-t border-blue-500 pt-4 text-sm text-center text-blue-100"
      >
        © {new Date().getFullYear()} MmGvos. Todos los derechos reservados.
      </motion.div>
    </footer>
  );
}
