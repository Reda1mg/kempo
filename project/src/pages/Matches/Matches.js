import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Matches.module.css';

const Matches = () => {
  const { categoryId } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Récupérer les matches de la catégorie
        const matchesResponse = await fetch(`http://localhost:8000/matches/category/${categoryId}`);
        if (matchesResponse.ok) {
          const matchesData = await matchesResponse.json();
          setMatches(matchesData);
        }

        // Récupérer les informations de la catégorie
        const categoryResponse = await fetch(`http://localhost:8000/categories/${categoryId}`);
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          setCategory(categoryData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des matches:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchMatches();
    }
  }, [categoryId]);

  const setMatchResult = async (matchId, score1, score2, keikuka1, keikuka2, winnerId = null, isFinished = true) => {
    try {
      const response = await fetch(`http://localhost:8000/matches/${matchId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score1,
          score2,
          keikuka1,
          keikuka2,
          winner: winnerId,
          isFinished
        }),
      });

      if (response.ok) {
        // Recharger les matches après la mise à jour
        const matchesResponse = await fetch(`http://localhost:8000/matches/category/${categoryId}`);
        if (matchesResponse.ok) {
          const matchesData = await matchesResponse.json();
          setMatches(matchesData);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du match:', error);
    }
  };

  const startMatch = (matchId) => {
    // Ouvrir le scoreboard dans un nouvel onglet
    const scoreboardUrl = `/scoreboard/${matchId}`;
    window.open(scoreboardUrl, '_blank', 'width=1200,height=800');
    
    // Rediriger la fenêtre actuelle vers la télécommande
    window.location.href = `/telecommande/${matchId}`;
  };

  const resetTournament = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser les matches ? Tous les matches seront supprimés.')) {
      try {
        const response = await fetch(`http://localhost:8000/matches/category/${categoryId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Recharger les matches après la suppression
          const matchesResponse = await fetch(`http://localhost:8000/matches/category/${categoryId}`);
          if (matchesResponse.ok) {
            const matchesData = await matchesResponse.json();
            setMatches(matchesData);
          }
        } else {
          console.error('Erreur lors de la suppression des matches:', response.status);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression des matches:', error);
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Chargement des matches...</div>;
  }

  return (
    <div className={styles.matchesContainer}>
      <h2 className={styles.title}>
        🥋 Bracket - {category ? category.name : 'Catégorie'}
      </h2>
      
      <div className={styles.eliminationType}>
        <span className={styles.typeLabel}>
          {category?.elimination_type === 'Directe' ? '🏆 Élimination Directe' : '🔄 Système de Poules'}
        </span>
        <button onClick={resetTournament} className={styles.resetButton}>
          🔄 Réinitialiser le tournoi
        </button>
      </div>
      
      {matches.length === 0 ? (
        <div className={styles.noMatches}>
          Aucun match trouvé. Veuillez d'abord démarrer le tournoi.
        </div>
      ) : (
        <div className={styles.matchesList}>
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSetResult={setMatchResult}
              onStartMatch={startMatch}
            />
          ))}
        </div>
      )}

      {/* Bouton pour réinitialiser le tournoi */}
      <div className={styles.resetTournament}>
        <button onClick={resetTournament} className={styles.resetButton}>
          🔄 Réinitialiser le Tournoi
        </button>
      </div>
    </div>
  );
};

