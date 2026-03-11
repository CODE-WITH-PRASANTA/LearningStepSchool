import React from 'react'
import DashBoardfirstSec from '../../Component/DashBoardfirstSec/DashBoardfirstSec'
import FeesCollection from '../../Component/FeesCollection/FeesCollection'
import EarningMode from '../../Component/EarningMode/EarningMode'
import StudentFeeChart from '../../Component/StudentFeeChart/StudentFeeChart'
import StaffPayRoll from '../../Component/StaffPayRoll/StaffPayRoll'
import Calender from '../../Component/Calender/Calender'

const Dashboard = () => {
  return (
    <div>
      Dashboard
      <DashBoardfirstSec/>
      <FeesCollection/>
      <EarningMode/>
      <StudentFeeChart/>
      <StaffPayRoll/>
      <Calender/>
      </div>
  )
}

export default Dashboard