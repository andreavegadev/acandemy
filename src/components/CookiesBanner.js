import React, { useState, useEffect } from "react";

const CookiesBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "#5e35b1",
      color: "#fff",
      padding: "18px 16px",
      textAlign: "center",
      zIndex: 9999,
      fontSize: "1em",
      boxShadow: "0 -2px 12px #b39ddb55"
    }}>
      Este sitio utiliza cookies para mejorar tu experiencia.{" "}
      <a href="/cookies-policy" style={{ color: "#ffe082", textDecoration: "underline" }}>
        Más información
      </a>
      <button
        onClick={handleAccept}
        style={{
          marginLeft: 18,
          background: "#ffe082",
          color: "#5e35b1",
          border: "none",
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        Aceptar
      </button>
    </div>
  );
};

export default CookiesBanner;