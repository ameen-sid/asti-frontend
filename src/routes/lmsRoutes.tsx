import { Route, Routes } from "react-router-dom";
import LMSOverview from "../modules/lms/pages/lsmOverview";
import LMSTemplate from "../modules/lms/pages/lsmTemplate";
import UserManagement from "../modules/lms/pages/userManagement";
import Operator from "../modules/lms/pages/operator";
import InstructorManagement from "../modules/lms/pages/instructor";
import EmployeeManagement from "../modules/lms/pages/employeeManagement";
import CourseManagement from "../modules/lms/pages/courseManagement";
import Departments from "../modules/lms/pages/departments";
function LMSRoutes() {
  return (
    <>
      <Routes>
        <Route element={<LMSTemplate />}>
          <Route index element={<LMSOverview />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="instructor" element={<InstructorManagement />} />
          <Route path="operator" element={<Operator />} />
          <Route path="employee-management" element={<EmployeeManagement />} />
          <Route path="course-management" element={<CourseManagement />} />
          <Route path="departments" element={<Departments />} />
        </Route>
      </Routes>
    </>
  );
}
export default LMSRoutes;
