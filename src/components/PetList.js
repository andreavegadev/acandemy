import React from "react";
import PropTypes from "prop-types";

const PetList = ({ pets, onViewPet, onAddPet }) => {
  return (
    <section>
      <h2>Mis Mascotas</h2>
      {pets.length > 0 ? (
        <ul>
          {pets.map((pet) => (
            <li key={pet.id}>
              {pet.name} - {calculateAge(pet.birth_date)} años
              <button onClick={() => onViewPet(pet.id)}>Ver Detalles</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes mascotas registradas.</p>
      )}
      <button onClick={onAddPet}>Añadir Mascota</button>
    </section>
  );
};

// Función para calcular la edad de la mascota
const calculateAge = (birthDate) => {
  if (!birthDate) return "Desconocida";
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  return monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())
    ? age - 1
    : age;
};

// Validación de propiedades
PetList.propTypes = {
  pets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      birth_date: PropTypes.string,
    })
  ).isRequired,
  onEditPet: PropTypes.func.isRequired,
  onAddPet: PropTypes.func.isRequired,
};

export default PetList;
