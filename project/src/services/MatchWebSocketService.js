// Service WebSocket pour la synchronisation en temps réel
class MatchWebSocketService {
  constructor() {
    this.connections = new Map();
    this.listeners = new Map();
  }

  // Simuler WebSocket avec localStorage et événements
  connect(matchId) {
    if (this.connections.has(matchId)) {
      return this.connections.get(matchId);
    }

    const connection = {
      matchId,
      isConnected: true,
      send: (data) => {
        // Utiliser localStorage pour la synchronisation entre onglets
        localStorage.setItem(`match_${matchId}`, JSON.stringify({
          ...data,
          timestamp: Date.now()
        }));
        
        // Déclencher un événement personnalisé
        window.dispatchEvent(new CustomEvent('matchUpdate', {
          detail: { matchId, data }
        }));
      },
      close: () => {
        this.connections.delete(matchId);
      }
    };

    this.connections.set(matchId, connection);
    return connection;
  }

  // Écouter les mises à jour
  onMatchUpdate(matchId, callback) {
    if (!this.listeners.has(matchId)) {
      this.listeners.set(matchId, []);
    }
    
    this.listeners.get(matchId).push(callback);

    // Écouter les événements de storage (pour les autres onglets)
    const storageListener = (e) => {
      if (e.key === `match_${matchId}` && e.newValue) {
        const data = JSON.parse(e.newValue);
        callback(data);
      }
    };

    // Écouter les événements personnalisés (pour le même onglet)
    const customListener = (e) => {
      if (e.detail.matchId === matchId) {
        callback(e.detail.data);
      }
    };

    window.addEventListener('storage', storageListener);
    window.addEventListener('matchUpdate', customListener);

    // Retourner une fonction de nettoyage
    return () => {
      window.removeEventListener('storage', storageListener);
      window.removeEventListener('matchUpdate', customListener);
      
      const listeners = this.listeners.get(matchId);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  // Obtenir les données actuelles du match
  getMatchData(matchId) {
    const data = localStorage.getItem(`match_${matchId}`);
    return data ? JSON.parse(data) : null;
  }

  // Nettoyer les données du match
  clearMatchData(matchId) {
    localStorage.removeItem(`match_${matchId}`);
  }
}

// Instance singleton
const matchWebSocketService = new MatchWebSocketService();

export default matchWebSocketService;
