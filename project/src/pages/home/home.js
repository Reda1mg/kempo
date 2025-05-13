
import TournoiTable from "./components/TournamentTable";
import styles from "./home.module.css"

function Home(){
    return(
    <div className="">
      <h1 className = {styles.title}>Liste des Tournois</h1>
      
      <TournoiTable />

    </div>
    )
}
export default Home