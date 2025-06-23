import React from "react";
import "../../styles/LegalPages.css";

const LegalNoticePage = () => {
  return (
    <div className="legal-bg">
      <div className="legal-card">
        <h1>Aviso Legal</h1>
        <p>
          Este sitio web es propiedad de [Nombre de la empresa o responsable].
          El acceso y uso de este sitio implica la aceptación de las siguientes
          condiciones:
        </p>
        <h2>Datos del responsable</h2>
        <p>
          <strong>Nombre:</strong> [Nombre de la empresa o responsable]
          <br />
          <strong>Dirección:</strong> [Dirección completa]
          <br />
          <strong>Email:</strong> [Correo electrónico de contacto]
          <br />
          <strong>NIF/CIF:</strong> [Número de identificación fiscal]
        </p>
        <h2>Condiciones de uso</h2>
        <p>
          El usuario se compromete a hacer un uso adecuado de los contenidos y
          servicios que se ofrecen a través de este sitio web y a no emplearlos
          para incurrir en actividades ilícitas o contrarias a la buena fe y al
          ordenamiento legal.
        </p>
        <h2>Propiedad intelectual</h2>
        <p>
          Todos los contenidos de este sitio web (textos, imágenes, logotipos,
          etc.) son propiedad de [Nombre de la empresa] o de sus licenciantes,
          quedando prohibida su reproducción total o parcial sin autorización
          expresa.
        </p>
        <h2>Responsabilidad</h2>
        <p>
          El titular no se hace responsable de los daños o perjuicios derivados
          del uso de la información de este sitio web ni del acceso a otros
          sitios a través de enlaces.
        </p>
        <h2>Legislación aplicable</h2>
        <p>
          Este aviso legal se rige por la legislación española. Para cualquier
          controversia que pudiera derivarse del acceso o uso de este sitio web,
          el usuario se somete a la jurisdicción de los tribunales de [Ciudad].
        </p>
      </div>
    </div>
  );
};

export default LegalNoticePage;
