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
                <Link to="/support"><li>🎫 Support</li></Link>
                {/* <Link to="/scoreboard"><li>📺 Scoarboard</li></Link> */}

            </ul>
        </div>
    );
};

export default NavBar;
