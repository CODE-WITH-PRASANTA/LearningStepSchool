import React from 'react'
import VisionAndMissionBreadcrum from '../../Components/VisionAndMissionBreadcrum/VisionAndMissionBreadcrum'
import VisionMission from '../../Components/VisionMission/VisionMission'
import VMAboutUs from '../../Components/VMAboutUs/VMAboutUs'
import VMOppertunity from '../../Components/VMOppertunity/VMOppertunity'
import VMVideoHero from '../../Components/VMVideoHero/VMVideoHero'
import VMMeetTeacher from '../../Components/VMMeetTeacher/VMMeetTeacher'
import HighQualityBlendVisionMission from '../../Components/HighQualityBlendVisionMission/HighQualityBlendVisionMission'
import VMSlider from '../../Components/VMSlider/VMSlider'
import VMFAQ from '../../Components/VMFAQ/VMFAQ' 
import ContactForm from '../../Components/ContactForm/ContactForm'



import MVKidesActivities from '../../Components/MVKidesActivities/MVKidesActivities'
const VisionAndMission = () => {
  return (
    <div>
      <VisionAndMissionBreadcrum/>
      <VisionMission/>
      <VMAboutUs/>
      <VMOppertunity/>
      <VMVideoHero/>
      <VMMeetTeacher/>
      <HighQualityBlendVisionMission/>
      <VMSlider/>
      <MVKidesActivities/>
      <VMFAQ/>
      <ContactForm />
    </div>
  )
}

export default VisionAndMission
