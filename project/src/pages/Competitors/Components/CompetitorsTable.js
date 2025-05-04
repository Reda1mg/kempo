import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CompetitorsTable.module.css";
import Filter from "./Filter";
import AjouterCompetiteurs from "./AddCompetitors"; // Ensure this exists

const CompetitorTable = () => {
  const [competitors, setCompetitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch competitors from backend
  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        const res = await axios.get("http://localhost:3000/competitors");
        setCompetitors(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch competitors:", error);
      }
    };

    fetchCompetitors();
  }, []);

  // Handle manual addition (optional)
  const handleAdd = (newCompetitor) => {
    setCompetitors([...competitors, newCompetitor]);
    setIsAddModalOpen(false);
  };

  const filteredCompetitors = competitors.filter((c) => {
    const fullName = `${c.firstname} ${c.lastname}`.toLowerCase();
    const matchesName = fullName.includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || (c.birthday && c.birthday.startsWith(selectedDate));
    const matchesGrade = !selectedGrade || c.rank === selectedGrade;
    return matchesName && matchesDate && matchesGrade;
  });

  return (
    <div className={styles.container}>
      <Filter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>👤 Nom</th>
              <th>🏆 Grade</th>
              <th>📅 Date de Naissance</th>
              <th>⚖️ Poids</th>
              <th>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompetitors.length > 0 ? (
              filteredCompetitors.map((c) => (
                <tr key={c.id}>
                  <td>{c.firstname} {c.lastname}</td>
                  <td>{c.rank}</td>
                  <td>{c.birthday ? new Date(c.birthday).toLocaleDateString() : "-"}</td>
                  <td>{c.weight ?? "-"}</td>
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

      <AjouterCompetiteurs
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default CompetitorTable;
