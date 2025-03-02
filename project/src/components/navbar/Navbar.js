import style from './nav.module.css'

const NavBar = () => {
    // ------------js code-------
    return (
        // --------jsx (html) / main div (unique)
        <div className={style.sidebar}>

            {/* User Info */}
            <div className={style["user-info"]}> 
                <p>🧑‍💼 Connecté en tant que :</p>
                <h3>Jean Dupont</h3>
            </div>

            {/* Navigation Menu */}
            <ul className={style["menu"]}>
                <li>🏠 Accueil</li>
                <li>📅 Tous les Tournois</li>
                <li>📊 Score Board</li>
                <li>👥 Compétiteurs</li>
                <li>⚙️ Paramètres</li>
                <li>🔧 Administration</li>
            </ul>

            {/* Logout */}
            <div className={style["logout"]}>
                <p>🚪 Déconnexion</p>
            </div>

        </div>
    )
}

export default NavBar