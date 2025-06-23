import React from "react";
import PropTypes from "prop-types";

const FeaturedCard = ({ icon, title, description, link }) => {
  return (
    <div className="featured-card">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={link} className="buy-now-button">
        Comprar Ahora
      </a>
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