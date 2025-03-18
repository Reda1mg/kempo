import React from "react";
import { Link } from "react-router-dom";
import styles from "./TournoiTable.module.css"; 

const TournoiTable = () => {
  const tournois = [
    { id: 1, name: "Tournoi Régional", date: "15/04/2024", location: "Nancy", organizer: "Nancy Kempo" },
    { id: 2, name: "Championnat National", date: "22/05/2024", location: "Châtenois", organizer: "Châtenois Martial" },
    { id: 3, name: "Open International", date: "05/06/2024", location: "Metz", organizer: "Metz Warriors" },
    { id: 4, name: "Coupe d’été", date: "20/07/2024", location: "Épinal", organizer: "Épinal Combat" },
  ];

  return (
    <div className={styles["table-container"]}>
      <table className={styles["tournament-table"]}>
        <thead>
          <tr>
            <th>🏆 Nom du Tournoi</th>
            <th>📅 Date</th>
            {/* <th>📍 Lieu</th> */}
            {/* <th>🏛️ Club Organisateur</th> */}
            <th>🔍 Actions</th>
          </tr>
        </thead>
        <tbody>
          {tournois.map((tournoi) => (
            <tr key={tournoi.id}>
              <td>{tournoi.name}</td>
              <td>{tournoi.date}</td>
              {/* <td>{tournoi.location}</td> */}
              {/* <td>{tournoi.organizer}</td> */}
              <td>
                <Link to={`/tournoiDetails/${tournoi.id}`}>
                  <button className={styles["details-btn"]}>Voir Détails</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TournoiTable;
