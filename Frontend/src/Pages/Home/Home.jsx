import React from 'react'
import Skillscertificate from '../../Components/Skillscertificate/Skillscertificate'
import Herosection from '../../Components/Herosection/Herosection'
import Myservices from '../../Components/Myservices/Myservices'

const Home = () => {
  return (
    <div>
      <Herosection/>
      {/* <Myservices/> */}
        <Skillscertificate/>
    </div>
  )
}

export default Home