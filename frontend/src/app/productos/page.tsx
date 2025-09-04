// frontend/src/app/productos/page.tsx

'use client';

import { useState, useEffect, FormEvent } from 'react';

// Interfaz para los datos del Producto
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: number;
}

export default function ProductosPage() {
  // --- Estados para la lista de productos (ya los teníamos) ---
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  // --- NUEVO: Estados para el formulario de creación ---
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- Función para obtener la lista de productos (sin cambios) ---
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/productos/');
      if (!response.ok) {
        throw new Error(`Error al obtener los productos. Estado: ${response.status}`);
      }
      const data: Producto[] = await response.json();
      setProductos(data);
    } catch (err: any) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar los productos cuando el componente se monte
  useEffect(() => {
    fetchProductos();
  }, []);

  // --- NUEVO: Función para manejar el envío del formulario ---
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevenir que la página se recargue
    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('http://localhost:8000/api/productos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio,
          stock: parseInt(stock) || 0, // Convertir stock a número
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al crear el producto. Estado: ${response.status}`);
      }

      // Limpiar el formulario y mostrar mensaje de éxito
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setStock('');
      setSuccessMessage('¡Producto creado exitosamente!');

      // Volver a cargar la lista de productos para que aparezca el nuevo
      await fetchProductos();

    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Gestión de Productos</h1>

      {/* --- NUEVO: Formulario de Creación --- */}
      <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-black">Añadir Nuevo Producto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
              <input
                type="number"
                id="precio"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Creando...' : 'Crear Producto'}
          </button>
          {formError && <p className="mt-2 text-sm text-red-600">{formError}</p>}
          {successMessage && <p className="mt-2 text-sm text-green-600">{successMessage}</p>}
        </form>
      </div>

      {/* --- Lista de Productos (como antes) --- */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Lista de Productos Existentes</h2>
        {loading && <p>Cargando productos...</p>}
        {listError && <p className="text-red-500">{listError}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && !listError && productos.length > 0 ? (
            productos.map((producto) => (
              <div key={producto.id} className="border rounded-lg p-4 shadow-lg bg-white">
                <h3 className="text-xl font-semibold text-gray-800">{producto.nombre}</h3>
                <p className="text-gray-600 mt-2">{producto.descripcion}</p>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-lg font-bold text-blue-600">${producto.precio}</p>
                  <p className="text-sm text-gray-500">Stock: {producto.stock}</p>
                </div>
              </div>
            ))
          ) : (
            !loading && <p>No hay productos para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
}