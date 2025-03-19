import styles from "./Filters.module.css";
import CreationTournoi from './CreationTournoi';

const Filters = ({ searchQuery, setSearchQuery, selectedDate, setSelectedDate, selectedCategory, setSelectedCategory }) => {
  return (
    <div className={styles.filtersContainer}>
      {/* 🔎 Search by Name */}
      <div className={styles.filterItem}>
        <label htmlFor="search"><span>🔎</span> Rechercher par nom :</label>
        <input 
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Nom du tournoi" 
        />
      </div>

      {/* 📅 Filter by Date */}
      <div className={styles.filterItem}>
        <label htmlFor="dateFilter"><span>📅</span> Filtrer par date :</label>
        <input 
          type="date" 
          id="dateFilter"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* 📊 Filter by Category */}
      <div className={styles.filterItem}>
        <label htmlFor="categoryFilter"><span>📊</span> Filtrer par catégorie :</label>
        <select 
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          <option value="Hommes">Hommes</option>
          <option value="Femmes">Femmes</option>
        </select>
      </div> 

      {/* ➕ Create Tournament Button */}
      <div className={styles.createBtn}>
        <CreationTournoi/>
      </div>
    </div>
  );
};

export default Filters;
