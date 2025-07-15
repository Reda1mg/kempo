import React from 'react';
// import BracketTree from './BracketTree';

// Mock data pour tester le composant
const mockMatches = [
  {
    id: '2d7c',
    competitor1: {
      firstname: 'Bastien',
      lastname: 'Fernandez',
      club: 'Dojo Avignon'
    },
    competitor2: {
      firstname: 'Dylan',
      lastname: 'Muller',
      club: 'Dojo Clermont'
    },
    score1: 0,
    score2: 0,
    winner: null,
    isRunning: false
  },
  {
    id: '4a4a',
    competitor1: {
      firstname: 'Quentin',
      lastname: 'Dupont',
      club: 'Dojo Caen'
    },
    competitor2: {
      firstname: 'Florian',
      lastname: 'Renard',
      club: 'Dojo Chambéry'
    },
    score1: 0,
    score2: 0,
    winner: null,
    isRunning: false
  },
  {
    id: 'e515',
    competitor1: {
      firstname: 'Valentin',
      lastname: 'Gautier',
      club: 'Dojo Poitiers'
    },
    competitor2: {
      firstname: 'Romain',
      lastname: 'Bonnet',
      club: 'Dojo Metz'
    },
    score1: 0,
    score2: 0,
    winner: null,
    isRunning: false
  },
  {
    id: 'a30c',
    competitor1: {
      firstname: 'Enzo',
      lastname: 'André',
      club: 'Dojo Amiens'
    },
    competitor2: {
      firstname: 'Kevin',
      lastname: 'Rousseau',
      club: 'Dojo Orléans'
    },
    score1: 0,
    score2: 0,
    winner: null,
    isRunning: false
  }
];

const mockCategory = {
  name: 'AutoCat',
  elimination_type: 'DIRECT'
};

