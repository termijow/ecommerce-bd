"use client";

import { motion } from "framer-motion";

const skills = [
  { nombre: "Desarrollo Web", porcentaje: 95 },
  { nombre: "IoT", porcentaje: 65 },
  { nombre: "Automatización", porcentaje: 80 },
  { nombre: "Inteligencia Artificial", porcentaje: 40 },
  { nombre: "Ciberseguridad", porcentaje: 55 },
];

// Función para determinar color por nivel
const getColorByPorcentaje = (porcentaje: number) => {
  if (porcentaje <= 40) return "bg-red-600";
  if (porcentaje <= 70) return "bg-yellow-500";
  return "bg-green-500";
};

export default function Nosotros() {
  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Imagen */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2"
        >
          <img
            src="/img/nosotros.jpg"
            alt="Nosotros"
            className="w-full h-[300px] md:h-[400px] object-cover rounded-xl shadow-md"
          />
        </motion.div>

        {/* Descripción + Skills */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2"
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-4">¿Quiénes Somos?</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            Somos una empresa comprometida con la innovación tecnológica. Nuestro equipo está
            conformado por profesionales apasionados por brindar soluciones eficientes y personalizadas,
            adaptadas a las necesidades de nuestros clientes. Nos impulsa la excelencia, la honestidad y el trabajo en equipo.
          </p>

          {/* Subtítulo de habilidades */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl font-semibold text-blue-800 mb-4"
          >
            Habilidades
          </motion.h3>

          {/* Barras de skills dinámicas */}
          <div className="space-y-4">
            {skills.map((skill, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm text-blue-800 font-semibold mb-1">
                  <span>{skill.nombre}</span>
                  <span>{skill.porcentaje}%</span>
                </div>
                <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.porcentaje}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    viewport={{ once: true }}
                    className={`h-full rounded-full ${getColorByPorcentaje(skill.porcentaje)}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
