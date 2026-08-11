import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiShield,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiKey,
  FiLayers,
  FiDatabase,
  FiActivity,
  FiAlertCircle,
  FiChevronDown,
  FiFolder,
  FiUsers,
  FiBookOpen,
  FiCreditCard,
  FiTruck,
  FiCalendar,
  FiSettings,
} from "react-icons/fi";

import API from "../../api/axios";
import "./PermissionManager.css";

/* =========================================================
   PERMISSION TEMPLATES
========================================================= */

const PERMISSION_OPTIONS = [
  /* GENERAL */
  { name: "VIEW_PROFILE", label: "Profile", group: "General" },
  { name: "SETTINGS", label: "Settings", group: "General" },
  { name: "DASHBOARD", label: "Dashboard", group: "General" },

  /* ADMISSION */
  { name: "VIEW_LEADS", label: "Cold Lead", group: "Admission" },
  {
    name: "ADMISSION_ENQUIRY",
    label: "Admission Enquiry",
    group: "Admission",
  },
  {
    name: "ENQUIRY_MANAGEMENT",
    label: "Enquiry Management",
    group: "Admission",
  },
  {
    name: "ONLINE_ADMISSION",
    label: "Online Admission",
    group: "Admission",
  },
  {
    name: "ADMISSION_MANAGEMENT",
    label: "Admission Management",
    group: "Admission",
  },
  {
    name: "ADMISSION_SURVEY",
    label: "Admission Survey",
    group: "Admission",
  },
  {
    name: "ADMISSION_SURVEY_VIEW",
    label: "Admission Survey Data",
    group: "Admission",
  },
  {
    name: "PRE_ADMISSION",
    label: "Pre Admission",
    group: "Admission",
  },
  {
    name: "PRE_ADMISSION_REPORT",
    label: "Pre Admission Report",
    group: "Admission",
  },

  /* STUDENT */
  {
    name: "VIEW_STUDENT_DETAILS",
    label: "Student Hub",
    group: "Students",
  },
  {
    name: "STUDENT_ADMISSION",
    label: "Student Admission",
    group: "Students",
  },
  {
    name: "STUDENT_LIST",
    label: "Student List",
    group: "Students",
  },
  {
    name: "STUDENT_UPDATE",
    label: "Student Update",
    group: "Students",
  },
  {
    name: "STUDENT_CATEGORY",
    label: "Student Category",
    group: "Students",
  },
  {
    name: "STUDENT_LINK",
    label: "Student Link",
    group: "Students",
  },
  {
    name: "STUDENT_REFERRAL",
    label: "Student Referral",
    group: "Students",
  },
  {
    name: "INACTIVE_STUDENT",
    label: "Inactive Student",
    group: "Students",
  },
  {
    name: "STUDENT_REPORT",
    label: "Student Report",
    group: "Students",
  },
  {
    name: "STUDENT_PORTFOLIO",
    label: "Student Portfolio",
    group: "Students",
  },
  {
    name: "STUDENT_ID_CARD",
    label: "Student ID Card",
    group: "Students",
  },
  {
    name: "STUDENT_PROMOTION",
    label: "Student Promotion",
    group: "Students",
  },
  {
    name: "HOUSE_MANAGEMENT",
    label: "House Management",
    group: "Students",
  },
  {
    name: "LINK_SIBLINGS",
    label: "Link Siblings",
    group: "Students",
  },

  /* ATTENDANCE */
  {
    name: "STUDENT_ATTENDANCE",
    label: "Student Attendance",
    group: "Attendance",
  },
  {
    name: "STUDENT_LEAVE",
    label: "Student Leave",
    group: "Attendance",
  },
  {
    name: "ATTENDANCE_REPORT",
    label: "Attendance Report",
    group: "Attendance",
  },
  {
    name: "CLASSWISE_ATTENDANCE_REPORT",
    label: "Classwise Attendance Report",
    group: "Attendance",
  },
  {
    name: "ATTENDANCE_BY_DATE",
    label: "Attendance By Date",
    group: "Attendance",
  },
  {
    name: "ABSENT_STUDENT",
    label: "Absent Student",
    group: "Attendance",
  },
  {
    name: "UNMARKED_ATTENDANCE",
    label: "Unmarked Attendance",
    group: "Attendance",
  },
  {
    name: "CUSTOM_ATTENDANCE_REPORT",
    label: "Custom Attendance Report",
    group: "Attendance",
  },
  {
    name: "EMPLOYEE_ATTENDANCE",
    label: "Employee Attendance",
    group: "Attendance",
  },
  {
    name: "ATTENDANCE_MANAGEMENT",
    label: "Attendance Management",
    group: "Attendance",
  },
  {
    name: "TODAY_ATTENDANCE",
    label: "Today Attendance",
    group: "Attendance",
  },
  {
    name: "ATTENDANCE_SHEET",
    label: "Attendance Sheet",
    group: "Attendance",
  },
  {
    name: "TIMESHEETS",
    label: "Timesheets",
    group: "Attendance",
  },
  {
    name: "OVERTIME",
    label: "Overtime",
    group: "Attendance",
  },
  {
    name: "SHIFT_PLANNING",
    label: "Shift Planning",
    group: "Attendance",
  },
  {
    name: "REMOTE_WFH",
    label: "Remote / WFH",
    group: "Attendance",
  },

  /* FEES */
  {
    name: "FEE_MANAGEMENT",
    label: "Student Paytrack",
    group: "Fees",
  },
  {
    name: "FEE_COLLECTION",
    label: "Fee Collection",
    group: "Fees",
  },
  {
    name: "FEE_TYPE",
    label: "Fee Type",
    group: "Fees",
  },
  {
    name: "FEE_GROUP",
    label: "Fee Group",
    group: "Fees",
  },
  {
    name: "FEE_HEAD",
    label: "Fee Head",
    group: "Fees",
  },
  {
    name: "FEE_STRUCTURE",
    label: "Fee Structure",
    group: "Fees",
  },
  {
    name: "FEE_ENTRY",
    label: "Fee Entry",
    group: "Fees",
  },
  {
    name: "ADMISSION_FEE",
    label: "Admission Fee",
    group: "Fees",
  },
  {
    name: "SCHOOL_FEE_INFO",
    label: "School Fee & Info",
    group: "Fees",
  },
  {
    name: "PAYMENT_RECEIPT",
    label: "Payment Receipt",
    group: "Fees",
  },

  /* CLASS & SUBJECT */
  {
    name: "CLASS_POST",
    label: "Class Post",
    group: "Class & Subject",
  },
  {
    name: "SUBJECT_POST",
    label: "Subject Post",
    group: "Class & Subject",
  },
  {
    name: "CLASSWISE_SUBJECT",
    label: "Classwise Subject",
    group: "Class & Subject",
  },
  {
    name: "CLASS_MANAGEMENT",
    label: "Class Management",
    group: "Class & Subject",
  },
  {
    name: "SECTION_MANAGEMENT",
    label: "Section Management",
    group: "Class & Subject",
  },
  {
    name: "ASSIGN_CLASS_TEACHER",
    label: "Assign Class Teacher",
    group: "Class & Subject",
  },
  {
    name: "ASSIGN_SUBJECTS",
    label: "Assign Subjects",
    group: "Class & Subject",
  },
  {
    name: "DAILY_TIMETABLE",
    label: "Daily Time Table",
    group: "Class & Subject",
  },
  {
    name: "CLASS_TIMETABLE",
    label: "Class Time Table",
    group: "Class & Subject",
  },
  {
    name: "TEACHER_TIMETABLE",
    label: "Teacher Time Table",
    group: "Class & Subject",
  },

  /* LEARNING */
  {
    name: "LEARNING_MANAGEMENT",
    label: "Learning Management",
    group: "Learning",
  },
  {
    name: "PRE_PRIMARY",
    label: "Pre Primary",
    group: "Learning",
  },
  {
    name: "PRIMARY",
    label: "Primary",
    group: "Learning",
  },
  {
    name: "SECONDARY",
    label: "Secondary",
    group: "Learning",
  },

  /* EXAMINATION */
  {
    name: "EXAM_TYPE",
    label: "Exam Type",
    group: "Examination",
  },
  {
    name: "EXAM_RESULT",
    label: "Exam Result",
    group: "Examination",
  },
  {
    name: "EXAM_RESULT_MANAGEMENT",
    label: "Exam Result Management",
    group: "Examination",
  },
  {
    name: "EXAM_REPORT",
    label: "Exam Report",
    group: "Examination",
  },
  {
    name: "EXAM_PROGRESS_REPORT",
    label: "Exam Progress Report",
    group: "Examination",
  },
  {
    name: "QUESTION_BANK",
    label: "Question Bank",
    group: "Examination",
  },
  {
    name: "QUESTION_MANAGEMENT",
    label: "Question Management",
    group: "Examination",
  },
  {
    name: "QUESTION_UPDATE",
    label: "Update Question",
    group: "Examination",
  },
  {
    name: "QUESTION_GENERATOR",
    label: "Question Generator",
    group: "Examination",
  },
  {
    name: "GENERATE_QUESTION",
    label: "Generate Question",
    group: "Examination",
  },
  {
    name: "ONLINE_EXAM",
    label: "Online Exam",
    group: "Examination",
  },
  {
    name: "TYPE_QUESTION",
    label: "Type Question",
    group: "Examination",
  },

  /* CONTENT */
  {
    name: "NEWS_POST",
    label: "News Posting",
    group: "Content",
  },
  {
    name: "LATEST_NEWS_MANAGEMENT",
    label: "Latest News Management",
    group: "Content",
  },
  {
    name: "BLOG_MANAGEMENT",
    label: "Blog Management",
    group: "Content",
  },
  {
    name: "NOTICE_MANAGEMENT",
    label: "Notice Management",
    group: "Content",
  },
  {
    name: "NOTIFICATION_MANAGEMENT",
    label: "Notification Management",
    group: "Content",
  },
  {
    name: "EVENT_MANAGEMENT",
    label: "Event Management",
    group: "Content",
  },
  {
    name: "FAQ_POSTING",
    label: "FAQ Posting",
    group: "Content",
  },
  {
    name: "TESTIMONIALS_MANAGEMENT",
    label: "Testimonials",
    group: "Content",
  },
  {
    name: "AWARD_MANAGEMENT",
    label: "Award Management",
    group: "Content",
  },
  {
    name: "MEDIA_MANAGEMENT",
    label: "Media Management",
    group: "Content",
  },
  {
    name: "PHOTO_GALLERY",
    label: "Photo Gallery",
    group: "Content",
  },
  {
    name: "VIDEO_GALLERY",
    label: "Video Gallery",
    group: "Content",
  },
  {
    name: "ADVERTISEMENT_MANAGEMENT",
    label: "Advertisement Management",
    group: "Content",
  },

  /* FRONT OFFICE */
  {
    name: "VISITOR_BOOK",
    label: "Visitor Book",
    group: "Front Office",
  },
  {
    name: "VISITOR_ENQUIRY",
    label: "Visitor Enquiry",
    group: "Front Office",
  },
  {
    name: "VISITOR_REPORT",
    label: "Visitor Report",
    group: "Front Office",
  },
  {
    name: "POSTAL_DISPATCH",
    label: "Postal Dispatch",
    group: "Front Office",
  },
  {
    name: "POSTAL_RECEIVE",
    label: "Postal Receive",
    group: "Front Office",
  },
  {
    name: "GATE_PASS",
    label: "Gate Pass",
    group: "Front Office",
  },
  {
    name: "STAFF_GATE_PASS",
    label: "Staff Gate Pass",
    group: "Front Office",
  },
  {
    name: "STAFF_VISIT_MEETING",
    label: "Staff Visit Meeting",
    group: "Front Office",
  },
  {
    name: "FRONT_OFFICE_COMPLAINT",
    label: "Front Office Complaint",
    group: "Front Office",
  },
  {
    name: "ADMIN_COMPLAINT",
    label: "Admin Complaint",
    group: "Front Office",
  },
  {
    name: "STAFF_COMPLAINT",
    label: "Staff Complaint",
    group: "Front Office",
  },

  /* INCOME */
  {
    name: "INCOME_MANAGEMENT",
    label: "Income Management",
    group: "Accounts & Income",
  },
  {
    name: "ADD_INCOME",
    label: "Add Income",
    group: "Accounts & Income",
  },
  {
    name: "INCOME_SEARCH",
    label: "Search Income",
    group: "Accounts & Income",
  },
  {
    name: "INCOME_HEAD",
    label: "Income Head",
    group: "Accounts & Income",
  },
  {
    name: "OTHER_INCOME",
    label: "Other Income",
    group: "Accounts & Income",
  },
  {
    name: "COLLECT_MONEY",
    label: "Collect Money",
    group: "Accounts & Income",
  },

  /* EXPENSE */
  {
    name: "EXPENSE_MANAGEMENT",
    label: "Expense Management",
    group: "Accounts & Expenses",
  },
  {
    name: "EXPENSE_LIST",
    label: "Expense List",
    group: "Accounts & Expenses",
  },
  {
    name: "ADD_EXPENSE",
    label: "Add Expense",
    group: "Accounts & Expenses",
  },
  {
    name: "EXPENSE_SEARCH",
    label: "Expense Search",
    group: "Accounts & Expenses",
  },
  {
    name: "EXPENSE_HEAD",
    label: "Expense Head",
    group: "Accounts & Expenses",
  },

  /* TEACHER */
  {
    name: "TEACHER_POSTING",
    label: "Teacher Posting",
    group: "Teacher",
  },
  {
    name: "TEACHER_MANAGEMENT",
    label: "Teacher Management",
    group: "Teacher",
  },
  {
    name: "CREATE_TEACHER",
    label: "Create Teacher",
    group: "Teacher",
  },
  {
    name: "TEACHER_PROFILE",
    label: "Teacher Profile",
    group: "Teacher",
  },

  /* LEAVE */
  {
    name: "TEACHER_LEAVE",
    label: "Leave",
    group: "Leave",
  },
  {
    name: "LEAVE_MANAGEMENT",
    label: "Leave Management",
    group: "Leave",
  },
  {
    name: "LEAVE_REQUEST",
    label: "Leave Requests",
    group: "Leave",
  },
  {
    name: "LEAVE_BALANCE",
    label: "Leave Balance",
    group: "Leave",
  },
  {
    name: "LEAVE_TYPES",
    label: "Leave Types",
    group: "Leave",
  },
  {
    name: "LEAVE_SETTINGS",
    label: "Leave Settings",
    group: "Leave",
  },

  /* PAYROLL */
  {
    name: "PAYROLL_MANAGEMENT",
    label: "Payroll Management",
    group: "Payroll",
  },
  {
    name: "WALLET",
    label: "Wallet",
    group: "Payroll",
  },
  {
    name: "COLLECT_PAYMENT",
    label: "Collect Payment",
    group: "Payroll",
  },

  /* LIBRARY */
  {
    name: "LIBRARY_MANAGEMENT",
    label: "Library Management",
    group: "Library",
  },
  {
    name: "BOOK_MASTER",
    label: "Book Master",
    group: "Library",
  },
  {
    name: "BOOK_LIST",
    label: "Book List",
    group: "Library",
  },
  {
    name: "ADD_BOOK",
    label: "Add Book",
    group: "Library",
  },
  {
    name: "ISSUE_BOOK",
    label: "Issue Book",
    group: "Library",
  },
  {
    name: "RETURN_BOOK",
    label: "Return Book",
    group: "Library",
  },
  {
    name: "ISSUE_RETURN",
    label: "Issue / Return",
    group: "Library",
  },
  {
    name: "ISSUED_RETURN_REPORT",
    label: "Issued Return Report",
    group: "Library",
  },
  {
    name: "LIBRARY_STAFF",
    label: "Library Staff",
    group: "Library",
  },
  {
    name: "LIBRARY_STUDENT",
    label: "Library Student",
    group: "Library",
  },

  /* TRANSPORT */
  {
    name: "TRANSPORT_MANAGEMENT",
    label: "Transport Management",
    group: "Transport",
  },
  {
    name: "TRANSPORT_VEHICLE",
    label: "Transport Vehicle",
    group: "Transport",
  },
  {
    name: "TRANSPORT_ROUTE",
    label: "Transport Route",
    group: "Transport",
  },
  {
    name: "TRANSPORT_DESTINATION",
    label: "Transport Destination",
    group: "Transport",
  },
  {
    name: "ASSIGN_ROUTES",
    label: "Assign Routes",
    group: "Transport",
  },
  {
    name: "VEHICLE_ROUTE",
    label: "Vehicle Route",
    group: "Transport",
  },
  {
    name: "TRANSPORT_SUMMARY",
    label: "Transport Summary",
    group: "Transport",
  },
  {
    name: "TRANSPORT_VEHICLE_REPORT",
    label: "Transport Vehicle Report",
    group: "Transport",
  },
  {
    name: "TRANSPORT_STUDENT_REPORT",
    label: "Transport Student Report",
    group: "Transport",
  },
  {
    name: "VEHICLE_DASHBOARD",
    label: "Vehicle Dashboard",
    group: "Transport",
  },
  {
    name: "VEHICLE_KM",
    label: "Vehicle KM",
    group: "Transport",
  },
  {
    name: "VEHICLE_SETTINGS",
    label: "Vehicle Settings",
    group: "Transport",
  },
  {
    name: "FUEL_MANAGEMENT",
    label: "Fuel Management",
    group: "Transport",
  },

  /* SYSTEM */
  {
    name: "PERMISSION_MANAGEMENT",
    label: "Permission Management",
    group: "System",
  },
  {
    name: "SYSTEM_SETTINGS",
    label: "System Settings",
    group: "System",
  },

  /* REPORTS */
  {
    name: "COMPLAINT_REPORT",
    label: "Complaint Report",
    group: "Reports",
  },
  {
    name: "TRANSPORT_REPORT",
    label: "Transport Report",
    group: "Reports",
  },

  /* SCHOOL */
  {
    name: "CLASS_DATA_REGISTRY",
    label: "Class Data Registry",
    group: "School",
  },
  {
    name: "SHOP_INFORMATION",
    label: "School Information",
    group: "School",
  },
  {
    name: "SUPPLIER_MASTER",
    label: "Supplier Master",
    group: "School",
  },
  {
    name: "CATEGORY_MASTER",
    label: "Category Master",
    group: "School",
  },
  {
    name: "ITEMS_MASTER",
    label: "Items Master",
    group: "School",
  },

  /* CO-CURRICULAR */
  {
    name: "CO_CURRICULAR",
    label: "Co-Curricular",
    group: "Co-Curricular",
  },
  {
    name: "ACTIVITY",
    label: "Activity",
    group: "Co-Curricular",
  },
  {
    name: "ASSESSMENT",
    label: "Assessment",
    group: "Co-Curricular",
  },
  {
    name: "EVALUATION_REMARK",
    label: "Evaluation Remark",
    group: "Co-Curricular",
  },
  {
    name: "PRIMARY_CLASS_REPORT",
    label: "Primary Class Report",
    group: "Reports",
  },
  {
    name: "TICKET_MANAGEMENT",
    label: "Ticket Management",
    group: "Support",
  },
  {
    name: "PROMOTION",
    label: "Promotion",
    group: "Students",
  },
];

