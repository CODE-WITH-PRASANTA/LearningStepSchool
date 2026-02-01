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
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 min-h-screen">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
        LEARNING STEP INTERNATIONAL SCHOOL – Admission Survey
      </h2>

      {/* Scroll Wrapper */}
      <div className="relative overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-[1900px] w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <tr>
              {[
                "SL No",
                "Application No",
                "Parent Name",
                "Mobile No",
                "WhatsApp",
                "Village",
                "Children",
                "Age",
                "Class",
                "Medium",
                "Current School",
                "Annual Fee",
                "Transport",
                "Distance",
                "Interest",
                "Concern",
              ].map((head, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-sm font-semibold text-left whitespace-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {surveyData.map((item, index) => (
              <tr
                key={item.id}
                className="odd:bg-gray-50 even:bg-white hover:bg-indigo-50 transition-all"
              >
                <td className="table-td">{index + 1}</td>
                <td className="table-td font-medium text-indigo-600">
                  {item.appNo}
                </td>
                <td className="table-td">{item.parentName}</td>
                <td className="table-td">{item.mobile}</td>

                {/* WhatsApp Badge */}
                <td className="table-td">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.whatsapp === "Yes"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.whatsapp}
                  </span>
                </td>

                <td className="table-td">{item.village}</td>
                <td className="table-td text-center">{item.children}</td>
                <td className="table-td text-center">{item.age}</td>

                <td className="table-td font-semibold text-purple-600">
                  {item.className}
                </td>

                <td className="table-td">{item.medium}</td>
                <td className="table-td">{item.currentSchool}</td>
                <td className="table-td font-medium text-emerald-600">
                  {item.fee}
                </td>

                {/* Transport Badge */}
                <td className="table-td">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.transport === "Yes"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.transport}
                  </span>
                </td>

                <td className="table-td">{item.distance}</td>

                {/* Interest */}
                <td className="table-td">
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs">
                    {item.interest}
                  </span>
                </td>

                {/* Concern */}
                <td className="table-td text-rose-600 font-medium">
                  {item.concern}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scroll Hint */}
      <p className="text-sm text-gray-500 mt-3 text-right">
        ⟶ Scroll right to view more details
      </p>
    </div>
  );
};

export default AdmissionSurveyView;
