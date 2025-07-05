import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";

const ListPersonalizationTypePage = ({ onCreated, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    const { error: insertError } = await supabase
      .from("personalization_types")
      .insert([
        {
          name: name.trim(),
          description: description.trim(),
        },
      ]);

    if (insertError) {
      setError("Error al crear el tipo: " + insertError.message);
    } else {
      setSuccess(true);
      setName("");
      setDescription("");
      if (onCreated) onCreated();
    }
  };

  return (
    <div>
      <style>{`
        .add-panel {
          background: #f8f6ff;
          border: 1px solid #d1c4e9;
          border-radius: 12px;
          padding: 28px 24px 24px 24px;
          min-width: 320px;
          max-width: 420px;
          box-shadow: 0 2px 12px #ede7f6;
          font-size: 16px;
          color: #3a2e5c;
          margin-bottom: 16px;
          animation: fadeInDetail 0.3s;
        }
        .add-panel h2 {
          color: #5e35b1;
          margin-top: 0;
          margin-bottom: 18px;
          font-size: 1.3em;
        }
        .add-panel label {
          display: block;
          margin: 10px 0 4px 0;
          font-weight: 500;
        }
        .add-panel input[type="text"] {
          width: 100%;
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid #d1c4e9;
          font-size: 15px;
          margin-bottom: 8px;
        }
        .add-panel textarea {
          width: 100%;
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid #d1c4e9;
          font-size: 15px;
          margin-bottom: 8px;
          min-height: 60px;
        }
        .add-panel .panel-actions {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }
        
        .add-panel .error {
          color: #e53935;
          margin-top: 8px;
        }
        .add-panel .success {
          color: #43a047;
          margin-top: 8px;
        }
      `}</style>
      <div className="add-panel">
        <h2>Crear tipo de personalización</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </label>
          <label>
            Descripción:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <div className="panel-actions">
            <ButtonPrimary type="submit" aria-label={`Crear personalización`}>
              Crear
            </ButtonPrimary>
            {onCancel && (
              <ButtonSecondary onClick={onCancel} aria-label={`Cancelar`}>
                Cancelar
              </ButtonSecondary>
            )}
          </div>
          {error && <div className="error">{error}</div>}
          {success && (
            <div className="success">¡Tipo de personalización creado!</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ListPersonalizationTypePage;
