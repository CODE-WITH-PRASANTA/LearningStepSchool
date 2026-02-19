import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layout/AppLayout/AppLayout";

/* ===================== PAGES ===================== */

// Dashboard & Core
import Dashboard from "./Pages/Dashboard/Dashboard";
import Fees from "./Pages/FeeManagement";
import Notices from "./Pages/NoticeManagement";
import ProfilePage from "./Pages/ProfilePage";
import SettingsPage from "./Pages/SettingsPage";
import LoginPage from "./Pages/LoginPage";
import AdmissionSurvey from "./Pages/AdmissionSurvey";
import EventManagement from "./Pages/EventManagement";

// Blog & CMS
import BlogView from "./Pages/BlogView/BlogView";
import BlogManagerPage from "./Pages/BlogManagerPage/BlogManagerPage";
import TestimonialPage from "./Pages/TestimonialPage/TestimonialPage";
import AdmissionSurveyView from "./Component/AdmissionSurveyView/AdmissionSurveyView";

// Auth
import ProtectedRoute from "./Auth/ProtectedRoute";
import { AuthProvider } from "./Auth/AuthContext";

// School / Admin
import ClsWiseDataManagements from "./Pages/ClsWiseDataManagements/ClsWiseDataManagements";
import AwardAdminPage from "./Pages/AwardAdminPage/AwardAdminPage";

// Learning
import TeacherAdminPage from "./Pages/TeacherAdminPage/TeacherAdminPage";
import PrePrimery from "./Pages/PrePrimery/PrePrimery";
import Primery from "./Pages/Primery/Primery";
import Secondary from "./Pages/Secondary/Secondary";

// Front Office
import VisitorBook from "./Pages/VisitorBook/VisitorBook";
import Visitorsbooksedit from "./Pages/Visitorsbooksedit/Visitorsbooksedit";
import PostalDispatch from "./Pages/PostalDispatch/PostalDispatch";
import PostalReceive from "./Pages/PostalReceive/PostalReceive";
import GatePass from "./Pages/GatePass/GatePass";
import AddIncome from "./Pages/AddIncome/AddIncome";
import SearchIncome from "./Pages/SearchIncome/SearchIncome";
import IncomeHead from "./Pages/IncomeHead/IncomeHead";
import Complain from "./Pages/Complain/Complain";
import ComplainAdd from "./Pages/ComplainAdd/ComplainAdd";
import AssignClassTeacher from "./Pages/AssignClassTeacher/AssignClassTeacher";
import ClassPage from "./Pages/ClassPage/ClassPage";
import SectionPage from "./Pages/SectionPage/SectionPage";
import DailyTimeTable from "./Pages/DailyTimeTable/DailyTimeTable";
import ClassTimeTable from "./Pages/ClassTimeTable/ClassTimeTable";
import TeacherTimeTable from "./Pages/TeacherTimeTable/TeacherTimeTable";



// Attendance
import StudentAttendance from "./Pages/Studentattendance/Studentattendance";
import Studentleave from "./Pages/Studentleave/Studentleave";
import AttendanceReport from "./Pages/AttendanceReport/AttendanceReport";

// Other
import FaqPosting from "./Pages/FaqPosting/FaqPosting";
import Editleave from "./Pages/Editleave/Editleave";
import Cocurricular from "./Pages/Cocurricular/Cocurricular";
import Subject from "./Pages/Subject/Subject";
import AssignSubjects from "./Pages/Assignsubject/Assignsubject"
import Activity from "./Pages/Activity/Activity";
import Assessment from "./Pages/Assesment/Assesment";
import EvaluationRemark from "./Pages/EvaluationRemark/EvaluationRemark";
import PrimaryClassReport from "./Pages/PrimaryClassReport/PrimaryClassReport";
import BookList from "./Pages/BookList/BookList";
import IssueReturn from "./Pages/IssueReturn/IssueReturn";
import AddStudent from "./Pages/AddStudent/AddStudent";
// import AddStaff from "./Pages/AddStaff/AddStaff";
import IssuedReturnReport from "./Pages/IssuedReturnReport/IssuedReturnReport";

import AdmissionEnquiry from "./Pages/AdmissionEnquiry/AdmissionEnquiry";
import EditAdmissionEnquiry from "./Component/AdmisionEnquiryPage/EditAdmissionEnquiry";
import  NotificationPublish  from "./Pages/NotificationPublish/NotificationPublish";
import  LatestNewsAdmin  from "./Pages/LatestNewsAdmin/LatestNewsAdmin";
import Photogallery from "./Pages/Photogallery/Photogallery";
import Videogallery from "./Pages/Videogallery/Videogallery";
import AddBook from "./Pages/AddBook/AddBook";
import StudentList from "./Pages/StudentList/StudentList";
import ReturnBook from "./Pages/ReturnBook/ReturnBook";
import Stafflibrary from "./Pages/Stafflibrary/Stafflibrary";


