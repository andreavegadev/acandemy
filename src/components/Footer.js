import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";
import Logo from "../assets/images/Logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <img src={Logo} alt="Acandemy" className="footer-logo-image" />
        <div className="footer-social">
          <a
            href="https://www.instagram.com/acandemy.tienda/"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-link"
          >
            <span>📸 Instagram</span>
          </a>
        </div>
      </div>
      <div className="footer-links">
        <Link to="/legal-notice">Aviso Legal</Link>
        <Link to="/cookies-policy">Política de Cookies</Link>
        <Link to="/privacy-policy">Política de Privacidad</Link>
      </div>
    </footer>
  );
};

export default Footer;
