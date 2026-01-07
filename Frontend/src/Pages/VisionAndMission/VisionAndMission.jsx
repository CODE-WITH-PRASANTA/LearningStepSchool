import React from 'react'
import VisionAndMissionBreadcrum from '../../Components/VisionAndMissionBreadcrum/VisionAndMissionBreadcrum'
import VisionMission from '../../Components/VisionMission/VisionMission'
import VMAboutUs from '../../Components/VMAboutUs/VMAboutUs'
import VMOppertunity from '../../Components/VMOppertunity/VMOppertunity'
import VMVideoHero from '../../Components/VMVideoHero/VMVideoHero'
import VMMeetTeacher from '../../Components/VMMeetTeacher/VMMeetTeacher'
import HighQualityBlendVisionMission from '../../Components/HighQualityBlendVisionMission/HighQualityBlendVisionMission'
import VMSlider from '../../Components/VMSlider/VMSlider'
import MVKidesActivities from '../../Components/MVKidesActivities/MVKidesActivities'
import VMFAQ from '../../Components/VMFAQ/VMFAQ'
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
    </div>
  )
}

export default VisionAndMission
