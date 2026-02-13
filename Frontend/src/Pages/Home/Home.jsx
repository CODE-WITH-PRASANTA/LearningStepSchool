import React from 'react'
import Skillscertificate from '../../Components/Skillscertificate/Skillscertificate'
import Herosection from '../../Components/Herosection/Herosection'
import Myservices from '../../Components/Myservices/Myservices'
import Awardwining from '../../Components/Awardwining/Awardwining'
import Testimonials from '../../Components/Testimonials/Testimonials'
import Ourevents from '../../Components/Ourevents/Ourevents'
import Ourblogs from '../../Components/Ourblogs/Ourblogs'
import HomeAbout from '../../Components/HomeAbout/HomeAbout'
import HomeClasses from '../../Components/HomeClasses/HomeClasses'
import ContactForm from '../../Components/ContactForm/ContactForm'
import AdmissionNav from '../../Components/AdmissionNav/AdmissionNav'
import NewsTicker from '../../Components/NewsTicker/NewsTicker'
import HomeGallery from '../../Components/HomeGallery/HomeGallery'

const Home = () => {
  return (
    <div>
      <AdmissionNav/>
      <Herosection/>
      <NewsTicker/>
      <HomeAbout />
      <HomeClasses />
      <Myservices/>
      <Awardwining/>
      <Testimonials/>
      <Ourevents/>
      <HomeGallery/>
      {/* <Ourblogs/> */}
      <Skillscertificate/>
      <ContactForm />
    </div>
  )
}

export default Home