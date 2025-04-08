import React, { useState } from "react";
import styles from "./AjouterCompetiteurs.module.css";

const AddCompetitorModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    grade: "",
    birthDate: "",
    category: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    onClose();
  };

  const handleImportCSV = () => {
    alert("Importer CSV clicked. You can add CSV logic here.");
    // Later you can implement actual CSV import handling here
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Ajouter un Compétiteur</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nom:
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Grade:
            <select name="grade" value={form.grade} onChange={handleChange} required>
              <option value="">Sélectionner</option>
              <option value="Ceinture Blanche">Ceinture Blanche</option>
              <option value="Ceinture Jaune">Ceinture Jaune</option>
              <option value="Ceinture Orange">Ceinture Orange</option>
              <option value="Ceinture Verte">Ceinture Verte</option>
              <option value="Ceinture Bleue">Ceinture Bleue</option>
              <option value="Ceinture Marron">Ceinture Marron</option>
              <option value="Ceinture Noire">Ceinture Noire</option>
            </select>
          </label>
          <label>
            Date de Naissance:
            <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} required />
          </label>
          <label>
            Catégorie:
            <input name="category" value={form.category} onChange={handleChange} required />
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>
              Annuler
            </button>
            <button type="button" className={styles.import} onClick={handleImportCSV}>
              Importer CSV
            </button>
            <button type="submit" className={styles.confirm}>
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompetitorModal;
