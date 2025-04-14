import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

import '../models/tournament.dart';
import '../utils/app_theme.dart';
import '../widgets/app_header.dart';

class TournamentDetailPage extends StatelessWidget {
  final Tournament tournament;

  const TournamentDetailPage({super.key, required this.tournament});

  @override
  Widget build(BuildContext context) {
    // Calculer les statistiques de base
    final totalMatches = tournament.matches.length;
    final Map<String, int> victoryCount = {};
    final Map<String, int> clubVictoryCount = {};
    
    // Initialiser les compteurs pour chaque compétiteur/club
    for (var competitor in tournament.competitors) {
      victoryCount[competitor.id] = 0;
      clubVictoryCount[competitor.club] = 0;
    }
    
    // Compter les victoires
    for (var match in tournament.matches) {
      victoryCount[match.winnerId] = (victoryCount[match.winnerId] ?? 0) + 1;
      
      // Trouver le club du vainqueur
      final winner = tournament.competitors.firstWhere(
        (competitor) => competitor.id == match.winnerId,
        orElse: () => tournament.competitors.first, // Fallback si non trouvé
      );
      
      clubVictoryCount[winner.club] = (clubVictoryCount[winner.club] ?? 0) + 1;
    }
    
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          AppHeader(
            title: tournament.name,
            showBackButton: true,
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTournamentInfo(),
                  const SizedBox(height: 24),
                  _buildStatsSection('Statistiques du tournoi'),
                  const SizedBox(height: 16),
                  _buildClubPerformanceChart(clubVictoryCount),
                  const SizedBox(height: 24),
                  _buildCompetitorsList(),
                  const SizedBox(height: 24),
                  _buildMatchesList(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTournamentInfo() {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Informations générales',
              style: TextStyle(
                fontSize: 18, 
                fontWeight: FontWeight.bold,
                fontFamily: AppTheme.fontFamily,
              ),
            ),
            const SizedBox(height: 12),
            _buildInfoRow(Icons.event, 'Date', '${tournament.date.day}/${tournament.date.month}/${tournament.date.year}'),
            const SizedBox(height: 8),
            _buildInfoRow(Icons.location_on, 'Lieu', tournament.location),
            const SizedBox(height: 8),
            _buildInfoRow(Icons.people, 'Participants', '${tournament.competitors.length}'),
            const SizedBox(height: 8),
            _buildInfoRow(Icons.sports_mma, 'Matchs', '${tournament.matches.length}'),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.blue),
        const SizedBox(width: 8),
        Text(
          label, 
          style: const TextStyle(
            fontWeight: FontWeight.w500,
            fontFamily: AppTheme.fontFamily,
          ),
        ),
        const Spacer(),
        Text(
          value,
          style: const TextStyle(
            fontFamily: AppTheme.fontFamily,
          ),
        ),
      ],
    );
  }

  Widget _buildStatsSection(String title) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 18, 
            fontWeight: FontWeight.bold,
            fontFamily: AppTheme.fontFamily,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Performances par club et compétiteur',
          style: TextStyle(
            fontSize: 14, 
            color: AppTheme.subtitleColor,
            fontFamily: AppTheme.fontFamily,
          ),
        ),
      ],
    );
  }

  Widget _buildClubPerformanceChart(Map<String, int> clubVictoryCount) {
    final data = clubVictoryCount.entries.toList();
    
    // Si pas de données, afficher un message
    if (data.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Text(
            'Pas de données disponibles pour ce tournoi',
            style: TextStyle(
              fontFamily: AppTheme.fontFamily,
              color: AppTheme.subtitleColor,
            ),
          ),
        ),
      );
    }
    
    // Trier par nombre de victoires
    data.sort((a, b) => b.value.compareTo(a.value));
    
    return Container(
      height: 300,
      padding: const EdgeInsets.all(16),
      child: BarChart(
        BarChartData(
          alignment: BarChartAlignment.spaceAround,
          maxY: data.first.value * 1.2, // Ajouter un peu d'espace au-dessus
          titlesData: FlTitlesData(
            leftTitles: AxisTitles(
              sideTitles: SideTitles(showTitles: true, reservedSize: 30),
            ),
            bottomTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                getTitlesWidget: (value, meta) {
                  if (value.toInt() >= 0 && value.toInt() < data.length) {
                    return Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Text(
                        data[value.toInt()].key,
                        style: const TextStyle(
                          fontSize: 10,
                          fontFamily: AppTheme.fontFamily,
                        ),
                      ),
                    );
                  }
                  return const SizedBox();
                },
                reservedSize: 40,
              ),
            ),
            rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          ),
          gridData: const FlGridData(show: false),
          borderData: FlBorderData(show: false),
          barGroups: data.asMap().entries.map((entry) {
            final index = entry.key;
            final item = entry.value;
            return BarChartGroupData(
              x: index,
              barRods: [
                BarChartRodData(
                  toY: item.value.toDouble(),
                  color: Colors.blue,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(4),
                    topRight: Radius.circular(4),
                  ),
                ),
              ],
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildCompetitorsList() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Compétiteurs',
          style: TextStyle(
            fontSize: 18, 
            fontWeight: FontWeight.bold,
            fontFamily: AppTheme.fontFamily,
          ),
        ),
        const SizedBox(height: 12),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: tournament.competitors.length,
          itemBuilder: (context, index) {
            final competitor = tournament.competitors[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                title: Text(competitor.name),
                subtitle: Text('Club: ${competitor.club} | Catégorie: ${competitor.category}'),
                leading: CircleAvatar(
                  child: Text(competitor.name.substring(0, 1)),
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildMatchesList() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Matchs',
          style: TextStyle(
            fontSize: 18, 
            fontWeight: FontWeight.bold,
            fontFamily: AppTheme.fontFamily,
          ),
        ),
        const SizedBox(height: 12),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: tournament.matches.length,
          itemBuilder: (context, index) {
            final match = tournament.matches[index];
            
            // Trouver les compétiteurs
            final competitor1 = tournament.competitors.firstWhere(
              (c) => c.id == match.competitorId1,
              orElse: () => Competitor(id: '', name: 'Inconnu', club: '', category: ''),
            );
            
            final competitor2 = tournament.competitors.firstWhere(
              (c) => c.id == match.competitorId2,
              orElse: () => Competitor(id: '', name: 'Inconnu', club: '', category: ''),
            );
            
            final isWinner1 = match.winnerId == competitor1.id;
            final isWinner2 = match.winnerId == competitor2.id;
            
            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Match ${index + 1} - ${match.round}',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: _buildCompetitorMatchInfo(
                            competitor1.name,
                            competitor1.club,
                            match.scoreCompetitor1.toString(),
                            isWinner1,
                          ),
                        ),
                        const Text('VS', style: TextStyle(fontWeight: FontWeight.bold)),
                        Expanded(
                          child: _buildCompetitorMatchInfo(
                            competitor2.name,
                            competitor2.club,
                            match.scoreCompetitor2.toString(),
                            isWinner2,
                            alignment: CrossAxisAlignment.end,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildCompetitorMatchInfo(
    String name,
    String club,
    String score,
    bool isWinner, {
    CrossAxisAlignment alignment = CrossAxisAlignment.start,
  }) {
    return Column(
      crossAxisAlignment: alignment,
      children: [
        Text(
          name,
          style: TextStyle(
            fontWeight: isWinner ? FontWeight.bold : FontWeight.normal,
            color: isWinner ? Colors.blue : null,
          ),
        ),
        Text(club, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        Text(
          score,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: isWinner ? Colors.blue : null,
          ),
        ),
      ],
    );
  }
}
