import styles from "./Header.module.css";
import { useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext";
import TextoTagline from "../assets/images/TextoTagline.png";
import ResponsiveLayout from "./ResponsiveLayout";
import { Inline } from "./LayoutUtilities";
import { ButtonPrimary, IconButton } from "./Button";
import Badge from "./Badge";

const navigationLinks = [
  {
    to: "/products",
    label: "Productos",
    activePaths: ["/products", "/product"],
  },
  { to: "/wishlist", label: "Favoritos", activePaths: ["/wishlist"] },
  {
    to: "/profile",
    label: "Mi Perfil",
    requiresAuth: true,
    activePaths: ["/profile"],
  },
  {
    to: "/admin",
    label: "Admin",
    requiresAuth: true,
    requiresAdmin: true,
    activePaths: ["/admin"],
  },
];

const NavigationItem = ({
  to,
  label,
  activePaths,
  isMobile = false,
  onClick,
}) => {
  const location = useLocation();
  const isActive = activePaths.some((path) =>
    location.pathname.startsWith(path)
  );

  if (isMobile) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`${styles.mobileNavItem} ${
          isActive ? styles.mobileNavItemActive : ""
        }`}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`${styles.navigationLink} ${
        isActive ? styles.navigationLinkActive : ""
      }`}
    >
      {label}
    </Link>
  );
};

const NavigationList = ({ session, isMobile = false, onItemClick }) => {
  return (
    <ul className={isMobile ? styles.mobileMenuList : styles.desktopMenuList}>
      {navigationLinks.map((link) => {
        if (link.requiresAuth && !session) return null;
        if (
          link.requiresAdmin &&
          session?.user?.profile?.toLowerCase() !== "admin"
        )
          return null;

        return (
          <li
            key={link.to}
            className={
              isMobile ? styles.mobileMenuItem : styles.desktopMenuItem
            }
          >
            <NavigationItem
              to={link.to}
              label={link.label}
              activePaths={link.activePaths}
              isMobile={isMobile}
              onClick={onItemClick}
            />
          </li>
        );
      })}
    </ul>
  );
};

const MobileNavigationMenu = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuId = useId();

  const handleClose = () => setIsOpen(false);

  return (
    <div className={styles.mobileMenu}>
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir menú de navegación"
        aria-expanded={isOpen}
        aria-controls={mobileMenuId}
        aria-haspopup="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="inherit"
        >
          <g data-name="Layer 2">
            <g data-name="menu">
              <rect
                width="24"
                height="24"
                transform="rotate(180 12 12)"
                opacity="0"
              ></rect>
              <rect x="3" y="11" width="18" height="2" rx=".95" ry=".95"></rect>
              <rect x="3" y="16" width="18" height="2" rx=".95" ry=".95"></rect>
              <rect x="3" y="6" width="18" height="2" rx=".95" ry=".95"></rect>
            </g>
          </g>
        </svg>
      </IconButton>
      {isOpen && (
        <div className={styles.mobileMenuContainer} id={mobileMenuId}>
          <NavigationList
            session={session}
            isMobile
            onItemClick={handleClose}
          />
        </div>
      )}
    </div>
  );
};

const Header = ({ session }) => {
  const { cart } = useCart();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error.message);
    } else {
      window.location.reload();
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className={styles.container}>
      <ResponsiveLayout>
        <Inline justify="space-between" align="center" fullWidth>
          <div className={styles.navigationMobile}>
            <MobileNavigationMenu session={session} />
          </div>

          <Link
            to="/"
            className="logo"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src={TextoTagline}
              alt="Acandemy"
              className="logo-image"
              style={{
                height: 40,
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Link>

          <nav className={styles.navigationDesktop}>
            <NavigationList session={session} />
          </nav>

          <div className={styles.rightActions}>
            <Badge count={cartCount}>
              <IconButton href="/cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="inherit"
                >
                  <g data-name="Layer 2">
                    <g data-name="shopping-cart">
                      <rect width="24" height="24" opacity="0"></rect>
                      <path d="M21.08 7a2 2 0 0 0-1.7-1H6.58L6 3.74A1 1 0 0 0 5 3H3a1 1 0 0 0 0 2h1.24L7 15.26A1 1 0 0 0 8 16h9a1 1 0 0 0 .89-.55l3.28-6.56A2 2 0 0 0 21.08 7zm-4.7 7H8.76L7.13 8h12.25z"></path>
                      <circle cx="7.5" cy="19.5" r="1.5"></circle>
                      <circle cx="17.5" cy="19.5" r="1.5"></circle>
                    </g>
                  </g>
                </svg>
              </IconButton>
            </Badge>
            {session ? (
              <ButtonPrimary onClick={handleLogout} small>
                Cerrar Sesión
              </ButtonPrimary>
            ) : (
              <div className={styles.authLinks}>
                <IconButton href="/login" aria-label="Iniciar sesión">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="inherit"
                  >
                    <g data-name="Layer 2">
                      <g data-name="person">
                        <rect width="24" height="24" opacity="0"></rect>
                        <path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"></path>
                        <path d="M12 13a7 7 0 0 0-7 7 1 1 0 0 0 2 0 5 5 0 0 1 10 0 1 1 0 0 0 2 0 7 7 0 0 0-7-7z"></path>
                      </g>
                    </g>
                  </svg>
                </IconButton>
              </div>
            )}
          </div>
        </Inline>
      </ResponsiveLayout>
    </header>
  );
};

export default Header;
