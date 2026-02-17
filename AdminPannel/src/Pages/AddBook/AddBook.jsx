import React from "react";
import "./AddBook.css";

const AddBook = () => {
  return (
    <div className="page-container">

      {/* 🔴 Add Book Form Box */}
      <div className="form-wrapper">
        <div className="form-header">
          <span className="icon">✏️</span> Add Book
        </div>

        <form className="book-form">

          {/* Row 1 */}
          <div className="form-row">
            <div className="form-group">
              <label>Book Title *</label>
              <input type="text" />
            </div>

            <div className="form-group">
              <label>Book Number *</label>
              <input type="text" />
            </div>

            <div className="form-group">
              <label>ISBN Number *</label>
              <input type="text" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-row">
            <div className="form-group">
              <label>Publisher</label>
              <input type="text" />
            </div>

            <div className="form-group">
              <label>Author</label>
              <input type="text" />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input type="text" />
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-row">
            <div className="form-group">
              <label>Rack Number</label>
              <input type="text" />
            </div>

            <div className="form-group">
              <label>Qty *</label>
              <input type="number" />
            </div>

            <div className="form-group">
              <label>Book Price</label>
              <input type="text" />
            </div>
          </div>

          {/* Row 4 */}
          <div className="form-row">
            <div className="form-group">
              <label>Year of Publication</label>
              <input type="text" />
            </div>

            <div className="form-group">
              <label>Stream</label>
              <input type="text" />
            </div>

            <div className="form-group">
              <label>Categories</label>
              <input type="text" />
            </div>

            <div className="form-group">
              <label>Post Date</label>
              <input
                type="text"
                defaultValue="17-02-2026"
                className="disabled-input"
                disabled
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-row full-width">
            <div className="form-group full">
              <label>Description</label>
              <textarea rows="4"></textarea>
            </div>
          </div>

          {/* Save Button */}
          <div className="save-btn-container">
            <button className="save-btn">Save</button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default AddBook;
