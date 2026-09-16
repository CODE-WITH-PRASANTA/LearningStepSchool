import React, { useCallback, useEffect, useState } from "react";
import API from "../../api/axios";
import WelcomeSection from "../../Component/WelcomeSection/WelcomeSection";
import EarningModeMain from "../../Component/EarningModeMain/EarningModeMain";
import FeeCollection from "../../Component/FeeCollection/FeeCollection";
import StudentBalance from "../../Component/StudentBalance/StudentBalance";
import StaffPayrollMain from "../../Component/StaffPayrollMain/StaffPayrollMain";
import MainCallender from "../../Component/MainCallender/MainCallender";

const MainDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await API.get("/dashboard");

      if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message || "Unable to load dashboard data.");
      }

      setDashboard(response.data.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div>
      {error && (
        <div
          role="alert"
          style={{ margin: "12px 20px 0", color: "#b91c1c", fontWeight: 600 }}
        >
          {error}
        </div>
      )}

      <WelcomeSection
        overview={dashboard?.overview}
        people={dashboard?.people}
        generatedAt={dashboard?.generatedAt}
        onRefresh={loadDashboard}
        isRefreshing={isLoading}
      />
      <EarningModeMain
        charts={dashboard?.charts}
        academicYear={dashboard?.academicYear}
      />
      <FeeCollection charts={dashboard?.charts} />
      <StudentBalance
        charts={dashboard?.charts}
        academicYear={dashboard?.academicYear}
      />
      <StaffPayrollMain
        charts={dashboard?.charts}
        academicYear={dashboard?.academicYear}
      />
      <MainCallender events={dashboard?.calendarEvents} />
    </div>
  );
};

export default MainDashboard;
