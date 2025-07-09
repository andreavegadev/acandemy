import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Heading from "../../components/Heading";
import { useNavigate } from "react-router-dom";
import { ButtonSecondary, ButtonPrimary } from "../../components/Button";
import Breadcrumbs from "../../components/Breadcrumbs";
import Input from "../../components/Input";

const UserProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      let user = null;
      if (supabase.auth.getUser) {
        const { data } = await supabase.auth.getUser();
        user = data?.user;
      } else {
        user = supabase.auth.user();
      }
      if (!user) {
        setLoading(false);
        return;
      }
      setEmail(user.email);

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      setUserData(data || {});
      setForm(data || {});
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
    setSuccess("");
    setError("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm(userData);
    setSuccess("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const { id, email, ...fieldsToUpdate } = form;
    const { error: updateError } = await supabase
      .from("users")
      .update(fieldsToUpdate)
      .eq("id", userData.id);
    if (updateError) {
      setError("Error al guardar los cambios: " + updateError.message);
    } else {
      setSuccess("Datos actualizados correctamente.");
      setUserData({ ...userData, ...fieldsToUpdate });
      setEditMode(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  if (loading) return <p>Cargando datos de perfil...</p>;

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <Breadcrumbs
        items={[
          { label: "Mi perfil", onClick: () => navigate("/admin/profile") },
          {
            label: `Perfil de ${userData.full_name || "usuario"}`,
            current: true,
          },
        ]}
      ></Breadcrumbs>
      <Heading as="h2">Perfil de {userData.full_name || "usuario"}</Heading>
      <form onSubmit={handleSave}>
        {editMode ? (
          <Input
            label="Nombre completo"
            type="text"
            name="full_name"
            value={form.full_name || ""}
            required
            onChange={handleChange}
          />
        ) : (
          <Input
            label="Nombre completo"
            type="text"
            name="full_name"
            value={userData.full_name || "-"}
            required
            readOnly
          />
        )}
        <Input
          type="email"
          name="email"
          label="Email"
          value={email || ""}
          readOnly
        />
        {editMode ? (
          <Input
            label="Documento de identidad"
            type="text"
            name="id_number"
            value={form.id_number || ""}
            onChange={handleChange}
          />
        ) : (
          <Input
            label="Documento de identidad"
            type="text"
            name="id_number"
            value={userData.id_number || "-"}
            readOnly
          />
        )}

        {editMode ? (
          <Input
            type="text"
            name="phone"
            label={"Teléfono"}
            value={form.phone || ""}
            onChange={handleChange}
          />
        ) : (
          <Input
            type="text"
            name="phone"
            label={"Teléfono"}
            value={userData.phone || "-"}
            readOnly
          />
        )}
        {editMode ? (
          <Input
            label={"Dirección (calle, número, piso, localidad y código postal)"}
            type="text"
            name="address"
            value={form.address || ""}
            onChange={handleChange}
          />
        ) : (
          <Input
            label={
              "Dirección completa (calle, número, piso, localidad, ciudad y código postal)"
            }
            type="text"
            name="address"
            value={userData.address || "-"}
            readOnly
          />
        )}

        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
        <div style={{ marginTop: 16 }}>
          {editMode ? (
            <>
              <ButtonPrimary type="submit">Guardar</ButtonPrimary>
              <ButtonSecondary type="button" onClick={handleCancel}>
                Cancelar
              </ButtonSecondary>
            </>
          ) : (
            <ButtonPrimary type="button" onClick={handleEdit}>
              Editar
            </ButtonPrimary>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfilePage;