/* ===================== APP ===================== */

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* ===== PUBLIC ===== */}
        {/* ===== PUBLIC ROUTE ===== */}
        <Route path="/login" element={<LoginPage />} />

        {/* ===== PROTECTED APP ===== */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Finance */}
          <Route path="fees" element={<Fees />} />

          {/* Notices */}
          <Route path="notices" element={<Notices />} />

          <Route path="notification" element={<NotificationPublish />} />


          <Route path="latest-news" element={<LatestNewsAdmin />} />

           {/* {Media} */}
          <Route path="/media-photo" element={<Photogallery />} />
          <Route path="/media-video" element={<Videogallery />} />



          {/* Class Data */}
          <Route path="class-data" element={<ClsWiseDataManagements />} />

          {/* Blogs */}
          <Route path="blogs" element={<BlogManagerPage />} />
          <Route path="blogs/view" element={<BlogView />} />

          {/* Testimonials */}
          <Route path="testimonials" element={<TestimonialPage />} />

          {/* User */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Survey & Events */}
          <Route path="survey" element={<AdmissionSurvey />} />
          <Route path="survey/view" element={<AdmissionSurvey />} />
          <Route path="survey/data" element={<AdmissionSurveyView />} />
          <Route path="events" element={<EventManagement />} />

          {/* Awards */}
          <Route path="awards" element={<AwardAdminPage />} />

          {/* Learning */}
          <Route path="learning/pre" element={<PrePrimery />} />
          <Route path="learning/primary" element={<Primery />} />
          <Route path="learning/secondary" element={<Secondary />} />

          {/* Front Office */}
          <Route path="front-office/visitors" element={<VisitorBook />} />
          <Route
            path="front-office/visitors/edit"
            element={<Visitorsbooksedit />}
          />
          <Route
            path="front-office/postal-dispatch"
            element={<PostalDispatch />}
          />
          <Route
            path="front-office/postal-receive"
            element={<PostalReceive />}
          />

          {/* Attendance */}
          <Route
            path="attendance/student-attendance"
            element={<StudentAttendance />}
          />
          <Route
            path="attendance/student-leave"
            element={<Studentleave />}
          />
          <Route
            path="attendance/student-leave/add"
            element={<Editleave />}
          />
          <Route
            path="attendance/attendance-report"
            element={<AttendanceReport />}
          />

          {/* FAQ */}
          <Route path="faq" element={<FaqPosting />} />
          <Route path="/awards" element={<AwardAdminPage />} />
          <Route path="/learning/pre" element={<PrePrimery />} />   
          <Route path="/learning/primary" element={<Primery />} />   
          <Route path="/front-office/postal-dispatch" element={<PostalDispatch />} />   
          <Route path="/front-office/postal-receive" element={<PostalReceive />} />   
          <Route path="/learning/secondary" element={<Secondary />} />   
          <Route path="/front-office/visitors" element={<VisitorBook />} />   
          <Route path="/faq" element={<FaqPosting />} />   
          <Route path="/teachers" element={<TeacherAdminPage />} />
          <Route path="/income/add-income" element={<AddIncome />} />
          <Route path="/income/search-income" element={<SearchIncome />} />
          <Route path="/income/income-head" element={<IncomeHead />} />
           <Route path="/front-office/complain" element={<Complain />} />
           <Route path="/front-office/complain/add" element={<ComplainAdd />} />
           <Route path="/academics/daily-time-table" element={<DailyTimeTable />} />
           <Route path="/academics/class-time-table" element={<ClassTimeTable />} />
           <Route path="/academics/teacher-timetable" element={<TeacherTimeTable/>}/>

          <Route path="/front-office/gate-pass" element={<GatePass />} />

          <Route path="academics/co-curricular-subject" element={<Cocurricular/>}/>
          <Route path="academics/Subject" element={<Subject/>}/>
          <Route path="/academics/assign-subjects" element={<AssignSubjects/>}/>
          <Route path="/primary-evaluation/activity" element={<Activity/>}/>
          <Route path="/primary-evaluation/assessment"element={<Assessment/>}/>
          <Route path="/primary-evaluation/evaluation-remark" element={<EvaluationRemark/>}/>
          <Route path="/primary-evaluation/class-report" element={<PrimaryClassReport/>}/>
          <Route path="/library/book-list" element={<BookList />} />
          <Route path="/library/issue-return" element={< IssueReturn/>}/>
          <Route path="/library/add-student" element={< AddStudent/>}/>
          {/* <Route path="/library/add-staff" element={< AddStaff/>}/> */}
          <Route path="/library/issued-return-report" element={<IssuedReturnReport/>}/>
          
          <Route path="/academics/assign-class-teacher" element={<AssignClassTeacher />} />
          <Route path="/academics/class" element={<ClassPage />} />
          <Route path="/academics/section" element={<SectionPage />} />
          <Route path="/front-office/enquiry" element={<AdmissionEnquiry />} />
          <Route path="/edit-admission-enquiry" element={<EditAdmissionEnquiry />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/library/issue-book" element={<IssueReturn/>}/>
          <Route path="/student-list" element={<StudentList/>}/>
          <Route path="/library/return-book" element={<ReturnBook/>}/>
          <Route path="library/student" element={<AddStudent/>}/>
          <Route path="/library/staff" element={<Stafflibrary/>}/>
         


         
          <Route
            path="/front-office/postal-dispatch"
            element={<PostalDispatch />}
          />
          <Route
            path="/front-office/postal-receive"
            element={<PostalReceive />}
          />
          <Route
            path="/front-office/postal-receive"
            element={<PostalReceive />}
          />

          <Route path="/faq" element={<FaqPosting />} />
        </Route>

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
