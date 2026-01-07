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

const Home = () => {
  return (
    <div>
      <Herosection/>
      <HomeAbout />
      <HomeClasses />
      <Myservices/>
      <Awardwining/>
      <Testimonials/>
      <Ourevents/>
      {/* <Ourblogs/> */}
      <Skillscertificate/>
      <ContactForm />
    </div>
  )
}

export default Home