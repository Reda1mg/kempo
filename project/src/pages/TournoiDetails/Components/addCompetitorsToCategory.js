import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./addCompetitorToCateg.module.css";
import AssignedCompetitors from "./AssignedCompetitors";

const AddCompetitorsToCategory = () => {
  const location = useLocation();
  const { id: tournamentId } = useParams();
  const categoryId = new URLSearchParams(location.search).get("categoryId");
  const navigate = useNavigate();

  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryDetails, setCategoryDetails] = useState(null);

  const fetchCompetitors = useCallback(async () => {
    console.log("🔍 DEBUG - tournamentId:", tournamentId);
    console.log("🔍 DEBUG - categoryId:", categoryId);
    
    try {
      const res = await axios.get(
        `http://localhost:8000/tournaments/${tournamentId}/categories/${categoryId}/competitors/all`
      );
      console.log("✅ Compétiteurs récupérés:", res.data);
      setCompetitors(res.data);
    } catch (error) {
      console.error("❌ Erreur chargement compétiteurs:", error);
      console.error("❌ Error details:", error.response?.data);
    }
  }, [tournamentId, categoryId]);

  // Récupérer les détails de la catégorie pour l'auto-assignation
  const fetchCategoryDetails = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/tournaments/${tournamentId}/categories`
      );
      const category = res.data.find((cat) => cat.id === categoryId);
      setCategoryDetails(category);
    } catch (error) {
      console.error("❌ Erreur chargement détails catégorie:", error);
    }
  }, [tournamentId, categoryId]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await fetchCompetitors();
      await fetchCategoryDetails();
      setLoading(false);
    };

    if (categoryId) fetchAll();
  }, [categoryId, tournamentId, fetchCompetitors, fetchCategoryDetails]);

  const handleAddClick = async (competitorId) => {
    try {
      // Directement assigner le compétiteur à la catégorie
      await axios.post(
        `http://localhost:8000/tournaments/${tournamentId}/categories/${categoryId}/competitors/${competitorId}/assign`
      );

      await fetchCompetitors();
      // Rafraîchir aussi la liste des compétiteurs assignés
      if (window.refreshAssignedCompetitors) {
        window.refreshAssignedCompetitors();
      }
    } catch (error) {
      console.error("❌ Erreur ajout compétiteur:", error.response?.data || error.message);
    }
  };

  // Fonction d'auto-assignation des compétiteurs selon les critères de la catégorie
  const handleAutoAssign = async () => {
    if (!categoryDetails) {
      alert("Impossible de récupérer les détails de la catégorie");
      return;
    }

    console.log("🔍 Détails de la catégorie pour auto-assignation:", categoryDetails);

    try {
      // Utiliser les compétiteurs déjà récupérés par fetchCompetitors
      const eligibleCompetitors = competitors.filter(competitor => {
        console.log(`🔍 Vérification du compétiteur ${competitor.firstname} ${competitor.lastname}:`);
        
        // Vérifier le genre
        if (categoryDetails.gender && competitor.gender !== categoryDetails.gender) {
          console.log(`❌ Genre: ${competitor.gender} !== ${categoryDetails.gender}`);
          return false;
        }

        // Vérifier les grades (si spécifiés)
        if (categoryDetails.rank && Array.isArray(categoryDetails.rank)) {
          if (!categoryDetails.rank.includes(competitor.rank)) {
            console.log(`❌ Grade: ${competitor.rank} pas dans ${categoryDetails.rank}`);
            return false;
          }
        }

        // Pour l'instant, on ne vérifie pas l'âge et le poids car cela nécessite plus de données
        // Vous pouvez ajouter ces vérifications plus tard si nécessaire
        
        console.log(`✅ Compétiteur éligible: ${competitor.firstname} ${competitor.lastname}`);
        return true;
      });

      console.log(`🎯 ${eligibleCompetitors.length} compétiteurs éligibles trouvés`);

      // Assigner automatiquement les compétiteurs éligibles
      let assignedCount = 0;
      for (const competitor of eligibleCompetitors) {
        try {
          await axios.post(
            `http://localhost:8000/tournaments/${tournamentId}/categories/${categoryId}/competitors/${competitor.id}/assign`
          );
          
          assignedCount++;
          console.log(`✅ ${competitor.firstname} ${competitor.lastname} assigné avec succès`);
        } catch (error) {
          // Ignorer les erreurs pour les compétiteurs déjà assignés
          if (error.response?.status === 400) {
            console.log(`ℹ️ ${competitor.firstname} ${competitor.lastname} déjà assigné`);
          } else {
            console.error(`❌ Erreur assignation ${competitor.firstname} ${competitor.lastname}:`, error);
          }
        }
      }

      alert(`✅ ${assignedCount} compétiteurs assignés automatiquement à la catégorie !`);
      
      // Rafraîchir la liste
      await fetchCompetitors();
      
      // Rafraîchir aussi la liste des compétiteurs assignés
      if (window.refreshAssignedCompetitors) {
        window.refreshAssignedCompetitors();
      }
      
    } catch (error) {
      console.error("❌ Erreur auto-assignation:", error);
      alert("Erreur lors de l'auto-assignation. Voir la console.");
    }
  };

  const handleStartTournament = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/tournaments/${tournamentId}/start`
      );
      alert("🚀 Tournoi démarré !");
      console.log("Réponse :", res.data);
    } catch (error) {
      console.error("❌ Erreur démarrage tournoi:", error.response?.data || error.message);
      alert("Impossible de démarrer le tournoi.");
    }
  };

  const handleGoToMatches = () => {
    navigate(`/tournaments/${tournamentId}/brackets`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Liste des Compétiteurs</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : competitors.length === 0 ? (
        <p>✅ Tous les compétiteurs disponibles ont été ajoutés à cette catégorie.</p>
      ) : (
        <div>
          <div className={styles.actionButtons}>
            <button 
              className={styles.autoAssignBtn}
              onClick={handleAutoAssign}
            >
              🤖 Auto-assigner selon les critères
            </button>
          </div>
          
          {/* Sélecteur de compétiteurs */}
          <div className={styles.competitorSelector}>
            <h3>Ajouter un compétiteur manuellement</h3>
            <div className={styles.selectContainer}>
              <select 
                className={styles.competitorSelect}
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddClick(e.target.value);
                    e.target.value = ''; // Reset après sélection
                  }
                }}
                defaultValue=""
              >
                <option value="">Sélectionner un compétiteur...</option>
                {competitors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstname} {c.lastname} - {c.rank} - {c.gender}
                    {c.weight ? ` (${c.weight}kg)` : ''}
                    {c.club ? ` - ${c.club}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Tableau détaillé (collapsible) */}
          <div className={styles.detailedView}>
            <details className={styles.detailsContainer}>
              <summary className={styles.detailsSummary}>
                📋 Voir tous les détails ({competitors.length} compétiteurs disponibles)
              </summary>
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
                          <button className={styles.addBtn} onClick={() => handleAddClick(c.id)}>
                            ➕ Ajouter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </div>
      )}

      <AssignedCompetitors onUpdate={fetchCompetitors} />

      <div className={styles.startBtnWrapper}>
        <button className={styles.startBtn} onClick={handleStartTournament}>
          🚀 Commencer le tournoi
        </button>

        <button className={styles.matchBtn} onClick={handleGoToMatches}>
          📋 Matchs
        </button>
      </div>
    </div>
  );
};

export default AddCompetitorsToCategory;
