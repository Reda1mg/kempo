import './App.css';
import NavBar from './components/navbar/Navbar'
import Home from './pages/home/home'
function App() {
  return (
    <div className="App">
      <NavBar />
      <div className="content">
        <Home />
      </div>

    </div>
  );
}

export default App;
