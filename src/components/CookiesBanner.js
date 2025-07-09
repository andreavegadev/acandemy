import React, { useState, useEffect } from "react";
import { ButtonLink, ButtonPrimary } from "./Button";

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
    <div
      style={{
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
        boxShadow: "0 -2px 12px #b39ddb55",
      }}
    >
      Este sitio utiliza cookies para mejorar tu experiencia.{" "}
      <ButtonLink
        href={`/cookies-policy`}
        aria-label={`Leer más sobre nuestra política de cookies`}
      >
        Más información
      </ButtonLink>
      <ButtonPrimary onClick={handleAccept} aria-label={`Aceptar cookies`}>
        Aceptar
      </ButtonPrimary>
    </div>
  );
};

export default CookiesBanner;
