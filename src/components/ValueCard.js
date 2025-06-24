import React from "react";
import PropTypes from "prop-types";

const ValueCard = ({ icon, title, subtitle }) => {
  return (
    <div className="value-card">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
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
