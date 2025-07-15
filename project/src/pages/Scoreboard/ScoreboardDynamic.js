import React, { useState, useEffect } from 'react';
import styles from './Scoreboard.module.css';

const ScoreboardDynamic = () => {
  const [matchData, setMatchData] = useState({
    competitor1: { name: 'Compétiteur 1', club: 'Club A' },
    competitor2: { name: 'Compétiteur 2', club: 'Club B' },
    score1: 0,
    score2: 0,
    keikuka1: 0,
    keikuka2: 0,
    timeLeft: 180,
    isRunning: false
  });

  // Charger les données initiales du localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('currentMatchData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setMatchData(parsed);
      } catch (error) {
        console.error('Erreur lors du parsing des données du match:', error);
      }
    }
  }, []);

  // Écouter les changements dans localStorage
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'currentMatchData' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          setMatchData(parsed);
        } catch (error) {
          console.error('Erreur lors du parsing des données du match:', error);
        }
      }
    };

    const handleCustomEvent = (event) => {
      setMatchData(event.detail);
    };

    // Écouter les événements de storage et les événements personnalisés
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('matchDataUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('matchDataUpdated', handleCustomEvent);
    };
  }, []);

  // Formater le temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Formater le nom du compétiteur
  const formatCompetitorName = (competitor) => {
    if (!competitor) return 'Compétiteur';
    if (competitor.name) return competitor.name;
    if (competitor.firstname && competitor.lastname) {
      return `${competitor.firstname} ${competitor.lastname}`;
    }
    return 'Compétiteur';
  };

  return (
    <div className={styles.container}>
      <div className={styles.player} style={{ backgroundColor: "#c00" }}>
        <div className={styles.details}>
          <div className={styles.name}>{formatCompetitorName(matchData.competitor1)}</div>
          <div className={styles.club}>{matchData.competitor1?.club || 'Club'}</div>
        </div>
        <div className={styles.score}>{matchData.score1}</div>
        <div className={styles.penalty}>{matchData.keikuka1}</div>
      </div>

      <div className={styles.player} style={{ backgroundColor: "#ddd" }}>
        <div className={styles.details}>
          <div className={styles.name}>{formatCompetitorName(matchData.competitor2)}</div>
          <div className={styles.club}>{matchData.competitor2?.club || 'Club'}</div>
        </div>
        <div className={styles.score}>{matchData.score2}</div>
        <div className={styles.penalty}>{matchData.keikuka2}</div>
      </div>

      <div className={styles.footer}>
        <div className={styles.logoBlock}>
          <div className={styles.kempoLogo} />
          <div className={styles.kempoText}>NIPPON KEMPO<br />日本拳法</div>
        </div>
        <div className={styles.timer}>{formatTime(matchData.timeLeft)}</div>
      </div>
    </div>
  );
};

export default ScoreboardDynamic;
