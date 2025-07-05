import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const EditOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      // Trae el pedido
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      // Trae los productos del pedido
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select(
          "id, product_id, quantity, unit_price, total_price, customizations, products(name)"
        )
        .eq("order_id", id);

      if (orderError || itemsError) {
        setError("No se pudo cargar el pedido.");
      } else {
        setOrder(orderData);
        setItems(itemsData || []);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!order) return <p>Pedido no encontrado.</p>;

  return (
    <div className="add-product-page">
      <h1>Pedido #{order.id}</h1>
      <p>
        <strong>Usuario:</strong> {order.user_id}
      </p>
      <p>
        <strong>Fecha:</strong>{" "}
        {new Date(order.order_date || order.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Estado:</strong> {order.status}
      </p>
      <p>
        <strong>Método de pago:</strong> {order.payment_method}
      </p>
      <p>
        <strong>Estado de pago:</strong> {order.payment_status}
      </p>
      <p>
        <strong>Dirección de envío:</strong> {order.shipping_address}
      </p>
      <p>
        <strong>Dirección de facturación:</strong> {order.billing_address}
      </p>
      <p>
        <strong>Número de seguimiento:</strong> {order.tracking_number || "-"}
      </p>
      <p>
        <strong>Total:</strong> {Number(order.total_amount).toFixed(2)} €
      </p>
      <h2>Productos del pedido</h2>
      <table className="admin-products-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Total</th>
            <th>Customizaciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.products?.name || item.product_id}</td>
              <td>{item.quantity}</td>
              <td>{Number(item.unit_price).toFixed(2)} €</td>
              <td>{Number(item.total_price).toFixed(2)} €</td>
              <td>
                {item.customizations ? (
                  <pre style={{ fontSize: "0.9em" }}>
                    {JSON.stringify(item.customizations, null, 2)}
                  </pre>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button style={{ marginTop: 24 }} onClick={() => navigate(-1)}>
        Volver
      </button>
    </div>
  );
};

export default EditOrderPage;
