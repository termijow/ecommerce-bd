'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrls, getAuthHeaders } from '@/lib/api'; // Importamos nuestros helpers de API

// Definimos las interfaces para los datos que manejaremos
interface Producto {
  id: number;
  nombre: string;
  precio: string; // El precio viene como string desde la API
  stock: number;
}
interface Pedido {
  id: number;
  cliente_id: number;
  cliente_nombre: string;
  fecha_pedido: string;
  estado: string;
  total: string;
}
interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  
  // Estados para el formulario de nuevo pedido
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [productosSeleccionados, setProductosSeleccionados] = useState<Map<number, number>>(new Map());
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Función para cargar todos los datos necesarios para la página
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    const headers = getAuthHeaders();
    if (!headers) {
      setError("Debes iniciar sesión para gestionar pedidos.");
      setLoading(false);
      return;
    }

    try {
      // Usamos Promise.all para hacer las peticiones en paralelo y mejorar el rendimiento
      const [resPedidos, resProductos, resClientes] = await Promise.all([
        fetch(apiUrls.pedidos, { headers }),
        fetch(apiUrls.productos, { headers }),
        fetch(apiUrls.clientes, { headers }),
      ]);

      // Verificamos si alguna de las peticiones falló por autenticación
      if ([resPedidos, resProductos, resClientes].some(res => res.status === 401)) {
          throw new Error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      }
      if ([resPedidos, resProductos, resClientes].some(res => res.status === 403)) {
        throw new Error("No tienes los permisos necesarios para ver todos los datos de esta página.");
      }

      // Parseamos los datos
      const dataPedidos: Pedido[] = await resPedidos.json();
      const dataProductos: Producto[] = await resProductos.json();
      const dataClientes: Cliente[] = await resClientes.json();
      
      setPedidos(dataPedidos);
      setProductos(dataProductos);
      setClientes(dataClientes);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Manejador para cambiar la cantidad de un producto en el pedido
  const handleCantidadChange = (productoId: number, cantidad: number) => {
    setProductosSeleccionados(prev => {
      const newMap = new Map(prev);
      if (cantidad > 0) {
        newMap.set(productoId, cantidad);
      } else {
        newMap.delete(productoId); // Si la cantidad es 0, lo eliminamos del pedido
      }
      return newMap;
    });
  };

  // Manejador para enviar el formulario de nuevo pedido
  const handleSubmitPedido = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMensajeExito(null);
    const headers = getAuthHeaders();
    if (!headers) {
        setIsSubmitting(false);
        return;
    }

    // Convertimos el Map de productos a un array que nuestra API espera
    const productosParaEnviar = Array.from(productosSeleccionados.entries()).map(([id, cantidad]) => {
        const productoDetalle = productos.find(p => p.id === id);
        return {
            producto_id: id,
            cantidad: cantidad,
            precio_unitario: productoDetalle?.precio || '0.00',
        };
    });

    if (productosParaEnviar.length === 0 || !clienteSeleccionado) {
        setError("Debes seleccionar un cliente y añadir al menos un producto.");
        setIsSubmitting(false);
        return;
    }

    try {
      // Llamamos al endpoint especial que ejecuta el PROCEDURE
      const res = await fetch(`${apiUrls.pedidos}registrar-nuevo-pedido/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            cliente_id: parseInt(clienteSeleccionado),
            productos: productosParaEnviar
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Error al crear el pedido.');
      }

      setMensajeExito('¡Pedido creado exitosamente!');
      // Reseteamos el formulario
      setClienteSeleccionado('');
      setProductosSeleccionados(new Map());
      // Volvemos a cargar los datos para ver el nuevo pedido en la lista
      cargarDatos();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8 text-center"><h1 className="text-2xl">Cargando datos de pedidos...</h1></div>;
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
      <h1 className="text-4xl font-bold mb-8 text-center">Gestión de Pedidos</h1>
      
      {/* Formulario para Crear un Nuevo Pedido */}
      <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Nuevo Pedido</h2>
        <form onSubmit={handleSubmitPedido} className="space-y-4">
            <div>
                <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select 
                    id="cliente"
                    value={clienteSeleccionado} 
                    onChange={(e) => setClienteSeleccionado(e.target.value)}
                    className="w-full border p-2 rounded bg-white"
                    required
                >
                    <option value="" disabled>Seleccione un cliente</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Productos</label>
                <div className="space-y-2 max-h-60 overflow-y-auto border p-4 rounded-md">
                {productos.map(p => (
                    <div key={p.id} className="flex items-center justify-between gap-4">
                        <span className="flex-1">{p.nombre} (${p.precio}) - Stock: {p.stock}</span>
                        <input 
                            type="number"
                            min="0"
                            max={p.stock} // No permitir pedir más del stock disponible
                            placeholder="Cantidad"
                            className="border p-1 rounded w-24 text-center"
                            onChange={(e) => handleCantidadChange(p.id, parseInt(e.target.value) || 0)}
                        />
                    </div>
                ))}
                </div>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Creando Pedido...' : 'Crear Pedido'}
            </button>
        </form>
        {mensajeExito && <p className="mt-4 text-center text-green-600">{mensajeExito}</p>}
        {/* Mostramos el error del formulario aquí también */}
        {error && !mensajeExito && <p className="mt-4 text-center text-red-600">{error}</p>}
      </div>

      {/* Tabla de Pedidos Existentes */}
      <h2 className="text-2xl font-semibold mb-4">Pedidos Registrados</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
            <thead className="bg-gray-100">
            <tr>
                <th className="p-3 border text-left">ID Pedido</th>
                <th className="p-3 border text-left">Cliente</th>
                <th className="p-3 border text-left">Fecha</th>
                <th className="p-3 border text-left">Estado</th>
                <th className="p-3 border text-right">Total</th>
            </tr>
            </thead>
            <tbody>
            {pedidos.length > 0 ? (
                pedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="border p-3">{pedido.id}</td>
                    <td className="border p-3">{pedido.cliente_nombre}</td>
                    <td className="border p-3">{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
                    <td className="border p-3">{pedido.estado}</td>
                    <td className="border p-3 text-right">${parseFloat(pedido.total).toFixed(2)}</td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                        No hay pedidos registrados.
                    </td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}