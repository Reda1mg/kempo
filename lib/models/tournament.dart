import 'package:hive/hive.dart';

part 'tournament.g.dart';

@HiveType(typeId: 0)
class Tournament extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String name;
  
  @HiveField(2)
  final DateTime date;
  
  @HiveField(3)
  final String location;
  
  @HiveField(4)
  final List<Competitor> competitors;
  
  @HiveField(5)
  final List<Match> matches;

  Tournament({
    required this.id,
    required this.name,
    required this.date,
    required this.location,
    required this.competitors,
    required this.matches,
  });
}

@HiveType(typeId: 1)
class Competitor extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String name;
  
  @HiveField(2)
  final String club;
  
  @HiveField(3)
  final String category;

  Competitor({
    required this.id,
    required this.name,
    required this.club,
    required this.category,
  });
}

@HiveType(typeId: 2)
class Match extends HiveObject {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String competitorId1;
  
  @HiveField(2)
  final String competitorId2;
  
  @HiveField(3)
  final int scoreCompetitor1;
  
  @HiveField(4)
  final int scoreCompetitor2;
  
  @HiveField(5)
  final String winnerId;
  
  @HiveField(6)
  final String round;

  Match({
    required this.id,
    required this.competitorId1,
    required this.competitorId2,
    required this.scoreCompetitor1,
    required this.scoreCompetitor2,
    required this.winnerId,
    required this.round,
  });
}
