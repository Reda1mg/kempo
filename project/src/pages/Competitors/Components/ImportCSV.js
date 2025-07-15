import React, { useState } from "react";
import axios from "axios";
import styles from "./ImportCSV.module.css";

const ImportCSV = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      previewFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
      previewFile(droppedFile);
    } else {
      alert("⚠️ Veuillez déposer un fichier CSV valide");
    }
  };

  const previewFile = (csvFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1, 6).map(line => { // Preview first 5 rows
          const values = line.split(',').map(v => v.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
          }, {});
        });
        
        setPreviewData(data);
        setShowPreview(true);
      }
    };
    reader.readAsText(csvFile);
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const competitor = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        // Map CSV headers to API fields
        switch (header) {
          case 'prénom':
          case 'prenom':
          case 'firstname':
            competitor.firstname = value;
            break;
          case 'nom':
          case 'lastname':
            competitor.lastname = value;
            break;
          case 'date_naissance':
          case 'birthday':
          case 'naissance':
            competitor.birthday = value;
            break;
          case 'club':
            competitor.club = value || 'Club Kempo';
            break;
          case 'pays':
          case 'country':
            competitor.country = value || 'France';
            break;
          case 'poids':
          case 'weight':
            competitor.weight = parseFloat(value) || 0;
            break;
          case 'grade':
          case 'rank':
            competitor.rank = value;
            break;
          case 'genre':
          case 'sexe':
          case 'gender':
            competitor.gender = value.toUpperCase() === 'HOMME' || value.toUpperCase() === 'H' ? 'H' : 'F';
            break;
          default:
            break;
        }
      });
      
      return competitor;
    }).filter(competitor => {
      // Validation plus stricte
      const isValid = competitor.firstname && 
                     competitor.lastname && 
                     competitor.birthday && 
                     competitor.weight > 0 && 
                     competitor.rank && 
                     competitor.gender;
      
      if (!isValid) {
        console.warn("Compétiteur invalide ignoré:", competitor);
      }
      
      return isValid;
    });
  };

  const handleImport = async () => {
    if (!file) {
      alert("⚠️ Veuillez sélectionner un fichier CSV");
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const csvText = e.target.result;
        const competitors = parseCSV(csvText);
        
        console.log("Données parsées:", competitors); // Debug
        
        if (competitors.length === 0) {
          alert("⚠️ Aucun compétiteur valide trouvé dans le fichier CSV");
          setIsLoading(false);
          return;
        }

        console.log(`Tentative d'import de ${competitors.length} compétiteurs`); // Debug

        // Import competitors in bulk
        const response = await axios.post("http://localhost:8000/competitors/bulk", competitors);
        const results = response.data;

        // Show results
        let message = `✅ Import terminé!\n${results.success} compétiteurs importés avec succès`;
        if (results.errors > 0) {
          message += `\n❌ ${results.errors} erreurs rencontrées`;
          console.log("Erreurs d'import:", results.errorDetails);
        }
        
        alert(message);
        
        // Close modal first, then refresh
        onClose();
        
        // Delay refresh to ensure modal is closed
        setTimeout(() => {
          onImport(); // Refresh the competitors list
        }, 100);
        
      } catch (error) {
        console.error("❌ Erreur lors de l'import:", error);
        
        // More detailed error handling
        if (error.response) {
          // Server responded with error status
          const errorMsg = `❌ Erreur serveur (${error.response.status}): ${error.response.data || error.message}`;
          alert(errorMsg);
        } else if (error.request) {
          // Request was made but no response received
          alert("❌ Erreur réseau: Impossible de contacter le serveur. Vérifiez que le backend est démarré sur le port 3000.");
        } else {
          // Something else happened
          alert(`❌ Erreur: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csvContent = `prénom,nom,date_naissance,club,pays,poids,grade,genre
Jean,Dupont,2010-05-15,Club Kempo,France,35,Ceinture Jaune,H
Marie,Martin,2009-08-20,Club Kempo,France,32,Ceinture Orange,F
Pierre,Lefebvre,2008-12-10,Club Kempo,France,40,Ceinture Verte,H
Sophie,Bernard,2009-03-25,Club Kempo,France,38,Ceinture Jaune,F`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_competiteurs.csv';
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>📥 Importer des compétiteurs (CSV)</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.instructions}>
            <h3>Instructions d'utilisation :</h3>
            <ul>
              <li>Le fichier doit être au format CSV</li>
              <li>Colonnes acceptées : prénom, nom, date_naissance, club, pays, poids, grade, genre</li>
              <li>Format date : YYYY-MM-DD (ex: 2010-05-15)</li>
              <li>Genre : H pour Homme, F pour Femme</li>
              <li>Club : "Club Kempo" par défaut si non spécifié</li>
            </ul>
            <button className={styles.templateBtn} onClick={downloadTemplate}>
              📄 Télécharger le modèle CSV
            </button>
          </div>

          <div
            className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className={styles.dropContent}>
              <span className={styles.uploadIcon}>📁</span>
              <p>Glissez-déposez votre fichier CSV ici</p>
              <p>ou</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className={styles.fileInput}
                id="csvFile"
              />
              <label htmlFor="csvFile" className={styles.fileLabel}>
                Choisir un fichier
              </label>
            </div>
          </div>

          {file && (
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>📄 {file.name}</span>
              <span className={styles.fileSize}>
                ({(file.size / 1024).toFixed(2)} KB)
              </span>
            </div>
          )}

          {showPreview && previewData.length > 0 && (
            <div className={styles.preview}>
              <h3>Aperçu des données (5 premières lignes) :</h3>
              <div className={styles.previewTable}>
                <table>
                  <thead>
                    <tr>
                      <th>Prénom</th>
                      <th>Nom</th>
                      <th>Naissance</th>
                      <th>Club</th>
                      <th>Grade</th>
                      <th>Genre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.prénom || row.firstname || '-'}</td>
                        <td>{row.nom || row.lastname || '-'}</td>
                        <td>{row.date_naissance || row.birthday || '-'}</td>
                        <td>{row.club || '-'}</td>
                        <td>{row.grade || row.rank || '-'}</td>
                        <td>{row.genre || row.gender || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose}>
              Annuler
            </button>
            <button
              className={styles.importBtn}
              onClick={handleImport}
              disabled={!file || isLoading}
            >
              {isLoading ? "⏳ Import en cours..." : "📥 Importer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportCSV;
