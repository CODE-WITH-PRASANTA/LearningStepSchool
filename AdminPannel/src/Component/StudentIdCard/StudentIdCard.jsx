import React, { useMemo, useState } from "react";

import "./StudentIdCard.css";

import studentsData from "../../Component/Header/students";
console.log(studentsData);

import StudentSearchForm from "../../Component/StudentSearchForm/StudentSearchForm";
import StudentTable from "../../Component/StudentTable/StudentTable";
import StudentIdPreview from "../../Component/StudentIdPreview/StudentIdPreview";

const StudentIdCard = () => {

  /* ==========================================
      FILTER STATE
  =========================================== */

  const [filters, setFilters] = useState({
    session: "2026-2027",
    className: "",
    section: "",
    house: "",
    category: "",
    gender: "",
    transport: "",
    template: "",
    status: "",
  });

  /* ==========================================
      PAGE STATE
  =========================================== */

  const [searched, setSearched] = useState(false);

  const [selectedStudents, setSelectedStudents] = useState([]);

  const [showPreview, setShowPreview] = useState(false);

  

  /* ==========================================
      SEARCH FILTER
  =========================================== */

  const filteredStudents = studentsData;

  /* ==========================================
      SEARCH
  =========================================== */

  const handleSearch = () => {

    setSearched(true);

    setSelectedStudents([]);

    setShowPreview(false);

  };

  /* ==========================================
      GENERATE
  =========================================== */

  const handleGenerate = () => {

    if (selectedStudents.length === 0) {

      alert("Please select at least one student.");

      return;

    }

    setShowPreview(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  /* ==========================================
      BACK
  =========================================== */

  const handleBack = () => {

    setShowPreview(false);

  };

  /* ==========================================
      PRINT
  =========================================== */

  const handlePrint = () => {

    window.print();

  };
  console.log("Students Data :", studentsData);
console.log("Students Length :", studentsData.length);
console.log("Filtered Students :", filteredStudents);

  /* ==========================================
      UI
  =========================================== */

  return (

<div className="StudentIdCard">

<div className="StudentIdCard-container">

<h2 className="StudentIdCard-pageTitle">

Student ID Card

</h2>

{

!showPreview && (

<>

<StudentSearchForm

filters={filters}

setFilters={setFilters}

onSearch={handleSearch}

/>

{

searched && (

<StudentTable

students={studentsData}

selectedStudents={selectedStudents}

setSelectedStudents={setSelectedStudents}

onGenerate={handleGenerate}

/>

)

}

</>

)

}

{

showPreview && (

<StudentIdPreview

students={selectedStudents}

onBack={handleBack}

onPrint={handlePrint}

/>

)

}

</div>

</div>

  );

};

export default StudentIdCard;