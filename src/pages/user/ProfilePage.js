import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  ButtonDanger,
  ButtonPrimary,
} from "../../components/Button";
import Heading from "../../components/Heading";

const ProfilePage = () => {
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
      <div className="profile-card" style={{ position: "relative" }}>
        <Heading as="h2">Mi perfil</Heading>
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
                <ButtonDanger
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
                </ButtonDanger>
                <ButtonPrimary type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar"}
                </ButtonPrimary>
              </>
            ) : (
              <ButtonPrimary onClick={() => setEditing(true)}>
                Editar perfil
              </ButtonPrimary>
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
