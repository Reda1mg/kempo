import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./TournoiTable.module.css"; 
import Filter from './Filters';

const TournoiTable = () => {
  const [searchQueryName, setSearchQueryName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const tournois = [
    { id: 1, name: "Tournoi Régional", date: "2024-04-15", category: "Hommes", organizer: "Nancy Kempo" },
    { id: 2, name: "Championnat National", date: "2024-05-22", category: "Femmes", organizer: "Châtenois Martial" },
    { id: 3, name: "Open International", date: "2024-06-05", category: "Hommes", organizer: "Metz Warriors" },
    { id: 4, name: "Coupe d’été", date: "2024-07-20", category: "Femmes", organizer: "Épinal Combat" },
  ];

  // **Apply Filters**
  const filteredTournois = tournois.filter((tournoi) => 
    tournoi.name.toLowerCase().includes(searchQueryName.toLowerCase()) &&
    (selectedDate === "" || tournoi.date === selectedDate) &&
    (selectedCategory === "" || tournoi.category === selectedCategory)
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
                <td>{comp.date}</td>
                <td>{comp.category}</td>
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
    </div>
  );
};

export default TournoiTable;
