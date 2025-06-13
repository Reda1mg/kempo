
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import NavBar from './components/navbar/Navbar';
import Home from './pages/home/home';
import Competitors from "./pages/Competitors/Competitors";
import TournoiDetails from "./pages/TournoiDetails/ToutnoiDetails";
import Telecommande from "./pages/Telecommande/components/Telecommande";
// import Scoreboard from "./pages/Scoreboard/Scoreboard";
import AddCompetitorsToCategory from "./pages/TournoiDetails/Components/addCompetitorsToCategory";
import MatchesTable from "./pages/Matches/Components/MatchesTable";
import ScoreboardDynamic from "./pages/Scoreboard/components/ScoerBoardDynamic";


function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>

          <Route path='/' element={<div className='content'><Home /></div>} />
          <Route path='/competiteurs' element={<div className='content'><Competitors /></div>} />
          <Route path='/telecommande' element={<div className='content'><Telecommande /></div>} />
          <Route path='/tournoiDetails/:id' element={<TournoiDetails />} />
          <Route path="/tournoiDetails/:id/ajouter-competiteurs" element={<AddCompetitorsToCategory />} />
          <Route path="/matches/:categoryId" element={<MatchesTable />} />
          <Route path="/telecommande/:matchId" element={<Telecommande />} />
          <Route path="/scoreboard/:matchId" element={<ScoreboardDynamic />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
