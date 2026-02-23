import React from "react";
import SelectCriteria from "../../Component/AdmisionEnquiryPage/SelectCriteria";
import EnquiryList from "../../Component/AdmisionEnquiryPage/EnquiryList";
import "./AdmissionEnquiry.css";

const AdmissionEnquiry = () => {
  return (
    <div className="ae-wrapper">
      <div className="ae-header">
        <h2>📄 Admission Enquiry</h2>
      </div>

      <SelectCriteria />
      <EnquiryList />
    </div>
  );
};

export default AdmissionEnquiry;
