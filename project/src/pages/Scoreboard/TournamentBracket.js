import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './TournamentBracket.module.css';

const TournamentBracket = () => {
    const { tournamentId } = useParams();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/categories/${tournamentId}/matches`);
                setMatches(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [tournamentId]);

    const getMatchStatus = (match) => {
        if (match.winner) return 'finished';
        if (match.competitor1 && match.competitor2) return 'ready';
        return 'waiting';
    };

    const getCompetitorName = (competitor) => {
        if (!competitor) return 'En attente';
        return `${competitor.firstname} ${competitor.lastname}`;
    };

    const getMatchResult = (match) => {
        if (!match.winner) return '';
        if (match.winner.id === match.competitor1?.id) return '1-0';
        if (match.winner.id === match.competitor2?.id) return '0-1';
        return '';
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <h2>Chargement des matches...</h2>
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className={styles.noMatches}>
                <h2>Aucun match trouvé</h2>
                <p>Le tournoi n'a pas encore été démarré ou aucun match n'a été généré.</p>
            </div>
        );
    }

    return (
        <div className={styles.bracketContainer}>
            <h1 className={styles.title}>Bracket du Tournoi</h1>
            
            <div className={styles.bracketGrid}>
                {matches.map((match) => (
                    <div key={match.id} className={`${styles.matchCard} ${styles[getMatchStatus(match)]}`}>
                        <div className={styles.matchHeader}>
                            <span className={styles.matchNumber}>Match #{match.id.slice(-8)}</span>
                            <span className={styles.matchStatus}>{getMatchStatus(match)}</span>
                        </div>
                        
                        <div className={styles.competitors}>
                            <div className={`${styles.competitor} ${match.winner?.id === match.competitor1?.id ? styles.winner : ''}`}>
                                <span className={styles.competitorName}>
                                    {getCompetitorName(match.competitor1)}
                                </span>
                                {match.competitor1?.club && (
                                    <span className={styles.competitorClub}>
                                        {match.competitor1.club}
                                    </span>
                                )}
                            </div>
                            
                            <div className={styles.vs}>VS</div>
                            
                            <div className={`${styles.competitor} ${match.winner?.id === match.competitor2?.id ? styles.winner : ''}`}>
                                <span className={styles.competitorName}>
                                    {getCompetitorName(match.competitor2)}
                                </span>
                                {match.competitor2?.club && (
                                    <span className={styles.competitorClub}>
                                        {match.competitor2.club}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {match.winner && (
                            <div className={styles.matchResult}>
                                Résultat: {getMatchResult(match)}
                            </div>
                        )}
                        
                        <div className={styles.matchDetails}>
                            <span>Tour: {match.tour || 1}</span>
                            <span>Round: {match.round || 1}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TournamentBracket;
