import styles from "./Filters.module.css";
import CreationTournoi from './CreationTournoi'
const Filters = () => {
  return (
    <div className={styles.filtersContainer}>
      {/* Search Tournament */}
      <div className={styles.filterItem}>
        <label htmlFor="search"><span>🔎</span> Rechercher par nom :</label>
        <input type="text" id="search" placeholder="Nom du tournoi" />
      </div>

      {/* Filter by Club */}
      <div className={styles.filterItem}>
        <label htmlFor="clubFilter">🏛️ Filtrer par club :</label>
        <select id="clubFilter">
          <option value="">Tous les clubs</option>
          <option value="Nancy Kempo">Nancy Kempo</option>
          <option value="Châtenois Martial">Châtenois Martial</option>
          <option value="Metz Warriors">Metz Warriors</option>
          <option value="Épinal Combat">Épinal Combat</option>
        </select>
      </div>

      <div className={styles.filterItem}>
        <label htmlFor="dateFilter">📅 Filtrer par date :</label>
        <input type="date" id="dateFilter" />
      </div>

      <div className={styles.filterItem}>
        <label htmlFor="dateFilter">📅 Filtrer par categories :</label>
        <select id="clubFilter">
          <option value="">Tous les categories</option>
          <option value="Nancy Kempo">Hommes</option>
          <option value="Châtenois Martial">Femmes</option>
        </select>
      </div> 
      <div className={styles.createBtn}><CreationTournoi/></div>
    </div>
  );
};

export default Filters;
