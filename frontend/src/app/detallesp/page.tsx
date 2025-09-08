'use client';

import { useEffect, useState } from 'react';

const API_PEDIDOS = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/pedidos/';
const API_PRODUCTOS = 'http://localhost:8000/api/productos/';
const API_DETALLES = 'http://localhost:8000/api/detalle-pedidos/';

export default function DetallesPedidosPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [detalles, setDetalles] = useState<any[]>([]);

  const [pedidoId, setPedidoId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);

  const [mensaje, setMensaje] = useState<string | null>(null);

  // Cargar pedidos, productos y detalles
  useEffect(() => {
    fetch(API_PEDIDOS).then((r) => r.json()).then(setPedidos);
    fetch(API_PRODUCTOS).then((r) => r.json()).then(setProductos);
    fetch(API_DETALLES).then((r) => r.json()).then(setDetalles);
  }, []);

  // Cuando cambie producto → actualizar precio unitario
  useEffect(() => {
    const p = productos.find((prod) => prod.id == productoId);
    if (p) setPrecioUnitario(Number(p.precio));
  }, [productoId, productos]);

  const crearDetalle = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    try {
      const res = await fetch(API_DETALLES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido: pedidoId,
          producto: productoId,
          cantidad,
          precio_unitario: precioUnitario,
        }),
      });

      if (res.ok) {
        setMensaje('✅ Detalle creado correctamente');
        setPedidoId('');
        setProductoId('');
        setCantidad(1);
        setPrecioUnitario(0);
        fetch(API_DETALLES).then((r) => r.json()).then(setDetalles);
      } else {
        const errData = await res.json().catch(() => ({}));
        setMensaje('❌ Error: ' + JSON.stringify(errData));
      }
    } catch (err: any) {
      setMensaje('❌ Error de red: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Detalles de Pedido</h1>

      {/* Formulario */}
      <form onSubmit={crearDetalle} className="mb-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Agregar Detalle</h2>

        <label className="block mb-2">Pedido</label>
        <select
          value={pedidoId}
          onChange={(e) => setPedidoId(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        >
          <option value="">Seleccione un pedido</option>
          {pedidos.map((p) => (
            <option key={p.id} value={p.id}>
              Pedido #{p.id} - Cliente: {p.cliente}
            </option>
          ))}
        </select>

        <label className="block mb-2">Producto</label>
        <select
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        >
          <option value="">Seleccione un producto</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        <label className="block mb-2">Cantidad</label>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          className="w-full border p-2 mb-4 rounded"
          min="1"
          required
        />

        <label className="block mb-2">Precio Unitario</label>
        <input
          type="number"
          value={precioUnitario}
          readOnly
          className="w-full border p-2 mb-4 rounded bg-gray-100"
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Crear Detalle
        </button>

        {mensaje && <p className="mt-2 text-center">{mensaje}</p>}
      </form>

      {/* Lista de detalles */}
      <h2 className="text-2xl font-semibold mb-4">Detalles Existentes</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Pedido</th>
            <th className="p-2 border">Producto</th>
            <th className="p-2 border">Cantidad</th>
            <th className="p-2 border">Precio Unitario</th>
            <th className="p-2 border">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{d.pedido}</td>
              <td className="p-2 border">{d.producto_nombre || d.producto}</td>
              <td className="p-2 border">{d.cantidad}</td>
              <td className="p-2 border">${d.precio_unitario}</td>
              <td className="p-2 border">${d.cantidad * d.precio_unitario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
