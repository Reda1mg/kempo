// src/pages/TournoiDetails/Components/AssignedCompetitors.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./AssignedCompetitors.module.css";

const AssignedCompetitors = () => {
  const { id: tournamentId } = useParams();
  const [assignedCompetitors, setAssignedCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedCompetitors = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/tournaments/${tournamentId}/competitors`
      );
      setAssignedCompetitors(res.data);
    } catch (error) {
      console.error("❌ Erreur chargement compétiteurs assignés:", error);
      alert("Erreur chargement compétiteurs assignés. Voir console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedCompetitors();
  }, [tournamentId]);

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.subtitle}>✅ Compétiteurs déjà ajoutés au tournoi</h3>
      {loading ? (
        <p>Chargement...</p>
      ) : assignedCompetitors.length === 0 ? (
        <p>Aucun compétiteur actuellement assigné à ce tournoi.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Genre</th>
                <th>Grade</th>
                <th>Date de naissance</th>
                <th>Club</th>
                <th>Pays</th>
                <th>Poids</th>
              </tr>
            </thead>
            <tbody>
              {assignedCompetitors.map((c) => (
                <tr key={c.id}>
                  <td>{c.firstname}</td>
                  <td>{c.lastname}</td>
                  <td>{c.gender}</td>
                  <td>{c.rank}</td>
                  <td>{c.birthday ? new Date(c.birthday).toLocaleDateString() : "-"}</td>
                  <td>{c.club || "-"}</td>
                  <td>{c.country || "-"}</td>
                  <td>{c.weight ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignedCompetitors;
