import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./AssignedCompetitors.module.css";

const AssignedCompetitors = ({ onUpdate }) => {
  const { id: tournamentId } = useParams();
  const location = useLocation();
  const categoryId = new URLSearchParams(location.search).get("categoryId");
  const [assignedCompetitors, setAssignedCompetitors] = useState([]);

  // Fetch assigned competitors for this specific category
  const fetchAssignedCompetitors = useCallback(async () => {
    if (!categoryId) return;
    
    try {
      const res = await axios.get(`http://localhost:8000/tournaments/${tournamentId}/categories/${categoryId}/competitors`);
      console.log("🔍 Compétiteurs assignés à la catégorie:", res.data);
      setAssignedCompetitors(res.data);
    } catch (error) {
      console.error("❌ Erreur récupération compétiteurs assignés:", error);
    }
  }, [tournamentId, categoryId]);

  // Delete competitor from tournament category
  const handleDelete = async (competitorId) => {
    try {
      await axios.delete(`http://localhost:8000/tournaments/${tournamentId}/categories/${categoryId}/competitors/${competitorId}`);
      alert("✅ Compétiteur supprimé de la catégorie !");
      await fetchAssignedCompetitors(); // Refresh assigned competitors
      if (onUpdate) onUpdate(); // Refresh main competitors list
    } catch (error) {
      console.error("❌ Erreur suppression compétiteur:", error.response?.data || error.message);
      alert("Erreur lors de la suppression. Voir la console.");
    }
  };

  useEffect(() => {
    fetchAssignedCompetitors();
  }, [fetchAssignedCompetitors]);

  // Exposer la fonction de rafraîchissement
  useEffect(() => {
    if (onUpdate) {
      window.refreshAssignedCompetitors = fetchAssignedCompetitors;
    }
  }, [fetchAssignedCompetitors, onUpdate]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        ✅ Compétiteurs assignés à cette catégorie ({assignedCompetitors.length})
      </h3>
      {assignedCompetitors.length === 0 ? (
        <p>Aucun compétiteur assigné à cette catégorie.</p>
      ) : (
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
              <th>Actions</th>
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
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(c.id)}
                  >
                    ❌ Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignedCompetitors;
