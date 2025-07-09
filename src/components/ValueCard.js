import Heading from "./Heading";
import PropTypes from "prop-types";

const ValueCard = ({ icon, title, subtitle }) => {
  return (
    <div className="value-card">
      <div className="icon">{icon}</div>
      <Heading as="h3">{title}</Heading>
      <p>{subtitle}</p>
    </div>
  );
};

ValueCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default ValueCard;
