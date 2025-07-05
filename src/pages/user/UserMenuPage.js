import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import UserOrdersPage from "./UserOrdersPage";
import UserMainData from "../../components/UserMainData";
import LastOrdersList from "../../components/LastOrdersList";
import PetList from "../pets/PetList";

import "../../styles/UserMenuPage.css";
import { ButtonSecondary } from "../../components/Button";

const UserMenuPage = () => {
  const [userData, setUserData] = useState({ full_name: "", email: "" });
  const [orders, setOrders] = useState([]);
  const [pets, setPets] = useState([]);
  const [view, setView] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error al obtener la sesión:", sessionError.message);
        return;
      }

      const userId = sessionData?.session?.user?.id;
      const email = sessionData?.session?.user?.email;

      if (!userId) {
        console.error("No se pudo obtener el ID del usuario.");
        return;
      }

      setUserData((prev) => ({ ...prev, email }));

      const { data: userData, error: userDataError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (userDataError) {
        console.error(
          "Error al obtener los datos del usuario:",
          userDataError.message
        );
      } else {
        setUserData((prev) => ({
          ...prev,
          full_name: userData.full_name,
          id_number: userData.id_number,
          phone: userData.phone,
        }));
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, order_date, total_amount, status")
        .eq("user_id", userId)
        .order("order_date", { ascending: false })
        .limit(5); // Limitar a los últimos 5 pedidos

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
    };

    fetchData();
  }, []);

  const handleViewOrderDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleViewAllOrders = () => {
    navigate("/orders");
  };

  const handleViewAllUserData = () => {
    navigate("/profile/details");
  };

  return (
    <div className="user-menu-container">
      <aside className="user-menu-sidebar">
        <h2>Mi cuenta</h2>
        <nav>
          <ul>
            <li>
              <ButtonSecondary onClick={() => setView("profile")}>
                Perfil
              </ButtonSecondary>
            </li>
            <li>
              <ButtonSecondary
                className={view === "orders" ? "active" : ""}
                onClick={() => setView("orders")}
              >
                Mis pedidos
              </ButtonSecondary>
            </li>
            <li>
              <ButtonSecondary
                className={view === "petlist" ? "active" : ""}
                onClick={() => setView("petlist")}
              >
                Mis mascotas
              </ButtonSecondary>
            </li>
            {/* Puedes añadir más opciones aquí */}
          </ul>
        </nav>
      </aside>
      <main className="user-menu-content">
        {view === "profile" && (
          <div className="user-profile">
            <header>
              <h1>Bienvenido a Academy, {userData.full_name}.</h1>
              <h2>La felicidad de tu mascota comienza aquí.</h2>
            </header>
            <section>
              <UserMainData
                user={userData}
                onViewAllUserData={handleViewAllUserData}
              />
            </section>
            <section>
              <LastOrdersList
                orders={orders}
                onViewOrder={handleViewOrderDetails}
                onViewAllOrders={handleViewAllOrders}
                limit={5}
              />
            </section>
          </div>
        )}
        {view === "orders" && (
          <div>
            <h3>Mis pedidos</h3>
            <UserOrdersPage />
          </div>
        )}
        {view === "petlist" && (
          <div>
            <h3>Listado completo de mascotas</h3>
            <PetList userId={userData.id} pets={pets} />
          </div>
        )}
      </main>
    </div>
  );
};

export default UserMenuPage;
