const Student = require("../models/sudentAdmission.model");
const User = require("../models/techerModel/createteacher.model");
const StudentAttendance = require("../models/Attendance.model");
const TeacherAttendance = require("../models/teacherAttendance.model");
const AdmissionFee = require("../models/admissionfee.model");
const FeeEntry = require("../models/Fee/feeEntry.model");
const Expense = require("../models/expense.model");
const OtherIncome = require("../models/otherIncome.model");
const Payroll = require("../models/payroll.model");
const Event = require("../models/event.model");
const Holiday = require("../models/holiday.model");
const StudentLeave = require("../models/StudentLeave.model");
const Leave = require("../models/techerModel/teacherLeve.model");
const StaffVisitMeeting = require("../models/staffVisitMeeting.model");

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const getLocalDateKey = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getStartOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getStartOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const getAcademicYear = (date) => {
  const startYear = date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1;
  return `${startYear}-${String(startYear + 1).slice(-2)}`;
};

const getFinancialYearStart = (date) =>
  new Date(date.getFullYear() - (date.getMonth() < 3 ? 1 : 0), 3, 1);

const getFinancialYearMonths = (date) => {
  const start = getFinancialYearStart(date);

  return Array.from({ length: 12 }, (_, index) => {
    const monthStart = new Date(start.getFullYear(), start.getMonth() + index, 1);
    const monthEnd = new Date(start.getFullYear(), start.getMonth() + index + 1, 1);

    return {
      label: MONTH_LABELS[monthStart.getMonth()],
      start: monthStart,
      end: monthEnd,
    };
  });
};

const sumBy = (items, getValue) =>
  items.reduce((total, item) => total + asNumber(getValue(item)), 0);

const sumInRange = (items, getDate, getValue, start, end) =>
  sumBy(items, (item) => {
    const date = new Date(getDate(item));
    return date >= start && date < end ? getValue(item) : 0;
  });

const countByClass = (items, getClass, getValue = () => 1) => {
  const values = new Map();

  items.forEach((item) => {
    const className = String(getClass(item) || "Unassigned").trim() || "Unassigned";
    values.set(className, (values.get(className) || 0) + asNumber(getValue(item)));
  });

  return [...values.entries()]
    .sort(([first], [second]) => first.localeCompare(second, undefined, { numeric: true }))
    .map(([label, value]) => ({ label, value }));
};

const normalizePaymentMode = (mode) => {
  const value = String(mode || "Cash").trim().toLowerCase();

  if (["upi", "online", "bank", "bank transfer", "dd"].includes(value)) return "Online";
  if (value === "cheque") return "Cheque";
  if (value === "card") return "Card";
  return "Cash";
};

const getUpcomingOccurrence = (value, now) => {
  const originalDate = new Date(value);

  if (Number.isNaN(originalDate.getTime())) return null;

  const today = getStartOfDay(now);
  let occurrence = new Date(now.getFullYear(), originalDate.getMonth(), originalDate.getDate());

  if (occurrence < today) {
    occurrence = new Date(now.getFullYear() + 1, originalDate.getMonth(), originalDate.getDate());
  }

  return occurrence;
};

