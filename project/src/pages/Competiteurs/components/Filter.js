import React from "react";
import styles from "./Filter.module.css";

const Filter = ({ searchQuery, setSearchQuery, selectedDate, setSelectedDate, selectedGrade, setSelectedGrade }) => {  
  return (
    <div className={styles.filtersContainer}>
      {/* 🔎 Search by Name */}
      <div className={styles.filterItem}>
        <label htmlFor="search">
          <span>🔎</span> Rechercher:
        </label>
        <input
          type="text"
          id="search"
          placeholder="Nom du compétiteur"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}  
        />
      </div>
    
      {/* 📅 Filter by Date */}
      <div className={styles.filterItem}>
        <label htmlFor="dateFilter">
          <span>📅</span> Filtrer par date :
        </label>
        <input 
          type="date" 
          id="dateFilter"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* 🏆 Filter by Grade */}
      <div className={styles.filterItem}>
        <label htmlFor="gradeFilter">
          <span>🏆</span> Filtrer par grade :
        </label>
        <select 
          id="gradeFilter"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
        >
          <option value="">Tous les grades</option>
          <option value="Ceinture Blanche">Ceinture Blanche</option>
          <option value="Ceinture Jaune">Ceinture Jaune</option>
          <option value="Ceinture Orange">Ceinture Orange</option>
          <option value="Ceinture Verte">Ceinture Verte</option>
          <option value="Ceinture Bleue">Ceinture Bleue</option>
          <option value="Ceinture Marron">Ceinture Marron</option>
          <option value="Ceinture Noire">Ceinture Noire</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
