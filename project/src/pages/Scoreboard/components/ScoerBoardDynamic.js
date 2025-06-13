import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ScoerBoardDynamic.module.css";

const ScoreboardDynamic = () => {
  const { matchId } = useParams();
  const [competitor1, setCompetitor1] = useState({});
  const [competitor2, setCompetitor2] = useState({});
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [keikuka1, setKeikuka1] = useState(0);
  const [keikuka2, setKeikuka2] = useState(0);
  const [time, setTime] = useState(180);

  // Load competitors once
  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        const match = await axios.get(`http://localhost:3000/tournaments/matches/${matchId}`);
        const { competitor1: id1, competitor2: id2 } = match.data;

        const [res1, res2] = await Promise.all([
          axios.get(`http://localhost:3000/competitors/${id1}`),
          axios.get(`http://localhost:3000/competitors/${id2}`)
        ]);

        setCompetitor1(res1.data);
        setCompetitor2(res2.data);
      } catch (error) {
        console.error("❌ Failed to load competitors:", error);
      }
    };

    fetchCompetitors();
  }, [matchId]);

  // Smooth local countdown
  useEffect(() => {
    const tick = setInterval(() => {
      setTime((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  // Periodic sync with backend
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/matches/${matchId}/live`);
        const { score1, score2, keikuka1, keikuka2, time } = res.data;

        setScore1(score1 ?? 0);
        setScore2(score2 ?? 0);
        setKeikuka1(keikuka1 ?? 0);
        setKeikuka2(keikuka2 ?? 0);
        setTime(time ?? 180);
      } catch (error) {
        console.error("❌ Failed to fetch live data:", error);
      }
    };

    fetchLive(); // Initial sync
    const interval = setInterval(fetchLive, 3000); // Poll every 3 sec
    return () => clearInterval(interval);
  }, [matchId]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className={styles.container}>
      {/* Red side */}
      <div className={styles.player} style={{ backgroundColor: "#c00" }}>
        <div className={styles.details}>
          <div className={styles.name}>{competitor1.firstname} {competitor1.lastname}</div>
          <div className={styles.club}>{competitor1.club}</div>
        </div>
        <div className={styles.score}>{score1}</div>
        <div className={styles.penalty}>{keikuka1}</div>
      </div>

      {/* White side */}
      <div className={styles.player} style={{ backgroundColor: "#ddd" }}>
        <div className={styles.details}>
          <div className={styles.name}>{competitor2.firstname} {competitor2.lastname}</div>
          <div className={styles.club}>{competitor2.club}</div>
        </div>
        <div className={styles.score}>{score2}</div>
        <div className={styles.penalty}>{keikuka2}</div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.logoBlock}>
  <img
    src="/logo_background_scoreboard_version_1.png"
    alt="Kempo Logo"
    className={styles.fullLogo}
  />
</div>


        <div className={styles.timer}>{formatTime(time)}</div>
      </div>
    </div>
  );
};

export default ScoreboardDynamic;
