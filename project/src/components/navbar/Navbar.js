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
                <Link to="/"><li>🏠 Accueil</li></Link>
                <li>📅 Tous les Tournois</li>
                <li>📊 Score Board</li>
                <Link to="/competiteurs"><li>👥 Compétiteurs</li></Link>
            </ul>
        </div>
    );
};

export default NavBar;
