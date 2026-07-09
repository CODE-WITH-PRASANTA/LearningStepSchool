import React from "react";
import API from "../../api/axios";
import { useEffect, useState } from "react";

import "./StudentIdCard.css";

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

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  /* ==========================================
      SEARCH FILTER
  =========================================== */

  const handleSearch = async () => {
    try {
      const res = await API.get("/students/id-cards", {
        params: {
          session: filters.session,
          className: filters.className,
          section: filters.section,
          house: filters.house,
          category: filters.category,
          gender: filters.gender,
          transport: filters.transport,
          status: filters.status,
        },
      });

      setStudents(res.data?.data || []);

      setSearched(true);

      setSelectedStudents([]);

      setShowPreview(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes");
      setClasses(res.data?.data || []);
    } catch (err) {
      console.log(err);
    }
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

  const handlePrint = async () => {
    const printArea = document.getElementById("StudentIdPreview-printArea");
    const images = Array.from(printArea?.querySelectorAll("img") || []);

    await Promise.all(
      images.map((image) => {
        if (image.complete) return Promise.resolve();

        return new Promise((resolve) => {
          image.onload = resolve;
          image.onerror = resolve;
        });
      }),
    );

    window.print();
  };

  /* ==========================================
      UI
  =========================================== */

  return (
    <div className="StudentIdCard">
      <div className="StudentIdCard-container">
        <h2 className="StudentIdCard-pageTitle">Student ID Card</h2>

        {!showPreview && (
          <>
            <StudentSearchForm
              filters={filters}
              setFilters={setFilters}
              classes={classes}
              onSearch={handleSearch}
            />

            {searched && (
              <StudentTable
                students={students}
                selectedStudents={selectedStudents}
                setSelectedStudents={setSelectedStudents}
                onGenerate={handleGenerate}
              />
            )}
          </>
        )}

        {showPreview && (
          <StudentIdPreview
            students={selectedStudents}
            onBack={handleBack}
            onPrint={handlePrint}
          />
        )}
      </div>
    </div>
  );
};

export default StudentIdCard;
