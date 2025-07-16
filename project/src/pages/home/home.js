

import TournoiTable from "./components/TournamentTable";
import styles from "./home.module.css"

function Home(){
    return(
    <div className="">
      <div className={styles.header}>
        <h1 className={styles.title}>Liste des Tournois</h1>
        <button className={styles.createButton}>+ Créer un Tournoi</button>
      </div>
      
      <TournoiTable />

    </div>
    )
}
export default Home
