import React from 'react';
import styles from './Bracket.module.css';

const BracketTest = () => {
  // Données de test pour simuler un bracket
  const testBracket = [
    {
      round: 1,
      matches: [
        {
          id: '1',
          competitor1: { firstname: 'Bastien', lastname: 'Fernandez', club: 'Dojo Avignon' },
          competitor2: { firstname: 'Dylan', lastname: 'Muller', club: 'Dojo Clermont' },
          score1: 0,
          score2: 0
        },
        {
          id: '2',
          competitor1: { firstname: 'Quentin', lastname: 'Dupont', club: 'Dojo Caen' },
          competitor2: { firstname: 'Florian', lastname: 'Renard', club: 'Dojo Chambéry' },
          score1: 0,
          score2: 0
        },
        {
          id: '3',
          competitor1: { firstname: 'Valentin', lastname: 'Gautier', club: 'Dojo Poitiers' },
          competitor2: { firstname: 'Romain', lastname: 'Bonnet', club: 'Dojo Metz' },
          score1: 0,
          score2: 0
        },
        {
          id: '4',
          competitor1: { firstname: 'Enzo', lastname: 'Andre', club: 'Dojo Amiens' },
          competitor2: { firstname: 'Kevin', lastname: 'Rousseau', club: 'Dojo Orléans' },
          score1: 0,
          score2: 0
        }
      ]
    },
    {
      round: 2,
      matches: [
        {
          id: '5',
          competitor1: { firstname: 'Gagnant 1', lastname: '', club: '' },
          competitor2: { firstname: 'Gagnant 2', lastname: '', club: '' },
          score1: 0,
          score2: 0
        },
        {
          id: '6',
          competitor1: { firstname: 'Gagnant 3', lastname: '', club: '' },
          competitor2: { firstname: 'Gagnant 4', lastname: '', club: '' },
          score1: 0,
          score2: 0
        }
      ]
    },
    {
      round: 3,
      matches: [
        {
          id: '7',
          competitor1: { firstname: 'Finaliste 1', lastname: '', club: '' },
          competitor2: { firstname: 'Finaliste 2', lastname: '', club: '' },
          score1: 0,
          score2: 0
        }
      ]
    }
  ];

  const getRoundName = (round, totalRounds) => {
    if (round === totalRounds) return 'Finale';
    if (round === totalRounds - 1) return 'Demi-finale';
    if (round === totalRounds - 2) return 'Quart de finale';
    return `Tour ${round}`;
  };

  const getMatchStatus = (match) => {
    if (match.winner) return 'finished';
    if (match.isRunning) return 'running';
    if (match.competitor1 && match.competitor2) return 'ready';
    return 'pending';
  };

  const totalRounds = testBracket.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🏆 Bracket Test - AutoCat</h1>
        <div className={styles.categoryInfo}>
          <span className={styles.eliminationType}>
            🗲 Élimination directe
          </span>
        </div>
      </div>

      <div className={styles.bracketContainer}>
        <div className={styles.bracket} style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          gap: '60px',
          alignItems: 'flex-start',
          overflowX: 'auto',
          width: '100%'
        }}>
          {testBracket.map((roundData, roundIndex) => (
            <div key={roundData.round} className={styles.round} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '300px',
              flexShrink: 0
            }}>
              <div className={styles.roundHeader}>
                <h3>{getRoundName(roundData.round, totalRounds)}</h3>
              </div>
              <div className={styles.roundColumn}>
                {roundData.matches.map((match, matchIndex) => (
                  <div key={match.id} className={styles.matchWrapper}>
                    <div className={`${styles.matchCard} ${styles[getMatchStatus(match)]}`}>
                      <div className={styles.matchTitle}>
                        Match #{match.id}
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
                        <button className={styles.startButton}>
                          🚀 Démarrer le match
                        </button>
                      </div>
                    </div>
                    
                    {/* Lignes de connexion vers le round suivant */}
                    {roundIndex < testBracket.length - 1 && (
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
      </div>
    </div>
  );
};

export default BracketTest;
