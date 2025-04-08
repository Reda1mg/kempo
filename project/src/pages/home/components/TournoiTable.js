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
    (selectedCategory === "" || tournoi.rank === selectedCategory) // Assuming `rank` is your category
  );

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
                  <td>
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
