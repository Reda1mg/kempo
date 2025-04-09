import React, { useState } from "react";
import styles from "./CompetitorsTable.module.css";
import Filter from "./Filter";
import AjouterCompetiteurs from "./AddCompetitors"; // Make sure this component exists and is styled

const CompetitorTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [competitors, setCompetitors] = useState([
    { name: "Jean Martin", grade: "Ceinture Noire", birthDate: "1990-03-12", category: "-75kg" },
    { name: "Paul Dupont", grade: "Ceinture Bleue", birthDate: "1995-07-05", category: "-80kg" },
    { name: "Lucie Bernard", grade: "Ceinture Verte", birthDate: "1998-11-20", category: "-60kg" },
    { name: "Maxime Dubois", grade: "Ceinture Marron", birthDate: "1992-08-10", category: "-70kg" },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAdd = (newCompetitor) => {
    setCompetitors([...competitors, newCompetitor]);
    setIsAddModalOpen(false);
  };

  const filteredCompetitors = competitors.filter((comp) =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedDate === "" || comp.birthDate.startsWith(selectedDate)) &&
    (selectedGrade === "" || comp.grade === selectedGrade)
  );

  return (
    <div className={styles.container}>
      <Filter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        onOpenAddModal={() => setIsAddModalOpen(true)} // 👈 handle modal open
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
            {filteredCompetitors.length > 0 ? (
              filteredCompetitors.map((comp, index) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="5">Aucun compétiteur trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal component */}
      <AjouterCompetiteurs
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default CompetitorTable;