const getUpcomingDates = (students, field, now, label) =>
  students
    .map((student) => {
      const occurrence = getUpcomingOccurrence(student[field], now);
      if (!occurrence) return null;

      return {
        id: `${label}-${student._id}`,
        name: `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student",
        date: occurrence.toISOString(),
      };
    })
    .filter(Boolean)
    .sort((first, second) => new Date(first.date) - new Date(second.date))
    .slice(0, 4);

const buildCalendarEvents = ({ events, holidays, visits, studentLeaves, teacherLeaves }) => {
  const calendarEvents = [
    ...events.map((event) => ({
      id: `event-${event._id}`,
      title: event.title,
      date: event.date,
      color: "#1e3a8a",
    })),
    ...holidays.map((holiday) => ({
      id: `holiday-${holiday._id}`,
      title: holiday.name,
      date: holiday.date,
      color: "#c13aa8",
    })),
    ...visits.map((visit) => ({
      id: `visit-${visit._id}`,
      title: `${visit.employeeName}: ${visit.schoolName}`,
      date: visit.startDate,
      endDate: visit.endDate,
      color: "#111827",
    })),
    ...studentLeaves.map((leave) => ({
      id: `student-leave-${leave._id}`,
      title: `Student leave: ${leave.student?.firstName || "Student"}`,
      date: leave.leaveFrom,
      endDate: leave.leaveTo,
      color: "#ea580c",
    })),
    ...teacherLeaves.map((leave) => ({
      id: `staff-leave-${leave._id}`,
      title: `Staff leave: ${leave.teacher?.name || "Staff"}`,
      date: leave.fromDate,
      endDate: leave.toDate,
      color: "#0f766e",
    })),
  ];

  return calendarEvents
    .filter((event) => event.date && !Number.isNaN(new Date(event.date).getTime()))
    .sort((first, second) => new Date(first.date) - new Date(second.date));
};

exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const today = getStartOfDay(now);
    const tomorrow = new Date(today.getTime() + DAY_IN_MS);
    const monthStart = getStartOfMonth(now);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const todayKey = getLocalDateKey(now);
    const financialYearMonths = getFinancialYearMonths(now);

    const [
      students,
      staffCount,
      studentAttendance,
      staffAttendance,
      admissionFees,
      feeEntries,
      expenses,
      otherIncome,
      payrolls,
      events,
      holidays,
      studentLeaves,
      teacherLeaves,
      visits,
    ] = await Promise.all([
      Student.find().select("firstName lastName gender class dob marriageAnniversary").lean(),
      User.countDocuments({ role: "teacher" }),
      StudentAttendance.find({ date: todayKey }).select("students").lean(),
      TeacherAttendance.find({ date: { $gte: today, $lt: tomorrow } })
        .select("status")
        .lean(),
      AdmissionFee.find()
        .select("class date totalAmount paid due discount finalAmount paymentMethod")
        .lean(),
      FeeEntry.find({ isActive: { $ne: false } })
        .select(
          "class entryDate grossAmount paidAmount dueAmount discountAmount totalPayable paymentMode"
        )
        .lean(),
      Expense.find().select("date amount").lean(),
      OtherIncome.find().select("date amount").lean(),
      Payroll.find().select("month year totalSalary status payDate createdAt").lean(),
      Event.find().select("title date").lean(),
      Holiday.find().select("name date").lean(),
      StudentLeave.find({ status: "Approved" })
        .populate("student", "firstName lastName")
        .select("student leaveFrom leaveTo")
        .lean(),
      Leave.find({ status: "approved" })
        .populate("teacher", "name")
        .select("teacher fromDate toDate")
        .lean(),
      StaffVisitMeeting.find().select("employeeName schoolName startDate endDate").lean(),
    ]);

    const feeTransactions = [
      ...admissionFees.map((fee) => ({
        source: "admission",
        className: fee.class,
        date: fee.date,
        assigned: asNumber(fee.totalAmount),
        collected: asNumber(fee.paid ?? fee.finalAmount),
        due: asNumber(fee.due),
        discount: asNumber(fee.discount),
        paymentMode: normalizePaymentMode(fee.paymentMethod),
      })),
      ...feeEntries.map((fee) => ({
        source: "fee-entry",
        className: fee.class,
        date: fee.entryDate,
        assigned: asNumber(fee.grossAmount),
        collected: asNumber(fee.paidAmount),
        due: asNumber(fee.dueAmount),
        discount: asNumber(fee.discountAmount),
        paymentMode: normalizePaymentMode(fee.paymentMode),
      })),
    ];

    const studentPresent = studentAttendance.reduce(
      (total, record) =>
        total +
        record.students.filter((student) => student.status === "Present").length,
      0
    );
    const staffPresent = staffAttendance.filter((record) =>
      ["Present", "Late", "Half Day"].includes(record.status)
    ).length;
    const monthlyFees = sumInRange(
      feeTransactions,
      (fee) => fee.date,
      (fee) => fee.collected,
      monthStart,
      nextMonthStart
    );
    const monthlyExpense = sumInRange(
      expenses,
      (expense) => expense.date,
      (expense) => expense.amount,
      monthStart,
      nextMonthStart
    );
    const monthlyIncome = sumInRange(
      otherIncome,
      (income) => income.date,
      (income) => income.amount,
      monthStart,
      nextMonthStart
    );

    const dailyDates = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth(), index + 1);
      return date < nextMonthStart ? date : null;
    }).filter(Boolean);

    const feeCollectionDaily = dailyDates.map((date) => {
      const start = getStartOfDay(date);
      const end = new Date(start.getTime() + DAY_IN_MS);

      return {
        label: String(date.getDate()).padStart(2, "0"),
        collection: sumInRange(
          feeTransactions,
          (fee) => fee.date,
          (fee) => fee.collected,
          start,
          end
        ),
        expense: sumInRange(
          expenses,
          (expense) => expense.date,
          (expense) => expense.amount,
          start,
          end
        ),
        income: sumInRange(
          otherIncome,
          (income) => income.date,
          (income) => income.amount,
          start,
          end
        ),
      };
    });

    const financialYear = financialYearMonths.map(({ label, start, end }) => ({
      label,
      fees: sumInRange(
        feeTransactions,
        (fee) => fee.date,
        (fee) => fee.collected,
        start,
        end
      ),
      expense: sumInRange(
        expenses,
        (expense) => expense.date,
        (expense) => expense.amount,
        start,
        end
      ),
      income: sumInRange(
        otherIncome,
        (income) => income.date,
        (income) => income.amount,
        start,
        end
      ),
      payroll: sumBy(
        payrolls.filter(
          (payroll) =>
            payroll.status === "Completed" &&
            payroll.year === start.getFullYear() &&
            payroll.month === start.getMonth() + 1
        ),
        (payroll) => payroll.totalSalary
      ),
    }));

    const feeByMode = ["Cash", "Cheque", "Online", "Card"].map((mode) => ({
      label: mode,
      value: sumBy(
        feeTransactions.filter((fee) => fee.paymentMode === mode),
        (fee) => fee.collected
      ),
    }));

    const totalAssigned = sumBy(feeTransactions, (fee) => fee.assigned);
    const totalCollected = sumBy(feeTransactions, (fee) => fee.collected);
    const totalDiscount = sumBy(feeTransactions, (fee) => fee.discount);
    const totalDue = sumBy(feeTransactions, (fee) => fee.due);

    return res.status(200).json({
      success: true,
      data: {
        generatedAt: now.toISOString(),
        academicYear: getAcademicYear(now),
        overview: {
          students: students.length,
          studentPresent,
          monthlyFees,
          monthlyIncome,
          monthlyExpense,
          staff: staffCount,
          staffPresent,
          maleStudents: students.filter(
            (student) => String(student.gender || "").toLowerCase() === "male"
          ).length,
          femaleStudents: students.filter(
            (student) => String(student.gender || "").toLowerCase() === "female"
          ).length,
        },
        charts: {
          feeByMode,
          studentsByClass: countByClass(students, (student) => student.class),
          balanceByClass: countByClass(
            feeTransactions,
            (fee) => fee.className,
            (fee) => fee.due
          ),
          feeSummary: {
            assigned: totalAssigned,
            collected: totalCollected,
            fine: 0,
            discount: totalDiscount,
            due: totalDue,
            todayCollection: sumInRange(
              feeTransactions,
              (fee) => fee.date,
              (fee) => fee.collected,
              today,
              tomorrow
            ),
          },
          feeCollectionDaily,
          financialYear,
        },
        people: {
          birthdays: getUpcomingDates(students, "dob", now, "birthday"),
          anniversaries: getUpcomingDates(students, "marriageAnniversary", now, "anniversary"),
          leaves: [
            ...studentLeaves.map((leave) => ({
              id: `student-leave-${leave._id}`,
              name: `${leave.student?.firstName || "Student"} ${leave.student?.lastName || ""}`.trim(),
              date: leave.leaveFrom,
            })),
            ...teacherLeaves.map((leave) => ({
              id: `staff-leave-${leave._id}`,
              name: leave.teacher?.name || "Staff member",
              date: leave.fromDate,
            })),
          ]
            .sort((first, second) => new Date(first.date) - new Date(second.date))
            .slice(0, 4),
        },
        calendarEvents: buildCalendarEvents({
          events,
          holidays,
          visits,
          studentLeaves,
          teacherLeaves,
        }),
        sources: {
          admissionFees: admissionFees.length,
          feeEntries: feeEntries.length,
          expenses: expenses.length,
          otherIncome: otherIncome.length,
          payrolls: payrolls.length,
        },
      },
    });
  } catch (error) {
    console.error("DASHBOARD DATA ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard data.",
    });
  }
};
