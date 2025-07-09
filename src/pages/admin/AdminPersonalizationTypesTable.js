import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Table from "../../components/Table";
import { Inline, Stack } from "../../components/LayoutUtilities";
import Heading from "../../components/Heading";
import { ButtonPrimary } from "../../components/Button";

const AdminPersonalizationTypesTable = () => {
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypes = async () => {
      let query = supabase
        .from("personalization_types")
        .select("*")
        .order("id", { ascending: false });

      const { data } = await query;
      setTypes(data || []);
    };
    fetchTypes();
  }, []);

  const onAddPesonalizationType = () => {
    navigate("/admin/customizations/add");
  };

  const onPersonalizationTypeSelect = (type) => {
    if (type && type.id) {
      navigate(`/admin/customizations/${type.id}`);
    }
  };

  // Filtros para la tabla
  const [filters, setFilters] = useState({
    name: "",
    description: "",
  });

  const tableFilters = [
    {
      key: "nombre",
      label: "Nombre",
      type: "text",
      value: filters.name,
      onChange: (e) => setFilters((f) => ({ ...f, name: e.target.value })),
    },
    {
      key: "descripción",
      label: "Descripción",
      type: "text",
      value: filters.description,
      onChange: (e) =>
        setFilters((f) => ({ ...f, description: e.target.value })),
    },
  ];

  // Filtrado en frontend
  const filteredTypes = types.filter(
    (type) =>
      (!filters.name ||
        type.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.description ||
        (type.description || "")
          .toLowerCase()
          .includes(filters.description.toLowerCase()))
  );

  return (
    <Stack gap={24}>
      <Inline justify="space-between" align="center" fullWidth>
        <Heading>Personalizaciones</Heading>
        <ButtonPrimary onClick={onAddPesonalizationType}>
          Añadir personalización
        </ButtonPrimary>
      </Inline>
      <Table
        items={filteredTypes.map((type) => ({
          id: type.id,
          nombre: type.name,
          descripción: type.description,
        }))}
        onClick={onPersonalizationTypeSelect}
        filters={tableFilters}
        addItems
      />
    </Stack>
  );
};

export default AdminPersonalizationTypesTable;
