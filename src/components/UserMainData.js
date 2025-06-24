import React from "react";

const cardStyle = {
  background: "#f8f6ff",
  border: "1px solid #d1c4e9",
  borderRadius: 16,
  boxShadow: "0 2px 12px #ede7f6",
  padding: 24,
  marginBottom: 24,
  maxWidth: 400,
};

const titleStyle = {
  color: "#5e35b1",
  marginBottom: 16,
  fontSize: "1.2em",
  fontWeight: 600,
};

const labelStyle = {
  fontWeight: 500,
  color: "#5e35b1",
  minWidth: 120,
  display: "inline-block",
};

const buttonStyle = {
  marginTop: 18,
  background: "#ede7f6",
  border: "none",
  color: "#5e35b1",
  fontWeight: "bold",
  padding: "8px 20px",
  borderRadius: 8,
  cursor: "pointer",
  transition: "background 0.2s",
};

const UserMainData = ({ user, onViewAllUserData }) => (
  <div style={cardStyle}>
    <h2 style={titleStyle}>Datos principales</h2>
    <p>
      <span style={labelStyle}>Nombre:</span> {user.full_name}
    </p>
    <p>
      <span style={labelStyle}>Documento de identidad:</span>{" "}
      {user.id_number || "No proporcionado"}
    </p>
    <p>
      <span style={labelStyle}>Email:</span> {user.email}
    </p>
    <p>
      <span style={labelStyle}>Teléfono:</span> {user.phone || "No proporcionado"}
    </p>
    <button
      style={buttonStyle}
      onMouseOver={e => (e.target.style.background = "#d1c4e9")}
      onMouseOut={e => (e.target.style.background = "#ede7f6")}
      onClick={onViewAllUserData}
    >
      Ver todos mis datos
    </button>
  </div>
);

export default UserMainData;
