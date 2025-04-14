import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/storage_service.dart';
import '../utils/app_theme.dart';
import '../widgets/app_header.dart';
import 'import_page.dart';
import 'tournaments_list_page.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          // Bandeau personnalisé avec logo
          const AppHeader(title: 'NK Tournament Stats'),
          
          // Contenu principal
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 40),
                    const Text(
                      'Bienvenue dans NK Tournament Stats',
                      style: TextStyle(
                        fontSize: 24, 
                        fontWeight: FontWeight.bold,
                        fontFamily: AppTheme.fontFamily,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Application d\'analyse de statistiques pour tournois de Kempo',
                      style: TextStyle(
                        fontSize: 16,
                        fontFamily: AppTheme.fontFamily,
                        color: AppTheme.subtitleColor,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 60),
                    
                    // Boutons d'action
                    _buildButton(
                      context: context,
                      icon: Icons.search,
                      text: 'Consulter les anciennes statistiques',
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const TournamentsListPage(),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 24),
                    _buildButton(
                      context: context,
                      icon: Icons.file_download,
                      text: 'Importer de nouvelles données',
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const ImportPage(),
                          ),
                        );
                      },
                    ),
                    
                    // Image décorative ou message en bas
                    const SizedBox(height: 60),
                    const Icon(
                      Icons.sports_martial_arts,
                      size: 80,
                      color: Color(0xFFE0E0E0),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Analysez facilement vos tournois',
                      style: TextStyle(
                        fontSize: 14,
                        fontFamily: AppTheme.fontFamily,
                        color: AppTheme.subtitleColor,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildButton({
    required BuildContext context,
    required IconData icon,
    required String text,
    required VoidCallback onPressed,
  }) {
    return Container(
      width: double.infinity,
      height: 60,
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryColor.withOpacity(0.2),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ElevatedButton.icon(
        icon: Icon(icon),
        label: Text(
          text,
          style: const TextStyle(
            fontFamily: AppTheme.fontFamily,
          ),
        ),
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppTheme.primaryColor,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        ),
      ),
    );
  }
}
