import { Route, Routes } from "react-router-dom";
import DashboardOverview from "../modules/dashboard/pages/dashboardOverview";
import Attendance from "../modules/dashboard/pages/attendance";
import DashboardTemplate from "../modules/dashboard/pages/dashboardTemplate";
import Requirements from "../modules/dashboard/pages/requirements";
import CTQMonitoring from "../modules/dashboard/pages/ctqMonitoring";
import ReportSystem from "../modules/dashboard/pages/reportSystem";
import ProtectedRoute from "../shared/services/protectedRoutes";
function DashboardRoutes() {
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardTemplate />}>
            <Route index element={<DashboardOverview />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="requirements" element={<Requirements />} />
            <Route path="ctq-monitoring" element={<CTQMonitoring />} />
            <Route path="report-system-management" element={<ReportSystem />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
export default DashboardRoutes;
