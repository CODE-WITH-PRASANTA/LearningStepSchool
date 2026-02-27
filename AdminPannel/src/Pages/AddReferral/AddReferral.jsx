import React from "react";
import { useNavigate } from "react-router-dom";
import "./AddReferral.css";
import { FiUserPlus } from "react-icons/fi";

const AddReferral = () => {
  const navigate = useNavigate();

  return (
    <div className="AddReferralWrapper">
      {/* Header */}
      <div className="AddReferralHeader">
        <div className="AddReferralTitle">
          <FiUserPlus className="AddReferralHeaderIcon" />
          <span>Add Referral</span>
        </div>

        <div className="AddReferralBreadcrumb">
          <span
            onClick={() => navigate("/referral")}
            className="AddReferralBreadcrumbLink"
          >
           Student Referral
          </span>
          <span className="AddReferralBreadcrumbSlash">/</span>
          <span className="AddReferralBreadcrumbActive">
            Add Referral
          </span>
        </div>
      </div>

      {/* Card */}
      <div className="AddReferralCard">
        <div className="AddReferralCardHeader">
          <FiUserPlus />
          <span>Add Referral</span>
        </div>

        <div className="AddReferralCardBody">
          {/* Row 1 */}
          <div className="AddReferralFormGrid3">
            <div className="AddReferralFormGroup">
              <label>
                Class <span>*</span>
              </label>
              <select className="AddReferralInput">
                <option>Select</option>
              </select>
            </div>

            <div className="AddReferralFormGroup">
              <label>
                Section <span>*</span>
              </label>
              <select className="AddReferralInput">
                <option>Select</option>
              </select>
            </div>

            <div className="AddReferralFormGroup">
              <label>
                Student <span>*</span>
              </label>
              <select className="AddReferralInput">
                <option>Select</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="AddReferralFormGrid4">
            <div className="AddReferralFormGroup">
              <label>
                Class <span>*</span>
              </label>
              <select className="AddReferralInput">
                <option>Select</option>
              </select>
            </div>

            <div className="AddReferralFormGroup">
              <label>
                Name <span>*</span>
              </label>
              <input
                type="text"
                placeholder="name"
                className="AddReferralInput"
              />
            </div>

            <div className="AddReferralFormGroup">
              <label>
                Email <span>*</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="AddReferralInput"
              />
            </div>

            <div className="AddReferralFormGroup">
              <label>
                Number <span>*</span>
              </label>
              <input
                type="text"
                placeholder="number"
                className="AddReferralInput"
              />
            </div>
          </div>

          {/* Note */}
          <div className="AddReferralFormGroup">
            <label>Note</label>
            <textarea
              rows="5"
              className="AddReferralInput AddReferralTextarea"
            ></textarea>
          </div>
        </div>

        <div className="AddReferralCardFooter">
          <button className="AddReferralSaveBtn">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddReferral;