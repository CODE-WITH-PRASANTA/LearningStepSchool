import React from "react";
import "./AppHeader.css";
import { FiSearch, FiBell, FiSun, FiMenu } from "react-icons/fi";
import logo from "../../Assets/Learning Step Logo.png";

const AppHeader = ({ onMenuClick }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <FiMenu />
        </button>

        <img src={logo} alt="Admin Logo" className="logo" />
      </div>

      <div className="header-search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      <div className="header-right">
        <button className="icon-btn">
          <FiSun />
        </button>

        <button className="icon-btn flag">🇺🇸</button>

        <button className="icon-btn notification">
          <FiBell />
          <span className="dot"></span>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
