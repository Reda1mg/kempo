import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './TelecommandeEmbed.module.css';

const Telecommande = ({ match, onBack, isEmbedded = false }) => {
  const [matchData, setMatchData] = useState({
    id: match?.id || null,
    competitor1: match?.competitor1 || null,
    competitor2: match?.competitor2 || null,
    score1: 0,
    score2: 0,
    keikuka1: 0,
    keikuka2: 0,
    timeLeft: 180,
    isRunning: false,
    status: 'en_cours'
  });

  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  // Synchronisation avec localStorage
  useEffect(() => {
    const saveToStorage = () => {
      localStorage.setItem('currentMatchData', JSON.stringify(matchData));
      window.dispatchEvent(new CustomEvent('matchDataUpdated', { detail: matchData }));
    };

    saveToStorage();
  }, [matchData]);

  // Gestion du timer
  useEffect(() => {
    if (matchData.isRunning && matchData.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setMatchData(prev => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - 1)
        }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [matchData.isRunning, matchData.timeLeft]);

  // Fonctions de gestion des scores
  const updateScore = (competitor, action) => {
    setMatchData(prev => ({
      ...prev,
      [`score${competitor}`]: Math.max(0, prev[`score${competitor}`] + action)
    }));
  };

  const updateKeikuka = (competitor, action) => {
    setMatchData(prev => ({
      ...prev,
      [`keikuka${competitor}`]: Math.max(0, prev[`keikuka${competitor}`] + action)
    }));
  };

  // Fonctions du timer
  const startTimer = () => {
    setMatchData(prev => ({ ...prev, isRunning: true }));
  };

  const pauseTimer = () => {
    setMatchData(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    setMatchData(prev => ({ ...prev, timeLeft: 180, isRunning: false }));
  };

  // Réinitialiser le match
  const resetMatch = () => {
    setMatchData(prev => ({
      ...prev,
      score1: 0,
      score2: 0,
      keikuka1: 0,
      keikuka2: 0,
      timeLeft: 180,
      isRunning: false
    }));
  };

  // Terminer le match
  const finishMatch = async () => {
    try {
      // Essayer de sauvegarder en base seulement si on a un ID valide
      if (matchData.id) {
        console.log('Tentative de sauvegarde du match ID:', matchData.id);
        await axios.put(`http://localhost:8000/api/matches/${matchData.id}`, {
          ...matchData,
          status: 'termine'
        });
        console.log('Match sauvegardé avec succès');
      } else {
        console.log('Pas d\'ID de match, terminaison sans sauvegarde');
      }
      
      // Terminer le match localement
      setMatchData(prev => ({ ...prev, status: 'termine', isRunning: false }));
      localStorage.removeItem('currentMatchData');
      
      if (onBack) onBack();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du match:', err);
      
      // Même en cas d'erreur, on peut terminer le match localement
      const userChoice = window.confirm(
        'Erreur lors de la sauvegarde du match. Voulez-vous terminer le match sans sauvegarder ?'
      );
      
      if (userChoice) {
        setMatchData(prev => ({ ...prev, status: 'termine', isRunning: false }));
        localStorage.removeItem('currentMatchData');
        if (onBack) onBack();
      } else {
        setError('Erreur lors de la sauvegarde du match');
      }
    }
  };

  // Terminer le match sans sauvegarde
  const forceFinishMatch = () => {
    setMatchData(prev => ({ ...prev, status: 'termine', isRunning: false }));
    localStorage.removeItem('currentMatchData');
    if (onBack) onBack();
  };

  // Formater le temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Fonction pour formater les noms des compétiteurs
  const formatCompetitorName = (competitor) => {
    if (!competitor) return 'Compétiteur';
    if (competitor.name) return competitor.name;
    if (competitor.firstname && competitor.lastname) {
      return `${competitor.firstname} ${competitor.lastname}`;
    }
    return 'Compétiteur';
  };

  if (error) {
    return (
      <div className={styles.error}>
        {error}
        <button onClick={() => setError(null)}>Fermer</button>
      </div>
    );
  }

  return (
    <div className={styles.telecommande}>
      <div className={styles.header}>
        <h1>Télécommande Match</h1>
        <div className={styles.matchInfo}>
          {formatCompetitorName(matchData.competitor1)} vs {formatCompetitorName(matchData.competitor2)}
        </div>
        {isEmbedded && (
          <button className={styles.backButton} onClick={onBack}>
            Retour au Bracket
          </button>
        )}
      </div>

      <div className={styles.scoreBoard}>
        {/* Compétiteur 1 */}
        <div className={styles.competitor}>
          <h3>{formatCompetitorName(matchData.competitor1)}</h3>
          <div className={styles.club}>{matchData.competitor1?.club || 'Club'}</div>
          <div className={styles.score}>{matchData.score1}</div>
          <div className={styles.keikuka}>Keikuka: {matchData.keikuka1}</div>
          <div className={styles.controls}>
            <button className={styles.addBtn} onClick={() => updateScore(1, 1)}>
              +1 Point
            </button>
            <button className={styles.removeBtn} onClick={() => updateScore(1, -1)}>
              -1 Point
            </button>
            <button className={styles.faultBtn} onClick={() => updateKeikuka(1, 1)}>
              +1 Keikuka
            </button>
            <button className={styles.removeFaultBtn} onClick={() => updateKeikuka(1, -1)}>
              -1 Keikuka
            </button>
          </div>
        </div>

        {/* Timer */}
        <div className={styles.timer}>
          <div className={styles.timeDisplay}>{formatTime(matchData.timeLeft)}</div>
          <div className={styles.timerControls}>
            <button className={styles.startBtn} onClick={startTimer}>
              Démarrer
            </button>
            <button className={styles.pauseBtn} onClick={pauseTimer}>
              Pause
            </button>
            <button className={styles.resetBtn} onClick={resetTimer}>
              Reset
            </button>
          </div>
        </div>

        {/* Compétiteur 2 */}
        <div className={styles.competitor}>
          <h3>{formatCompetitorName(matchData.competitor2)}</h3>
          <div className={styles.club}>{matchData.competitor2?.club || 'Club'}</div>
          <div className={styles.score}>{matchData.score2}</div>
          <div className={styles.keikuka}>Keikuka: {matchData.keikuka2}</div>
          <div className={styles.controls}>
            <button className={styles.addBtn} onClick={() => updateScore(2, 1)}>
              +1 Point
            </button>
            <button className={styles.removeBtn} onClick={() => updateScore(2, -1)}>
              -1 Point
            </button>
            <button className={styles.faultBtn} onClick={() => updateKeikuka(2, 1)}>
              +1 Keikuka
            </button>
            <button className={styles.removeFaultBtn} onClick={() => updateKeikuka(2, -1)}>
              -1 Keikuka
            </button>
          </div>
        </div>
      </div>

      <div className={styles.globalControls}>
        <button className={styles.resetMatchBtn} onClick={resetMatch}>
          Réinitialiser Match
        </button>
        <button className={styles.finishBtn} onClick={finishMatch}>
          Terminer Match
        </button>
        <button className={styles.resetMatchBtn} onClick={forceFinishMatch}>
          Terminer sans Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default Telecommande;
