import React, { useState } from "react";
import "../styles/ContactPage.css";
import { ButtonPrimary } from "../components/Button";
import Heading from "../components/Heading";
import ResponsiveLayout from "../components/ResponsiveLayout";
import { Box } from "../components/LayoutUtilities";
import Input from "../components/Input";
import TextArea from "../components/TextArea";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccess("");
    setError("");

    try {
      // Llama a tu API o endpoint de backend para enviar el correo
      const res = await fetch("/api/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess("¡Mensaje enviado correctamente!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setError("No se pudo enviar el mensaje. Inténtalo más tarde.");
      }
    } catch {
      setError("No se pudo enviar el mensaje. Inténtalo más tarde.");
    }
    setSending(false);
  };

  return (
    <ResponsiveLayout>
      <Box paddingY={48}>
        <div className="contact-page">
          <Heading>Contacto</Heading>
          <p>
            ¿Tienes alguna pregunta o necesitas ayuda? ¡Estamos aquí para
            ayudarte! Puedes contactarnos a través de los siguientes medios:
          </p>

          <div className="contact-info">
            <div className="contact-item">
              <Heading as="h3">📧 Correo Electrónico</Heading>
              <p>
                <a href="mailto:andreavegadev@gmail.com" className="email-link">
                  andreavegadev@gmail.com
                </a>
              </p>
            </div>
            <div className="contact-item">
              <Heading as="h3">📞 Teléfono</Heading>
              <p>
                <a href="tel:+34123456789" className="phone-link">
                  +34 123 456 789
                </a>
              </p>
            </div>
            <div className="contact-item">
              <Heading as="h3">📍 Dirección</Heading>
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

          <Heading as="h2">Formulario de Contacto</Heading>
          <form className="contact-form" onSubmit={handleSubmit}>
            <Input
              label="Nombre"
              type="text"
              id="name"
              name="name"
              placeholder="Tu nombre"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              id="email"
              name="email"
              placeholder="Tu correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
            />
            <TextArea
              label={"Mensaje"}
              id="message"
              name="message"
              rows="5"
              placeholder="Escribe tu mensaje aquí"
              value={form.message}
              onChange={handleChange}
              required
            />
            <ButtonPrimary type="submit" disabled={sending}>
              {sending ? "Enviando..." : "Enviar"}
            </ButtonPrimary>
            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
          </form>
          {/* TODO enviar correo electrónico al administrador */}
        </div>
      </Box>
    </ResponsiveLayout>
  );
};

export default ContactPage;
