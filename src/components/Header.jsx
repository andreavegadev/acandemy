import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext";
import TextoTagline from "../assets/images/TextoTagline.png";
import ResponsiveLayout from "./ResponsiveLayout";
import { Inline } from "./LayoutUtilities";

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

  const navigationLinks = [
    {
      to: "/products",
      label: "Productos",
      activePaths: ["/products", "/product"],
    },
    { to: "/about", label: "Nosotros", activePaths: ["/about"] },
    { to: "/wishlist", label: "Favoritos", activePaths: ["/wishlist"] },
    {
      to: "/profile",
      label: "Mi Perfil",
      requiresAuth: true,
      activePaths: ["/profile"],
    },
  ];

  const NavigationItem = ({ to, label, activePaths = [] }) => {
    const location = useLocation();
    const isActive = activePaths.some((path) =>
      location.pathname.startsWith(path)
    );

    const linkStyle = `${styles.navigationLink} ${
      isActive ? styles.navigationLinkActive : ""
    }`;

    return (
      <Link to={to} className={linkStyle}>
        {label}
      </Link>
    );
  };

  return (
    <header className={styles.container}>
      <ResponsiveLayout>
        <Inline justify={"space-between"} align={"center"} fullWidth>
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

          <nav className={styles.navigation}>
            <ul>
              {navigationLinks.map((link) => {
                if (link.requiresAuth && !session) return null;
                return (
                  <li key={link.to}>
                    <NavigationItem
                      to={link.to}
                      label={link.label}
                      activePaths={link.activePaths}
                    ></NavigationItem>
                  </li>
                );
              })}
            </ul>
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
                <Link to="/login">Iniciar Sesión</Link>
                <Link to="/register">Registrarse</Link>
              </>
            )}
          </div>
        </Inline>
      </ResponsiveLayout>
    </header>
  );
};

export default Header;
