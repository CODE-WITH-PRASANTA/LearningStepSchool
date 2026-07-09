import React from 'react'
import WelcomeSection from '../../Component/WelcomeSection/WelcomeSection'
import EarningModeMain from '../../Component/EarningModeMain/EarningModeMain'
import FeeCollection from '../../Component/FeeCollection/FeeCollection'
import StudentBalance from '../../Component/StudentBalance/StudentBalance'
import StaffPayrollMain from '../../Component/StaffPayrollMain/StaffPayrollMain'
import MainCallender from '../../Component/MainCallender/MainCallender'

const MainDashboard = () => {
  return (
    <div>
        <WelcomeSection />
        <EarningModeMain />
        <FeeCollection />
        <StudentBalance />
        <StaffPayrollMain />
        <MainCallender />
    </div>
  )
}

export default MainDashboard