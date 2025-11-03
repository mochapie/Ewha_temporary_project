import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Auth/Signup'
import SignupComplete from './pages/Auth/SignupComplete'
import Login from './pages/Auth/Login'
import SearchResult from './pages/SearchResult'
import NutritionFacts from './pages/NutritionFacts'
//import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/complete" element={<SignupComplete />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/product/:id" element={<NutritionFacts />} />
      </Routes>
    </Router>
  )
}

export default App