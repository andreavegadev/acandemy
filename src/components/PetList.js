import PropTypes from "prop-types";
import { ButtonPrimary } from "./Button";

const PetList = ({ pets, onViewPet, onAddPet }) => {
  return (
    <section>
      <Heading as="h2">Mis Mascotas</Heading>
      {pets.length > 0 ? (
        <ul>
          {pets.map((pet) => (
            <li key={pet.id}>
              {pet.name} - {calculateAge(pet.birth_date)} años
              <ButtonPrimary
                href={`/profile/pets/${pet.Id}`}
                aria-label={`Ver detalles de ${pet.name}`}
              >
                Ver Detalles
              </ButtonPrimary>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes mascotas registradas.</p>
      )}
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
