import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { AgeGroup } from '../entities/age-group.entity.ts';
import { Tournament } from '../entities/Tournament.entity.ts';
import { Category, EnumEliminationType } from '../entities/Category.entity.ts';
import { Competitor } from '../entities/Competitor.entity.ts';
import { WeightCategory, EnumGender } from '../entities/weight-category.ts';
import { EnumRank } from '../entities/Tournament.entity.ts';

export class DatabaseSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    
    const mini_poussin = em.create(AgeGroup, {
      name: "Mini-Poussin",
      age_min: 0,
      age_max: 5
    });

    const poussin = em.create(AgeGroup, {
      name: "Poussin",
      age_min: 6,
      age_max: 7
    });

    const pupille = em.create(AgeGroup, {
      name: "Pupille",
      age_min: 8,
      age_max: 9
    });

    const benjamin = em.create(AgeGroup, {
      name: "Benjamin",
      age_min: 10,
      age_max: 11
    });

    const minime = em.create(AgeGroup, {
      name: "Minime",
      age_min: 12,
      age_max: 13
    });

    const cadet = em.create(AgeGroup, {
      name: "Cadet",
      age_min: 14,
      age_max: 15
    });

    const junior = em.create(AgeGroup, {
      name: "Junior",
      age_min: 16,
      age_max: 17
    });

    const senior = em.create(AgeGroup, {
      name: "Senior",
      age_min: 18,
      age_max: 40
    });

    const veteran = em.create(AgeGroup, {
      name: "Vétéran",
      age_min: 41,
      age_max: 100
    });

    const ageGroups = [mini_poussin, poussin, pupille, benjamin, minime, cadet, junior, senior, veteran];

    // 1. Tournaments
    const tournaments = Array.from({ length: 5 }).map((_, i) =>
      em.create(Tournament, {
        name: `Tournoi ${i + 1}`,
        city: `Ville ${i + 1}`,
        start_date: new Date(2025, 4, 10 + i),
        end_date: new Date(2025, 4, 11 + i),
      })
    );

    // 2. WeightCategories
    const weightCategories = Array.from({ length: 5 }).map((_, i) => {
      const min = 10 * (i + 1);
      return em.create(WeightCategory, {
        name: `Catégorie Poids ${i + 1}`,
        weight_min: min,
        weight_max: min + 5,
        age_group: ageGroups[i % ageGroups.length],
        gender: i % 2 === 0 ? EnumGender.MAN : EnumGender.WOMAN,
      });
    });

    // 3. Competitors
    const competitors = Array.from({ length: 10 }).map((_, i) =>
      em.create(Competitor, {
        firstname: `Prenom${i + 1}`,
        lastname: `Nom${i + 1}`,
        birthday: new Date(2010 + i, 0, 1),
        club: `Club${i + 1}`,
        country: 'France',
        weight: 31 + i * 7, 
        rank: Object.values(EnumRank)[i % Object.values(EnumRank).length],
        gender: i % 2 === 0 ? EnumGender.MAN : EnumGender.WOMAN,
      })
    );

    // 4. Categories
    const categories = Array.from({ length: 5 }).map((_, i) =>
      em.create(Category, {
        name: `Catégorie ${i + 1}`,
        tournament: tournaments[i % tournaments.length],
        rank: [Object.values(EnumRank)[i % Object.values(EnumRank).length]],
        gender: i % 2 === 0 ? EnumGender.MAN : EnumGender.WOMAN,
        weight_category: weightCategories[i % weightCategories.length],
        age_group: ageGroups[i % ageGroups.length],
        elimination_type: i % 2 === 0 ? EnumEliminationType.POOL : EnumEliminationType.DIRECT,
      })
    );

    // Persist all
    await em.persistAndFlush([
      ...ageGroups,
      ...tournaments,
      ...weightCategories,
      ...competitors,
      ...categories,
    ]);
  }
}