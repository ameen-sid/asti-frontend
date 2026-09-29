import { Route, Routes, Navigate } from "react-router-dom";
import CMSTemplate from "../modules/cms/pages/cmsTemplate";
import TotalDefects from "../modules/cms/pages/totalDefects";
import ManRelatedDefects from "../modules/cms/pages/manRelatedDefects";
import ProtectedRoute from "../shared/services/protectedRoutes";

function CMSRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<CMSTemplate />}>
          <Route index element={<Navigate to="man-related-defects" replace />} />
          <Route path="total-defects" element={<TotalDefects />} />
          <Route path="man-related-defects" element={<ManRelatedDefects />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default CMSRoutes;