/* =========================================================
   GROUP ICONS
========================================================= */

const GROUP_ICONS = {
  General: FiShield,
  Admission: FiUsers,
  Students: FiUsers,
  Attendance: FiCalendar,
  Fees: FiCreditCard,
  "Class & Subject": FiLayers,
  Learning: FiBookOpen,
  Examination: FiBookOpen,
  Content: FiDatabase,
  "Front Office": FiActivity,
  "Accounts & Income": FiCreditCard,
  "Accounts & Expenses": FiCreditCard,
  Teacher: FiUsers,
  Leave: FiCalendar,
  Payroll: FiCreditCard,
  Library: FiBookOpen,
  Transport: FiTruck,
  System: FiSettings,
  Reports: FiActivity,
  School: FiLayers,
  "Co-Curricular": FiActivity,
  Support: FiShield,
};

/* =========================================================
   COMPONENT
========================================================= */

const PermissionManager = () => {
  const [form, setForm] = useState({
    name: "",
    label: "",
  });

  const [permissions, setPermissions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [permissionSearch, setPermissionSearch] = useState("");
  const dropdownRef = useRef(null);

  /* =====================================================
     FETCH
  ===================================================== */

  const fetchPermissions = async () => {
    try {
      setLoading(true);

      const res = await API.get("/permissions");

      setPermissions(
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : []
      );
    } catch (err) {
      console.error("FETCH PERMISSIONS ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Unable to load permissions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  /* =====================================================
     CLOSE DROPDOWN OUTSIDE CLICK
  ===================================================== */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =====================================================
     GROUP PERMISSIONS
  ===================================================== */

  const groupedPermissions = useMemo(() => {
    const groups = {};

    PERMISSION_OPTIONS.forEach((permission) => {
      const group = permission.group || "Other";

      if (!groups[group]) {
        groups[group] = [];
      }

      groups[group].push(permission);
    });

    return groups;
  }, []);

  /* =====================================================
     FILTER DROPDOWN
  ===================================================== */

  const filteredGroupedPermissions = useMemo(() => {
    const text =
      permissionSearch.trim().toLowerCase();

    if (!text) {
      return groupedPermissions;
    }

    const result = {};

    Object.entries(groupedPermissions).forEach(
      ([group, items]) => {
        const filtered = items.filter(
          (permission) =>
            permission.label
              .toLowerCase()
              .includes(text) ||
            permission.name
              .toLowerCase()
              .includes(text) ||
            group.toLowerCase().includes(text)
        );

        if (filtered.length > 0) {
          result[group] = filtered;
        }
      }
    );

    return result;
  }, [
    groupedPermissions,
    permissionSearch,
  ]);

  /* =====================================================
     INPUT
  ===================================================== */

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* =====================================================
     PERMISSION SELECT
  ===================================================== */

  const handlePermissionSelect = (permission) => {
    if (!permission) return;

    setForm({
      name: permission.name,
      label: permission.label,
    });

    setDropdownOpen(false);
    setPermissionSearch("");
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.label) {
      alert("Please select a permission");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        await API.put(
          `/permissions/${editId}`,
          form
        );
      } else {
        await API.post(
          "/permissions",
          form
        );
      }

      setForm({
        name: "",
        label: "",
      });

      setEditId(null);

      await fetchPermissions();
    } catch (err) {
      console.error(
        "SAVE PERMISSION ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to save permission"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this permission?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await API.delete(
        `/permissions/${id}`
      );

      await fetchPermissions();
    } catch (err) {
      console.error(
        "DELETE PERMISSION ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to delete permission"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (permission) => {
    setForm({
      name: permission.name,
      label: permission.label,
    });

    setEditId(permission._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     CANCEL
  ===================================================== */

  const handleCancel = () => {
    setForm({
      name: "",
      label: "",
    });

    setEditId(null);
    setDropdownOpen(false);
    setPermissionSearch("");
  };

  /* =====================================================
     SEARCH TABLE
  ===================================================== */

  const filteredPermissions = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    if (!searchText) {
      return permissions;
    }

    return permissions.filter(
      (permission) =>
        permission.name
          ?.toLowerCase()
          .includes(searchText) ||
        permission.label
          ?.toLowerCase()
          .includes(searchText)
    );
  }, [permissions, search]);

  /* =====================================================
     STATS
  ===================================================== */

  const totalPermissions =
    permissions.length;

  const availablePermissions =
    Math.max(
      PERMISSION_OPTIONS.length -
        permissions.length,
      0
    );

  const filteredCount =
    filteredPermissions.length;

  /* =====================================================
     CREATED CHECK
  ===================================================== */

  const isPermissionCreated = (name) => {
    return permissions.some(
      (permission) =>
        permission.name === name
    );
  };

  /* =====================================================
     SELECTED PERMISSION
  ===================================================== */

  const selectedPermission =
    PERMISSION_OPTIONS.find(
      (permission) =>
        permission.name === form.name
    );

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="permission-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="permission-header">
        <div className="permission-header-content">

          <div className="permission-title-wrap">

            <div className="permission-title-icon">
              <FiShield />
            </div>

            <div>
              <div className="permission-breadcrumb">
                Administration
                <span>/</span>
                Permissions
              </div>

              <h1 className="permission-title">
                Permission Manager
              </h1>

              <p className="permission-subtitle">
                Manage access permissions and
                control system capabilities.
              </p>
            </div>

          </div>

          <div className="permission-header-badge">
            <FiShield />
            Access Control
          </div>

        </div>
      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="permission-stats">

        <div className="permission-stat-card">
          <div className="permission-stat-icon blue">
            <FiKey />
          </div>

          <div className="permission-stat-content">
            <span>Total Permissions</span>
            <strong>
              {totalPermissions}
            </strong>
          </div>
        </div>

        <div className="permission-stat-card">
          <div className="permission-stat-icon green">
            <FiCheck />
          </div>

          <div className="permission-stat-content">
            <span>Available in System</span>
            <strong>
              {availablePermissions}
            </strong>
          </div>
        </div>

        <div className="permission-stat-card">
          <div className="permission-stat-icon purple">
            <FiLayers />
          </div>

          <div className="permission-stat-content">
            <span>Permission Templates</span>
            <strong>
              {PERMISSION_OPTIONS.length}
            </strong>
          </div>
        </div>

        <div className="permission-stat-card">
          <div className="permission-stat-icon orange">
            <FiActivity />
          </div>

          <div className="permission-stat-content">
            <span>Showing</span>
            <strong>
              {filteredCount}
            </strong>
          </div>
        </div>

      </div>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="permission-content">

        {/* =================================================
            CREATE / EDIT
        ================================================= */}

        <div className="card form-card">

          <div className="card-header">

            <div className="card-header-icon">
              {editId ? (
                <FiEdit2 />
              ) : (
                <FiPlus />
              )}
            </div>

            <div>
              <h2>
                {editId
                  ? "Edit Permission"
                  : "Create Permission"}
              </h2>

              <p>
                {editId
                  ? "Update the selected permission."
                  : "Add a new system permission."}
              </p>
            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="permission-form"
          >

            {/* PERMISSION DROPDOWN */}

            <div className="field-group">

              <label>
                Permission
                <span>*</span>
              </label>

              <div
                className="permission-dropdown"
                ref={dropdownRef}
              >

                <button
                  type="button"
                  className={`permission-dropdown-trigger ${
                    dropdownOpen
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setDropdownOpen(
                      !dropdownOpen
                    )
                  }
                >

                  <div className="selected-permission">

                    <div className="selected-permission-icon">
                      <FiKey />
                    </div>

                    <div className="selected-permission-text">

                      {selectedPermission ? (
                        <>
                          <strong>
                            {
                              selectedPermission.label
                            }
                          </strong>

                          <span>
                            {
                              selectedPermission.name
                            }
                          </span>
                        </>
                      ) : (
                        <span className="placeholder">
                          Select permission
                        </span>
                      )}

                    </div>

                  </div>

                  <FiChevronDown
                    className={
                      dropdownOpen
                        ? "rotate"
                        : ""
                    }
                  />

                </button>

                {dropdownOpen && (
                  <div className="permission-dropdown-menu">

                    {/* SEARCH */}

                    <div className="dropdown-search">

                      <FiSearch />

                      <input
                        type="text"
                        value={
                          permissionSearch
                        }
                        onChange={(e) =>
                          setPermissionSearch(
                            e.target.value
                          )
                        }
                        placeholder="Search permission..."
                        autoFocus
                      />

                      {permissionSearch && (
                        <button
                          type="button"
                          onClick={() =>
                            setPermissionSearch(
                              ""
                            )
                          }
                        >
                          <FiX />
                        </button>
                      )}

                    </div>

                    {/* GROUPS */}

                    <div className="permission-group-list">

                      {Object.keys(
                        filteredGroupedPermissions
                      ).length === 0 ? (

                        <div className="dropdown-empty">
                          <FiAlertCircle />
                          <span>
                            No permission found
                          </span>
                        </div>

                      ) : (

                        Object.entries(
                          filteredGroupedPermissions
                        ).map(
                          ([
                            groupName,
                            groupPermissions,
                          ]) => {

                            const GroupIcon =
                              GROUP_ICONS[
                                groupName
                              ] || FiFolder;

                            return (
                              <div
                                className="permission-group"
                                key={groupName}
                              >

                                <div className="permission-group-header">

                                  <div className="group-title">

                                    <div className="group-icon">
                                      <GroupIcon />
                                    </div>

                                    <span>
                                      {groupName}
                                    </span>

                                  </div>

                                  <span className="group-count">
                                    {
                                      groupPermissions.length
                                    }
                                  </span>

                                </div>

                                <div className="permission-group-items">

                                  {groupPermissions.map(
                                    (
                                      permission
                                    ) => {

                                      const created =
                                        isPermissionCreated(
                                          permission.name
                                        );

                                      const selected =
                                        form.name ===
                                        permission.name;

                                      return (
                                        <button
                                          type="button"
                                          key={
                                            permission.name
                                          }
                                          className={`permission-option ${
                                            selected
                                              ? "selected"
                                              : ""
                                          } ${
                                            created &&
                                            !editId
                                              ? "created"
                                              : ""
                                          }`}
                                          disabled={
                                            created &&
                                            !editId
                                          }
                                          onClick={() =>
                                            handlePermissionSelect(
                                              permission
                                            )
                                          }
                                        >

                                          <div className="option-icon">
                                            {selected ? (
                                              <FiCheck />
                                            ) : (
                                              <FiKey />
                                            )}
                                          </div>

                                          <div className="option-content">

                                            <strong>
                                              {
                                                permission.label
                                              }
                                            </strong>

                                            <span>
                                              {
                                                permission.name
                                              }
                                            </span>

                                          </div>

                                          {created &&
                                            !editId && (
                                              <span className="created-badge">
                                                Created
                                              </span>
                                            )}

                                        </button>
                                      );
                                    }
                                  )}

                                </div>

                              </div>
                            );
                          }
                        )
                      )}

                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* LABEL */}

            <div className="field-group">

              <label htmlFor="permission-label">
                Display Label
                <span>*</span>
              </label>

              <div className="input-wrapper">

                <FiLayers />

                <input
                  id="permission-label"
                  type="text"
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  className="input"
                  placeholder="Permission display name"
                />

              </div>

            </div>

            {/* PREVIEW */}

            {form.name && (
              <div className="permission-preview">

                <div className="preview-title">
                  <span>Permission Preview</span>

                  {selectedPermission?.group && (
                    <span className="preview-group">
                      {selectedPermission.group}
                    </span>
                  )}
                </div>

                <div className="preview-content">

                  <div className="preview-icon">
                    <FiShield />
                  </div>

                  <div className="preview-info">

                    <strong>
                      {form.label ||
                        "Permission Label"}
                    </strong>

                    <span>
                      {form.name}
                    </span>

                  </div>

                  <div className="preview-status">
                    <FiCheck />
                    Ready
                  </div>

                </div>

              </div>
            )}

            {/* ACTIONS */}

            <div className="form-actions">

              <button
                type="submit"
                className="button primary-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="button-spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    {editId ? (
                      <FiCheck />
                    ) : (
                      <FiPlus />
                    )}

                    {editId
                      ? "Update Permission"
                      : "Create Permission"}
                  </>
                )}

              </button>

              {editId && (
                <button
                  type="button"
                  className="button cancel-btn"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <FiX />
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="card table-card">

          <div className="table-card-header">

            <div className="table-title">

              <div className="table-title-icon">
                <FiDatabase />
              </div>

              <div>
                <h2>
                  System Permissions
                </h2>

                <p>
                  Manage permissions currently
                  registered in the system.
                </p>
              </div>

            </div>

            <div className="permission-count">
              {filteredCount}{" "}
              {filteredCount === 1
                ? "Permission"
                : "Permissions"}
            </div>

          </div>

          {/* SEARCH */}

          <div className="permission-toolbar">

            <div className="search-wrapper">

              <FiSearch />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search permissions..."
                className="permission-search"
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <FiX />
                </button>
              )}

            </div>

          </div>

          {/* LOADING */}

          {loading &&
          permissions.length === 0 ? (

            <div className="permission-loading">
              <div className="loading-spinner" />

              <p>
                Loading permissions...
              </p>
            </div>

          ) : filteredPermissions.length ===
            0 ? (

            <div className="empty">

              <div className="empty-icon">
                <FiAlertCircle />
              </div>

              <h3>
                No permissions found
              </h3>

              <p>
                {search
                  ? "Try a different search term."
                  : "No permissions have been created yet."}
              </p>

              {search && (
                <button
                  type="button"
                  className="empty-button"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  Clear Search
                </button>
              )}

            </div>

          ) : (

            <div className="table-container">

              <table className="table">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Permission</th>
                    <th>Permission Key</th>
                    <th>Created</th>
                    <th className="action-column">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredPermissions.map(
                    (permission, index) => {

                      const template =
                        PERMISSION_OPTIONS.find(
                          (item) =>
                            item.name ===
                            permission.name
                        );

                      return (
                        <tr
                          key={
                            permission._id
                          }
                        >

                          <td>
                            <span className="row-number">
                              {index + 1}
                            </span>
                          </td>

                          <td>

                            <div className="permission-name-cell">

                              <div className="permission-row-icon">
                                <FiShield />
                              </div>

                              <div className="permission-table-info">

                                <strong>
                                  {
                                    permission.label
                                  }
                                </strong>

                                <div className="permission-meta">

                                  <small>
                                    System Access
                                  </small>

                                  {template?.group && (
                                    <>
                                      <span>
                                        •
                                      </span>

                                      <small>
                                        {
                                          template.group
                                        }
                                      </small>
                                    </>
                                  )}

                                </div>

                              </div>

                            </div>

                          </td>

                          <td>
                            <span className="code">
                              {
                                permission.name
                              }
                            </span>
                          </td>

                          <td>
                            <span className="date-cell">
                              {permission.createdAt
                                ? new Date(
                                    permission.createdAt
                                  ).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "—"}
                            </span>
                          </td>

                          <td>

                            <div className="action-buttons">

                              <button
                                type="button"
                                className="edit-btn"
                                onClick={() =>
                                  handleEdit(
                                    permission
                                  )
                                }
                                title="Edit permission"
                              >
                                <FiEdit2 />
                                <span>
                                  Edit
                                </span>
                              </button>

                              <button
                                type="button"
                                className="delete-btn"
                                onClick={() =>
                                  handleDelete(
                                    permission._id
                                  )
                                }
                                title="Delete permission"
                              >
                                <FiTrash2 />
                                <span>
                                  Delete
                                </span>
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default PermissionManager;