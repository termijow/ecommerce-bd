'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const API_CLIENTES = 'http://localhost:8000/api/clientes/';

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
  // --- ÚNICA VARIABLE PARA TODOS LOS ERRORES ---
  const [error, setError] = useState<string | null>(null); 
  const router = useRouter();

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push('/login');
      return null;
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    const headers = getAuthHeaders();
    if (!headers) {
        setLoading(false);
        return;
    }

    try {
      const res = await fetch(API_CLIENTES, { headers });

      if (res.status === 401) {
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      }
      if (res.status === 403) {
        throw new Error('No tienes permiso para acceder a esta página.');
      }
      if (!res.ok) {
        throw new Error('Error al listar los clientes.');
      }

      const data: Cliente[] = await res.json();
      setClientes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Usamos setError para el formulario también, no formError
    setError(null); 
    setSuccessMessage(null);
    const headers = getAuthHeaders();
    if (!headers) {
        setIsSubmitting(false);
        return;
    }

    try {
      const res = await fetch(API_CLIENTES, {
        method: 'POST',
        headers,
        body: JSON.stringify({ nombre, apellido, email, telefono, direccion }),
      });
      
      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMessage = Object.entries(responseData)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ');
        throw new Error(errorMessage || 'No se pudo crear el cliente.');
      }

      setNombre('');
      setApellido('');
      setEmail('');
      setTelefono('');
      setDireccion('');
      setSuccessMessage('Cliente creado exitosamente');
      await fetchClientes();
    } catch (err: any) {
      // Usamos setError para el formulario también
      setError(err.message); 
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-2xl">Cargando...</h1>
        </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Ocurrió un Error</h1>
        <p className="mt-2">{error}</p>
        <button 
          onClick={() => router.push('/login')} 
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Ir a Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Gestión de Clientes</h1>

      <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Registrar Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border p-2 rounded" required />
          <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} className="w-full border p-2 rounded" required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded" required />
          <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full border p-2 rounded" />
          <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full border p-2 rounded" />
          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
            {isSubmitting ? 'Creando...' : 'Crear Cliente'}
          </button>
        </form>
        {/* Aquí también usamos 'error' en lugar de 'formError' */}
        {error && <p className="mt-2 text-red-600">{error}</p>}
        {successMessage && <p className="mt-2 text-green-600">{successMessage}</p>}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Clientes Registrados</h2>
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
          {clientes.length > 0 ? (
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
            <tr><td colSpan={6} className="p-4 text-center">No hay clientes para mostrar.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}