import React from 'react'
import SecondaryBreadcrum from '../../Components/SecondaryBreadcrum/SecondaryBreadcrum'
import SecondaryCard from '../../Components/SecondaryCard/SecondaryCard'
import SecondaryFeature from '../../Components/SecondaryFeatures/SecondaryFeatures'
import SecondaryWayToLearn from '../../Components/SecondaryWayToLearn/SecondaryWayToLearn'
import SecondaryFullDayLearning from '../../Components/SecondaryFullDayLearning/SecondaryFullDayLearning'
import SecondaryMoreInformation from '../../Components/SecondaryMoreInformation/SecondaryMoreInformation'
import SecondaryJoinNewSession from '../../Components/SecondaryJoinNewSession/SecondaryJoinNewSession'
import SecondaryMoreProgram from '../../Components/SecondaryMoreProgram/SecondaryMoreProgram'
import ContactForm from '../../Components/ContactForm/ContactForm'

const Secondary = () => {
  return (
    <>
      <SecondaryBreadcrum/>
      <SecondaryCard/>
      <SecondaryFeature/>
      <SecondaryWayToLearn/>
      <SecondaryFullDayLearning/>
      <SecondaryMoreInformation/>
      <SecondaryJoinNewSession/>
      <SecondaryMoreProgram/>
      <ContactForm />
    </>
  )
}

export default Secondary
