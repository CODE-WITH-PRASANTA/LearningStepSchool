import React from "react";
import AdmissionsBreadcrumb from "../../Components/AdmissionsBreadcrumb/AdmissionsBreadcrumb";
import EnrollWithUs from "../../Components/EnrollWithUs/EnrollWithUs";
import SchoolFee from "../../Components/SchoolFee/SchoolFee";
import HowToApplySection from "../../Components/HowToApplySection/HowToApplySection";
import ViedoSection from "../../Components/ViedoSection/ViedoSection";
import KnowAndAid from "../../Components/KnowAndAid/KnowAndAid";
import Features from "../../Components/Features/Features";
import FeesFAQ from "../../Components/FeesFAQ/FeesFAQ";
import AdmissionFaqSection from "../../Components/AdmissionFaqSection/AdmissionFaqSection";
const Admissions = () => {
  return (
    <div>
      <AdmissionsBreadcrumb />
      <EnrollWithUs />
      <SchoolFee />
      <HowToApplySection />
      <ViedoSection />
      <KnowAndAid />
      <Features />
      <FeesFAQ />
      <AdmissionFaqSection />
    </div>
  );
};

export default Admissions;







