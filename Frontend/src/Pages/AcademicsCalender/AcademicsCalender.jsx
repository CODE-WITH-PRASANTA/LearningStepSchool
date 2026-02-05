import React from 'react'
import TimeTableBreadcrum from '../../Components/TimeTableBreadcrum/TimeTableBreadcrum'
import TimeTable from '../../Components/TimeTable/TimeTable'
import NewsLetter from '../../Components/NewsLetter/NewsLetter'
import ContactForm from '../../Components/ContactForm/ContactForm'

const AcademicsCalender = () => {
  return (
    <div>
      <TimeTableBreadcrum/>
      <TimeTable/>
      <NewsLetter/>
      <ContactForm />
    </div>
  )
}

export default AcademicsCalender
