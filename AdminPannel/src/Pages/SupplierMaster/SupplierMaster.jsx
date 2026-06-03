import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

import "./SupplierMaster.css";

const SupplierMaster = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [supplierData, setSupplierData] = useState([
    {
      id: 1,
      shop: "Demo",
      supplierName: "Chris",
      mobile: "9012708735",
      gst: "",
      aadhaar: "",
      pan: "",
      state: "Uttar Pradesh",
      city: "Agra",
      pincode: "282003",
      address: "",
      remark: "",
    },
    {
      id: 2,
      shop: "Demo",
      supplierName: "Example",
      mobile: "1234567890",
      gst: "359641364",
      aadhaar: "",
      pan: "",
      state: "Delhi",
      city: "Delhi",
      pincode: "110001",
      address: "",
      remark: "",
    },
  ]);

  const [formData, setFormData] = useState({
    shop: "",
    supplierName: "",
    mobile: "",
    gst: "",
    aadhaar: "",
    pan: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    remark: "",
  });

  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSupplier = () => {
    setSupplierData([
      ...supplierData,
      {
        id: supplierData.length + 1,
        ...formData,
      },
    ]);

    setShowAddModal(false);

    setFormData({
      shop: "",
      supplierName: "",
      mobile: "",
      gst: "",
      aadhaar: "",
      pan: "",
      state: "",
      city: "",
      pincode: "",
      address: "",
      remark: "",
    });
  };

  const handleEditClick = (supplier, index) => {
    setEditIndex(index);
    setFormData(supplier);
    setShowEditModal(true);
  };

  const handleUpdateSupplier = () => {
    const updatedData = [...supplierData];

    updatedData[editIndex] = {
      ...formData,
      id: supplierData[editIndex].id,
    };

    setSupplierData(updatedData);
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    setSupplierData(
      supplierData.filter((item) => item.id !== id)
    );
  };

  const renderForm = (isEdit = false) => (
    <>
      <div className="spm_formGrid">
        <div className="spm_formGroup">
          <input
            className="spm_input"
            name="shop"
            placeholder="Select Shop *"
            value={formData.shop}
            onChange={handleChange}
          />
        </div>

        <div className="spm_formGroup">
          <input
            className="spm_input"
            name="supplierName"
            placeholder="Supplier Name *"
            value={formData.supplierName}
            onChange={handleChange}
          />
        </div>

        <div className="spm_formGroup">
          <input
            className="spm_input"
            name="mobile"
            placeholder="Mobile No *"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>

        <div className="spm_formGroup">
          <input
            className="spm_input"
            name="gst"
            placeholder="GST No"
            value={formData.gst}
            onChange={handleChange}
          />
        </div>

        <div className="spm_formGroup">
          <input
            className="spm_input"
            name="aadhaar"
            placeholder="Aadhaar No"
            value={formData.aadhaar}
            onChange={handleChange}
          />
        </div>

        <div className="spm_formGroup">
          <input
            className="spm_input"
            name="pan"
            placeholder="PAN No"
            value={formData.pan}
            onChange={handleChange}
          />
        </div>

        <div className="spm_formGroup">
          <input
            className="spm_input"
            name="state"
            placeholder="Select State *"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        <div className="spm_formGroup">
          <input
            className="spm_input"
            name="city"
            placeholder="Select City *"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div className="spm_formGroup">
          <input
            className="spm_input"
            name="pincode"
            placeholder="Pincode *"
            value={formData.pincode}
            onChange={handleChange}
          />
        </div>

        <div className="spm_formGroup">
          <input
            className="spm_input"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="spm_formGroup spm_textareaWrapper">
          <textarea
            className="spm_textarea"
            name="remark"
            placeholder="Remark"
            value={formData.remark}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="spm_modalFooter">
        <button
          className="spm_cancelButton"
          onClick={() => {
            setShowAddModal(false);
            setShowEditModal(false);
          }}
        >
          Cancel
        </button>

        <button
          className="spm_saveButton"
          onClick={
            isEdit
              ? handleUpdateSupplier
              : handleAddSupplier
          }
        >
          {isEdit ? "Modify" : "Add"}
        </button>
      </div>
    </>
  );

  return (
    <div className="spm_container">
      <div className="spm_header">
        <div className="spm_searchBox">
          <FaSearch className="spm_searchIcon" />
          <input className="spm_searchInput" placeholder="Search..." />
        </div>

        <button
          className="spm_addButton"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus />
        </button>
      </div>

      <div className="spm_tableWrapper">
        <table className="spm_table">
          <thead>
            <tr>
              <th>S.NO.</th>
              <th>SUPPLIER NAME</th>
              <th>MOBILE NO</th>
              <th>CITY</th>
              <th>GST NO</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {supplierData.map((supplier, index) => (
              <tr key={supplier.id} className="spm_tableRow">
                <td>{index + 1}</td>
                <td>{supplier.supplierName}</td>
                <td>{supplier.mobile}</td>
                <td>{supplier.city}</td>
                <td>{supplier.gst || "-"}</td>

                <td className="spm_actionCell">
                  <button
                    className="spm_editButton"
                    onClick={() =>
                      handleEditClick(
                        supplier,
                        index
                      )
                    }
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="spm_deleteButton"
                    onClick={() =>
                      handleDelete(supplier.id)
                    }
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="spm_modalOverlay">
          <div className="spm_modal">
            <div className="spm_modalHeader">
              <h2 className="spm_modalTitle">SUPPLIER MASTER</h2>

              <button
                className="spm_closeButton"
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                <FaTimes />
              </button>
            </div>

            {renderForm(false)}
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="spm_modalOverlay">
          <div className="spm_modal">
            <div className="spm_modalHeader">
              <h2 className="spm_modalTitle">SUPPLIER MASTER</h2>

              <button
                className="spm_closeButton"
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                <FaTimes />
              </button>
            </div>

            {renderForm(true)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierMaster;