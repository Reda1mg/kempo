import 'package:syncfusion_flutter_pdf/pdf.dart';

import '../models/tournament.dart';

/// Classe utilitaire pour extraire les données spécifiques du format PDF de NK Master Tournament
class PDFParser {
  /// Extrait les données du tournoi à partir du contenu texte du PDF
  static Tournament? extractTournamentData(List<String> pdfTextContent) {
    try {
      // NOTE: Le format exact du PDF NK Master Tournament n'étant pas connu,
      // cette implémentation est un exemple à adapter à la structure réelle du PDF.
      
      // Valeurs par défaut
      String id = DateTime.now().millisecondsSinceEpoch.toString();
      String name = 'Tournoi par défaut';
      DateTime date = DateTime.now();
      String location = 'Lieu par défaut';
      List<Competitor> competitors = [];
      List<Match> matches = [];
      
      // Parcourir le contenu pour extraire les informations
      for (int i = 0; i < pdfTextContent.length; i++) {
        String line = pdfTextContent[i].trim();
        
        // Extraction du nom du tournoi
        if (line.contains('Tournoi:') || line.contains('Tournament:')) {
          name = line.split(':').last.trim();
        }
        
        // Extraction de la date
        else if (line.contains('Date:')) {
          // Supposons un format de date comme "Date: 25/03/2023"
          String dateStr = line.split(':').last.trim();
          List<String> dateParts = dateStr.split('/');
          if (dateParts.length == 3) {
            try {
              int day = int.parse(dateParts[0]);
              int month = int.parse(dateParts[1]);
              int year = int.parse(dateParts[2]);
              date = DateTime(year, month, day);
            } catch (e) {
              // Utiliser la date par défaut en cas d'erreur
            }
          }
        }
        
        // Extraction du lieu
        else if (line.contains('Lieu:') || line.contains('Location:')) {
          location = line.split(':').last.trim();
        }
        
        // Extraction des compétiteurs
        // Hypothèse: le format est "ID | Nom | Club | Catégorie"
        else if (line.contains('|') && !line.toLowerCase().contains('match')) {
          List<String> parts = line.split('|').map((part) => part.trim()).toList();
          if (parts.length >= 4) {
            String competitorId = parts[0];
            String name = parts[1];
            String club = parts[2];
            String category = parts[3];
            
            competitors.add(Competitor(
              id: competitorId,
              name: name,
              club: club,
              category: category,
            ));
          }
        }
        
        // Extraction des matchs
        // Hypothèse: le format est "Match ID | CompetiteurID1 | CompetiteurID2 | Score1 | Score2 | VainqueurID | Round"
        else if (line.toLowerCase().contains('match') && line.contains('|')) {
          List<String> parts = line.split('|').map((part) => part.trim()).toList();
          if (parts.length >= 7) {
            String matchId = parts[0].replaceAll('Match', '').trim();
            String competitorId1 = parts[1];
            String competitorId2 = parts[2];
            int score1 = int.tryParse(parts[3]) ?? 0;
            int score2 = int.tryParse(parts[4]) ?? 0;
            String winnerId = parts[5];
            String round = parts[6];
            
            matches.add(Match(
              id: matchId,
              competitorId1: competitorId1,
              competitorId2: competitorId2,
              scoreCompetitor1: score1,
              scoreCompetitor2: score2,
              winnerId: winnerId,
              round: round,
            ));
          }
        }
      }
      
      // Si aucun compétiteur n'a été trouvé, on ajoute des données fictives pour démonstration
      if (competitors.isEmpty) {
        competitors = [
          Competitor(id: '1', name: 'John Doe', club: 'Club A', category: 'Senior'),
          Competitor(id: '2', name: 'Jane Smith', club: 'Club B', category: 'Senior'),
        ];
        
        matches = [
          Match(
            id: '1',
            competitorId1: '1',
            competitorId2: '2',
            scoreCompetitor1: 10,
            scoreCompetitor2: 5,
            winnerId: '1',
            round: 'Final',
          ),
        ];
      }
      
      return Tournament(
        id: id,
        name: name,
        date: date,
        location: location,
        competitors: competitors,
        matches: matches,
      );
    } catch (e) {
      print('Erreur lors de l\'extraction des données: $e');
      return null;
    }
  }
  
  /// Extrait le contenu texte d'un document PDF
  static List<String> extractTextFromPdf(PdfDocument document) {
    List<String> result = [];
    
    // Parcourir chaque page du document
    for (int i = 0; i < document.pages.count; i++) {
      // Extraire le texte de la page
      String? text = PdfTextExtractor(document).extractText(startPageIndex: i, endPageIndex: i);
      
      if (text != null && text.isNotEmpty) {
        // Diviser le texte en lignes
        List<String> lines = text.split('\n');
        result.addAll(lines);
      }
    }
    
    return result;
  }
}