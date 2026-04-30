import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import LeavesDashboard from "../../Component/LeavesDashboard/LeavesDashboard";
import LeaveTable from "../../Component/LeaveTable/LeaveTable";

const LeaveManagement = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const res = await API.get("/admin/leaves");
      setLeaveData(res.data.data || res.data || []);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div>
      <LeavesDashboard
        leaveData={leaveData}
        loading={loading}
        setLeaveData={setLeaveData}
      />
      <LeaveTable
        leaveData={leaveData}
        setLeaveData={setLeaveData}
        loading={loading}
      />
    </div>
  );
};

export default LeaveManagement;
