import DashboardRoutes from "./dashboardRoutes";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../shared/pages/loginPage";
import AdminPortal from "../shared/pages/adminPortal";
import LMSRoutes from "./lmsRoutes";
function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/admin-portals" element={<AdminPortal />}></Route>
        <Route path="dashboard/*" element={<DashboardRoutes />}></Route>
        <Route path="lms/*" element={<LMSRoutes />}></Route>
      </Routes>
    </>
  );
}
export default AppRoutes;
