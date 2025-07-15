import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Match.module.css';

const Match = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await fetch(`http://localhost:8000/matches/${matchId}`);
        if (response.ok) {
          const data = await response.json();
          setMatch(data);
          
          // Auto-open telecommande and scoreboard
          setTimeout(() => {
            // Open telecommande in current window
            window.location.href = `/telecommande/${matchId}`;
            
            // Open scoreboard in new window
            window.open(`/scoreboard/${matchId}`, 'scoreboard', 'width=1200,height=800');
          }, 500);
        }
      } catch (error) {
        console.error('❌ Failed to fetch match:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Chargement du match...</div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Match non trouvé</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.matchInfo}>
        <h1>🥋 Match en cours</h1>
        <div className={styles.competitors}>
          <div className={styles.competitor}>
            <h3>{match.competitor1?.firstname} {match.competitor1?.lastname}</h3>
            <p>{match.competitor1?.club}</p>
          </div>
          <div className={styles.vs}>VS</div>
          <div className={styles.competitor}>
            <h3>{match.competitor2?.firstname} {match.competitor2?.lastname}</h3>
            <p>{match.competitor2?.club}</p>
          </div>
        </div>
        <div className={styles.info}>
          <p>🔄 Redirection automatique vers la télécommande...</p>
          <p>📺 Le scoreboard s'ouvre dans une nouvelle fenêtre</p>
        </div>
      </div>
    </div>
  );
};

export default Match;
