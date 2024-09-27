import './App.css';
import Navigation from './components/Navigation';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Search from './components/Search';
import Content from './components/Content';
import Categories from './components/Categories';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/content" element={<Content />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
