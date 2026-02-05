import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";
import dragData from "chartjs-plugin-dragdata";
import { FaEllipsisV } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  dragData
);

const SchoolPerformanceWave = () => {

  const [openMenu, setOpenMenu] = useState(false);

  const data = {
    labels: ["S","M","T","W","T","F","S"],
    datasets: [
      {
        data: [20,60,30,50,42,60,50],
        borderColor: "#2b50ed",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0,0,0,300);
          gradient.addColorStop(0,"rgba(43,80,237,0.45)");
          gradient.addColorStop(1,"rgba(43,80,237,0.05)");
          return gradient;
        },
        fill: true,
        tension: 0.45,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#2b50ed",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        borderWidth: 3
      }
    ]
  };

  const options = {
    responsive: true,
    animation:{ duration:1500 },
    plugins:{
      legend:{ display:false },
      dragData:{ showTooltip:true }
    },
    scales:{
      x:{ grid:{ display:false }},
      y:{
        min:10,
        max:70,
        ticks:{ stepSize:10 },
        grid:{ color:"#eee" }
      }
    }
  };

  return (
    <div className="dashboard-card">

      <div className="dashboard-card-header">

        <h3>School Performance</h3>

        <div className="three-dot-menu">
          <FaEllipsisV onClick={() => setOpenMenu(!openMenu)} />

          {openMenu && (
            <div className="three-dot-dropdown fancy-dropdown">
              <div>View Detail</div>
              <div>Edit</div>
              <div>Delete</div>
            </div>
          )}
        </div>

      </div>

      <Line data={data} options={options} />

    </div>
  );
};

export default SchoolPerformanceWave;
