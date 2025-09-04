-- Tabla para los usuarios del sistema (autenticación y autorización)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL, -- Deberías almacenar hashes de contraseñas, no texto plano
    email VARCHAR(100) UNIQUE NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente', -- 'administrador', 'empleado', 'cliente'
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para guardar los datos de clientes (si es diferente a usuarios o si un usuario puede ser cliente)
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE, -- Opcional: enlaza con tabla usuarios
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL -- Puede ser el mismo que en usuarios o permitir diferente
);

-- Tabla para guardar la información de productos y/o servicios
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla para guardar datos de pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL, -- Si el cliente se elimina, el pedido se mantiene
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'enviado', 'entregado', 'cancelado'
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0)
);

-- Tabla de detalle para los pedidos (muchos productos en un pedido)
CREATE TABLE detalle_pedidos (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id) ON DELETE RESTRICT, -- No se puede eliminar un producto si hay pedidos asociados
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0)
);

-- Tabla donde se manejen devoluciones
CREATE TABLE devoluciones (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    fecha_devolucion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT,
    estado VARCHAR(50) NOT NULL DEFAULT 'solicitada' -- 'solicitada', 'aprobada', 'rechazada', 'completada'
);

-- 1. Rol de Administrador (Super usuario)
-- NOTA: Crea este rol con una contraseña fuerte.
CREATE ROLE administrador WITH LOGIN SUPERUSER PASSWORD 'tu_password_admin_superfuerte';

-- 2. Rol de Empleados (DELETE, UPDATE, no INSERT)
CREATE ROLE empleados WITH LOGIN PASSWORD 'tu_password_empleado';
GRANT CONNECT ON DATABASE ecommerce_bd_dev TO empleados;
GRANT USAGE ON SCHEMA public TO empleados; -- O el esquema donde estén tus tablas

-- Permisos específicos para empleados
GRANT DELETE ON TABLE clientes, pedidos, detalle_pedidos, productos, devoluciones TO empleados;
GRANT UPDATE ON TABLE clientes, pedidos, detalle_pedidos, productos, devoluciones TO empleados;
-- No se concede INSERT

-- Opcional: Si necesitan ver datos para actualizar/borrar
GRANT SELECT ON TABLE clientes, pedidos, detalle_pedidos, productos, devoluciones TO empleados;


-- 3. Rol Estándar para Clientes (solo SELECT)
CREATE ROLE clientes_rol WITH LOGIN PASSWORD 'tu_password_cliente';
GRANT CONNECT ON DATABASE ecommerce_bd_dev TO clientes_rol;
GRANT USAGE ON SCHEMA public TO clientes_rol;

-- Permisos específicos para clientes
GRANT SELECT ON TABLE productos, pedidos, detalle_pedidos, devoluciones TO clientes_rol;
-- NOTA: Los clientes solo podrán ver sus propios pedidos/devoluciones en la aplicación,
-- la base de datos solo les da el permiso de lectura general, la lógica de negocio
-- para filtrar por cliente_id se implementa en tu backend.

CREATE OR REPLACE PROCEDURE registrar_pedido(
    p_cliente_id INTEGER,
    p_estado VARCHAR(50),
    p_productos_ids INTEGER[],
    p_cantidades INTEGER[],
    p_precios_unitarios DECIMAL(10, 2)[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_pedido_id INTEGER;
    v_total_pedido DECIMAL(10, 2) := 0;
    i INTEGER;
    v_subtotal DECIMAL(10, 2);
BEGIN
    -- 1. Insertar el pedido principal
    INSERT INTO pedidos (cliente_id, estado, total)
    VALUES (p_cliente_id, p_estado, 0) -- El total se actualizará al final
    RETURNING id INTO v_pedido_id;

    -- 2. Insertar los detalles del pedido y calcular el total
    FOR i IN 1 .. array_length(p_productos_ids, 1) LOOP
        v_subtotal := p_cantidades[i] * p_precios_unitarios[i];
        INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
        VALUES (v_pedido_id, p_productos_ids[i], p_cantidades[i], p_precios_unitarios[i], v_subtotal);

        v_total_pedido := v_total_pedido + v_subtotal;

        -- 3. Actualizar el stock del producto (se podría hacer en un trigger AFTER INSERT ON detalle_pedidos)
        -- Aquí lo hacemos explícitamente para simplificar el ejemplo del procedure
        UPDATE productos
        SET stock = stock - p_cantidades[i]
        WHERE id = p_productos_ids[i];
    END LOOP;

    -- 4. Actualizar el total del pedido
    UPDATE pedidos
    SET total = v_total_pedido
    WHERE id = v_pedido_id;

    COMMIT; -- Confirmar la transacción
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK; -- Deshacer si hay algún error
        RAISE; -- Re-lanzar la excepción
END;
$$;