// Mock du composant BracketTree avec des données statiques
const BracketTreeTest = () => {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🏆 Bracket - {mockCategory.name}</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <span style={{
            background: 'linear-gradient(135deg, #3498db, #2980b9)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '25px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
          }}>
            {mockCategory.elimination_type === 'DIRECT' ? '🗲 Élimination directe' : '🔄 Poule'}
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '80px',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '40px 20px',
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        margin: '20px'
      }}>
        
        {/* Quart de finale */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '300px' }}>
          <h3 style={{
            color: '#2c3e50',
            fontSize: '1.4em',
            fontWeight: 'bold',
            marginBottom: '30px',
            padding: '12px 25px',
            background: 'linear-gradient(135deg, #ecf0f1, #d5dbdb)',
            borderRadius: '30px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            Quart de finale
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', alignItems: 'center' }}>
            {mockMatches.map((match, index) => (
              <div key={match.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ffffff, #ebf3fd)',
                  borderRadius: '15px',
                  padding: '25px',
                  width: '280px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  border: '3px solid #3498db',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                    borderRadius: '10px',
                    marginBottom: '10px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        fontSize: '1.1em',
                        marginBottom: '5px'
                      }}>
                        {match.competitor1.firstname} {match.competitor1.lastname}
                      </div>
                      <div style={{
                        fontSize: '0.9em',
                        color: '#7f8c8d',
                        fontStyle: 'italic'
                      }}>
                        {match.competitor1.club}
                      </div>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #34495e, #2c3e50)',
                      color: 'white',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '1.3em',
                      minWidth: '40px',
                      textAlign: 'center'
                    }}>
                      {match.score1}
                    </div>
                  </div>
                  
                  <div style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#7f8c8d',
                    fontSize: '1.1em',
                    margin: '10px 0'
                  }}>
                    VS
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                    borderRadius: '10px',
                    marginBottom: '10px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        fontSize: '1.1em',
                        marginBottom: '5px'
                      }}>
                        {match.competitor2.firstname} {match.competitor2.lastname}
                      </div>
                      <div style={{
                        fontSize: '0.9em',
                        color: '#7f8c8d',
                        fontStyle: 'italic'
                      }}>
                        {match.competitor2.club}
                      </div>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #34495e, #2c3e50)',
                      color: 'white',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '1.3em',
                      minWidth: '40px',
                      textAlign: 'center'
                    }}>
                      {match.score2}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <button style={{
                      background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 25px',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '1em',
                      boxShadow: '0 5px 15px rgba(39, 174, 96, 0.3)'
                    }}>
                      🚀 Démarrer
                    </button>
                  </div>
                </div>
                
                {/* Ligne de connexion */}
                <div style={{
                  position: 'absolute',
                  right: '-40px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '80px',
                  height: '3px',
                  background: 'linear-gradient(to right, #3498db, #2980b9)',
                  borderRadius: '2px'
                }}></div>
                <div style={{
                  position: 'absolute',
                  right: '-48px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '12px solid #2980b9',
                  borderTop: '6px solid transparent',
                  borderBottom: '6px solid transparent'
                }}></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Demi-finale */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '300px' }}>
          <h3 style={{
            color: '#2c3e50',
            fontSize: '1.4em',
            fontWeight: 'bold',
            marginBottom: '30px',
            padding: '12px 25px',
            background: 'linear-gradient(135deg, #ecf0f1, #d5dbdb)',
            borderRadius: '30px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            Demi-finale
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '100px', alignItems: 'center' }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                  borderRadius: '15px',
                  padding: '25px',
                  width: '280px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  border: '3px dashed #bdc3c7'
                }}>
                  <div style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, #ecf0f1, #d5dbdb)',
                    borderRadius: '10px',
                    marginBottom: '10px',
                    border: '2px dashed #95a5a6',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      color: '#7f8c8d',
                      fontStyle: 'italic',
                      fontSize: '1.1em'
                    }}>
                      En attente...
                    </span>
                  </div>
                  
                  <div style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#7f8c8d',
                    fontSize: '1.1em',
                    margin: '10px 0'
                  }}>
                    VS
                  </div>
                  
                  <div style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, #ecf0f1, #d5dbdb)',
                    borderRadius: '10px',
                    marginBottom: '10px',
                    border: '2px dashed #95a5a6',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      color: '#7f8c8d',
                      fontStyle: 'italic',
                      fontSize: '1.1em'
                    }}>
                      En attente...
                    </span>
                  </div>
                </div>
                
                {/* Ligne de connexion */}
                <div style={{
                  position: 'absolute',
                  right: '-40px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '80px',
                  height: '3px',
                  background: 'linear-gradient(to right, #3498db, #2980b9)',
                  borderRadius: '2px'
                }}></div>
                <div style={{
                  position: 'absolute',
                  right: '-48px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '12px solid #2980b9',
                  borderTop: '6px solid transparent',
                  borderBottom: '6px solid transparent'
                }}></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Finale */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '300px' }}>
          <h3 style={{
            color: '#2c3e50',
            fontSize: '1.4em',
            fontWeight: 'bold',
            marginBottom: '30px',
            padding: '12px 25px',
            background: 'linear-gradient(135deg, #ecf0f1, #d5dbdb)',
            borderRadius: '30px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            Finale
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', alignItems: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              borderRadius: '15px',
              padding: '25px',
              width: '280px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              border: '3px dashed #bdc3c7'
            }}>
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #ecf0f1, #d5dbdb)',
                borderRadius: '10px',
                marginBottom: '10px',
                border: '2px dashed #95a5a6',
                textAlign: 'center'
              }}>
                <span style={{
                  color: '#7f8c8d',
                  fontStyle: 'italic',
                  fontSize: '1.1em'
                }}>
                  En attente...
                </span>
              </div>
              
              <div style={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#7f8c8d',
                fontSize: '1.1em',
                margin: '10px 0'
              }}>
                VS
              </div>
              
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #ecf0f1, #d5dbdb)',
                borderRadius: '10px',
                marginBottom: '10px',
                border: '2px dashed #95a5a6',
                textAlign: 'center'
              }}>
                <span style={{
                  color: '#7f8c8d',
                  fontStyle: 'italic',
                  fontSize: '1.1em'
                }}>
                  En attente...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BracketTreeTest;
