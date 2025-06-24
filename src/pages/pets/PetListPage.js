import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "../../styles/PetListPage.css";
import PetDetailPanel from "./PetDetailPanel";

const PetListPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
  });
  const [saving, setSaving] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchParams] = useSearchParams();
  const startEditing = searchParams.get("edit") === "1";
  const [isEditing, setIsEditing] = useState(startEditing);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("pets")
        .select("*")
        .order("name", { ascending: true });
      setPets(data || []);
      setLoading(false);
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

  if (loading)
    return <div className="pet-list-loading">Cargando mascotas...</div>;

  return (
    <div className="pet-list-container">
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
        .pet-modal button {
          background: #5e35b1;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 18px;
          font-size: 1em;
          cursor: pointer;
          transition: background 0.2s;
        }
        .pet-modal button:disabled {
          background: #b39ddb;
          cursor: not-allowed;
        }
        .pet-modal .close-btn {
          background: #ede7f6;
          color: #5e35b1;
        }
        .pet-modal .close-btn:hover {
          background: #d1c4e9;
        }
      `}</style>
      <h2>Mis Mascotas</h2>
      <div className="pet-list-grid">
        {pets.map((pet) => (
          <div
            className="pet-card"
            key={pet.id}
            onClick={() => navigate(`/pets/${pet.id}`)} // Para ver o editar
          >
            <img
              src={pet.photo_url || "/img/pet-placeholder.png"}
              alt={pet.name}
              className="pet-card-img"
            />
            <div className="pet-card-info">
              <h3>{pet.name}</h3>
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
      <button className="add-pet-btn" onClick={handleOpenModal}>
        +
      </button>
      {showModal && (
        <div className="pet-modal-bg" onClick={handleCloseModal}>
          <form
            className="pet-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleAddPet}
          >
            <h3>Añadir Mascota</h3>
            <label>Nombre</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={40}
              autoFocus
            />
            <label>Especie</label>
            <select
              name="species"
              value={form.species}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona especie</option>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
              <option value="ave">Ave</option>
              {/* Agrega aquí los valores reales de tu enum */}
            </select>
            <label>Raza</label>
            <input
              name="breed"
              value={form.breed}
              onChange={handleChange}
              maxLength={30}
            />
            <div className="modal-actions">
              <button
                type="button"
                className="close-btn"
                onClick={handleCloseModal}
                disabled={saving}
              >
                Cancelar
              </button>
              <button type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </button>
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
            // Recarga la lista de mascotas aquí si quieres
          }}
        />
      )}
    </div>
  );
};

export default PetListPage;
