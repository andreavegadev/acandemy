import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Table from "../../components/Table";
import { Inline, Stack } from "../../components/LayoutUtilities";
import Heading from "../../components/Heading";
import { ButtonPrimary } from "../../components/Button";
import Text from "../../components/Text";

const AdminShippingTable = () => {
  const [shippingTypes, setShippingTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShipping = async () => {
      setLoading(true);
      let query = supabase
        .from("shipping")
        .select("*")
        .order("created_at", { ascending: false });

      const { data } = await query;
      setShippingTypes(data || []);
      setLoading(false);
    };
    fetchShipping();
  }, []);

  const onAddShipping = () => {
    navigate("/admin/shippings/add");
  };

  const onShippingSelect = (shipping) => {
    if (shipping && shipping.id) {
      navigate(`/admin/shippings/${shipping.id}`);
    }
  };

  return (
    <Stack gap={24}>
      <Inline justify="space-between" align="center" fullWidth>
        <Heading>Tipos de envío</Heading>
        <ButtonPrimary onClick={onAddShipping}>
          Añadir tipo de envío
        </ButtonPrimary>
      </Inline>
      <Table
        items={shippingTypes.map((shipping) => ({
          id: shipping.id,
          nombre: shipping.name,
          precio: shipping.price + "€",
          activo: shipping.active ? "Sí" : "No",
        }))}
        onClick={onShippingSelect}
        filters={[
          { key: "nombre", label: "Buscar nombre" },
          {
            key: "activo",
            label: "Filtrar por activo",
            type: "select",
            options: [
              { value: "Sí", label: "Sí" },
              { value: "No", label: "No" },
            ],
          },
        ]}
      />
      {loading && <p>Cargando...</p>}
      {!loading && shippingTypes.length === 0 && <p>Sin tipos de envío</p>}
    </Stack>
  );
};

export default AdminShippingTable;
