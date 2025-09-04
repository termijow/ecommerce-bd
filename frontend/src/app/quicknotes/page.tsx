// frontend/src/app/quicknotes/page.tsx

// 'use client' es necesario en Next.js App Router para componentes que usan hooks como useState y useEffect.
'use client'; 

import { useState, useEffect } from 'react';

// Definimos una interfaz para tipar los datos del producto, aprovechando TypeScript.
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string; // El API lo devuelve como string, podríamos convertirlo a number si quisiéramos.
  stock: number;
}

export default function ProductosPage() {
  // Estado para almacenar la lista de productos que obtengamos del API.
  const [productos, setProductos] = useState<Producto[]>([]);
  // Estado para manejar si la página está cargando los datos.
  const [loading, setLoading] = useState(true);
  // Estado para almacenar cualquier error que ocurra durante la llamada al API.
  const [error, setError] = useState<string | null>(null);

  // useEffect es un hook de React que ejecuta código cuando el componente se "monta" (se muestra en pantalla).
  // Es el lugar perfecto para hacer llamadas a APIs.
  useEffect(() => {
    // Definimos una función asíncrona dentro de useEffect para poder usar await.
    const fetchProductos = async () => {
      try {
        // Hacemos la llamada GET al endpoint de productos de nuestra API de Django.
        // La URL debe coincidir con la que configuraste en docker-compose.yml (NEXT_PUBLIC_API_URL).
        // En este caso, asumimos que es http://localhost:8000/api
        const response = await fetch('http://localhost:8000/api/productos/');

        // Si la respuesta no es exitosa (ej. error 500, 404), lanzamos un error.
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        // Convertimos la respuesta del API de JSON a un objeto de JavaScript.
        const data: Producto[] = await response.json();
        
        // Actualizamos nuestro estado con los datos recibidos.
        setProductos(data);
      } catch (err: any) {
        // Si ocurre cualquier error (de red, de parseo, etc.), lo guardamos en el estado de error.
        setError(err.message);
      } finally {
        // Finalmente, sin importar si hubo éxito o error, dejamos de mostrar el estado de "cargando".
        setLoading(false);
      }
    };

    // Llamamos a la función que acabamos de definir.
    fetchProductos();
  }, []); // El array vacío `[]` significa que este efecto se ejecutará solo una vez, cuando el componente se monte.

  // Renderizamos diferentes cosas dependiendo del estado.
  if (loading) {
    return <p className="text-center mt-8">Cargando productos...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">Error al cargar los productos: {error}</p>;
  }

  // Si todo fue bien, mostramos la lista de productos.
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Lista de Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div key={producto.id} className="border rounded-lg p-4 shadow-lg">
              <h2 className="text-xl font-semibold">{producto.nombre}</h2>
              <p className="text-gray-600 mt-2">{producto.descripcion}</p>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-lg font-bold text-blue-600">${producto.precio}</p>
                <p className="text-sm text-gray-500">Stock: {producto.stock}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos para mostrar. Añade algunos desde el Django Admin o Swagger.</p>
        )}
      </div>
    </div>
  );
}