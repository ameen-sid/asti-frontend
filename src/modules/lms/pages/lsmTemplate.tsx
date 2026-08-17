import { Outlet } from "react-router-dom";
import Navbar from "../../../shared/components/navbar";
import LMSSidebar from "../components/lmsSidebar";
import { useState } from "react";
function LMSTemplate(){
      const [collapsed, setCollapsed] = useState(false);

    return (
        <>
        <div className="container-fluid main-dashboard-container p-0">
        <Navbar />

        <div className="dashboard-body">
          <LMSSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

          <div
            className={`dashboard-content ${
              collapsed ? "content-collapsed" : "content-expanded"
            }`}
          >
            <Outlet />
          </div>
        </div>
      </div>
        </>
    );
}
export default LMSTemplate;