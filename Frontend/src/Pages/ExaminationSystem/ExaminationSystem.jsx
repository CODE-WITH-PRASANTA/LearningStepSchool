import React from 'react'
import EXbreadcrum from '../../Components/EXbreadcrum/EXbreadcrum'
import EXCard from '../../Components/EXCard/EXCard'
import EXSection from '../../Components/EXSection/EXSection'
import EXCurve from '../../Components/EXCurve/EXCurve'
import ExamChild from '../../Components/ExamChild/ExamChild'
import EXAdmission from '../../Components/EXAdmission/EXAdmission'
import EXTeacher from '../../Components/EXTeacher/EXTeacher'
import EXRoom from '../../Components/EXRoom/EXRoom'
import EXCustomer from '../../Components/EXCustomer/EXCustomer'
import EXNew from '../../Components/EXNew/EXNew'


function ExaminationSystem() {
  return (
    <div>
      <EXbreadcrum />
      <EXCard />
      <EXSection />
      <EXCurve />
      <ExamChild />
      <EXAdmission />
      <EXTeacher />
      <EXRoom />
      <EXCustomer />
      <EXNew />

      


    </div>
  )
}

export default ExaminationSystem
