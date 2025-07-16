import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "../../styles/PetList.css";
import PetDetailPanel from "./PetDetailPanel";
import {
  ButtonPrimary,
  ButtonSecondary,
  IconButton,
} from "../../components/Button";
import Heading from "../../components/Heading";
import Select from "../../components/Select";
import { Stack } from "../../components/LayoutUtilities";

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
  });
  const [saving, setSaving] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      const { data } = await supabase
        .from("pets")
        .select("*")
        .order("name", { ascending: true });
      setPets(data || []);
    };
    fetchPets();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    if (!form.species) {
      alert("Por favor selecciona una especie.");
      return;
    }
    setSaving(true);
    const speciesEnum = form.species.trim().toLowerCase();
    const { name, breed } = form;
    const { error } = await supabase.from("pets").insert([
      {
        name,
        species: speciesEnum,
        breed,
        active: true,
      },
    ]);
    setSaving(false);
    if (!error) {
      const { data: newPets } = await supabase
        .from("pets")
        .select("*")
        .order("name", { ascending: true });
      setPets(newPets || []);
      setShowModal(false);
    } else {
      alert("Error al añadir mascota: " + (error.message || ""));
    }
  };

  return (
    <Stack gap={24}>
      <Heading>Mis mascotas</Heading>

      <div className="pet-list-grid">
        {pets.map((pet) => (
          <div
            className="pet-card"
            key={pet.id}
            onClick={() => navigate(`/profile/pets/${pet.id}`)} // Para ver o editar
          >
            <img
              src={"/img/pet-placeholder.png"}
              alt={pet.name}
              className="pet-card-img"
            />
            <div className="pet-card-info">
              <Heading as="h3">{pet.name}</Heading>
              <p>
                {pet.species} {pet.breed && `- ${pet.breed}`}
              </p>
              <span
                className={`pet-status ${pet.active ? "active" : "inactive"}`}
              >
                {pet.active ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        ))}
      </div>
      <IconButton href={`/profile/pets/add`}>+</IconButton>
      {showModal && (
        <div className="pet-modal-bg" onClick={handleCloseModal}>
          <form
            className="pet-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleAddPet}
          >
            <Heading as="h3">Añadir Mascota</Heading>
            <label>Nombre</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={40}
              autoFocus
            />
            <Select
              name="species"
              label={`Especie`}
              value={form.species}
              onChange={handleChange}
              required
              options={[
                { value: "", label: "Selecciona especie" },
                { value: "perro", label: "Perro" },
                { value: "gato", label: "Gato" },
                { value: "ave", label: "Ave" },
              ]}
            />
            <label>Raza</label>
            <input
              name="breed"
              value={form.breed}
              onChange={handleChange}
              maxLength={30}
            />
            <div className="modal-actions">
              <ButtonSecondary onClick={handleCloseModal} disabled={saving}>
                Cancelar
              </ButtonSecondary>
              <ButtonPrimary type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </ButtonPrimary>
            </div>
          </form>
        </div>
      )}
      {showDetail && (
        <PetDetailPanel
          pet={selectedPet}
          onClose={() => setShowDetail(false)}
          onSave={() => {
            setShowDetail(false);
          }}
        />
      )}
    </Stack>
  );
};

export default PetList;
