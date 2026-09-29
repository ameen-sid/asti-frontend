import { Outlet } from "react-router-dom";
import BreadcrumbTopbar from "../../../shared/components/breadcrumbTopbar";
import CMSSidebar from "../components/cmsSidebar";
import { useState, useEffect } from "react";

function CMSTemplate() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = () => window.innerWidth <= 768;

  // Auto-collapse sidebar on small screens on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (isMobile()) {
        setCollapsed(true);
        setMobileOpen(false);
      } else {
        setCollapsed(false);
        setMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile floating hamburger toggle */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label="Toggle navigation"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop visible"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="container-fluid main-dashboard-container p-0">
        <div className="dashboard-body no-navbar">
          <div className={`side-bar rounded ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"} ${mobileOpen ? "mobile-open" : ""}`}>
            <CMSSidebar
              collapsed={collapsed}
              setCollapsed={(val) => {
                if (typeof val === "function") {
                  setCollapsed(val);
                } else {
                  setCollapsed(val);
                }
                if (isMobile()) setMobileOpen(false);
              }}
            />
          </div>
          <div
            className={`dashboard-content ${collapsed ? "content-collapsed" : "content-expanded"}`}
          >
            <BreadcrumbTopbar />
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default CMSTemplate;
