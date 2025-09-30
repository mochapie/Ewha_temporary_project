import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SearchResult from './pages/SearchResult'
import NutritionFacts from './pages/NutritionFacts'
//import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/product/:id" element={<NutritionFacts />} />
      </Routes>
    </Router>
  )
}

export default App