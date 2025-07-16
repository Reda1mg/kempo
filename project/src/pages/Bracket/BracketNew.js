import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BracketTree.css';

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
    const fetchData = async () => {
      await fetchMatches();
      await fetchCategory();
    };
    fetchData();
    // Refresh matches every 2 seconds
    const interval = setInterval(fetchMatches, 2000);
    return () => clearInterval(interval);
  }, [categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  const startMatch = (matchId) => {
    window.location.href = `/match/${matchId}`;
  };

  // Créer un arbre de tournoi basé sur le nombre de matches
  const createTournamentTree = (initialMatches) => {
    if (!initialMatches || initialMatches.length === 0) return [];
    
    const totalMatches = initialMatches.length;
    const rounds = [];
    
    // Déterminer le nom du premier round selon le nombre de matches
    let firstRoundName = 'Quart de finale';
    if (totalMatches <= 2) {
      firstRoundName = 'Demi-finale';
    } else if (totalMatches <= 4) {
      firstRoundName = 'Quart de finale';
    } else if (totalMatches <= 8) {
      firstRoundName = 'Huitième de finale';
    }
    
    // Round 1: Matches initiaux avec les vrais compétiteurs
    rounds.push({
      name: firstRoundName,
      matches: initialMatches.map(match => ({
        id: match.id,
        competitor1: match.competitor1,
        competitor2: match.competitor2,
        score1: match.score1 || 0,
        score2: match.score2 || 0,
        winner: match.winner,
        isRunning: match.isRunning,
        isEmpty: false
      }))
    });
    
    // Round 2: Demi-finales (cases vides)
    if (totalMatches > 2) {
      const semiCount = Math.ceil(totalMatches / 2);
      const semiMatches = [];
      for (let i = 0; i < semiCount; i++) {
        semiMatches.push({
          id: `semi-${i}`,
          competitor1: null,
          competitor2: null,
          score1: 0,
          score2: 0,
          winner: null,
          isRunning: false,
          isEmpty: true
        });
      }
      rounds.push({
        name: 'Demi-finale',
        matches: semiMatches
      });
    }
    
    // Round 3: Finale (case vide)
    if (totalMatches > 1) {
      rounds.push({
        name: 'Finale',
        matches: [{
          id: 'final',
          competitor1: null,
          competitor2: null,
          score1: 0,
          score2: 0,
          winner: null,
          isRunning: false,
          isEmpty: true
        }]
      });
    }
    
    return rounds;
  };

  const getMatchStatus = (match) => {
    if (match.isEmpty) return 'empty';
    if (match.winner) return 'finished';
    if (match.isRunning) return 'running';
    if (match.competitor1 && match.competitor2) return 'ready';
    return 'pending';
  };

  if (loading) {
    return <div className="loading">Chargement du bracket...</div>;
  }

  const tournamentTree = createTournamentTree(matches);

  if (matches.length === 0) {
    return (
      <div className="bracket-container">
        <div className="bracket-header">
          <h1>🏆 Bracket - {category?.name}</h1>
          <div className="category-info">
            <span className="elimination-type">
              {category?.elimination_type === 'DIRECT' ? '🗲 Élimination directe' : '🔄 Poule'}
            </span>
          </div>
        </div>
        <div className="no-matches">
          <h3>Aucun match généré</h3>
          <p>Veuillez démarrer le tournoi pour générer les matches</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bracket-container">
      <div className="bracket-header">
        <h1>🏆 Bracket - {category?.name}</h1>
        <div className="category-info">
          <span className="elimination-type">
            {category?.elimination_type === 'DIRECT' ? '🗲 Élimination directe' : '🔄 Poule'}
          </span>
        </div>
      </div>

      <div className="tournament-tree">
        {tournamentTree.map((round, roundIndex) => (
          <div key={round.name} className="tournament-round">
            <h3 className="round-title">{round.name}</h3>
            <div className="matches-column">
              {round.matches.map((match, matchIndex) => (
                <div key={match.id} className="match-container">
                  <div className={`match-card ${getMatchStatus(match)}`}>
                    {match.isEmpty ? (
                      <div className="empty-match">
                        <div className="competitor-slot">
                          <span className="waiting-text">En attente...</span>
                        </div>
                        <div className="vs-divider">VS</div>
                        <div className="competitor-slot">
                          <span className="waiting-text">En attente...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="filled-match">
                        <div className="competitor">
                          <div className="competitor-info">
                            <div className="competitor-name">
                              {match.competitor1 
                                ? `${match.competitor1.firstname} ${match.competitor1.lastname}`
                                : 'En attente...'
                              }
                            </div>
                            {match.competitor1?.club && (
                              <div className="competitor-club">
                                {match.competitor1.club}
                              </div>
                            )}
                          </div>
                          <div className="score">{match.score1}</div>
                        </div>
                        
                        <div className="vs-divider">VS</div>
                        
                        <div className="competitor">
                          <div className="competitor-info">
                            <div className="competitor-name">
                              {match.competitor2 
                                ? `${match.competitor2.firstname} ${match.competitor2.lastname}`
                                : 'En attente...'
                              }
                            </div>
                            {match.competitor2?.club && (
                              <div className="competitor-club">
                                {match.competitor2.club}
                              </div>
                            )}
                          </div>
                          <div className="score">{match.score2}</div>
                        </div>
                        
                        <div className="match-actions">
                          {getMatchStatus(match) === 'ready' && (
                            <button
                              className="start-btn"
                              onClick={() => startMatch(match.id)}
                            >
                              🚀 Démarrer
                            </button>
                          )}
                          {getMatchStatus(match) === 'running' && (
                            <button
                              className="continue-btn"
                              onClick={() => startMatch(match.id)}
                            >
                              📱 Télécommande
                            </button>
                          )}
                          {getMatchStatus(match) === 'finished' && (
                            <div className="winner">
                              🏆 {match.winner?.firstname} {match.winner?.lastname}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Ligne de connexion vers le round suivant */}
                  {roundIndex < tournamentTree.length - 1 && (
                    <div className="connection-line"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bracket;
