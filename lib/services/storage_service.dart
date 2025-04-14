import 'package:flutter/foundation.dart';
import 'package:hive_flutter/hive_flutter.dart';

import '../models/tournament.dart';

class StorageService extends ChangeNotifier {
  late Box<Tournament> _tournamentsBox;
  List<Tournament> _tournaments = [];

  StorageService() {
    _initBox();
  }

  Future<void> _initBox() async {
    _tournamentsBox = Hive.box<Tournament>('tournaments');
    _loadTournaments();
  }

  void _loadTournaments() {
    _tournaments = _tournamentsBox.values.toList();
    notifyListeners();
  }

  List<Tournament> get tournaments => _tournaments;

  Future<void> saveTournament(Tournament tournament) async {
    await _tournamentsBox.put(tournament.id, tournament);
    _loadTournaments();
  }

  Future<void> deleteTournament(String id) async {
    await _tournamentsBox.delete(id);
    _loadTournaments();
  }
}
