import React from 'react';
import { FiHome, FiChevronRight } from 'react-icons/fi';
import { IoSettingsOutline } from 'react-icons/io5';

const MonthlyAttendance = () => {
  // Mock data representing the days based on the images
  const days = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    // Matching status logic from Screenshot 2026-06-29 16:01:11
    if (dayNum === 17) return { day: dayNum, status: 'absent' };
    if (dayNum === 18 || dayNum === 20) return { day: dayNum, status: 'present' };
    if (dayNum === 19) return { day: dayNum, status: 'late' };
    return { day: dayNum, status: 'default' };
  });

  // Dynamic styling for the square date boxes based on reference images
  const getBoxStyles = (status) => {
    switch (status) {
      case 'present':
        return 'bg-[#edf7ed] text-[#2e7d32] border-[#c8e6c9] font-bold';
      case 'absent':
        return 'bg-[#fdeded] text-[#d32f2f] border-[#ffcdd2] font-bold';
      case 'late':
        return 'bg-[#fff4e5] text-[#ed6c02] border-[#ffe0b2] font-bold';
      default:
        return 'bg-[#f8f9fa] text-[#b0b0b0] border-[#f1f1f1] font-bold';
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f6] p-6 font-sans relative text-[#333333]">
      
      {/* Floating Settings Gear Icon */}
      <div className="absolute right-0 top-40 bg-[#6571ff] text-white p-2 rounded-l-md shadow-md cursor-pointer hover:bg-[#525fe6] transition-colors">
        <IoSettingsOutline size={20} className="animate-spin-slow" />
      </div>

      {/* Header & Breadcrumbs Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h1 className="text-xl font-bold text-[#364152]">Monthly Attendance</h1>
        <div className="flex items-center gap-1 text-xs text-[#616161]">
          <FiHome className="text-[#6571ff] cursor-pointer" size={14} />
          <FiChevronRight className="text-gray-400" />
          <span className="hover:underline cursor-pointer">Attendance</span>
          <FiChevronRight className="text-gray-400" />
          <span className="text-gray-400 font-medium">Monthly Attendance</span>
        </div>
      </div>

      {/* Top Statistical Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* Total Present */}
        <div className="bg-[#4caf50] text-white rounded-xl p-5 text-center shadow-sm">
          <p className="text-sm font-semibold opacity-90 mb-2">Total Present</p>
          <p className="text-4xl font-extrabold">15</p>
        </div>
        {/* Total Absent */}
        <div className="bg-[#f44336] text-white rounded-xl p-5 text-center shadow-sm">
          <p className="text-sm font-semibold opacity-90 mb-2">Total Absent</p>
          <p className="text-4xl font-extrabold">2</p>
        </div>
        {/* Late Arrivals */}
        <div className="bg-[#ff9800] text-white rounded-xl p-5 text-center shadow-sm">
          <p className="text-sm font-semibold opacity-90 mb-2">Late Arrivals</p>
          <p className="text-4xl font-extrabold">3</p>
        </div>
        {/* Half Days */}
        <div className="bg-[#2196f3] text-white rounded-xl p-5 text-center shadow-sm">
          <p className="text-sm font-semibold opacity-90 mb-2">Half Days</p>
          <p className="text-4xl font-extrabold">0</p>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e3e8be]/0">
        <h2 className="text-xl font-bold text-[#1e293b] mb-6">January 2026</h2>
        
        {/* Date Box Layout Grid: 7 explicit columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 mb-8">
          {days.map((item) => (
            <div
              key={item.day}
              className={`aspect-square flex items-center justify-center text-lg rounded-xl border transition-all duration-200 ${getBoxStyles(item.status)}`}
            >
              {item.day}
            </div>
          ))}
        </div>

        {/* Legend / Status Indicators Footnote */}
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100 text-sm font-medium text-[#4a5568]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#4caf50]" />
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#f44336]" />
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff9800]" />
            <span>Late</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2196f3]" />
            <span>Half Day</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MonthlyAttendance;