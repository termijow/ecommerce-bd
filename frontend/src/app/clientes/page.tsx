'use client';

import { useState, useEffect, FormEvent } from 'react';

const API_CLIENTES = 'http://localhost:8000/api/clientes/';

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  // Estados formulario
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Obtener clientes
  const fetchClientes = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_CLIENTES);
      if (!res.ok) throw new Error(`Error al listar clientes. Estado: ${res.status}`);
      const data: Cliente[] = await res.json();
      setClientes(data);
    } catch (err: any) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Crear cliente
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(API_CLIENTES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, telefono, direccion }),
      });

      if (!res.ok) throw new Error(`Error al crear cliente. Estado: ${res.status}`);

      setNombre('');
      setCorreo('');
      setTelefono('');
      setDireccion('');
      setSuccessMessage('Cliente creado exitosamente');
      await fetchClientes();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Gestión de Clientes</h1>

      {/* Formulario */}
      <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Registrar Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isSubmitting ? 'Creando...' : 'Crear Cliente'}
          </button>
        </form>
        {formError && <p className="mt-2 text-red-600">{formError}</p>}
        {successMessage && <p className="mt-2 text-green-600">{successMessage}</p>}
      </div>

      {/* Lista de clientes */}
      <h2 className="text-2xl font-semibold mb-4">Clientes Registrados</h2>
      {loading && <p>Cargando clientes...</p>}
      {listError && <p className="text-red-500">{listError}</p>}

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Correo</th>
            <th className="p-2 border">Teléfono</th>
            <th className="p-2 border">Dirección</th>
          </tr>
        </thead>
        <tbody>
          {!loading && !listError && clientes.length > 0 ? (
            clientes.map((c) => (
              <tr key={c.id}>
                <td className="border p-2">{c.id}</td>
                <td className="border p-2">{c.nombre}</td>
                <td className="border p-2">{c.correo}</td>
                <td className="border p-2">{c.telefono}</td>
                <td className="border p-2">{c.direccion}</td>
              </tr>
            ))
          ) : (
            !loading && <tr><td colSpan={5} className="p-4 text-center">No hay clientes registrados</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
