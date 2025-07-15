const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Mock data
const categories = [
  { id: 1, name: 'Seniors -75kg', weight: '75kg' },
  { id: 2, name: 'Seniors -80kg', weight: '80kg' }
];

const matches = [
  {
    id: 1,
    categoryId: 1,
    competitor1: { id: 1, firstname: 'Jean', lastname: 'Dupont', club: 'Club A' },
    competitor2: { id: 2, firstname: 'Pierre', lastname: 'Martin', club: 'Club B' },
    round: 1,
    status: 'pending'
  },
  {
    id: 2,
    categoryId: 1,
    competitor1: { id: 3, firstname: 'Marie', lastname: 'Durand', club: 'Club C' },
    competitor2: { id: 4, firstname: 'Sophie', lastname: 'Bernard', club: 'Club D' },
    round: 1,
    status: 'pending'
  },
  {
    id: 3,
    categoryId: 1,
    competitor1: { id: 5, firstname: 'Bastien', lastname: 'Fernandez', club: 'Dojo Avignon' },
    competitor2: { id: 6, firstname: 'Dylan', lastname: 'Muller', club: 'Dojo Clermont' },
    round: 1,
    status: 'pending'
  },
  {
    id: 4,
    categoryId: 1,
    competitor1: { id: 7, firstname: 'Lucas', lastname: 'Petit', club: 'Club E' },
    competitor2: { id: 8, firstname: 'Thomas', lastname: 'Leroy', club: 'Club F' },
    round: 1,
    status: 'pending'
  }
];

// Routes
app.get('/categories/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const category = categories.find(c => c.id === categoryId);
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

app.get('/categories/:id/matches', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const categoryMatches = matches.filter(m => m.categoryId === categoryId);
  console.log(`📋 Récupération des matches pour la catégorie ${categoryId}:`, categoryMatches.length);
  res.json(categoryMatches);
});

// Route pour obtenir un match individuel
app.get('/api/matches/:id', (req, res) => {
  const matchId = parseInt(req.params.id);
  const match = matches.find(m => m.id === matchId);
  
  if (match) {
    console.log(`🔍 Match trouvé:`, match);
    res.json(match);
  } else {
    console.log(`❌ Match non trouvé avec l'ID: ${matchId}`);
    res.status(404).json({ error: 'Match not found' });
  }
});

app.put('/api/matches/:id', (req, res) => {
  const matchId = parseInt(req.params.id);
  const matchIndex = matches.findIndex(m => m.id === matchId);
  
  console.log(`🔄 Tentative de mise à jour du match ID: ${matchId}`);
  
  if (matchIndex !== -1) {
    matches[matchIndex] = { ...matches[matchIndex], ...req.body };
    console.log(`✅ Match mis à jour:`, matches[matchIndex]);
    res.json(matches[matchIndex]);
  } else {
    console.log(`❌ Match non trouvé pour mise à jour avec l'ID: ${matchId}`);
    console.log(`📋 Matches disponibles:`, matches.map(m => ({ id: m.id, status: m.status })));
    res.status(404).json({ error: 'Match not found' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Mock server running at http://localhost:${port}`);
});
