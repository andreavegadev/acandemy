import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "../../styles/PetList.css";
import PetDetailPanel from "./PetDetailPanel";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import Heading from "../../components/Heading";
import Select from "../../components/Select";

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

  const handleOpenModal = () => {
    setForm({ name: "", species: "", breed: "" });
    setShowModal(true);
  };

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
    <div className="pet-list-container">
      <Heading>Mis mascotas</Heading>
      <style>{`
        .add-pet-btn {
          background: #5e35b1;
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          font-size: 2em;
          box-shadow: 0 4px 16px #b39ddb77;
          cursor: pointer;
          z-index: 100;
          transition: background 0.2s;
        }
        .add-pet-btn:hover {
          background: #7e57c2;
        }
        .pet-modal-bg {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(60,40,100,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
        }
        .pet-modal {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 32px #b39ddb55;
          padding: 32px 28px 24px 28px;
          min-width: 320px;
          max-width: 95vw;
          position: relative;
        }
        .pet-modal h3 {
          margin-top: 0;
          color: #5e35b1;
        }
        .pet-modal label {
          display: block;
          margin: 14px 0 6px 0;
          font-weight: 500;
        }
        .pet-modal input,
        .pet-modal select {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #d1c4e9;
          border-radius: 6px;
          font-size: 1em;
        }
        .pet-modal .modal-actions {
          margin-top: 22px;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
      `}</style>
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
      <ButtonPrimary href={`/profile/pets/add`}>+</ButtonPrimary>
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
    </div>
  );
};

export default PetList;
