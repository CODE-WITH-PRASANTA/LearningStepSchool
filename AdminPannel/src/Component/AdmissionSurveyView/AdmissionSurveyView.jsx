import React from "react";

const AdmissionSurveyView = () => {
  const surveyData = [
    {
      id: 1,
      appNo: "APP-1001",
      parentName: "Ramesh Kumar",
      mobile: "9876543210",
      whatsapp: "Yes",
      village: "Nakhara",
      children: 1,
      age: 6,
      className: "UKG",
      medium: "English",
      currentSchool: "ABC Public School",
      fee: "10k-12k",
      transport: "Yes",
      distance: "4-6 km",
      interest: "Confirm",
      concern: "Fee",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        LEARNING STEP INTERNATIONAL SCHOOL – Admission Survey
      </h2>

      {/* Scroll Wrapper */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-[1800px] w-full border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="table-th">SL No</th>
              <th className="table-th">Application No</th>
              <th className="table-th">Parent Name</th>
              <th className="table-th">Mobile No</th>
              <th className="table-th">WhatsApp</th>
              <th className="table-th">Village</th>
              <th className="table-th">No. of Children</th>
              <th className="table-th">Age</th>
              <th className="table-th">Class</th>
              <th className="table-th">Medium</th>
              <th className="table-th">Current School</th>
              <th className="table-th">Annual Fee</th>
              <th className="table-th">Transport</th>
              <th className="table-th">Distance</th>
              <th className="table-th">Admission Interest</th>
              <th className="table-th">Main Concern</th>
            </tr>
          </thead>

          <tbody>
            {surveyData.map((item, index) => (
              <tr
                key={item.id}
                className="odd:bg-gray-50 hover:bg-indigo-50 transition"
              >
                <td className="table-td">{index + 1}</td>
                <td className="table-td">{item.appNo}</td>
                <td className="table-td">{item.parentName}</td>
                <td className="table-td">{item.mobile}</td>
                <td className="table-td">{item.whatsapp}</td>
                <td className="table-td">{item.village}</td>
                <td className="table-td text-center">{item.children}</td>
                <td className="table-td text-center">{item.age}</td>
                <td className="table-td">{item.className}</td>
                <td className="table-td">{item.medium}</td>
                <td className="table-td">{item.currentSchool}</td>
                <td className="table-td">{item.fee}</td>
                <td className="table-td">{item.transport}</td>
                <td className="table-td">{item.distance}</td>
                <td className="table-td font-semibold text-indigo-600">
                  {item.interest}
                </td>
                <td className="table-td">{item.concern}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdmissionSurveyView;
