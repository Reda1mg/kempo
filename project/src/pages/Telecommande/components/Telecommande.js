import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./Telecommande.module.css";

const Telecommande = () => {
  const { matchId } = useParams();
  const [competitor1, setCompetitor1] = useState({ firstname: "", lastname: "", club: "" });
  const [competitor2, setCompetitor2] = useState({ firstname: "", lastname: "", club: "" });
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [time, setTime] = useState(180); // 3 minutes
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchMatchAndCompetitors = async () => {
      try {
        const matchRes = await axios.get(`http://localhost:3000/tournaments/matches/${matchId}`);
        const { competitor1: comp1Id, competitor2: comp2Id } = matchRes.data;

        const [comp1Res, comp2Res] = await Promise.all([
          axios.get(`http://localhost:3000/competitors/${comp1Id}`),
          axios.get(`http://localhost:3000/competitors/${comp2Id}`)
        ]);

        setCompetitor1(comp1Res.data);
        setCompetitor2(comp2Res.data);
      } catch (err) {
        console.error("❌ Failed to fetch match or competitors:", err);
      }
    };

    fetchMatchAndCompetitors();
  }, [matchId]);

  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStart = () => {
    if (time > 0) setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  const handleReset = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setTime(180);
  };

  const handleEnd = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setTime(0);
  };

  const applyFaute = (setScore) => {
    setScore(prev => Math.max(0, prev - 2));
  };

  return (
    <div className={styles.container}>
      {/* Competitor 1 */}
      <div className={styles.card}>
        <div className={styles.competitor}>
          <strong>{competitor1.firstname} {competitor1.lastname}</strong>
          <span>{competitor1.club}</span>
        </div>
        <div className={styles.controls}>
          <button className={styles.btn} onClick={() => setScore1(s => Math.max(0, s - 1))}>-</button>
          <div className={styles.score}>{score1}</div>
          <button className={styles.btn} onClick={() => setScore1(s => s + 1)}>+</button>
          <button className={styles.faute} onClick={() => applyFaute(setScore1)}>Faute</button>
        </div>
      </div>

      {/* Competitor 2 */}
      <div className={styles.card}>
        <div className={styles.competitor}>
          <strong>{competitor2.firstname} {competitor2.lastname}</strong>
          <span>{competitor2.club}</span>
        </div>
        <div className={styles.controls}>
          <button className={styles.btn} onClick={() => setScore2(s => Math.max(0, s - 1))}>-</button>
          <div className={styles.score}>{score2}</div>
          <button className={styles.btn} onClick={() => setScore2(s => s + 1)}>+</button>
          <button className={styles.faute} onClick={() => applyFaute(setScore2)}>Faute</button>
        </div>
      </div>

      {/* Timer */}
      <div className={`${styles.card} ${styles.timerCard}`}>
        <div className={styles.timer}>{formatTime(time)}</div>
        <div className={styles.timerControls}>
          <button className={`${styles.ctrlBtn} ${styles.select}`}>SELECT</button>
          <button className={`${styles.ctrlBtn} ${styles.start}`} onClick={handleStart}>START</button>
          <button className={`${styles.ctrlBtn} ${styles.pause}`} onClick={handlePause}>PAUSE</button>
          <button className={`${styles.ctrlBtn} ${styles.reset}`} onClick={handleReset}>RESET</button>
          <button className={`${styles.ctrlBtn} ${styles.end}`} onClick={handleEnd}>END</button>
        </div>
      </div>
    </div>
  );
};

export default Telecommande;
