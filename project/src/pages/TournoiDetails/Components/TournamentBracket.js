import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './TournamentBracket.module.css';

const TournamentBracket = () => {
  const { id: tournamentId } = useParams();
  const [categories, setCategories] = useState([]);
  const [matches, setMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les informations du tournoi
        const tournamentRes = await axios.get(`http://localhost:8000/tournaments/${tournamentId}`);
        setTournament(tournamentRes.data);

        // Récupérer les catégories
        const categoriesRes = await axios.get(`http://localhost:8000/tournaments/${tournamentId}/categories`);
        setCategories(categoriesRes.data);

        // Pour chaque catégorie, récupérer les matches
        const matchesData = {};
        for (const category of categoriesRes.data) {
          try {
            const matchesRes = await axios.get(`http://localhost:8000/tournaments/categories/${category.id}/matches`);
            matchesData[category.id] = matchesRes.data;
          } catch (error) {
            console.error(`Erreur récupération matches pour ${category.name}:`, error);
            matchesData[category.id] = [];
          }
        }
        setMatches(matchesData);
        
      } catch (error) {
        console.error('Erreur récupération données tournoi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [tournamentId]);

  const getMatchStatus = (match) => {
    if (match.isFinished) return 'finished';
    if (match.isRunning) return 'running';
    return 'pending';
  };

  const getMatchStatusText = (match) => {
    if (match.isFinished) return 'Terminé';
    if (match.isRunning) return 'En cours';
    return 'À venir';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCompetitorDisplayName = (competitor) => {
    if (!competitor) return 'TBD';
    return `${competitor.firstname} ${competitor.lastname}`;
  };

  const getCompetitorInfo = (competitor) => {
    if (!competitor) return '';
    const info = [];
    if (competitor.club) info.push(competitor.club);
    if (competitor.rank) info.push(competitor.rank);
    if (competitor.weight) info.push(`${competitor.weight}kg`);
    return info.join(' • ');
  };

  const isWinner = (match, competitor) => {
    return match.winner && match.winner.id === competitor?.id;
  };

  const renderMatch = (match, index) => {
    const status = getMatchStatus(match);
    const statusText = getMatchStatusText(match);

    return (
      <div key={match.id} className={`${styles.matchCard} ${styles[status]}`}>
        <div className={styles.matchHeader}>
          <span className={styles.matchNumber}>Match #{index + 1}</span>
          <span className={`${styles.matchStatus} ${styles[status]}`}>
            {statusText}
          </span>
        </div>

        <div className={styles.competitors}>
          <div className={`${styles.competitor} ${
            match.isFinished ? (isWinner(match, match.competitor1) ? styles.winner : styles.loser) : ''
          }`}>
            <div>
              <div className={styles.competitorName}>
                {getCompetitorDisplayName(match.competitor1)}
              </div>
              <div className={styles.competitorInfo}>
                {getCompetitorInfo(match.competitor1)}
              </div>
            </div>
            <div className={styles.competitorScore}>
              {match.score1 || 0}
            </div>
          </div>

          <div className={`${styles.competitor} ${
            match.isFinished ? (isWinner(match, match.competitor2) ? styles.winner : styles.loser) : ''
          }`}>
            <div>
              <div className={styles.competitorName}>
                {getCompetitorDisplayName(match.competitor2)}
              </div>
              <div className={styles.competitorInfo}>
                {getCompetitorInfo(match.competitor2)}
              </div>
            </div>
            <div className={styles.competitorScore}>
              {match.score2 || 0}
            </div>
          </div>
        </div>

        {match.time && (
          <div className={styles.matchTime}>
            Temps: {formatTime(match.time)}
          </div>
        )}

        <div className={styles.matchControls}>
          {!match.isFinished && !match.isRunning && (
            <button className={`${styles.controlBtn} ${styles.startBtn}`}>
              ▶️ Démarrer
            </button>
          )}
          {match.isRunning && (
            <button className={`${styles.controlBtn} ${styles.stopBtn}`}>
              ⏹️ Arrêter
            </button>
          )}
          {match.isFinished && (
            <button className={`${styles.controlBtn} ${styles.updateBtn}`}>
              ✏️ Modifier
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderCategory = (category) => {
    const categoryMatches = matches[category.id] || [];
    
    return (
      <div key={category.id} className={styles.categorySection}>
        <h3 className={styles.categoryHeader}>{category.name}</h3>
        
        <div className={styles.categoryInfo}>
          <span>👥 {category.gender === 'H' ? 'Hommes' : 'Femmes'}</span>
          <span>🥋 {Array.isArray(category.rank) ? category.rank.join(', ') : category.rank}</span>
          <span>⚔️ {category.elimination_type}</span>
        </div>

        {categoryMatches.length > 0 ? (
          <div className={styles.bracket}>
            <div className={styles.roundTitle}>
              {category.elimination_type === 'Directe' ? 'Élimination Directe' : 'Matches de Poule'}
            </div>
            <div className={styles.matchesGrid}>
              {categoryMatches.map((match, index) => renderMatch(match, index))}
            </div>
          </div>
        ) : (
          <div className={`${styles.noMatches} ${styles.info}`}>
            <p>Aucun match généré pour cette catégorie</p>
            <p>Assurez-vous d'avoir assigné au moins 2 compétiteurs et démarré le tournoi</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.bracketContainer}>
        <div className={styles.noMatches}>
          <p>Chargement des brackets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bracketContainer}>
      <h1 className={styles.bracketTitle}>
        🏆 Brackets - {tournament?.name || 'Tournoi'}
      </h1>
      
      {categories.length > 0 ? (
        categories.map(category => renderCategory(category))
      ) : (
        <div className={styles.noMatches}>
          <p>Aucune catégorie trouvée pour ce tournoi</p>
        </div>
      )}
    </div>
  );
};

export default TournamentBracket;
