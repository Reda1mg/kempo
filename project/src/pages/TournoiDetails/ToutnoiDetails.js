import React from "react";
import MatchTable from "./Components/ListeMatches";
import RankingTable from "./Components/RankingTable"; 

const matchesData = [
  { combat: "#1", name: "John", surname: "Doe", club: "Nancy", ippon: 0, kekkou: 0 },
  { combat: "#2", name: "XXX", surname: "Doe", club: "-", ippon: 0, kekkou: 0 }
];

const rankingsData = [
  { name: "John", surname: "Doe", ippon: 1, kekkou: 2, points: 6 },
  { name: "XXX", surname: "Doe", ippon: 1, kekkou: 2, points: 5 }
];

const TournoiDetails = () => {
  return (
    <div className="content">
      <h1>Détails du Tournoi</h1>
      <MatchTable matches={matchesData} />  
      <RankingTable rankings={rankingsData} /> 
    </div>
  );
};

export default TournoiDetails;
