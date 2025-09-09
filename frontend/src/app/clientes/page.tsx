'use client';

import { useState, useEffect, FormEvent } from 'react';

// --- ¡LA CORRECCIÓN CLAVE ESTÁ AQUÍ! ---
// Nos aseguramos de que la URL completa, incluyendo /api/, esté correcta.
const API_CLIENTES = 'http://localhost:8000/api/clientes/';

// La interfaz debe coincidir con el modelo de Django
interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Obtener clientes
  const fetchClientes = async () => {
    try {
      setLoading(true);
      setListError(null); // Limpiar errores previos
      const res = await fetch(API_CLIENTES);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Error al listar clientes. Estado: ${res.status}. Detalles: ${JSON.stringify(errorData)}`);
      }
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
        body: JSON.stringify({ nombre, apellido, email, telefono, direccion }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Error desconocido del servidor.' }));
        const errorMessage = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ');
        throw new Error(`Error al crear cliente: ${errorMessage}`);
      }

      // Limpiar el formulario
      setNombre('');
      setApellido('');
      setEmail('');
      setTelefono('');
      setDireccion('');
      setSuccessMessage('Cliente creado exitosamente');
      await fetchClientes(); // Actualizar la lista
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
          <input type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e)=> setApellido(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
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
            <th className="p-2 border">Apellido</th>
            <th className="p-2 border">Email</th>
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
                <td className="border p-2">{c.apellido}</td>
                <td className="border p-2">{c.email}</td>
                <td className="border p-2">{c.telefono}</td>
                <td className="border p-2">{c.direccion}</td>
              </tr>
            ))
          ) : (
            !loading && <tr><td colSpan={6} className="p-4 text-center">No hay clientes registrados</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}