import Heading from "../../components/Heading";
import { ButtonSecondary } from "../../components/Button";

const PetDetailPanel = ({ pet, onClose, onEdit }) => {
  if (!pet) return null;
  return (
    <div className="pet-modal-bg" onClick={onClose}>
      <style>{`
        .pet-detail-panel {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 32px #b39ddb55;
          padding: 32px 28px 24px 28px;
          min-width: 320px;
          max-width: 95vw;
          position: relative;
          animation: fadeInDetail 0.3s;
        }
        .pet-detail-panel h3 {
          margin-top: 0;
          color: #5e35b1;
        }
        .pet-detail-panel p {
          margin: 10px 0;
          font-size: 1.08em;
        }
        .pet-detail-panel .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #ede7f6;
          color: #5e35b1;
          border: none;
          border-radius: 6px;
          padding: 6px 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        .pet-detail-panel .close-btn:hover {
          background: #d1c4e9;
        }
        .pet-detail-panel .edit-btn {
          position: absolute;
          top: 16px;
          right: 110px;
          background: #ede7f6;
          color: #5e35b1;
          border: none;
          border-radius: 6px;
          padding: 6px 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        .pet-detail-panel .edit-btn:hover {
          background: #d1c4e9;
        }
        .pet-detail-panel .pet-status {
          display: inline-block;
          margin-top: 10px;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.98em;
          font-weight: 500;
          background: #ede7f6;
          color: #5e35b1;
        }
        .pet-detail-panel .pet-status.inactive {
          background: #ffcdd2;
          color: #b71c1c;
        }
        .pet-detail-panel .pet-img {
          display: block;
          margin: 0 auto 18px auto;
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: 50%;
          border: 2px solid #d1c4e9;
          background: #f3e5f5;
        }
        @keyframes fadeInDetail {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
      <div className="pet-detail-panel" onClick={(e) => e.stopPropagation()}>
        <ButtonSecondary
          onClick={onClose}
          aria-label={`Cerrar detalle de mascota ${pet.name}`}
        >
          Cerrar
        </ButtonSecondary>
        <ButtonSecondary
          onClick={() => onEdit && onEdit(pet)}
          aria-label={`Editar mascota ${pet.name}`}
        >
          Editar
        </ButtonSecondary>
        <img
          src={"/img/pet-placeholder.png"}
          alt={pet.name}
          className="pet-img"
        />
        <Heading as="h3">{pet.name}</Heading>
        <p>
          <b>Especie:</b> {pet.species}
        </p>
        <p>
          <b>Raza:</b> {pet.breed || "-"}
        </p>
        <p>
          <b>Fecha nacimiento:</b> {pet.birth_date || "-"}
        </p>
        <p>
          <b>Peso:</b> {pet.weight ? `${pet.weight} kg` : "-"}
        </p>
        <p>
          <b>Cuello:</b> {pet.neck_size ? `${pet.neck_size} cm` : "-"}
        </p>
        <p>
          <b>Pecho:</b> {pet.chest_size ? `${pet.chest_size} cm` : "-"}
        </p>
        <span className={`pet-status ${pet.active ? "active" : "inactive"}`}>
          {pet.active ? "Activo" : "Inactivo"}
        </span>
      </div>
    </div>
  );
};

export default PetDetailPanel;
