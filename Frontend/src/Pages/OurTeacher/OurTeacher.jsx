import React from 'react'
import './OurTeacher.css'
import OurTeacherBreadcrum from '../../Components/OurTeacherBreadcrum/OurTeacherBreadcrum'
import TeacherCard from '../../Components/TeacherCard/TeacherCard'
import ContactForm from '../../Components/ContactForm/ContactForm'

const OurTeacher = () => {
  return (
    <div>
      <OurTeacherBreadcrum />
      <TeacherCard />
      <ContactForm />
    </div>
  )
}

export default OurTeacher
