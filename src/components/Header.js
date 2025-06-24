import React from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext";
import TextoTagline from "../assets/images/TextoTagline.png";

const Header = ({ session }) => {
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
    <header
      className="header"
      style={{
        background: "linear-gradient(90deg, #5e35b1 60%, #7e57c2 100%)",
        color: "#fff",
        padding: "0 32px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 12px #b39ddb55",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Link
        to="/"
        className="logo"
        style={{ display: "flex", alignItems: "center", height: "100%" }}
      >
        <img
          src={TextoTagline}
          alt="Acandemy"
          className="logo-image"
          style={{
            height: 40, // Ajusta este valor según lo que prefieras
            width: "auto",
            objectFit: "contain",
            marginRight: 12,
          }}
        />
      </Link>
      <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <Link to="/products" style={navLinkStyle}>
          Productos
        </Link>
        <Link to="/about" style={navLinkStyle}>
          Sobre Nosotros
        </Link>
        <Link to="/wishlist" style={navLinkStyle}>
          Mi Lista de Deseos
        </Link>
        {session && (
          <>
            <Link to="/profile" style={navLinkStyle}>
              Mi Perfil
            </Link>
            <Link to="/pets" style={navLinkStyle}>
              Mis Mascotas
            </Link>
          </>
        )}
      </nav>
      <div className="cart">
        <span className="cart-icon">🛒</span>
        <Link to="/cart">
          Carrito ({cart.reduce((total, item) => total + item.quantity, 0)})
        </Link>
        {session ? (
          <>
            <button className="logout-button" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={navLinkStyle}>
              Iniciar Sesión
            </Link>
            <Link to="/register" style={navLinkStyle}>
              Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

const navLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: 500,
  fontSize: 18,
  padding: "6px 12px",
  borderRadius: 8,
  transition: "background 0.2s",
  background: "transparent",
};

export default Header;
