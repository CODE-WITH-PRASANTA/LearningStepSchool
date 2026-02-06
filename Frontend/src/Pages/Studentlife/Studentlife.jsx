import React from 'react'
import Studentlifeherosection from '../../Components/Studentlifeherosection/Studentlifeherosection'
import Studentlifeaboutus from '../../Components/Studentlifeaboutus/Studentlifeaboutus'
import Studentlifecounter from '../../Components/Studentlifecounter/Studentlifecounter'
import Studentlifeextracurricular from '../../Components/Studentlifeextracurricular/Studentlifeextracurricular'
import Studentlifeourpricing from '../../Components/Studentlifeourpricing/Studentlifeourpricing'
import Studentlifecraft from '../../Components/Studentlifecraft/Studentlifecraft'
import Studentlifestaywithus from '../../Components/Studentlifestaywithus/Studentlifestaywithus'
import Studentlifeourblogs from '../../Components/Studentlifeourblogs/Studentlifeourblogs'
import Studentlifeproduct from '../../Components/Studentlifeproduct/Studentlifeproduct'
import ContactForm from '../../Components/ContactForm/ContactForm'

const Studentlife = () => {
  return (
    <>
        <Studentlifeherosection/>
        <Studentlifeaboutus/>
        <Studentlifecounter/>
        <Studentlifeextracurricular/>
        <Studentlifeproduct/>
        <Studentlifeourpricing/>
        <Studentlifecraft/>
        <Studentlifeourblogs/>
        <Studentlifestaywithus/>
        <ContactForm />
    </>
  )
}

export default Studentlife