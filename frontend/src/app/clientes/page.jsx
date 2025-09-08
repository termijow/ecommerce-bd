"use client";

import { useEffect, useState } from "react";



export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({ 
    nombre: "", 
    correo: "",
    telefono:"",
    direccion:"",
  });

    // Obtener clientes de la API
    const fetchClientes = async () => {
      const res = await fetch("http://localhost:8000/api/clientes/");
      const data = await res.json();
      setClientes(data);
  };
  
  useEffect(() => {
    fetchClientes();
  }, []);

  // Manejo de formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8000/api/clientes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ nombre: "", correo: "", telefono: "", direccion: "" });
    fetchClientes();
  };

return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Clientes</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Agregar Cliente
        </button>
      </form>

      {/* Tabla */}
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Correo</th>
            <th className="border p-2">Teléfono</th>
            <th className="border p-2">Dirección</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.nombre}</td>
              <td className="border p-2">{c.correo}</td>
              <td className="border p-2">{c.telefono}</td>
              <td className="border p-2">{c.direccion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
