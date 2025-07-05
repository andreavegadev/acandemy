import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => (
  <footer
    style={{
      background: "linear-gradient(90deg, #ede7f6 60%, #d1c4e9 100%)",
      color: "#5e35b1",
      padding: "32px 0 16px 0",
      textAlign: "center",
      borderTop: "2px solid #b39ddb55",
    }}
  >
    <div style={{ marginBottom: 12 }}>
      <Link to="/legal-notice" style={footerLinkStyle}>
        Aviso Legal
      </Link>
      {" | "}
      <Link to="/cookies-policy" style={footerLinkStyle}>
        Cookies
      </Link>
      {" | "}
      <Link to="/privacy-policy" style={footerLinkStyle}>
        Privacidad
      </Link>
      {" | "}
      <Link to="/contact" style={footerLinkStyle}>
        Contacto
      </Link>
    </div>
    <div style={{ fontSize: 15, color: "#7e57c2" }}>
      © {new Date().getFullYear()} Acandemy. Todos los derechos reservados.
    </div>
  </footer>
);

const footerLinkStyle = {
  color: "#5e35b1",
  textDecoration: "none",
  margin: "0 8px",
  fontWeight: 500,
  fontSize: 16,
};

export default Footer;
