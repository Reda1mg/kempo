import Filters from "./components/Filters";
import TournoiTable from "./components/TournoiTable";
import styles from "./home.module.css"
import { createBrowserRouter,RouterProvider } from "react-router-dom";
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