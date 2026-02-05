import { useState } from "react";

/* ================= SAMPLE DATA ================= */
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
    starred: false,
  },
];

export default function AdmissionSurveyView() {
  const [data, setData] = useState(surveyData);
  const [search, setSearch] = useState("");

  /* ================= SEARCH ================= */
  const filteredData = data.filter((item) =>
    `${item.appNo} ${item.parentName} ${item.mobile} ${item.village}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ================= STAR ================= */
  const toggleStar = (id) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, starred: !row.starred } : row
      )
    );
  };

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-[80vh] overflow-auto">
      {/* ================= TOOLBAR ================= */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search App No, Parent, Mobile, Village..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[320px] px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* ================= TABLE ================= */}
      <table className="w-[1500px] bg-white border border-slate-200 rounded-lg overflow-hidden">
        <thead className="sticky top-0 z-10 bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-600">
              ★
            </th>
            {[
              "App No",
              "Parent Name",
              "Mobile",
              "WhatsApp",
              "Village",
              "Children",
              "Age",
              "Class",
              "Medium",
              "Current School",
              "Fee",
              "Transport",
              "Distance",
              "Interest",
              "Concern",
            ].map((head) => (
              <th
                key={head}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td
                colSpan={16}
                className="text-center py-10 text-slate-500 text-sm"
              >
                No records found
              </td>
            </tr>
          ) : (
            filteredData.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-slate-200 hover:bg-indigo-50 transition ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                {/* STAR */}
                <td className="text-center">
                  <button
                    onClick={() => toggleStar(item.id)}
                    className={`text-xl transition ${
                      item.starred ? "text-yellow-400" : "text-slate-300"
                    } hover:scale-110`}
                  >
                    ★
                  </button>
                </td>

                <td className="px-4 py-3 font-mono text-sm">{item.appNo}</td>
                <td className="px-4 py-3 font-semibold">
                  {item.parentName}
                </td>
                <td className="px-4 py-3 font-mono">{item.mobile}</td>

                <td className="px-4 py-3">
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

                <td className="px-4 py-3">{item.village}</td>
                <td className="px-4 py-3 text-center">{item.children}</td>
                <td className="px-4 py-3 text-center">{item.age}</td>
                <td className="px-4 py-3 text-center">{item.className}</td>
                <td className="px-4 py-3">{item.medium}</td>

                <td className="px-4 py-3 max-w-[220px] truncate">
                  {item.currentSchool}
                </td>

                <td className="px-4 py-3">{item.fee}</td>
                <td className="px-4 py-3">{item.transport}</td>
                <td className="px-4 py-3">{item.distance}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.interest === "Confirm"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {item.interest}
                  </span>
                </td>

                <td className="px-4 py-3">{item.concern}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
