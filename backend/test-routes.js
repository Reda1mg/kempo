// Test pour voir quelles routes sont undefined
import { TournamentsRoutes } from './src/tournaments/adapter-rest/tournaments.openapi.ts';

console.log('Routes disponibles:');
for (const [key, value] of Object.entries(TournamentsRoutes)) {
    console.log(`${key}: ${value ? 'OK' : 'UNDEFINED'}`);
}

console.log('\nRoutes problématiques:');
const routesUsedInRouter = [
    'get', 'post', 'put', 'list', 'delete', 'addCompetitor', 'deleteCompetitor',
    'getCompetitors', 'createCategory', 'listCategories', 'assignCompetitor',
    'getAllCompetitors', 'getAssignedCategoryCompetitors', 'removeCategoryCompetitor',
    'startTournament', 'resetTournament'
];

routesUsedInRouter.forEach(route => {
    if (!TournamentsRoutes[route]) {
        console.log(`❌ ${route} is undefined`);
    } else {
        console.log(`✅ ${route} is OK`);
    }
});
