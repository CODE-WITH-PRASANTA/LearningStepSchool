import React, { useState } from "react";
import PayrollDashboard from "../../Component/PayrollDashboard/PayrollDashboard";
import PayrollList from "../../Component/PayrollList/PayrollList";

const PayRollManagement = () => {
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // 🔁 reload list
  const reload = () => setRefresh((prev) => !prev);

  // ➕ ADD
  const handleAdd = () => {
    setEditData(null);
    setShowModal(true);
  };

  // ✏️ EDIT
  const handleEdit = (data) => {
    setEditData(data);
    setShowModal(true);
  };

  return (
    <div>
      <PayrollDashboard
        onAddClick={handleAdd}
        showModal={showModal}
        setShowModal={setShowModal}
        editData={editData}
        onSuccess={reload}
      />

      <PayrollList
        refresh={refresh}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default PayRollManagement;