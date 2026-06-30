import React from 'react';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import './SalaryHeader.css';

const SalaryHeader = () => {
  return (
    <div className="SalaryHeader-container">
      <div className="SalaryHeader-inner">
        {/* Title Left Side */}
        <h1 className="SalaryHeader-title">Salary Details</h1>

        {/* Breadcrumb Right Side */}
        <nav className="SalaryHeader-breadcrumbs" aria-label="breadcrumb">
          <span className="SalaryHeader-breadcrumb-item home-link">
            <FaHome className="SalaryHeader-icon-home" />
          </span>
          
          <FaChevronRight className="SalaryHeader-icon-separator" />
          
          <span className="SalaryHeader-breadcrumb-item">Payroll</span>
          
          <FaChevronRight className="SalaryHeader-icon-separator" />
          
          <span className="SalaryHeader-breadcrumb-item active">Salary Details</span>
        </nav>
      </div>
    </div>
  );
};

export default SalaryHeader;