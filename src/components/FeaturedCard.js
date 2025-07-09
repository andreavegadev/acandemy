import PropTypes from "prop-types";
import "../styles/FeaturedCard.css";
import { ButtonLink } from "./Button";
const FeaturedCard = ({ icon, title, description, link }) => {
  return (
    <div className="featured-card">
      <ButtonLink href={link}>
        <div className="icon">{icon}</div>
        <span href={link} className="buy-now-button">
          {title}
        </span>
      </ButtonLink>
    </div>
  );
};

FeaturedCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default FeaturedCard;
