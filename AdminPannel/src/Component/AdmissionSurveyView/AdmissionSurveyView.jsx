import { FiPhone, FiMapPin, FiUser } from "react-icons/fi";

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

export default function AdmissionSurveyView() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-indigo-700">
          Admission Survey Data
        </h1>
        <p className="text-sm text-slate-500">
          View submitted school admission surveys
        </p>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="grid gap-4 sm:hidden">
        {surveyData.map((s) => (
          <div
            key={s.id}
            className="rounded-xl bg-white border border-indigo-100 shadow-sm p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-indigo-600">
                {s.appNo}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium
                ${
                  s.interest === "Confirm"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {s.interest}
              </span>
            </div>

            <h3 className="font-semibold text-slate-800">
              {s.parentName}
            </h3>

            <p className="text-sm flex items-center gap-2 text-slate-600">
              <FiPhone /> {s.mobile} (WhatsApp: {s.whatsapp})
            </p>

            <p className="text-sm flex items-center gap-2 text-slate-600">
              <FiMapPin /> {s.village}
            </p>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><b>Child:</b> {s.children}</p>
              <p><b>Age:</b> {s.age}</p>
              <p><b>Class:</b> {s.className}</p>
              <p><b>Medium:</b> {s.medium}</p>
            </div>

            <div className="text-sm">
              <p><b>Fee Range:</b> {s.fee}</p>
              <p><b>Transport:</b> {s.transport} ({s.distance})</p>
              <p><b>Concern:</b> {s.concern}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block bg-white rounded-2xl border border-indigo-100 shadow-md overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-indigo-50 text-indigo-700">
            <tr>
              <th className="px-4 py-3 text-left">App No</th>
              <th className="px-4 py-3 text-left">Parent</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Village</th>
              <th className="px-4 py-3">Child</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Medium</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Transport</th>
              <th className="px-4 py-3">Interest</th>
              <th className="px-4 py-3">Concern</th>
            </tr>
          </thead>

          <tbody>
            {surveyData.map((s) => (
              <tr
                key={s.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium text-indigo-600">
                  {s.appNo}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-slate-400" />
                    {s.parentName}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {s.mobile}
                  <span className="text-xs text-slate-400 block">
                    WhatsApp: {s.whatsapp}
                  </span>
                </td>
                <td className="px-4 py-3">{s.village}</td>
                <td className="px-4 py-3 text-center">
                  {s.children}
                </td>
                <td className="px-4 py-3">
                  {s.className} ({s.age} yrs)
                </td>
                <td className="px-4 py-3">{s.medium}</td>
                <td className="px-4 py-3">{s.fee}</td>
                <td className="px-4 py-3">
                  {s.transport} ({s.distance})
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      s.interest === "Confirm"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {s.interest}
                  </span>
                </td>
                <td className="px-4 py-3">{s.concern}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
