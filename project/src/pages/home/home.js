import Filters from "./components/Filters";
import TournoiTable from "./components/TournoiTable";
import styles from "./home.module.css"
function Home(){
    return(
    <div className="">
      <h1 className = {styles.title}>Liste des Tournois</h1>
      <Filters />
      <TournoiTable />

    </div>
    )
}
export default Home