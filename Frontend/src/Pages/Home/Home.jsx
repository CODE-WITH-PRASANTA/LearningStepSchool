import React from 'react'
import Skillscertificate from '../../Components/Skillscertificate/Skillscertificate'
import Herosection from '../../Components/Herosection/Herosection'
import Myservices from '../../Components/Myservices/Myservices'
import Awardwining from '../../Components/Awardwining/Awardwining'
import Testimonials from '../../Components/Testimonials/Testimonials'
import Ourevents from '../../Components/Ourevents/Ourevents'
import Ourblogs from '../../Components/Ourblogs/Ourblogs'

const Home = () => {
  return (
    <div>
      <Herosection/>
      <Myservices/>
      <Awardwining/>
      <Testimonials/>
      <Ourevents/>
      <Ourblogs/>
        <Skillscertificate/>
    </div>
  )
}

export default Home