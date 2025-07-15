import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Bracket.module.css';

const Bracket = () => {
  const { categoryId } = useParams();
  const [matches, setMatches] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`http://localhost:8000/categories/${categoryId}/matches`);
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch matches:', error);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await fetch(`http://localhost:8000/categories/${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        setCategory(data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch category:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchCategory();
    const interval = setInterval(fetchMatches, 2000);
    return () => clearInterval(interval);
  }, [categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  const startMatch = (matchId) => {
    window.location.href = `/match/${matchId}`;
  };

  const getMatchStatus = (match) => {
    if (match.winner) return 'finished';
    if (match.isRunning) return 'running';
    if (match.competitor1 && match.competitor2) return 'ready';
    return 'pending';
  };

  // Organiser les matches par rounds pour créer un vrai bracket
  const organizeBracket = (matches) => {
    if (!matches || matches.length === 0) return [];
    
    console.log('📊 Matches reçus:', matches);
    
    // Si tous les matches ont le même round, on simule un bracket réel
    const allSameRound = matches.every(match => (match.round || 1) === (matches[0].round || 1));
    
    if (allSameRound) {
      // Créer un bracket simulé basé sur le nombre de matches
      const totalMatches = matches.length;
      
      const bracket = [];
      
      // Premier round : tous les matches initiaux
      bracket.push({
        round: 1,
        matches: matches
      });
      
      // Si on a plus de 1 match, on peut simuler des rounds suivants
      if (totalMatches > 1) {
        const halfMatches = Math.ceil(totalMatches / 2);
        if (halfMatches > 1) {
          bracket.push({
            round: 2,
            matches: matches.slice(0, halfMatches) // Demi-finale simulée
          });
        }
        
        // Finale
        bracket.push({
          round: bracket.length + 1,
          matches: [matches[0]] // Finale simulée
        });
      }
      
      console.log('🎯 Bracket simulé:', bracket);
      return bracket;
    }
    
    // Sinon, utiliser les rounds existants
    const rounds = {};
    matches.forEach(match => {
      const round = match.round || 1;
      if (!rounds[round]) {
        rounds[round] = [];
      }
      rounds[round].push(match);
    });

    const sortedRounds = Object.keys(rounds)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(round => ({
        round: parseInt(round),
        matches: rounds[round].sort((a, b) => (a.position || 0) - (b.position || 0))
      }));

    console.log('✅ Bracket final:', sortedRounds);
    return sortedRounds;
  };

  const getRoundName = (roundNumber, totalRounds) => {
    if (roundNumber === totalRounds) return 'Finale';
    if (roundNumber === totalRounds - 1) return 'Demi-finale';
    if (roundNumber === totalRounds - 2) return 'Quart de finale';
    return `Tour ${roundNumber}`;
  };

  if (loading) {
    return <div className={styles.loading}>Chargement du bracket...</div>;
  }

  const bracketData = organizeBracket(matches);
  const totalRounds = bracketData.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🏆 Bracket - {category?.name}</h1>
        <div className={styles.categoryInfo}>
          <span className={styles.eliminationType}>
            {category?.elimination_type === 'DIRECT' ? '🗲 Élimination directe' : '🔄 Poule'}
          </span>
        </div>
      </div>

      <div className={styles.bracketContainer}>
        {matches.length === 0 ? (
          <div className={styles.noMatches}>
            <h3>Aucun match généré</h3>
            <p>Veuillez démarrer le tournoi pour générer les matches</p>
          </div>
        ) : (
          <div className={styles.bracket}>
            {bracketData.map((roundData, roundIndex) => (
              <div key={roundData.round} className={styles.round}>
                <div className={styles.roundHeader}>
                  <h3>{getRoundName(roundData.round, totalRounds)}</h3>
                </div>
                <div className={styles.roundColumn}>
                  {roundData.matches.map((match, matchIndex) => (
                    <div key={match.id} className={styles.matchWrapper}>
                      <div className={`${styles.matchCard} ${styles[getMatchStatus(match)]}`}>
                        <div className={styles.matchTitle}>
                          Match #{match.id.slice(-4)}
                        </div>
                        
                        <div className={styles.competitor}>
                          <span className={styles.competitorName}>
                            {match.competitor1 
                              ? `${match.competitor1.firstname} ${match.competitor1.lastname}`
                              : 'En attente...'
                            }
                          </span>
                          {match.competitor1?.club && (
                            <span className={styles.competitorClub}>
                              {match.competitor1.club}
                            </span>
                          )}
                          <span className={styles.score}>
                            {match.score1 || 0}
                          </span>
                        </div>

                        <div className={styles.vs}>VS</div>

                        <div className={styles.competitor}>
                          <span className={styles.competitorName}>
                            {match.competitor2 
                              ? `${match.competitor2.firstname} ${match.competitor2.lastname}`
                              : 'En attente...'
                            }
                          </span>
                          {match.competitor2?.club && (
                            <span className={styles.competitorClub}>
                              {match.competitor2.club}
                            </span>
                          )}
                          <span className={styles.score}>
                            {match.score2 || 0}
                          </span>
                        </div>

                        <div className={styles.matchAction}>
                          {getMatchStatus(match) === 'ready' && (
                            <button
                              className={styles.startButton}
                              onClick={() => startMatch(match.id)}
                            >
                              🚀 Démarrer le match
                            </button>
                          )}
                          {getMatchStatus(match) === 'running' && (
                            <button
                              className={styles.continueButton}
                              onClick={() => startMatch(match.id)}
                            >
                              📱 Télécommande
                            </button>
                          )}
                          {getMatchStatus(match) === 'finished' && (
                            <div className={styles.winner}>
                              🏆 {match.winner?.firstname} {match.winner?.lastname}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Lignes de connexion vers le round suivant */}
                      {roundIndex < bracketData.length - 1 && (
                        <div className={styles.connection}>
                          <div className={styles.connectionLine}></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bracket;
