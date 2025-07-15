import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ScoerBoardDynamic.module.css";

const ScoreboardDynamic = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load match data
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await fetch(`http://localhost:8000/matches/${matchId}`);
        if (response.ok) {
          const data = await response.json();
          setMatch(data);
        } else {
          console.error("❌ Failed to load match");
        }
      } catch (error) {
        console.error("❌ Failed to load match:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
    const interval = setInterval(fetchMatch, 1000); // Polling de base
    return () => clearInterval(interval);
  }, [matchId]);

  // Listen for real-time updates via localStorage and events
  useEffect(() => {
    // Listen for localStorage changes (other tabs)
    const handleStorageChange = (e) => {
      if (e.key === `match_${matchId}` && e.newValue) {
        const data = JSON.parse(e.newValue);
        console.log("📡 Received localStorage update:", data);
        setMatch(prev => ({
          ...prev,
          score1: data.score1,
          score2: data.score2,
          keikuka1: data.keikuka1,
          keikuka2: data.keikuka2,
          time: data.time,
          isRunning: data.isRunning,
          isFinished: data.isFinished
        }));
      }
    };

    // Listen for custom events (same tab)
    const handleCustomEvent = (e) => {
      if (e.detail.matchId === matchId) {
        const data = e.detail.data;
        console.log("📡 Received custom event update:", data);
        setMatch(prev => ({
          ...prev,
          score1: data.score1,
          score2: data.score2,
          keikuka1: data.keikuka1,
          keikuka2: data.keikuka2,
          time: data.time,
          isRunning: data.isRunning,
          isFinished: data.isFinished
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('matchUpdate', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('matchUpdate', handleCustomEvent);
    };
  }, [matchId]);

  // Réinitialiser le match quand le scoreboard est rechargé
  useEffect(() => {
    const resetMatchOnLoad = async () => {
      try {
        await fetch(`http://localhost:8000/matches/${matchId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            time: 180,
            isRunning: false,
            isFinished: false
          }),
        });
      } catch (error) {
        console.error("❌ Failed to reset match:", error);
      }
    };

    resetMatchOnLoad();
  }, [matchId]); // Se déclenche uniquement au chargement initial

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
      {/* Compétiteur 1 - Rouge */}
      <div className={styles.playerRed}>
        <div className={styles.flag}>🇫🇷</div>
        <div className={styles.details}>
          <div className={styles.name}>
            {match.competitor1?.firstname} {match.competitor1?.lastname}
          </div>
          <div className={styles.club}>{match.competitor1?.club}</div>
        </div>
        <div className={styles.score}>{match.score1 || 0}</div>
        <div className={styles.penalty}>{match.keikuka1 || 0}</div>
      </div>

      {/* Compétiteur 2 - Blanc */}
      <div className={styles.playerWhite}>
        <div className={styles.flag}>🇫🇷</div>
        <div className={styles.details}>
          <div className={styles.name}>
            {match.competitor2?.firstname} {match.competitor2?.lastname}
          </div>
          <div className={styles.club}>{match.competitor2?.club}</div>
        </div>
        <div className={styles.score}>{match.score2 || 0}</div>
        <div className={styles.penalty}>{match.keikuka2 || 0}</div>
      </div>

      {/* Footer avec logo et timer */}
      <div className={styles.footer}>
        <div className={styles.logoBlock}>
          <div className={styles.kempoLogo}>
            <span className={styles.kempoText}>NIPPON KEMPO</span>
            <span className={styles.kempoJapanese}>日本拳法</span>
          </div>
        </div>
        <div className={`${styles.timer} ${match.isRunning ? styles.running : ''}`}>
          {formatTime(match.time || 180)}
        </div>
      </div>

      {/* Affichage du gagnant si terminé */}
      {match.isFinished && match.winner && (
        <div className={styles.winner}>
          <h2>🏆 Gagnant</h2>
          <h3>{match.winner.firstname} {match.winner.lastname}</h3>
        </div>
      )}
    </div>
  );
};

export default ScoreboardDynamic;
