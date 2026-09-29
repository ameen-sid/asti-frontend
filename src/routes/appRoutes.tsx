import DashboardRoutes from "./dashboardRoutes";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../shared/pages/loginPage";
import AdminPortal from "../shared/pages/adminPortal";
import LMSRoutes from "./lmsRoutes";
import CMSRoutes from "./cmsRoutes";
import ProtectedRoute from "../shared/services/protectedRoutes";
import PublicRoute from "../shared/services/publicRoute";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin-portals" element={<AdminPortal />}></Route>
          <Route path="dashboard/*" element={<DashboardRoutes />}></Route>
          <Route path="lms/*" element={<LMSRoutes />}></Route>
          <Route path="cms/*" element={<CMSRoutes />}></Route>
        </Route>
      </Routes>
    </>
  );
}
export default AppRoutes;
