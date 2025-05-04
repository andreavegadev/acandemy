import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import PetList from "../../components/PetList";

const UserMenuPage = () => {
  const [userData, setUserData] = useState({ full_name: "" });
  const [orders, setOrders] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error al obtener la sesión:", sessionError.message);
        setLoading(false);
        return;
      }

      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        console.error("No se pudo obtener el ID del usuario.");
        setLoading(false);
        return;
      }

      const { data: userData, error: userDataError } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", userId)
        .single();

      if (userDataError) {
        console.error(
          "Error al obtener los datos del usuario:",
          userDataError.message
        );
      } else {
        setUserData(userData);
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, order_date, total_amount, status")
        .eq("user_id", userId)
        .order("order_date", { ascending: false })
        .limit(5);

      if (ordersError) {
        console.error("Error al obtener los pedidos:", ordersError.message);
      } else {
        setOrders(ordersData);
      }

      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("id, name, birth_date")
        .eq("user_id", userId);

      if (petsError) {
        console.error("Error al obtener las mascotas:", petsError.message);
      } else {
        setPets(petsData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleViewOrderDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleViewAllOrders = () => {
    navigate("/orders");
  };

  const handleViewPetDetails = (petId) => {
    navigate(`/pets/${petId}`);
  };

  const handleAddPet = () => {
    navigate("/pets/add");
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="user-profile">
      <header>
        <h1>Bienvenido a Academy, {userData.full_name}.</h1>
        <h2>La felicidad de tu mascota comienza aquí.</h2>
      </header>

      <section>
        <h2>Últimos 5 pedidos</h2>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                Pedido #{order.id} -{" "}
                {new Date(order.order_date).toLocaleDateString()} - $
                {order.total_amount} - {order.status}
                <button onClick={() => handleViewOrderDetails(order.id)}>
                  Ver Detalles
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes pedidos recientes.</p>
        )}
        <button onClick={handleViewAllOrders}>Ver todos los pedidos</button>
      </section>

      <PetList
        pets={pets}
        onViewPet={handleViewPetDetails}
        onAddPet={handleAddPet}
      />
    </div>
  );
};

export default UserMenuPage;
