import styles from "./CompetiteursTables.module.css";

const CompetitorTable = () => {
  const competitors = [
    { name: "Jean Martin", grade: "Ceinture Noire", birthDate: "12/03/1990", club: "Nancy Kempo", category: "-75kg" },
    { name: "Paul Dupont", grade: "Ceinture Bleue", birthDate: "05/07/1995", club: "Châtenois Martial", category: "-80kg" },
    { name: "Lucie Bernard", grade: "Ceinture Verte", birthDate: "20/11/1998", club: "Metz Warriors", category: "-60kg" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.addButton}>
        <button className={styles.btnAdd}>➕ Ajouter un Compétiteur</button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>👤 Nom</th>
              <th>🏆 Grade</th>
              <th>📅 Date de Naissance</th>
              <th>🏢 Club</th>
              <th>⚖️ Catégorie</th>
              <th>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((comp, index) => (
              <tr key={index}>
                <td>{comp.name}</td>
                <td>{comp.grade}</td>
                <td>{comp.birthDate}</td>
                <td>{comp.club}</td>
                <td>{comp.category}</td>
                <td className={styles.btnAction}>
                  <button className={styles.btnEdit}>✏️</button>
                  <button className={styles.btnDelete}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompetitorTable;
