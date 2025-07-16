import React from "react";
import { Link } from "react-router-dom";
import style from "./nav.module.css";

const NavBar = () => {
    return (
        <div className={style.sidebar}>
            <div className={style["user-info"]}>
                <img src="/logo.png" alt="Tournament Logo" className={style.logo} />
            </div>

            <ul className={style.menu}>
                <Link to="/"><li>🏠 Tournois</li></Link>
                <Link to="/competiteurs"><li>👥 Compétiteurs</li></Link>
                <Link to="/telecommande"><li>🎚️ Telecommande</li></Link>
                {/* <Link to="/scoreboard"><li>📺 Scoarboard</li></Link> */}
            </ul>

            {/* Support button at bottom */}
            <div className={style.supportSection}>
                <Link to="/support"><li className={style.supportButton}>🎫 Support</li></Link>
            </div>
        </div>
    );
};

export default NavBar;