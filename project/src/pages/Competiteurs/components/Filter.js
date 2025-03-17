import styles from "./Filter.module.css"; 

const Filter = () => {
  return (
    <div className={styles.filtersContainer}>
      {/* Search Input */}
      <div className={styles.filterItem}>
        <label htmlFor="search">
          <span>🔎</span> Rechercher :
        </label>
        <input type="text" id="search" placeholder="Nom du tournoi" />
      </div>

      {/* Club Select Dropdown */}
      <div className={styles.filterItem}>
        <label htmlFor="clubFilter">
          <span>🏢</span> Filtrer par club :
        </label>
        <select id="clubFilter">
          <option value="">Tous les clubs</option>
          <option value="Nancy Kempo">Nancy Kempo</option>
          <option value="Châtenois Martial">Châtenois Martial</option>
          <option value="Metz Warriors">Metz Warriors</option>
          <option value="Épinal Combat">Épinal Combat</option>
        </select>
      </div>

      {/* Date Filter */}
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
