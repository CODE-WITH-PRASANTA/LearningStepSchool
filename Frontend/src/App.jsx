import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import Home from '../src/Pages/Home/Home'
import ContactBreadcrum from './Components/ContactBreadcrum/ContactBreadcrum'
import ContactPage from './Pages/ContactPage/ContactPage'
import FAQ from './Pages/FAQ/FAQ'

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>

      <Footer />
    </Router>
  )
}

export default App
