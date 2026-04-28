import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./AccordionSection.css";

export default function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="acc">
      
      {/* HEADER */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="acc__header"
      >
        <span className="acc__title">{title}</span>

        <ChevronDown
          className={`acc__icon ${open ? "rotate" : ""}`}
        />
      </button>

      {/* BODY */}
      <div className={`acc__body ${open ? "open" : ""}`}>
        <div className="acc__content">{children}</div>
      </div>

    </div>
  );
}