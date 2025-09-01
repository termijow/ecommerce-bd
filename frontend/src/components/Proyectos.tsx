"use client";

import { useEffect, useRef } from "react";

const proyectos = [
  { nombre: "Robot Seguidor de Línea", imagen: "/img/proyecto1.jpg" },
  { nombre: "Brazo Robótico", imagen: "/img/proyecto2.jpg" },
  { nombre: "Dron Autónomo", imagen: "/img/proyecto3.jpg" },
  { nombre: "Robot Evitador de Obstáculos", imagen: "/img/proyecto4.jpg" },
  { nombre: "Robot Humanoide", imagen: "/img/proyecto5.jpg" },
  { nombre: "Robot Sumobot", imagen: "/img/proyecto6.jpg" },
  { nombre: "Robot Araña", imagen: "/img/proyecto7.jpg" },
  { nombre: "Robot por Voz", imagen: "/img/proyecto8.jpg" },
];

export default function Proyectos() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Clonamos los proyectos para hacer el bucle visual
  const duplicados = [...proyectos, ...proyectos];

  return (
    <section className="bg-white py-16 px-6 overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-700">
        Nuestros Proyectos de Robótica
      </h2>

      <div
        ref={marqueeRef}
        className="flex gap-6 animate-marquee w-max"
        style={{ animationDuration: "40s" }}
      >
        {duplicados.map((proyecto, index) => (
          <div
            key={index}
            className="min-w-[250px] max-w-[250px] bg-blue-50 rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={proyecto.imagen}
              alt={proyecto.nombre}
              className="w-full h-44 object-cover"
            />
            <div className="p-4">
              <h3 className="text-blue-800 text-md font-semibold text-center">
                {proyecto.nombre}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
