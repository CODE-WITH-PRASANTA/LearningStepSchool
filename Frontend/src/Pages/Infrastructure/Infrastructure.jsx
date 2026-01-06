import React from "react";
import InfrastructureBreadcrumb from "../../Components/InfrastructureBreadcrumb/InfrastructureBreadcrumb.jsx";
import StatsSection from "../../Components/StatsSection/StatsSection";
import SectionArea from "../../Components/SectionArea/SectionArea";
import SectionArea1 from "../../Components/SectionArea1/SectionArea1";
import EmploymentSection from "../../Components/EmploymentSection/EmploymentSection";
import NewsLetterSection from "../../Components/NewsLetterSection/NewsLetterSection";
const Infrastructure = () => {
  return (
    <div>
      <InfrastructureBreadcrumb />
      <StatsSection />
      <SectionArea />
      <SectionArea1 />
      <EmploymentSection />
      <NewsLetterSection />
    </div>
  );
};

export default Infrastructure;
