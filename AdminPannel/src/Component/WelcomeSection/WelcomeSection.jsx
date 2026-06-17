import React from "react";
import "./WelcomeSection.css";

import {
  FaSyncAlt,
  FaUserGraduate,
  FaClipboardCheck,
  FaWallet,
  FaMoneyBillWave,
  FaChalkboardTeacher,
  FaUserCheck,
  FaMale,
  FaFemale,
  FaBirthdayCake,
  FaHeart,
  FaPlaneDeparture,
  FaDownload,
} from "react-icons/fa";

const WelcomeSection = () => {
  const cards = [
    {
      icon: <FaUserGraduate />,
      value: "5",
      title: "Student",
      color: "red",
    },
    {
      icon: <FaClipboardCheck />,
      value: "0",
      title: "Student Presence",
      color: "purple",
      badge: "Today",
    },
    {
      icon: <FaWallet />,
      value: "1106546",
      title: "Monthly Fees",
      color: "blue",
    },
    {
      icon: <FaMoneyBillWave />,
      value: "0 / 50000",
      title: "Income / Expense",
      color: "cyan",
      badge: "Monthly",
    },
    {
      icon: <FaChalkboardTeacher />,
      value: "68",
      title: "Staff",
      color: "teal",
    },
    {
      icon: <FaUserCheck />,
      value: "0",
      title: "Staff Presence",
      color: "green",
      badge: "Today",
    },
    {
      icon: <FaMale />,
      value: "5",
      title: "Total Male",
      color: "orange",
    },
    {
      icon: <FaFemale />,
      value: "0",
      title: "Total Female",
      color: "pink",
    },
  ];

  return (
    <section className="WelcomeSection">

  <div className="WelcomeSection_TopRow">

    {/* Welcome Card */}

    <div className="WelcomeSection_WelcomeCard">

      <div className="WelcomeSection_Content">
        <h1>Welcome Back!</h1>

        <p>
          Manage your dashboard and settings from here.
        </p>

        <button className="WelcomeSection_RefreshBtn">
          <FaSyncAlt />
          Refresh Dashboard
        </button>

        <span>Updated at 0 mins ago</span>
      </div>

      <div className="WelcomeSection_Illustration">
        <img
          src="https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
          alt=""
        />
      </div>

    </div>

    {/* 6 Cards */}

    <div className="WelcomeSection_CardsGrid">

      {cards.slice(0, 6).map((card, index) => (
        <div className="WelcomeSection_StatCard" key={index}>

          {card.badge && (
            <span className="WelcomeSection_Badge">
              {card.badge}
            </span>
          )}

          <div
            className={`WelcomeSection_Icon WelcomeSection_${card.color}`}
          >
            {card.icon}
          </div>

          <div className="WelcomeSection_Info">
            <h3>{card.value}</h3>
            <p>{card.title}</p>
          </div>

          <div className="WelcomeSection_Circle" />

        </div>
      ))}

    </div>

  </div>

  <div className="WelcomeSection_BottomRow">

    {/* Birthday */}

    <div className="WelcomeSection_BirthdayCard">

      <div className="WelcomeSection_BirthdayHeader">

        <div className="WelcomeSection_Tabs">
          <span><FaBirthdayCake /> Birthday</span>
          <span><FaHeart /> Anniversary</span>
          <span><FaPlaneDeparture /> Leave</span>
        </div>

        <button>
          <FaDownload />
          Download
        </button>

      </div>

      <div className="WelcomeSection_BirthdayBody">

        <div className="WelcomeSection_PersonCard">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt=""
          />

          <div>
            <h4>KRIT GOEL</h4>
            <p>21 Jun</p>
          </div>

          <button>Wish</button>
        </div>

        <div className="WelcomeSection_PersonCard">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt=""
          />

          <div>
            <h4>Eunice</h4>
            <p>17 Jun</p>
          </div>

          <button>Wish</button>
        </div>

      </div>

    </div>

    {/* Male */}

    <div className="WelcomeSection_StatCard">
      <div className="WelcomeSection_Icon WelcomeSection_orange">
        <FaMale />
      </div>

      <div className="WelcomeSection_Info">
        <h3>5</h3>
        <p>Total Male</p>
      </div>

      <div className="WelcomeSection_Circle" />
    </div>

    {/* Female */}

    <div className="WelcomeSection_StatCard">
      <div className="WelcomeSection_Icon WelcomeSection_pink">
        <FaFemale />
      </div>

      <div className="WelcomeSection_Info">
        <h3>0</h3>
        <p>Total Female</p>
      </div>

      <div className="WelcomeSection_Circle" />
    </div>

  </div>

</section>
  );
};

export default WelcomeSection;