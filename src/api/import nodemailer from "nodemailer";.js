import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    {
      /* TODO: Configurar para el email de acandemy
       *  Descomentar cuando se configure el email de producción
       */
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "andreavegadev@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "andreavegadev@gmail.com",
      subject: "Nuevo mensaje de contacto",
      text: message,
      html: `<p><b>Nombre:</b> ${name}</p>
             <p><b>Email:</b> ${email}</p>
             <p><b>Mensaje:</b><br/>${message}</p>`,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error enviando el correo" });
  }
}
