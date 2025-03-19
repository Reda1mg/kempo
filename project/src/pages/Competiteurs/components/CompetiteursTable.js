import React, { useState } from "react";
import styles from "./CompetiteursTables.module.css";
import Filter from "./Filter";  

const CompetitorTable = () => {
  const [searchQuery, setSearchQuery] = useState("");  
  const [selectedDate, setSelectedDate] = useState("");  

  const competitors = [
    { name: "Jean Martin", grade: "Ceinture Noire", birthDate: "1990-03-12", category: "-75kg" },
    { name: "Paul Dupont", grade: "Ceinture Bleue", birthDate: "1995-07-05", category: "-80kg" },
    { name: "Lucie Bernard", grade: "Ceinture Verte", birthDate: "1998-11-20", category: "-60kg" },
  ];

  const filteredCompetitors = competitors.filter((comp) =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedDate === "" || comp.birthDate === selectedDate)  
  );

  return (
    <div className={styles.container}>
      <Filter 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        selectedDate={selectedDate}  
        setSelectedDate={setSelectedDate}  
      />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>👤 Nom</th>
              <th>🏆 Grade</th>
              <th>📅 Date de Naissance</th>
              <th>⚖️ Catégorie</th>
              <th>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompetitors.map((comp, index) => (
              <tr key={index}>
                <td>{comp.name}</td>
                <td>{comp.grade}</td>
                <td>{comp.birthDate}</td>
                <td>{comp.category}</td>
                <td>
                  <button className={styles.btnEdit}>✏️</button>
                  <button className={styles.btnDelete}>🗑️</button>
                </td>
              </tr>
            ))}
            {filteredCompetitors.length === 0 && (
              <tr>
                <td colSpan="5">Aucun compétiteur trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompetitorTable;
