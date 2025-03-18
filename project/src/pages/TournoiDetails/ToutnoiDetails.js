import React from "react";
import RankingTable from "./Components/RankingTable";

const rankingsData = [
  { name: "John", surname: "Doe", ippon: 1, kekkou: 2, points: 6 },
  { name: "XXX", surname: "Doe", ippon: 1, kekkou: 2, points: 5 },
  { name: "YYY", surname: "Doe", ippon: 1, kekkou: 2, points: 5 },
];

const TournoiDetails = () => {
  return (
    <div className="content">
      <h1>Détails du Tournoi</h1>
      <RankingTable rankings={rankingsData} /> 
    </div>
  );
};

export default TournoiDetails;
