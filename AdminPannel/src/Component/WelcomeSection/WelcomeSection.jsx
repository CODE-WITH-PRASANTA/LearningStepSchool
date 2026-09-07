import React, { useMemo, useState } from "react";
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

const numberFormatter = new Intl.NumberFormat("en-IN");
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const formatDate = (value) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const WelcomeSection = ({
  overview = {},
  people = {},
  generatedAt,
  onRefresh,
  isRefreshing = false,
}) => {
  const [activePeopleTab, setActivePeopleTab] = useState("birthdays");

  const cards = [
    {
      icon: <FaUserGraduate />,
      value: numberFormatter.format(asNumber(overview.students)),
      title: "Student",
      color: "red",
    },
    {
      icon: <FaClipboardCheck />,
      value: numberFormatter.format(asNumber(overview.studentPresent)),
      title: "Student Presence",
      color: "purple",
      badge: "Today",
    },
    {
      icon: <FaWallet />,
      value: currencyFormatter.format(asNumber(overview.monthlyFees)),
      title: "Monthly Fees",
      color: "blue",
    },
    {
      icon: <FaMoneyBillWave />,
      value: `${currencyFormatter.format(asNumber(overview.monthlyIncome))} / ${currencyFormatter.format(asNumber(overview.monthlyExpense))}`,
      title: "Income / Expense",
      color: "cyan",
      badge: "Monthly",
    },
    {
      icon: <FaChalkboardTeacher />,
      value: numberFormatter.format(asNumber(overview.staff)),
      title: "Staff",
      color: "teal",
    },
    {
      icon: <FaUserCheck />,
      value: numberFormatter.format(asNumber(overview.staffPresent)),
      title: "Staff Presence",
      color: "green",
      badge: "Today",
    },
  ];

  const peopleTabs = useMemo(
    () => [
      { id: "birthdays", label: "Birthday", icon: <FaBirthdayCake />, items: people.birthdays || [] },
      {
        id: "anniversaries",
        label: "Anniversary",
        icon: <FaHeart />,
        items: people.anniversaries || [],
      },
      { id: "leaves", label: "Leave", icon: <FaPlaneDeparture />, items: people.leaves || [] },
    ],
    [people]
  );

  const selectedPeopleTab =
    peopleTabs.find((tab) => tab.id === activePeopleTab) || peopleTabs[0];
  const selectedPeople = selectedPeopleTab.items;

  const handleDownload = () => {
    if (!selectedPeople.length) return;

    const csv = [
      "Name,Date",
      ...selectedPeople.map((person) =>
        `"${String(person.name || "").replaceAll('"', '""')}","${formatDate(person.date)}"`
      ),
    ].join("\n");
    const downloadUrl = URL.createObjectURL(
      new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" })
    );
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = `${selectedPeopleTab.id}.csv`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const updatedAt = generatedAt
    ? `Updated ${new Date(generatedAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : "Loading dashboard data...";

  return (
    <section className="WelcomeSection">
      <div className="WelcomeSection_TopRow">
        <div className="WelcomeSection_WelcomeCard">
          <div className="WelcomeSection_Content">
            <h1>Welcome Back!</h1>
            <p>Manage your dashboard and settings from here.</p>
            <button
              className="WelcomeSection_RefreshBtn"
              onClick={onRefresh}
              type="button"
              disabled={isRefreshing}
            >
              <FaSyncAlt />
              {isRefreshing ? "Refreshing..." : "Refresh Dashboard"}
            </button>
            <span>{updatedAt}</span>
          </div>

          <div className="WelcomeSection_Illustration">
            <img
              src="https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
              alt=""
            />
          </div>
        </div>

        <div className="WelcomeSection_CardsGrid">
          {cards.map((card) => (
            <div className="WelcomeSection_StatCard" key={card.title}>
              {card.badge && <span className="WelcomeSection_Badge">{card.badge}</span>}

              <div className={`WelcomeSection_Icon WelcomeSection_${card.color}`}>
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
        <div className="WelcomeSection_BirthdayCard">
          <div className="WelcomeSection_BirthdayHeader">
            <div className="WelcomeSection_Tabs">
              {peopleTabs.map((tab) => (
                <button
                  aria-pressed={activePeopleTab === tab.id}
                  key={tab.id}
                  onClick={() => setActivePeopleTab(tab.id)}
                  type="button"
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <button disabled={!selectedPeople.length} onClick={handleDownload} type="button">
              <FaDownload />
              Download
            </button>
          </div>

          <div className="WelcomeSection_BirthdayBody">
            {selectedPeople.length ? (
              selectedPeople.map((person) => (
                <div className="WelcomeSection_PersonCard" key={person.id}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt=""
                  />
                  <div>
                    <h4>{person.name}</h4>
                    <p>{formatDate(person.date)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="WelcomeSection_PersonCard">
                <div>
                  <h4>No upcoming {selectedPeopleTab.label.toLowerCase()}s</h4>
                  <p>There are no records to show.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="WelcomeSection_StatCard">
          <div className="WelcomeSection_Icon WelcomeSection_orange">
            <FaMale />
          </div>
          <div className="WelcomeSection_Info">
            <h3>{numberFormatter.format(asNumber(overview.maleStudents))}</h3>
            <p>Total Male</p>
          </div>
          <div className="WelcomeSection_Circle" />
        </div>

        <div className="WelcomeSection_StatCard">
          <div className="WelcomeSection_Icon WelcomeSection_pink">
            <FaFemale />
          </div>
          <div className="WelcomeSection_Info">
            <h3>{numberFormatter.format(asNumber(overview.femaleStudents))}</h3>
            <p>Total Female</p>
          </div>
          <div className="WelcomeSection_Circle" />
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
