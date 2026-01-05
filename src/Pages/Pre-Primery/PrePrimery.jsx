import React from 'react'
import PrePrimeryBreadcrum from '../../Components/PrePrimeryBreadcrum/PrePrimeryBreadcrum'
import PrePrimeryCard from '../../Components/PrePrimeryCard/PrePrimeryCard'
import PrePrimeryFeature from '../../Components/PrePrimeryFeature/PrePrimeryFeature'
import PrePrimeryWayToLearn from '../../Components/PrePrimeryWayToLearn/PrePrimeryWayToLearn'
import PrePrimeryFullDayLerning from '../../Components/PrePrimeryFullDayLerning/PrePrimeryFullDayLerning'
import PrePrimeryMoreInformation from '../../Components/PrePrimeryMoreInformation/PrePrimeryMoreInformation'
import PrePrimeryJoinNewSession from '../../Components/PrePrimeryJoinNewSession/PrePrimeryJoinNewSession'
import PrePrimeryMoreProgram from '../../Components/PrePrimeryMoreProgram/PrePrimeryMoreProgram'

const PrePrimery = () => {
  return (
    <>
       <PrePrimeryBreadcrum/>
       <PrePrimeryCard/>
       <PrePrimeryFeature/>
       <PrePrimeryWayToLearn/>
       <PrePrimeryFullDayLerning/>
       <PrePrimeryMoreInformation/>
       <PrePrimeryJoinNewSession/>
       <PrePrimeryMoreProgram/>
    </>
  )
}

export default PrePrimery
