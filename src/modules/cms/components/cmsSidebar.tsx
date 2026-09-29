import React, { useState } from "react";
import "../../../styles/dashboardSidebar.css";
import { NavLink, Link } from "react-router-dom";
import logo from "../../../assets/asti-india-logo.png";
import LogoutModal from "../../../shared/components/logoutModal";

interface CMSSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

function CMSSidebar({ collapsed, setCollapsed }: CMSSidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const links = [

    { to: "/cms/man-related-defects", name: "Man Related Defects" },
    { to: "/cms/total-defects", name: "Total Defects" },
  ];

  return (
    <>
      {/* Scrollable navigation links container */}
      <div className="sidebar-nav-scroll">
        <div className="row g-3 m-0 w-100">
          {/* Logo + collapse button row */}
          <div className="sidebar-header-row d-flex align-items-center justify-content-between w-100 px-1">
            {!collapsed && (
              <img
                src={logo}
                alt="ASTI India"
                className="sidebar-logo"
              />
            )}
            <button
              type="button"
              className={`btn btn-sm border-0 bg-transparent ${collapsed ? "mx-auto" : "ms-auto"}`}
              onClick={() => setCollapsed((prev) => !prev)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 48 48"
                fill="none"
                style={{
                  transition: "transform .3s",
                  transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                  flexShrink: 0,
                }}
              >
                <path d="M8 11H40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M8 24H40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M8 37H40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M13.6567 29.6569L7.99988 24L13.6567 18.3431" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Portals Button */}
          <Link
            to="/admin-portals"
            className={`portal-sidebar-btn h-40px w-100 rounded-3 d-flex align-items-center text-decoration-none navigation-hover ${collapsed ? "justify-content-center p-0" : "justify-content-start px-3"}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zm0 10h6v6h-6v-6zm-10 0h6v6H4v-6z" />
            </svg>
            {!collapsed && <span className="ms-2">Portals</span>}
            {!collapsed && <span className="portal-sidebar-badge ms-auto">Switch</span>}
          </Link>

          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `h-40px w-100 rounded-3 d-flex align-items-center text-decoration-none navigation-hover ${collapsed ? "justify-content-center p-0" : "justify-content-start px-3"
                } ${isActive ? "active" : ""}`
              }
            >
              {link.name === "Total Defects" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
              {!collapsed && (
                <span className="ms-2 text-nowrap" style={{ fontSize: "0.9rem" }}>
                  {link.name}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Pinned footer logout button */}
      <div className="sidebar-footer-section w-100">
        <button
          type="button"
          className="sidebar-logout-btn justify-content-center p-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowLogoutModal(true);
          }}
          title="Log out"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pointerEvents: "none", flexShrink: 0 }}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && (
            <span className="ms-2" style={{ pointerEvents: "none", fontSize: "0.9rem" }}>
              Logout
            </span>
          )}
        </button>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
}

export default CMSSidebar;
