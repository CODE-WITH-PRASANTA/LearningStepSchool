import React from "react";
import SelectCriteria from "../../Component/AdmisionEnquiryPage/SelectCriteria";
import EnquiryList from "../../Component/AdmisionEnquiryPage/EnquiryList";
import "./AdmissionEnquiry.css";

const AdmissionEnquiry = () => {
  return (
    <div className="ae-wrapper">
      <div className="ae-header">
        <h2>📄 Admission Enquiry</h2>
        <div className="ae-breadcrumb">Front Office / Admission Enquiry</div>
      </div>

      <SelectCriteria />
      <EnquiryList />
    </div>
  );
};

export default AdmissionEnquiry;
