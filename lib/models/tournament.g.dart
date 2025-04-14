// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tournament.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class TournamentAdapter extends TypeAdapter<Tournament> {
  @override
  final int typeId = 0;

  @override
  Tournament read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Tournament(
      id: fields[0] as String,
      name: fields[1] as String,
      date: fields[2] as DateTime,
      location: fields[3] as String,
      competitors: (fields[4] as List).cast<Competitor>(),
      matches: (fields[5] as List).cast<Match>(),
    );
  }

  @override
  void write(BinaryWriter writer, Tournament obj) {
    writer
      ..writeByte(6)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.date)
      ..writeByte(3)
      ..write(obj.location)
      ..writeByte(4)
      ..write(obj.competitors)
      ..writeByte(5)
      ..write(obj.matches);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TournamentAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class CompetitorAdapter extends TypeAdapter<Competitor> {
  @override
  final int typeId = 1;

  @override
  Competitor read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Competitor(
      id: fields[0] as String,
      name: fields[1] as String,
      club: fields[2] as String,
      category: fields[3] as String,
    );
  }

  @override
  void write(BinaryWriter writer, Competitor obj) {
    writer
      ..writeByte(4)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.club)
      ..writeByte(3)
      ..write(obj.category);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CompetitorAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class MatchAdapter extends TypeAdapter<Match> {
  @override
  final int typeId = 2;

  @override
  Match read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Match(
      id: fields[0] as String,
      competitorId1: fields[1] as String,
      competitorId2: fields[2] as String,
      scoreCompetitor1: fields[3] as int,
      scoreCompetitor2: fields[4] as int,
      winnerId: fields[5] as String,
      round: fields[6] as String,
    );
  }

  @override
  void write(BinaryWriter writer, Match obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.competitorId1)
      ..writeByte(2)
      ..write(obj.competitorId2)
      ..writeByte(3)
      ..write(obj.scoreCompetitor1)
      ..writeByte(4)
      ..write(obj.scoreCompetitor2)
      ..writeByte(5)
      ..write(obj.winnerId)
      ..writeByte(6)
      ..write(obj.round);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is MatchAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
