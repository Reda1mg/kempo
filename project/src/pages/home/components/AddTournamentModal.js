import React, { useState } from "react";
import styles from "./EditTournamentModal.module.css"; // reuse the same styles

const AddTournamentModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [multiDay, setMultiDay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setCity("");
    setStartDate("");
    setEndDate("");
    setMultiDay(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !city || !startDate) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsLoading(true);

    const tournamentData = {
      name,
      city,
      start_date: startDate,
      end_date: multiDay ? endDate : startDate,
    };

    try {
      const response = await fetch("http://localhost:8000/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tournamentData),
      });

      if (response.ok) {
        alert("✅ Tournoi créé avec succès !");
        onAdd(); // refresh parent list
        handleClose(); // close modal and reset form
      } else {
        const errorText = await response.text();
        console.error("Erreur lors de la création:", errorText);
        alert(`❌ Erreur lors de la création du tournoi: ${errorText}`);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      alert("❌ Erreur réseau lors de la création du tournoi");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Créer un nouveau tournoi</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nom du tournoi *:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Championnat régional 2025"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="city">Ville *:</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Paris"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="startDate">Date de début *:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                checked={multiDay}
                onChange={(e) => setMultiDay(e.target.checked)}
              />
              Tournoi sur plusieurs jours
            </label>
          </div>

          {multiDay && (
            <div className={styles.formGroup}>
              <label htmlFor="endDate">Date de fin:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button type="button" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer le tournoi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTournamentModal;
