import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Añade este import
import { supabase } from "../../supabaseClient";
import "../../styles/ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate(); // Hook para navegar
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    id_number: "",
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: sessionUser },
      } = await supabase.auth.getUser();
      if (!sessionUser) return setError("No hay sesión activa.");
      setEmail(sessionUser.email);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", sessionUser.id)
        .single();
      if (error) setError("No se pudo cargar el perfil.");
      else {
        setUser(data);
        setForm({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
          id_number: data.id_number || "",
        });
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    // 1. Actualiza el email en auth.users
    let emailError = null;
    let emailUpdateSuccess = false;
    if (email !== user.email) {
      const { error: emailUpdateError } = await supabase.auth.updateUser({
        email,
      });
      if (emailUpdateError) {
        emailError = emailUpdateError.message;
      } else {
        emailUpdateSuccess = true;
      }
    }

    // 2. Actualiza el resto de datos en la tabla users
    const { error: userError } = await supabase
      .from("users")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        address: form.address,
        id_number: form.id_number,
      })
      .eq("id", user.id);

    setSaving(false);

    if (emailError || userError) {
      setError(
        (emailError
          ? "Error al actualizar el correo: " + emailError + ". "
          : "") +
          (userError ? "Error al guardar el perfil: " + userError.message : "")
      );
    } else {
      let msg = "Perfil actualizado correctamente.";
      if (emailUpdateSuccess) {
        msg +=
          " Revisa tu nuevo correo y confirma el cambio para finalizar la actualización del email.";
      }
      setSuccess(msg);
      setEditing(false);
      setUser({ ...user, ...form, email });
    }
  };

  if (error)
    return (
      <div
        style={{
          color: "red",
          textAlign: "center",
          marginTop: 40,
        }}
      >
        {error}
      </div>
    );
  if (!user)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        Cargando perfil...
      </div>
    );

  return (
    <div className="profile-page-bg">
      <style>{`
        .profile-page-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #ede7f6 0%, #fff 100%);
          padding: 40px 0;
        }
        .profile-card {
          max-width: 440px;
          margin: 0 auto;
          background: #fff;
          border: 1.5px solid #d1c4e9;
          border-radius: 18px;
          padding: 36px 30px 28px 30px;
          box-shadow: 0 4px 32px #b39ddb33;
          position: relative;
        }
        .profile-card h2 {
          color: #5e35b1;
          margin-bottom: 18px;
          text-align: center;
          font-size: 2em;
          letter-spacing: 0.5px;
        }
        .profile-card label {
          display: block;
          margin: 14px 0 6px 0;
          font-weight: 500;
          color: #5e35b1;
        }
        .profile-card input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1c4e9;
          border-radius: 8px;
          font-size: 1em;
          margin-bottom: 8px;
          background: #f8f6ff;
          color: #3a2e5c;
          transition: border 0.2s;
        }
        .profile-card input:focus {
          border: 1.5px solid #7e57c2;
          outline: none;
        }
        .profile-card input[disabled] {
          background: #ede7f6;
          color: #b39ddb;
        }
        .profile-actions {
          margin-top: 22px;
          display: flex;
          gap: 14px;
          justify-content: flex-end;
        }
        .profile-card button {
          background: #5e35b1;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 10px 22px;
          font-size: 1em;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .profile-card button:disabled {
          background: #b39ddb;
          cursor: not-allowed;
        }
        .profile-card .cancel-btn {
          background: #ede7f6;
          color: #5e35b1;
        }
        .profile-card .cancel-btn:hover {
          background: #d1c4e9;
        }
        .profile-card .edit-btn {
          background: #5e35b1;
        }
        .profile-card .edit-btn:hover {
          background: #7e57c2;
        }
        .profile-card .success-msg {
          color: #388e3c;
          margin-top: 16px;
          text-align: center;
          font-weight: 500;
        }
        .profile-card .error-msg {
          color: #b71c1c;
          margin-top: 16px;
          text-align: center;
          font-weight: 500;
        }
        .back-btn {
          position: absolute;
          left: 24px;
          top: 24px;
          background: #ede7f6;
          color: #5e35b1;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-size: 1em;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .back-btn:hover {
          background: #d1c4e9;
        }
      `}</style>
      <div className="profile-card" style={{ position: "relative" }}>
        <button
          className="back-btn"
          onClick={() => navigate("/profile")}
          type="button"
        >
          ← Volver
        </button>
        <h2>Mi perfil</h2>
        <form onSubmit={handleSave} autoComplete="off">
          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            disabled={!editing}
            required
            style={{
              background: editing ? "#fff" : "#ede7f6",
              color: "#5e35b1",
            }}
          />
          <label>Nombre completo</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            disabled={!editing}
            required
          />
          <label>Teléfono</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={!editing}
          />
          <label>
            Dirección (calle, número, piso, localidad y código postal)
          </label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            disabled={!editing}
          />
          <label>DNI/NIE</label>
          <input
            name="id_number"
            value={form.id_number}
            onChange={handleChange}
            disabled={!editing}
            required
          />
          <div className="profile-actions">
            {editing ? (
              <>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setEditing(false);
                    setEmail(user.email || "");
                    setForm({
                      full_name: user.full_name || "",
                      phone: user.phone || "",
                      address: user.address || "",
                      id_number: user.id_number || "",
                    });
                    setError("");
                    setSuccess("");
                  }}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button type="submit" className="edit-btn" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="edit-btn"
                onClick={() => setEditing(true)}
              >
                Editar perfil
              </button>
            )}
          </div>
          {success && <div className="success-msg">{success}</div>}
          {error && <div className="error-msg">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
