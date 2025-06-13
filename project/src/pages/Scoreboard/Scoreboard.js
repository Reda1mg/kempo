import React from "react";
import styles from "./Scoreboard.module.css";

const Scoreboard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.player} style={{ backgroundColor: "#c00" }}>
        <div className={styles.details}>
          <div className={styles.name}>Julien WECKERLE</div>
          <div className={styles.club}>Chatenois</div>
        </div>
        <div className={styles.score}>1</div>
        <div className={styles.penalty}>0</div>
      </div>

      <div className={styles.player} style={{ backgroundColor: "#ddd" }}>
        <div className={styles.details}>
          <div className={styles.name}>Mesut AYSEL</div>
          <div className={styles.club}>Nancy</div>
        </div>
        <div className={styles.score}>2</div>
        <div className={styles.penalty}>0</div>
      </div>

      <div className={styles.footer}>
        <div className={styles.logoBlock}>
          <div className={styles.kempoLogo} />
          <div className={styles.kempoText}>NIPPON KEMPO<br />日本拳法</div>
        </div>
        <div className={styles.timer}>03:00</div>
      </div>
    </div>
  );
};

export default Scoreboard;
