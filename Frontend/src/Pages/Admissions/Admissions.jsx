import React from "react";
import AdmissionsBreadcrumb from "../../Components/AdmissionsBreadcrumb/AdmissionsBreadcrumb";
import EnrollWithUs from "../../Components/EnrollWithUs/EnrollWithUs";
import SchoolFee from "../../Components/SchoolFee/SchoolFee";
import FeesFAQ from "../../Components/FeesFAQ/FeesFAQ";
import ContactForm from '../../Components/ContactForm/ContactForm'
const Admissions = () => {
  return (
    <div>
      <AdmissionsBreadcrumb />
      <EnrollWithUs />
      <SchoolFee />
      <FeesFAQ />
      <ContactForm />
    </div>
  );
};

export default Admissions;







