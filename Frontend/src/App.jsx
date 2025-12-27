import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Layout Components
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

// Pages
import Home from "./Pages/Home/Home";
import ContactPage from "./Pages/ContactPage/ContactPage";
import FAQ from "./Pages/FAQ/FAQ";
import Blog from "./Pages/Blog/Blog";
import OurTeacher from "./Pages/OurTeacher/OurTeacher";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/ourteacher" element={<OurTeacher />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
