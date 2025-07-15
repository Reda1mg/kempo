import styles from './Competiteur.module.css'
import Filter from './components/Filter';
import CompetiteursTable from './components/CompetiteursTable';
function Competiteurs(){
    return (
        <div className="">
        <h1 className={styles.title}>Liste des Compétiteurs</h1>

        <CompetiteursTable />
    </div>
    )
}

export default Competiteurs
