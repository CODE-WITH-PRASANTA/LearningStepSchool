import React from "react";
import { FaUsers } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi2";
import "./LinkSiblings.css";

const LinkSiblings = () => {
  return (
    <div className="ss-wrapper">
      
      {/* HEADER */}
      <div className="ss-header">
        <div className="ss-header-left">
          <div className="ss-icon-box">
            <FaUsers />
          </div>
          <h1>Student Sibling</h1>
        </div>

        <div className="ss-breadcrumb">
          <span>Student Info</span>
          <span className="divider">/</span>
          <span className="active">Sibling List</span>
        </div>
      </div>

      {/* CARD */}
      <div className="ss-card">
        <div className="ss-card-header">
          <HiOutlineUserGroup />
          <h2>Student Sibling List</h2>
        </div>

        <div className="ss-card-body">
          {/* Empty State (Replace with Table Later) */}
          <div className="ss-empty">
            
            <h3>No Sibling Records Found</h3>
            <p>
              Add sibling details to display the records here.
            </p>
            {/* <button className="ss-add-btn">
              + Add Sibling
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkSiblings;