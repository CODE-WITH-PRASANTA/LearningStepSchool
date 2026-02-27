import { useState } from "react";
import { ChevronDown } from "lucide-react";

const AccordionSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-xl bg-[#F8F5EC ] shadow-sm overflow-hidden">
      {/* HEADER */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-100 hover:bg-[#E0E7FF] transition"
      >
        <span className="text-lg font-semibold text-gray-600">
          {title}
        </span>

        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* BODY */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-6 border-t">{children}</div>
      </div>
    </div>
  );
};

export default AccordionSection;