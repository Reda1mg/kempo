import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

const AddCompetitorsToCategory = () => {
  const { id: tournamentId } = useParams();
  const location = useLocation();
  const categoryId = new URLSearchParams(location.search).get("categoryId");

  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompetitors = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/tournaments/categories/${categoryId}/competitors`);
      setCompetitors(res.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des compétiteurs :", error.response?.data || error.message);
      alert("Erreur lors du chargement des compétiteurs. Voir la console.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTestCompetitor = async () => {
    try {
      const testCompetitorId = "your-test-competitor-id"; // Replace with a real one

      await axios.post(
        `http://localhost:3000/tournaments/${tournamentId}/assign-competitor/${categoryId}`,
        { competitor_id: testCompetitorId }
      );

      alert("✅ Compétiteur de test assigné !");
      fetchCompetitors(); // Refresh list
    } catch (error) {
      console.error("❌ Erreur d'assignation :", error.response?.data || error.message);
      alert("Erreur lors de l'assignation. Voir la console.");
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, [categoryId]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Ajouter des Compétiteurs au Tournoi:</h2>
      <button onClick={handleAssignTestCompetitor}>🧪 Assigner Test Compétiteur</button>

      <h3>Liste des Compétiteurs</h3>
      {loading ? (
        <p>Chargement...</p>
      ) : competitors.length === 0 ? (
        <p>Aucun compétiteur assigné à cette catégorie.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Genre</th>
              <th>Grade</th>
              <th>Date de Naissance</th>
              <th>Club</th>
              <th>Pays</th>
              <th>Poids</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c) => (
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
      )}
    </div>
  );
};

export default AddCompetitorsToCategory;
