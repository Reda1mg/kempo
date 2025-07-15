import { useEffect, useRef, useCallback } from 'react';
import matchWebSocketService from '../services/MatchWebSocketService';

export const useMatchSync = (matchId) => {
  const connectionRef = useRef(null);
  const cleanupRef = useRef(null);

  // Initialiser la connexion
  useEffect(() => {
    if (!matchId) return;

    connectionRef.current = matchWebSocketService.connect(matchId);

    return () => {
      if (connectionRef.current) {
        connectionRef.current.close();
      }
    };
  }, [matchId]);

  // Envoyer une mise à jour
  const sendUpdate = useCallback((data) => {
    if (connectionRef.current) {
      connectionRef.current.send(data);
    }
  }, []);

  // Écouter les mises à jour
  const onUpdate = useCallback((callback) => {
    if (!matchId) return;

    cleanupRef.current = matchWebSocketService.onMatchUpdate(matchId, callback);

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [matchId]);

  // Obtenir les données actuelles
  const getCurrentData = useCallback(() => {
    if (!matchId) return null;
    return matchWebSocketService.getMatchData(matchId);
  }, [matchId]);

  // Nettoyer les données
  const clearData = useCallback(() => {
    if (!matchId) return;
    matchWebSocketService.clearMatchData(matchId);
  }, [matchId]);

  return {
    sendUpdate,
    onUpdate,
    getCurrentData,
    clearData
  };
};

export default useMatchSync;
