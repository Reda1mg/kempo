import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/tournament.dart';
import '../services/pdf_service.dart';
import '../services/storage_service.dart';
import '../utils/app_theme.dart';
import '../widgets/app_header.dart';
import 'tournament_detail_page.dart';

class ImportPage extends StatefulWidget {
  const ImportPage({super.key});

  @override
  State<ImportPage> createState() => _ImportPageState();
}

class _ImportPageState extends State<ImportPage> {
  final PDFService _pdfService = PDFService();
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _pickAndAnalyzePdf() async {
    try {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      // Sélectionner le fichier PDF
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf'],
      );

      if (result != null && result.files.single.path != null) {
        String filePath = result.files.single.path!;
        
        // Analyser le PDF
        Tournament? tournament = await _pdfService.analyzePdf(filePath);
        
        if (tournament != null) {
          // Sauvegarder le tournoi
          await Provider.of<StorageService>(context, listen: false)
              .saveTournament(tournament);
          
          if (mounted) {
            // Afficher le tournoi
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => TournamentDetailPage(tournament: tournament),
              ),
            );
          }
        } else {
          setState(() {
            _errorMessage = 'Impossible d\'analyser le fichier PDF';
          });
        }
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Erreur: ${e.toString()}';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          const AppHeader(
            title: 'Importer un tournoi',
            showBackButton: true,
          ),
          Expanded(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.upload_file,
                      size: 64,
                      color: AppTheme.primaryColor,
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Importez un fichier PDF généré par NK Master Tournament',
                      style: TextStyle(
                        fontSize: 18,
                        fontFamily: AppTheme.fontFamily,
                        fontWeight: FontWeight.w600,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Connectez votre téléphone à l\'ordinateur et transférez le fichier PDF, '
                      'puis sélectionnez-le ci-dessous.',
                      style: TextStyle(
                        fontSize: 14, 
                        fontFamily: AppTheme.fontFamily,
                        color: AppTheme.subtitleColor,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 48),
                    if (_isLoading)
                      const CircularProgressIndicator(
                        color: AppTheme.primaryColor,
                      )
                    else
                      Container(
                        width: double.infinity,
                        height: 50,
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
                          icon: const Icon(Icons.file_open),
                          label: const Text(
                            'Sélectionner le fichier PDF',
                            style: TextStyle(
                              fontFamily: AppTheme.fontFamily,
                            ),
                          ),
                          onPressed: _pickAndAnalyzePdf,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryColor,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ),
                    if (_errorMessage != null) ...[  
                      const SizedBox(height: 24),
                      Text(
                        _errorMessage!,
                        style: const TextStyle(
                          color: Colors.red,
                          fontFamily: AppTheme.fontFamily,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
