import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import './App.css';
import NavBar from './components/navbar/Navbar'
import Home from './pages/home/home'
import Competiteurs  from "./pages/Competiteurs/Competiteurs";  
function App() {
  return (
    <div className="App">
      <Router>
      <NavBar />
      <Routes>
      <Route path='/' element={<div className='content'><Home /></div>}></Route>
      <Route path='/competiteurs' element={<div className='content'><Competiteurs/></div>}></Route>

      </Routes>

      </Router>
   
    </div>
  );
}

export default App;
