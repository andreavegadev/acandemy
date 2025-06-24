import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import { supabase } from "../supabaseClient";
import TextoTagline from "../assets/images/TextoTagline.png"; // Importa la imagen
import { useCart } from "../context/CartContext";

const Header = ({ session }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (session) {
        // Suponiendo que tienes un campo "profile" en tu tabla de usuarios
        const { data } = await supabase
          .from("users")
          .select("profile")
          .eq("id", session.user.id)
          .single();
        setIsAdmin(data?.profile?.toLowerCase() === "admin");
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [session]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error.message);
    } else {
      window.location.reload(); // Recarga la página para actualizar el estado
    }
  };
  const { cart } = useCart();

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={TextoTagline} alt="Acandemy" className="logo-image" />
      </Link>
      <nav className="nav">
        <Link to="/products">Productos</Link>
        <Link to="/about">Sobre Nosotros</Link>
        <Link to="/contact">Contacto</Link>
        {session && (
          <>
            <Link to="/profile">Mi Perfil</Link>
            <Link to="/pets">Mis Mascotas</Link>
            {isAdmin && <Link to="/admin/dashboard">Dashboard</Link>}
          </>
        )}
        <Link to="/wishlist" className="wishlist-link">
          <span role="img" aria-label="wishlist">
            ❤️
          </span>{" "}
          Wishlist
        </Link>
        <Link to="/cart">
          🛒 Carrito ({cart.reduce((total, item) => total + item.quantity, 0)})
        </Link>
      </nav>
      <div className="user-actions">
        {session ? (
          <>
            <button className="logout-button" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