const MatchCard = ({ match, onSetResult, onStartMatch }) => {
  const [score1, setScore1] = useState(match.score1);
  const [score2, setScore2] = useState(match.score2);
  const [keikuka1, setKeikuka1] = useState(match.keikuka1);
  const [keikuka2, setKeikuka2] = useState(match.keikuka2);

  const handleSetResult = () => {
    // Marquer le match comme terminé quand on soumet manuellement les résultats
    onSetResult(match.id, score1, score2, keikuka1, keikuka2, null, true);
  };

  const handleStartMatch = () => {
    onStartMatch(match.id);
  };

  const getRoundLabel = (poolNumber) => {
    if (poolNumber === '0') return 'Premier Tour';
    if (poolNumber.startsWith('round-')) return `Tour ${poolNumber.split('-')[1]}`;
    return `Poule ${poolNumber}`;
  };

  return (
    <div className={`${styles.matchCard} ${match.isFinished ? styles.finished : ''}`}>
      <div className={styles.matchHeader}>
        <h3>{getRoundLabel(match.pool_number)}</h3>
        {match.isFinished && (
          <span className={styles.finishedBadge}>✅ Terminé</span>
        )}
      </div>
      
      <div className={styles.competitors}>
        <div className={styles.competitor}>
          <div className={styles.competitorName}>
            {match.competitor1 ? `${match.competitor1.firstname} ${match.competitor1.lastname}` : 'En attente'}
          </div>
          <div className={styles.competitorDetails}>
            {match.competitor1 && (
              <>
                <span>{match.competitor1.club}</span>
                <span className={styles.rank}>{match.competitor1.rank}</span>
              </>
            )}
          </div>
        </div>
        
        <div className={styles.vs}>VS</div>
        
        <div className={styles.competitor}>
          <div className={styles.competitorName}>
            {match.competitor2 ? `${match.competitor2.firstname} ${match.competitor2.lastname}` : 'En attente'}
          </div>
          <div className={styles.competitorDetails}>
            {match.competitor2 && (
              <>
                <span>{match.competitor2.club}</span>
                <span className={styles.rank}>{match.competitor2.rank}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Bouton pour démarrer le match */}
      {!match.isFinished && match.competitor1 && match.competitor2 && (
        <div className={styles.startSection}>
          <button onClick={handleStartMatch} className={styles.startMatchButton}>
            🚀 Démarrer le Match
          </button>
          <p className={styles.startInfo}>
            Ouvre le scoreboard et la télécommande
          </p>
        </div>
      )}
      
      {/* Section de saisie manuelle des résultats */}
      {!match.isFinished && match.competitor1 && match.competitor2 && (
        <div className={styles.manualSection}>
          <h4>Saisie manuelle des résultats</h4>
          <div className={styles.scoreInputs}>
            <div className={styles.scoreGroup}>
              <label>Score {match.competitor1.firstname}</label>
              <input
                type="number"
                value={score1}
                onChange={(e) => setScore1(parseInt(e.target.value) || 0)}
                min="0"
              />
              <label>Keikuka</label>
              <input
                type="number"
                value={keikuka1}
                onChange={(e) => setKeikuka1(parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
            
            <div className={styles.scoreGroup}>
              <label>Score {match.competitor2.firstname}</label>
              <input
                type="number"
                value={score2}
                onChange={(e) => setScore2(parseInt(e.target.value) || 0)}
                min="0"
              />
              <label>Keikuka</label>
              <input
                type="number"
                value={keikuka2}
                onChange={(e) => setKeikuka2(parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
          
          <div className={styles.actions}>
            <button onClick={handleSetResult} className={styles.finishButton}>
              ✅ Terminer le match
            </button>
          </div>
        </div>
      )}
      
      {/* Affichage des résultats finaux */}
      {match.isFinished && (
        <div className={styles.finalScore}>
          <div className={styles.scoreFinal}>
            <span className={match.winner?.id === match.competitor1?.id ? styles.winner : ''}>
              {match.competitor1?.firstname}: {match.score1} ({match.keikuka1})
            </span>
            <span className={match.winner?.id === match.competitor2?.id ? styles.winner : ''}>
              {match.competitor2?.firstname}: {match.score2} ({match.keikuka2})
            </span>
          </div>
          {match.winner && (
            <div className={styles.winnerAnnouncement}>
              🏆 Gagnant: {match.winner.firstname} {match.winner.lastname}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Matches;
