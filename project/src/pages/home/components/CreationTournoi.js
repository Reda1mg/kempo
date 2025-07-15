import React, { useState } from "react";
import styles from "./CreationTournoi.module.css"; // Import CSS Module

const TournamentModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center">

      <button className={styles.openButton} onClick={() => setIsOpen(true)}>
        Créer un Tournoi
      </button>

      <div className={`${styles.modal} ${isOpen ? styles.modalOpen : ""}`}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h1>Création du tournoi</h1>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              &times;
            </button>
          </div>

          <div className="space-y-4 mt-4">
            <div className={styles.formGroup}>
              <label>Insérer nom du tournoi :</label>
              <input type="text" className="border border-gray-300 rounded p-2 w-full" placeholder="Nom du tournoi" />
            </div>

            <div className={styles.formGroup}>
              <label>Date du tournoi :</label>
              <input type="date" className="border border-gray-300 rounded p-2 w-full" />
              <label className="flex items-center mt-2">
                <span className="text-red-500 text-sm">Tournoi sur plusieurs jours ?</span>
                <input type="checkbox" className="ml-2" />
              </label>
            </div>

            <div className={styles.groupBox}>
              <label>GRADE :</label>
              <div className="grid grid-cols-2">
                <div>
                  <label><input type="checkbox" /> Ceinture Blanche</label>
                  <label><input type="checkbox" /> Ceinture Jaune</label>
                  <label><input type="checkbox" /> Ceinture Orange</label>
                  <label><input type="checkbox" /> Ceinture Verte</label>
                  <label><input type="checkbox" /> Ceinture Bleue</label>
                  <label><input type="checkbox" /> Ceinture Marron</label>
                </div>
                <div>
                  <label><input type="checkbox" /> Ceinture Noire 1er Dan</label>
                  <label><input type="checkbox" /> Ceinture Noire 2ème Dan</label>
                  <label><input type="checkbox" /> Ceinture Noire 3ème Dan</label>
                  <label><input type="checkbox" /> Ceinture Noire 4ème Dan</label>
                  <label><input type="checkbox" /> Ceinture Noire 5ème Dan</label>
                  <label><input type="checkbox" /> Ceinture Noire 6ème Dan</label>
                </div>
              </div>
            </div>

            <div className={styles.groupBox}>
              <label>GENRE :</label>
              <label><input type="checkbox" /> Homme</label>
              <label><input type="checkbox" /> Femme</label>
            </div>

            <div className={styles.groupBox}>
              <label>SYSTÈME D'ÉLIMINATION :</label>
              <label><input type="checkbox" /> Poules</label>
              <label><input type="checkbox" /> Élimination directe</label>
            </div>

            <div className={styles.groupBox}>
              <label>IMPORTER LISTE PARTICIPANTS :</label>
              <label><input type="radio" name="import" /> Manuellement</label>
              <label><input type="radio" name="import" /> Automatiquement</label>
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.primaryBtn}>Ajouter le tournoi</button>
              <button className={styles.secondaryBtn} onClick={() => setIsOpen(false)}>Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentModal;
