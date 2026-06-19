import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaTrash,
  FaHome,
} from "react-icons/fa";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";

import "./Freehead.css";

const feeGroups = [
  "OFTHD",
  "Science",
  "Commerce",
  "Arts",
  "Hostel",
  "Transport",
  "Sports",
  "Library",
  "Lab",
  "Exam",
  "Activity",
  "Other",
];

const installmentTypes = [
  "Monthly",
  "Quarterly",
  "Half Yearly",
  "Annually",
  "Weekly",
  "Custom",
];

const dummyData = [
  {
    id: 1,
    feeHead: "Opening Balance",
    priority: 1,
    applyFor: "Old",
    gender: "Both",
    installment: "Annually",
    feeType: "dayscholar",
  },
  {
    id: 2,
    feeHead: "Fine",
    priority: 2,
    applyFor: "Both",
    gender: "Both",
    installment: "Monthly",
    feeType: "dayscholar",
  },
  {
    id: 3,
    feeHead: "Transport",
    priority: 3,
    applyFor: "Both",
    gender: "Both",
    installment: "Monthly",
    feeType: "dayscholar",
  },
  {
    id: 4,
    feeHead: "Hostel",
    priority: 4,
    applyFor: "Both",
    gender: "Both",
    installment: "Monthly",
    feeType: "dayscholar",
  },
  {
    id: 5,
    feeHead: "Other",
    priority: 5,
    applyFor: "Both",
    gender: "Both",
    installment: "Monthly",
    feeType: "dayscholar",
  },
  {
    id: 6,
    feeHead: "Extra Concession",
    priority: 6,
    applyFor: "Old",
    gender: "Both",
    installment: "Annually",
    feeType: "dayscholar",
  },
  {
    id: 7,
    feeHead: "Admission Fee",
    priority: 7,
    applyFor: "New",
    gender: "Both",
    installment: "Monthly",
    feeType: "1,2",
  },
  {
    id: 8,
    feeHead: "Library Fee",
    priority: 8,
    applyFor: "Both",
    gender: "Both",
    installment: "Monthly",
    feeType: "dayscholar",
  },
  {
    id: 9,
    feeHead: "Exam Fee",
    priority: 9,
    applyFor: "New",
    gender: "Male",
    installment: "Monthly",
    feeType: "dayscholar",
  },
];

const Freehead = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [search, setSearch] = useState("");

  const filteredData = dummyData.filter((item) =>
    item.feeHead.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentItems = filteredData.slice(
    indexOfFirst,
    indexOfLast
  );

  return (
    <div className="Freehead">

      <div className="Freehead-header">
        <h2>Fee Head</h2>

        <div className="Freehead-breadcrumb">
          <FaHome />
          <span>Fees</span>
          <span>Fee Head</span>
        </div>
      </div>

      <div className="Freehead-toolbar">
        <div className="Freehead-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <button
          className="Freehead-addBtn"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus />
        </button>
      </div>

      <div className="Freehead-tableWrapper">
        <table className="Freehead-table">
          <thead>
            <tr>
              <th>S.NO.</th>
              <th>FEE HEAD</th>
              <th>PRIORITY</th>
              <th>APPLY FOR</th>
              <th>GENDER</th>
              <th>INSTALLMENT</th>
              <th>FEE TYPE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((row) => (
              <tr
                key={row.id}
                onClick={() => {
                  setSelectedRow(row);
                  setShowEditModal(true);
                }}
              >
                <td>{row.id}</td>
                <td>{row.feeHead}</td>
                <td>{row.priority}</td>
                <td>{row.applyFor}</td>
                <td>{row.gender}</td>
                <td>{row.installment}</td>
                <td>{row.feeType}</td>
                <td>
                  <FaTrash className="deleteIcon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="Freehead-pagination">

        <div className="Freehead-itemsPerPage">
          <span>Items per page:</span>

          <select
            value={itemsPerPage}
            onChange={(e) =>
              setItemsPerPage(Number(e.target.value))
            }
          >
            <option>5</option>
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>

        <div className="Freehead-pageInfo">
          {indexOfFirst + 1} -
          {Math.min(indexOfLast, filteredData.length)}
          of {filteredData.length}
        </div>

        <button
          onClick={() =>
            setCurrentPage((p) =>
              Math.max(1, p - 1)
            )
          }
        >
          <MdKeyboardArrowLeft />
        </button>

        <button
          onClick={() =>
            setCurrentPage((p) =>
              Math.min(totalPages, p + 1)
            )
          }
        >
          <MdKeyboardArrowRight />
        </button>
      </div>

      {showAddModal && (
        <FeeModal
          title="FEE HEAD"
          buttonText="Add"
          close={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && (
        <FeeModal
          title="FEE HEAD"
          buttonText="Modify"
          editData={selectedRow}
          close={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

const FeeModal = ({
  title,
  buttonText,
  close,
  editData,
}) => {
  return (
    <div className="Freehead-modalOverlay">
      <div className="Freehead-modal">

        <div className="Freehead-modalHeader">
          <h2>{title}</h2>
          <button onClick={close}>✕</button>
        </div>

        <div className="Freehead-form">

          <select>
            {feeGroups.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select>
            {installmentTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <input
            placeholder="Fee Head Name"
            defaultValue={editData?.feeHead}
          />

          <input
            placeholder="Fee Head Short Name"
            defaultValue="OB"
          />

          <select>
            <option>Day Scholar</option>
            <option>Hosteller</option>
          </select>

          <div className="Freehead-radioGroup">
            <h4>Head Type</h4>

            <label>
              <input type="radio" name="head" />
              Both
            </label>

            <label>
              <input type="radio" name="head" />
              New
            </label>

            <label>
              <input type="radio" name="head" />
              Old
            </label>
          </div>

          <div className="Freehead-radioGroup">
            <h4>Gender Type</h4>

            <label>
              <input type="radio" name="gender" />
              Both
            </label>

            <label>
              <input type="radio" name="gender" />
              Male
            </label>

            <label>
              <input type="radio" name="gender" />
              Female
            </label>
          </div>

          <label className="Freehead-checkbox">
            <input type="checkbox" />
            Is Board Fee
          </label>

          {buttonText === "Modify" && (
            <>
              <div className="Freehead-radioGroup">
                <h4>Refundable</h4>

                <label>
                  <input type="radio" />
                  Yes
                </label>

                <label>
                  <input type="radio" />
                  No
                </label>
              </div>

              <input
                placeholder="Priority Number"
                defaultValue={
                  editData?.priority || 1
                }
              />
            </>
          )}
        </div>

        <div className="Freehead-modalFooter">
          <button
            className="cancelBtn"
            onClick={close}
          >
            Cancel
          </button>

          <button className="saveBtn">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Freehead;