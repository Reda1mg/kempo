import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

const AddCompetitorsToCategory = () => {
  const location = useLocation();
  const { id: tournamentId } = useParams(); // Get tournamentId from the URL
  const categoryId = new URLSearchParams(location.search).get("categoryId");

  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompetitors = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/competitors/categories/${categoryId}`
      );
      setCompetitors(res.data);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des compétiteurs:", error);
      alert("Erreur lors du chargement des compétiteurs. Voir la console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchCompetitors();
    }
  }, [categoryId]);

  const handleAddClick = async (competitorId) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/tournaments/${tournamentId}/add-competitor/${competitorId}`
      );
      alert("✅ Compétiteur ajouté au tournoi !");
      console.log("✅ Réponse:", res.data);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout :", error.response?.data || error.message);
      alert("Erreur lors de l'ajout. Voir la console.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Liste des Compétiteurs</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : competitors.length === 0 ? (
        <p>Aucun compétiteur trouvé pour cette catégorie.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
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
              <th>Action</th>
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
                <td>
                  <button onClick={() => handleAddClick(c.id)}>Ajouter</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AddCompetitorsToCategory;
