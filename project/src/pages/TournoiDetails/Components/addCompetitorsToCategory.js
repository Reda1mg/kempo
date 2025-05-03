import React from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

const AddCompetitorsToCategory = () => {
  const { id: tournamentId } = useParams();
  const location = useLocation();
  const categoryId = new URLSearchParams(location.search).get("categoryId");

  const handleAssignTestCompetitor = async () => {
    try {
      // Replace with an actual existing UUID from your competitors table
      const testCompetitorId = "your-test-competitor-id";

      await axios.post(
        `http://localhost:3000/tournaments/${tournamentId}/assign-competitor/${categoryId}`,
        { competitor_id: testCompetitorId }
      );

      alert("✅ Compétiteur de test assigné !");
    } catch (error) {
      console.error("❌ Erreur d'assignation :", error.response?.data || error.message);
      alert("Erreur lors de l'assignation. Voir la console.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Ajouter des Compétiteurs au Tournoi:</h2>
      <button onClick={handleAssignTestCompetitor}>🧪 Assigner Test Compétiteur</button>
    </div>
  );
};

export default AddCompetitorsToCategory;
