import React, { useState } from "react";
import GatePassForm from "../../Component/GetPassPage/GatePassForm";
import GatePassList from "../../Component/GetPassPage/GatePassList";
import GatePassPrintModal from "../../Component/GetPassPage/GatePassPrintModal";
import "./GatePass.css";

const GatePass = () => {
  const [data, setData] = useState([]);
  const [printItem, setPrintItem] = useState(null);

  const addPass = (pass) => {
    setData([{ ...pass, id: Date.now() }, ...data]);
  };

  const deletePass = (id) => {
    setData(data.filter((d) => d.id !== id));
  };

  return (
    <div className="gatepass-wrapper">
      <div className="gatepass-container">
        <GatePassForm onAdd={addPass} />

        <GatePassList
          data={data}
          onDelete={deletePass}
          onPrint={setPrintItem}
        />
      </div>

      {printItem && (
        <GatePassPrintModal
          item={printItem}
          onClose={() => setPrintItem(null)}
        />
      )}
    </div>
  );
};

export default GatePass;
