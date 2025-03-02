import React from "react";
import styles from "./TournoiTable.module.css"; // Import CSS for styling

const TournoiTable = () => {
  // we put js above the return
  const tournois = [
    { name: "Tournoi Régional", date: "15/04/2024", location: "Nancy", organizer: "Nancy Kempo" },
    { name: "Championnat National", date: "22/05/2024", location: "Châtenois", organizer: "Châtenois Martial" },
    { name: "Open International", date: "05/06/2024", location: "Metz", organizer: "Metz Warriors" },
    { name: "Coupe d’été", date: "20/07/2024", location: "Épinal", organizer: "Épinal Combat" },
  ];

  return (
    <div className={styles["table-container"]}>
      <table className={styles["tournament-table"]}>
        <thead>
          <tr>
            <th>🏆 Nom du Tournoi</th>
            <th>📅 Date</th>
            <th>📍 Lieu</th>
            <th>🏛️ Club Organisateur</th>
            <th>🔍 Actions</th>
          </tr>
        </thead>
        <tbody>
          {tournois.map((tournoi, index) => (
            <tr key={index}> {/* equivalent a for each tournois[index]*/}
              <td>{tournoi.name}</td>
              <td>{tournoi.date}</td>
              <td>{tournoi.location}</td>
              <td>{tournoi.organizer}</td>
              <td>
                <button className={styles["details-btn"]}>Voir Détails</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TournoiTable;
