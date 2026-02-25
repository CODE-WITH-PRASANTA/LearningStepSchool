import React from 'react';
import './GenerateQuestion.css';

const GenerateQuestion = () => {
  return (
    <div className="gq-container">
      {/* Header Section */}
      <div className="gq-header">
        <div className="gq-header-left">
          <i className="far fa-file-alt"></i> 
          <h1>Generate Question</h1>
        </div>
        <div className="gq-header-right">
          <span className="breadcrumb-link"><i className="far fa-edit"></i> Question</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-active">Add Update Question</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="gq-card">
        <div className="gq-card-header">
          <i className="far fa-edit"></i> Add Update Question
        </div>
        
        <div className="gq-card-body">
          <div className="gq-form-grid">
            
            <div className="gq-form-group">
              <label>Title <span className="required">*</span></label>
              <input type="text" placeholder="" />
            </div>

            <div className="gq-form-group">
              <label>Class <span className="required">*</span></label>
              <select defaultValue="">
                <option value="" disabled>Select</option>
                <option value="10">Class 10</option>
              </select>
            </div>

            <div className="gq-form-group">
              <label>Subject <span className="required">*</span></label>
              <select defaultValue="">
                <option value="" disabled>Select</option>
                <option value="math">Mathematics</option>
              </select>
            </div>

            <div className="gq-form-group">
              <label>Lesson <span className="required">*</span></label>
              <select defaultValue="">
                <option value="" disabled></option>
                <option value="1">Lesson 1</option>
              </select>
            </div>

            <div className="gq-form-group">
              <label>Session</label>
              <select defaultValue="2025-26">
                <option value="2025-26">2025-26</option>
                <option value="2024-25">2024-25</option>
              </select>
            </div>

            <div className="gq-form-group">
              <label>Marks <span className="required">*</span></label>
              <input type="number" placeholder="0" className="bg-input" />
            </div>

            <div className="gq-form-group">
              <label>Time <span className="required">*</span></label>
              <div className="time-input-wrapper">
                <input type="text" />
                <div className="time-icon">
                  <i className="far fa-clock"></i>
                </div>
              </div>
            </div>

            <div className="gq-form-group">
              <label>Note</label>
              <textarea rows="1"></textarea>
            </div>

          </div>

          <div className="gq-footer">
            <button className="btn-set-paper">Set Question Paper</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateQuestion;