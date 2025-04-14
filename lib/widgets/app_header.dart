import 'package:flutter/material.dart';
import '../utils/app_theme.dart';

class AppHeader extends StatelessWidget {
  final String title;
  final double height;
  final bool showBackButton;
  final VoidCallback? onBackPressed;

  const AppHeader({
    super.key,
    required this.title,
    this.height = 120.0,
    this.showBackButton = false,
    this.onBackPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      decoration: const BoxDecoration(
        color: AppTheme.primaryColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            offset: Offset(0, 2),
            blurRadius: 4.0,
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            children: [
              // Logo à gauche (plus grand et sans fond)
              Container(
                width: 120,
                height: 120,
                child: Image.asset(
                  'assets/images/logo_kempo_nbg.png',
                  fit: BoxFit.contain,
                ),
              ),
              
              const SizedBox(width: 16),
              
              // Bouton retour si nécessaire
              if (showBackButton) ...[
                IconButton(
                  icon: const Icon(Icons.arrow_back, color: Colors.white),
                  onPressed: onBackPressed ?? () => Navigator.of(context).pop(),
                ),
                const SizedBox(width: 8),
              ],
              
              // Titre centré
              Expanded(
                child: Text(
                  title,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontFamily: AppTheme.fontFamily,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              
              // Espace équivalent au logo pour centrer le titre
              const SizedBox(width: 60),
            ],
          ),
        ),
      ),
    );
  }
}