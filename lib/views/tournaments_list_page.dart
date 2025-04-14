import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/tournament.dart';
import '../services/storage_service.dart';
import '../utils/app_theme.dart';
import '../widgets/app_header.dart';
import 'tournament_detail_page.dart';

class TournamentsListPage extends StatelessWidget {
  const TournamentsListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          const AppHeader(
            title: 'Tournois enregistrés',
            showBackButton: true,
          ),
          Expanded(
            child: Consumer<StorageService>(
              builder: (context, storageService, child) {
                final tournaments = storageService.tournaments;
                
                if (tournaments.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.sports_mma,
                          size: 64,
                          color: Color(0xFFE0E0E0),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Aucun tournoi enregistré',
                          style: TextStyle(
                            fontSize: 18,
                            fontFamily: AppTheme.fontFamily,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Importez des données de tournoi pour commencer',
                          style: TextStyle(
                            fontSize: 14, 
                            fontFamily: AppTheme.fontFamily,
                            color: AppTheme.subtitleColor,
                          ),
                        ),
                        const SizedBox(height: 24),
                        ElevatedButton(
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryColor,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text(
                            'Retour à l\'accueil',
                            style: TextStyle(
                              fontFamily: AppTheme.fontFamily,
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                }
                
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: tournaments.length,
                  itemBuilder: (context, index) {
                    final tournament = tournaments[index];
                    return _buildTournamentCard(context, tournament);
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTournamentCard(BuildContext context, Tournament tournament) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => TournamentDetailPage(tournament: tournament),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                tournament.name,
                style: const TextStyle(
                  fontSize: 18, 
                  fontWeight: FontWeight.bold,
                  fontFamily: AppTheme.fontFamily,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.event, size: 16, color: AppTheme.subtitleColor),
                  const SizedBox(width: 4),
                  Text(
                    '${tournament.date.day}/${tournament.date.month}/${tournament.date.year}',
                    style: const TextStyle(
                      color: AppTheme.subtitleColor,
                      fontFamily: AppTheme.fontFamily,
                    ),
                  ),
                  const SizedBox(width: 16),
                  const Icon(Icons.location_on, size: 16, color: AppTheme.subtitleColor),
                  const SizedBox(width: 4),
                  Text(
                    tournament.location,
                    style: const TextStyle(
                      color: AppTheme.subtitleColor,
                      fontFamily: AppTheme.fontFamily,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.people, size: 16, color: AppTheme.subtitleColor),
                  const SizedBox(width: 4),
                  Text(
                    '${tournament.competitors.length} participants',
                    style: const TextStyle(
                      color: AppTheme.subtitleColor,
                      fontFamily: AppTheme.fontFamily,
                    ),
                  ),
                  const SizedBox(width: 16),
                  const Icon(Icons.sports_mma, size: 16, color: AppTheme.subtitleColor),
                  const SizedBox(width: 4),
                  Text(
                    '${tournament.matches.length} matchs',
                    style: const TextStyle(
                      color: AppTheme.subtitleColor,
                      fontFamily: AppTheme.fontFamily,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
