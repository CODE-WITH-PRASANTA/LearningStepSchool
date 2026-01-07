import React from 'react'
import VisionAndMissionBreadcrum from '../../Components/VisionAndMissionBreadcrum/VisionAndMissionBreadcrum'
import VisionMission from '../../Components/VisionMission/VisionMission'
import VMAboutUs from '../../Components/VMAboutUs/VMAboutUs'
import HighQualityBlendVisionMission from '../../Components/HighQualityBlendVisionMission/HighQualityBlendVisionMission'
import VMSlider from '../../Components/VMSlider/VMSlider'
import VMFAQ from '../../Components/VMFAQ/VMFAQ' 
import ContactForm from '../../Components/ContactForm/ContactForm'



const VisionAndMission = () => {
  return (
    <div>
      <VisionAndMissionBreadcrum/>
      <VisionMission/>
      <VMAboutUs/>
      <HighQualityBlendVisionMission/>
      <VMSlider/>
      <VMFAQ/>
      <ContactForm />
    </div>
  )
}

export default VisionAndMission
