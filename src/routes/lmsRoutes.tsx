import { Route, Routes } from "react-router-dom";
import LMSOverview from "../modules/lms/pages/lsmOverview";
import LMSTemplate from "../modules/lms/pages/lsmTemplate";
import UserManagement from "../modules/lms/pages/userManagement";

import EmployeeManagement from "../modules/lms/pages/employeeManagement";
import Courses from "../modules/lms/pages/courses";
import DojoManagement from "../modules/lms/pages/dojoManagement";
import OperatorDistributor from "../modules/lms/pages/operatorDistributor";
import CourseManagement from "../modules/lms/pages/courseManagement";
import Departments from "../modules/lms/pages/departments";
import SubDepartments from "../modules/lms/pages/subDepartments";
import SectionsAndLines from "../modules/lms/pages/sectionsAndLines";
import Machines from "../modules/lms/pages/machines";
import CreateQuestionPaper from "../modules/lms/pages/createQuestionPaper";
import PreviewQuestionPaper from "../modules/lms/pages/previewQuestionPaper";
import ProtectedRoute from "../shared/services/protectedRoutes";
import TrainingMaterial from "../modules/lms/pages/trainingMaterial";
import { Examination } from "../modules/lms/pages/examination";
import RolesPermissions from "../modules/lms/pages/rolesPermissions";

function LMSRoutes() {
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<LMSTemplate />}>
            <Route index element={<LMSOverview />} />
            <Route path="user-management" element={<UserManagement />} />

            <Route path="employee-management" element={<EmployeeManagement />} />
            <Route path="courses" element={<Courses />} />
            <Route path="dojo-management" element={<DojoManagement />} />
            <Route path="operator-distributor" element={<OperatorDistributor />} />
            <Route path="course-management" element={<CourseManagement />} />
            <Route path="question-paper-management" element={<CourseManagement />} />
            <Route path="create-question-paper" element={<CreateQuestionPaper />} />
            <Route path="departments" element={<Departments />} />
            <Route path="departments/sub-departments" element={<SubDepartments />} />
            <Route path="departments/:deptName/sub-departments" element={<SubDepartments />} />
            <Route path="departments/:deptName" element={<SubDepartments />} />
            <Route path="departments/sections-lines" element={<SectionsAndLines />} />
            <Route path="departments/machines" element={<Machines />} />
            <Route path="training-material" element={<TrainingMaterial />} />
            <Route path="examination" element={<Examination />} />
            <Route path="roles-permissions" element={<RolesPermissions />} />
          </Route>
        </Route>

        {/* Standalone full-page routes (no sidebar) */}
        <Route path="preview-question-paper" element={<PreviewQuestionPaper />} />
      </Routes >
    </>
  );
}
export default LMSRoutes;
