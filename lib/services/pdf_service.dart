import 'dart:io';
import 'package:syncfusion_flutter_pdf/pdf.dart';
import '../models/tournament.dart';
import '../utils/pdf_parser.dart';

class PDFService {
  /// Analyse un fichier PDF du NK Master Tournament et extrait les données
  Future<Tournament?> analyzePdf(String filePath) async {
    try {
      // Chargement du fichier PDF
      final File file = File(filePath);
      final List<int> bytes = await file.readAsBytes();
      final PdfDocument document = PdfDocument(inputBytes: bytes);
      
      // Extraire le texte du PDF
      final List<String> pdfTextContent = PDFParser.extractTextFromPdf(document);
      
      // Analyser le contenu pour extraire les données du tournoi
      final Tournament? tournament = PDFParser.extractTournamentData(pdfTextContent);
      
      // Fermer le document
      document.dispose();
      
      return tournament;
    } catch (e) {
      print('Erreur lors de l\'analyse du PDF: $e');
      return null;
    }
  }
}
