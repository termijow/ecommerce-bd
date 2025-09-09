'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrls, getAuthHeaders } from '@/lib/api';

// Interfaces
interface Detalle {
  id: number;
  pedido_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
}
interface Pedido { 
    id: number; 
    cliente_nombre: string;
}
interface Producto { 
    id: number;
    nombre: string;
    precio: string;
}

export default function DetallesPedidosPage() {
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Estados del formulario
  const [pedidoId, setPedidoId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState('0.00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError(null);
      const headers = getAuthHeaders();
      // En modo demo, getAuthHeaders siempre devolverá algo porque
      // la página de login guarda un token falso.
      
      try {
        const [resDetalles, resPedidos, resProductos] = await Promise.all([
          fetch(apiUrls.detalles, { headers }),
          fetch(apiUrls.pedidos, { headers }),
          fetch(apiUrls.productos, { headers }),
        ]);

        if (!resDetalles.ok) throw new Error(`Error al cargar detalles: ${resDetalles.statusText}`);
        if (!resPedidos.ok) throw new Error(`Error al cargar pedidos: ${resPedidos.statusText}`);
        if (!resProductos.ok) throw new Error(`Error al cargar productos: ${resProductos.statusText}`);
        
        const dataDetalles = await resDetalles.json();
        const dataPedidos = await resPedidos.json();
        const dataProductos = await resProductos.json();

        setDetalles(dataDetalles);
        setPedidos(dataPedidos);
        setProductos(dataProductos);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  useEffect(() => {
    const producto = productos.find(p => p.id === parseInt(productoId));
    if (producto) {
      setPrecioUnitario(producto.precio);
    }
  }, [productoId, productos]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMensajeExito(null);

    const headers = getAuthHeaders();
    if (!headers) return; // Salvaguarda

    try {
      const res = await fetch(apiUrls.detalles, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          pedido_id: parseInt(pedidoId),
          producto_id: parseInt(productoId),
          cantidad: cantidad,
          precio_unitario: parseFloat(precioUnitario),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error al crear el detalle.');
      }

      setMensajeExito('Detalle de pedido añadido exitosamente.');
      // Resetear y recargar
      setPedidoId('');
      setProductoId('');
      setCantidad(1);
      cargarDatos();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Gestión de Detalles de Pedido</h1>

      {/* --- RENDERIZADO CORREGIDO --- */}
      {/* La estructura de la página ahora siempre es visible */}

      <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Agregar Detalle a un Pedido</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Pedido</label>
            <select value={pedidoId} onChange={e => setPedidoId(e.target.value)} className="w-full border p-2 rounded bg-white" required>
              <option value="" disabled>Seleccione un pedido</option>
              {pedidos.map(p => <option key={p.id} value={p.id}>Pedido #{p.id} ({p.cliente_nombre})</option>)}
            </select>
          </div>
          <div>
            <label>Producto</label>
            <select value={productoId} onChange={e => setProductoId(e.target.value)} className="w-full border p-2 rounded bg-white" required>
              <option value="" disabled>Seleccione un producto</option>
              {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div>
            <label>Cantidad</label>
            <input type="number" min="1" value={cantidad} onChange={e => setCantidad(parseInt(e.target.value))} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label>Precio Unitario (Automático)</label>
            <input type="number" step="0.01" value={precioUnitario} readOnly className="w-full border p-2 rounded bg-gray-100" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            {isSubmitting ? 'Agregando...' : 'Agregar Detalle'}
          </button>
        </form>
        {mensajeExito && <p className="mt-4 text-green-600">{mensajeExito}</p>}
        {/* Mostramos el error del formulario aquí, sin ocultar la página */}
        {error && !mensajeExito && <p className="mt-4 text-red-600">{error}</p>}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Detalles Existentes</h2>
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center">Cargando detalles...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Pedido ID</th>
                <th className="p-3 border text-left">Producto</th>
                <th className="p-3 border text-center">Cantidad</th>
                <th className="p-3 border text-right">Precio Unitario</th>
                <th className="p-3 border text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles.length > 0 ? (
                detalles.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="border p-3">{d.pedido_id}</td>
                    <td className="border p-3">{d.producto_nombre}</td>
                    <td className="border p-3 text-center">{d.cantidad}</td>
                    <td className="border p-3 text-right">${parseFloat(d.precio_unitario).toFixed(2)}</td>
                    <td className="border p-3 text-right">${parseFloat(d.subtotal).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-4 text-center text-gray-500">No hay detalles de pedido para mostrar.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}