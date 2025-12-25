import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import Home from '../src/Pages/Home/Home'
import ContactBreadcrum from './Components/ContactBreadcrum/ContactBreadcrum'
import ContactPage from './Pages/ContactPage/ContactPage'

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      <Footer />
    </Router>
  )
}

export default App
