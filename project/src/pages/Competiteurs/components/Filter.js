
function FiltreCompetiteur(){
    return (
        
    <div className="row mb-3">
        <div className="col-md-6">
            <label htmlFor="searchCompetitor" className="form-label">🔎 Rechercher par nom :</label>
            <input type="text" id="searchCompetitor" 
            className="form-control" 
            placeholder="Nom du compétiteur" 
            >
        </div>
        <div className="col-md-6">
            <label for="clubSelect" className="form-label">🏢 Filtrer par club :</label>
            <select id="clubSelect" className="form-select" onchange="filterCompetitors()">
                <option value="">Tous les clubs</option>
                <option value="Nancy Kempo">Nancy Kempo</option>
                <option value="Châtenois Martial">Châtenois Martial</option>
                <option value="Metz Warriors">Metz Warriors</option>
                <option value="Épinal Combat">Épinal Combat</option>
            </select>
        </div>
    </div>
        
    )
}
export default FiltreCompetiteur
