"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

// Datos de los servicios
const servicios = [
  {
    titulo: "Desarrollo Web",
    descripcion: "Creamos sitios modernos, rápidos y adaptables con tecnologías de última generación.",
    imagen: "/img/servicio1.jpg",
  },
  {
    titulo: "Consultoría Técnica",
    descripcion: "Asesoría en infraestructura, arquitectura de software y optimización de procesos.",
    imagen: "/img/servicio2.jpg",
  },
  {
    titulo: "Soporte & Mantenimiento",
    descripcion: "Monitoreo continuo y resolución de problemas para mantener tus sistemas en marcha.",
    imagen: "/img/servicio3.jpg",
  },
  {
    titulo: "Automatización Industrial",
    descripcion: "Implementamos soluciones automatizadas para mejorar la eficiencia y productividad.",
    imagen: "/img/servicio4.jpg",
  },
  {
    titulo: "IoT y Dispositivos Inteligentes",
    descripcion: "Desarrollamos e integramos dispositivos inteligentes para hogares y empresas.",
    imagen: "/img/servicio5.jpg",
  },
  {
    titulo: "Sistemas Embebidos",
    descripcion: "Diseño y programación de sistemas de control para hardware específico.",
    imagen: "/img/servicio6.jpg",
  },
];

// Componente de título animado por letra en hover
function AnimatedTitle({ text }: { text: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <h2 className="text-center mb-16 flex justify-center flex-wrap">
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          className="inline-block text-4xl md:text-5xl font-bold text-blue-700 cursor-default"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          animate={
            hoveredIndex === index
              ? { y: -10, rotate: -5, color: "#1d4ed8" }
              : { y: 0, rotate: 0, color: "#1e3a8a" }
          }
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </h2>
  );
}

// Componente principal
export default function Servicios() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section
      id="servicios"
      className="relative overflow-hidden py-24 px-6 bg-gradient-to-br from-blue-50 to-white"
      ref={ref}
    >
      {/* Fondo que se mueve con el scroll */}
      <motion.div
        className="absolute top-0 left-1/2 w-[150%] h-[150%] bg-gradient-to-r from-blue-200 to-transparent rounded-full opacity-20 blur-3xl -z-10"
        style={{ y }}
      />

      {/* Título animado */}
      <AnimatedTitle text="Nuestros Servicios" />

      {/* Tarjetas de servicios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {servicios.map((servicio, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            viewport={{ once: true }}
            whileHover={{ rotate: 1 }}
            className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
          >
            <div className="overflow-hidden rounded-xl mb-4 shadow-md">
              <motion.img
                src={servicio.imagen}
                alt={servicio.titulo}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                whileHover={{ scale: 1.1 }}
              />
            </div>
            <h3 className="text-2xl font-semibold text-blue-800 mb-2">{servicio.titulo}</h3>
            <p className="text-gray-600 leading-relaxed">{servicio.descripcion}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
