'use client';

import { useState, useEffect } from 'react';

const API_PEDIDOS = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/pedidos/';
const API_PRODUCTOS = 'http://localhost:8000/api/productos/';

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [carrito, setCarrito] = useState<any[]>([]);

  const [fecha, setFecha] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);

  // cargar productos y pedidos
  useEffect(() => {
    fetch(API_PRODUCTOS)
      .then((r) => r.json())
      .then(setProductos)
      .catch((err) => console.error('Error cargando productos:', err));

    fetch(API_PEDIDOS)
      .then((r) => r.json())
      .then(setPedidos)
      .catch((err) => console.error('Error cargando pedidos:', err));
  }, []);

  // agregar productos al carrito
  const agregarProducto = (p: any) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.producto === p.id);
      if (existe) {
        return prev.map((item) =>
          item.producto === p.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          producto: p.id,
          nombre: p.nombre,
          precio: Number(p.precio),
          cantidad: 1,
        },
      ];
    });
  };

  // cambiar cantidad
  const cambiarCantidad = (id: number, delta: number) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.producto === id
          ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
          : item
      )
    );
  };

  // calcular total
  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  // crear pedido
  const crearPedido = async (e: React.FormEvent) => {
    e.preventDefault();

    if (carrito.length === 0) {
      setMensaje('❌ Debes agregar al menos un producto');
      return;
    }

    try {
      const res = await fetch(API_PEDIDOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: 1, // 👈 se envía como id numérico fijo (para probar)
          fecha: new Date(fecha).toISOString().split('T')[0], // 👈 YYYY-MM-DD
          total,
          detalles: carrito.map((item) => ({
            producto: item.producto,
            cantidad: item.cantidad,
          })),
        }),
      });

      if (res.ok) {
        setMensaje('✅ Pedido creado con éxito');
        setFecha('');
        setCarrito([]);
        fetch(API_PEDIDOS).then((r) => r.json()).then(setPedidos);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Error del backend:', errorData);
        setMensaje(
          '❌ Error al crear el pedido: ' + JSON.stringify(errorData)
        );
      }
    } catch (err) {
      console.error('Error al conectar con la API:', err);
      setMensaje('❌ Error de conexión con la API');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Gestión de Pedidos</h1>

      {/* formulario pedido */}
      <form
        onSubmit={crearPedido}
        className="mb-8 p-6 bg-white shadow rounded"
      >
        <h2 className="text-2xl font-semibold mb-4">Nuevo Pedido</h2>

        <label className="block mb-2">Fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
          className="w-full border p-2 mb-4 rounded"
        />

        {/* productos */}
        <h3 className="text-xl font-semibold mb-2">Productos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {productos.map((p) => (
            <div
              key={p.id}
              className="border rounded p-4 shadow flex flex-col"
            >
              <h4 className="font-bold">{p.nombre}</h4>
              <p className="text-sm text-gray-600">{p.descripcion}</p>
              <p className="mt-2 text-blue-600 font-semibold">
                ${p.precio}
              </p>
              <p className="text-xs text-gray-500">Stock: {p.stock}</p>
              <button
                type="button"
                onClick={() => agregarProducto(p)}
                className="mt-auto bg-green-500 text-white px-3 py-1 rounded"
              >
                Añadir
              </button>
            </div>
          ))}
        </div>

        {/* carrito */}
        {carrito.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Carrito</h3>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Producto</th>
                  <th className="p-2 border">Precio</th>
                  <th className="p-2 border">Cantidad</th>
                  <th className="p-2 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.producto}>
                    <td className="border p-2">{item.nombre}</td>
                    <td className="border p-2">${item.precio}</td>
                    <td className="border p-2 flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          cambiarCantidad(item.producto, -1)
                        }
                        className="px-2 bg-gray-300 rounded"
                      >
                        -
                      </button>
                      {item.cantidad}
                      <button
                        type="button"
                        onClick={() =>
                          cambiarCantidad(item.producto, 1)
                        }
                        className="px-2 bg-gray-300 rounded"
                      >
                        +
                      </button>
                    </td>
                    <td className="border p-2">
                      ${item.precio * item.cantidad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-right font-bold mt-2">Total: ${total}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Crear Pedido
        </button>

        {mensaje && <p className="mt-2 text-center">{mensaje}</p>}
      </form>

      {/* pedidos existentes */}
      <h2 className="text-2xl font-semibold mb-4">Pedidos existentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pedidos.map((p) => (
          <div
            key={p.id}
            className="border rounded p-4 shadow bg-white"
          >
            <h3 className="font-bold text-lg">Pedido #{p.id}</h3>
            <p>Cliente: {p.cliente}</p>
            <p>Fecha: {p.fecha}</p>
            <p>Total: ${p.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
