import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./TournoiTable.module.css";
import Filter from "./Filters";

const TournoiTable = () => {
  const [searchQueryName, setSearchQueryName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tournois, setTournois] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/tournaments")
      .then((res) => res.json())
      .then((data) => {
        setTournois(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des tournois:", err);
        setLoading(false);
      });
  }, []);

  const filteredTournois = tournois.filter((tournoi) =>
    tournoi.name.toLowerCase().includes(searchQueryName.toLowerCase()) &&
    (selectedDate === "" || tournoi.start_date === selectedDate) &&
    (selectedCategory === "" || tournoi.rank === selectedCategory)
  );
  const handleDelete = async (id) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer ce tournoi ?");
    if (!confirm) return;
  
    try {
      const response = await fetch(`http://localhost:3000/tournaments/${id}`, {
        method: "DELETE",
      });
  
      if (response.status === 202) {
        console.log("✅ Tournoi supprimé !");
        // Optional: remove from UI without full reload
        setTournois(prev => prev.filter(t => t.id !== id));
      } else if (response.status === 404) {
        alert("❌ Tournoi introuvable.");
      } else {
        alert("❌ Une erreur est survenue.");
      }
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
    }
  };
  
  return (
    <div className={styles["table-container"]}>
      <Filter
        searchQuery={searchQueryName}
        setSearchQuery={setSearchQueryName}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {loading ? (
        <p>Chargement des tournois...</p>
      ) : (
        <table className={styles["tournament-table"]}>
          <thead>
            <tr>
              <th>🏆 Nom du Tournoi</th>
              <th>📅 Date</th>
              <th>📊 Catégorie</th>
              <th>🔍 Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTournois.length > 0 ? (
              filteredTournois.map((comp, index) => (
                <tr key={index}>
                  <td>{comp.name}</td>
                  <td>{comp.start_date}</td>
                  <td>{comp.rank}</td>
                  <td className={styles["action-buttons"]}>
                    <button className={styles["edit-btn"]}>Modifier</button>
                    <button
                      className={styles["delete-btn"]}
                      onClick={() => handleDelete(comp.id)}
                    >
                      Supprimer
                    </button>
                    <Link to={`/tournoiDetails/${comp.id}`}>
                      <button className={styles["details-btn"]}>Voir Détails</button>
                    </Link>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Aucun tournoi trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TournoiTable;
