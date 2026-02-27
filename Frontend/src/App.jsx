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
import FloatingActions from "./Components/FloatingActions/FloatingActions";
import FloatingForm from "./Components/FloatingForm/FloatingForm";
import About from "./Pages/About/About";
import Studentlife from "./Pages/Studentlife/Studentlife";
import Admissions from "./Pages/Admissions/Admissions";
import Infrastructure from "./Pages/Infrastructure/Infrastructure";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Regisrter/Register";
import Notice from "./Pages/Notice/Notice";
import AcademicsCalender from "./Pages/AcademicsCalender/AcademicsCalender";
import VisionAndMission from  "./Pages/VisionAndMission/VisionAndMission";
import PrePrimery from "./Pages/PrePrimery/PrePrimery";
import ExaminationSystem from "./Pages/ExaminationSystem/ExaminationSystem";
import WhyChooseUs from "./Pages/WhyChooseUs/WhyChooseUs";
import Primery from "./Pages/Primery/Primery";
import Secondary from "./Pages/Secondary/Secondary";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";
import TermAndCondition from "./Pages/TermAndCondition/TermAndCondition";
import Gallery from "./Pages/Gallery/Gallery";
import PublishNotification from "./Pages/PublishNotification/PublishNotification";
import AdPage from "./Pages/AdPage";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ad" element={<AdPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQ />} />c
        <Route path="/blog" element={<Blog />} />
        <Route path="/ourteacher" element={<OurTeacher />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/student-life" element={<Studentlife/>}/>
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/infrastructure" element={<Infrastructure />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />}/>
        <Route path="/notice" element={<Notice />}/>
        <Route path="/academics/calendar" element={<AcademicsCalender/>}/>
        <Route path="/vision-mission" element={<VisionAndMission/>}/>
        <Route path="/academics/pre-primary" element={<PrePrimery/>}/>
        <Route path="/academics/exams" element={<ExaminationSystem/>}/>
        <Route path="/WhyChooseUs" element={<WhyChooseUs/>}/> 
        <Route path="/academics/primary" element={<Primery/>}/>
        <Route path="/academics/secondary" element={<Secondary/>}/>
        <Route path="/privacy" element={<PrivacyPolicy/>}/>
        <Route path="/terms" element={<TermAndCondition/>}/>
        <Route path="/gallery" element={<Gallery/>}/>
        <Route path="/notification" element={<PublishNotification/>}/>

        {/* <Route path="/notice/:id" element={<ViewNotice />} /> */}
      </Routes>

      <Footer /> 
      <FloatingForm /> {/* 👈 Popup Form */}
      {/* Floating Call & WhatsApp Icons */}
      <FloatingActions />
    </Router>
  );
}

export default App;
