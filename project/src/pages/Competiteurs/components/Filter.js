
import React from "react";
import styles from "./Filter.module.css";

const Filter = ({ searchQuery, setSearchQuery }) => {  
  if (!setSearchQuery) {
    
    return null;
  }

  return (
    <div className={styles.filtersContainer}>
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
    
      <div className={styles.filterItem}>
        <label htmlFor="dateFilter">
          <span>📅</span> Filtrer par date :
        </label>
        <input type="date" id="dateFilter" />
      </div>
    </div>
  );
};

export default Filter;
