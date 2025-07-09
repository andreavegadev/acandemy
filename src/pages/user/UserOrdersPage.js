import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { getOrderTagType, STATUS_LABELS } from "../../constants/order";
import Tag from "../../components/Tag";
import { Row, RowList } from "../../components/Row";
import Heading from "../../components/Heading";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [orderProducts, setOrderProducts] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        return;
      }
      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        return;
      }
      const { data: ordersData } = await supabase
        .from("orders")
        .select("id, order_date, total_amount, status")
        .eq("user_id", userId)
        .order("order_date", { ascending: false });
      setOrders(ordersData || []);

      // Obtener productos de todos los pedidos
      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map((o) => o.id);
        const { data: itemsData } = await supabase
          .from("order_items")
          .select("order_id, products(name)")
          .in("order_id", orderIds);

        // Agrupar productos por pedido
        const productsByOrder = {};
        itemsData?.forEach((item) => {
          if (!productsByOrder[item.order_id]) productsByOrder[item.order_id] = [];
          productsByOrder[item.order_id].push(item.products?.name || "");
        });
        setOrderProducts(productsByOrder);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <Heading>Mis pedidos</Heading>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888" }}>
          No tienes pedidos.
        </div>
      ) : (
        <RowList>
          {orders.map((order) => {
            const products = orderProducts[order.id] || [];
            let title = products.slice(0, 3).join(", ");
            if (products.length > 3) title += "…";
            if (!title) title = `Pedido ${order.id}`;
            return (
              <Row
                key={order.id}
                title={title}
                subtitle={new Date(order.order_date).toLocaleDateString()}
                tag={
                  <Tag type={getOrderTagType(order.status)}>
                    {STATUS_LABELS[order.status] || order.status}
                  </Tag>
                }
                href={`/profile/orders/${order.id}`}
              />
            );
          })}
        </RowList>
      )}
    </div>
  );
};

export default UserOrdersPage;
