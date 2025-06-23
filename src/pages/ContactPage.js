import React from "react";
import "../styles/ContactPage.css";

const ContactPage = () => {
  return (
    <div className="contact-page">
      <h1>Contacto</h1>
      <p>
        ¿Tienes alguna pregunta o necesitas ayuda? ¡Estamos aquí para ayudarte!
        Puedes contactarnos a través de los siguientes medios:
      </p>

      <div className="contact-info">
        <div className="contact-item">
          <h3>📧 Correo Electrónico</h3>
          <p>
            <a href="mailto:andreavegadev@gmail.com" className="email-link">
              andreavegadev@gmail.com
            </a>
          </p>
        </div>
        <div className="contact-item">
          <h3>📞 Teléfono</h3>
          <p>
            <a href="tel:+34123456789" className="phone-link">
              +34 123 456 789
            </a>
          </p>
        </div>
        <div className="contact-item">
          <h3>📍 Dirección</h3>
          <p>
            Calle de las Mascotas, 123, Gijón, España
            <br />
            <a
              href="https://www.google.com/maps?q=Calle+de+las+Mascotas,+123,+Gijón,+España"
              target="_blank"
              rel="noopener noreferrer"
              className="google-maps-link"
            >
              Ver en Google Maps
            </a>
          </p>
        </div>
      </div>

      <h2>Formulario de Contacto</h2>
      <form className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input type="text" id="name" name="name" placeholder="Tu nombre" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Tu correo electrónico"
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Mensaje</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            placeholder="Escribe tu mensaje aquí"
          ></textarea>
        </div>
        <button type="submit" className="submit-button">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
