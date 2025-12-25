import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import Home from '../src/Pages/Home/Home'
import ContactBreadcrum from './Components/ContactBreadcrum/ContactBreadcrum'

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactBreadcrum />} />
      </Routes>

      <Footer />
    </Router>
  )
}

export default App
