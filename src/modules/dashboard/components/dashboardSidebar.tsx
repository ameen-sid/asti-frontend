import React, { useState } from "react";
import "../../../styles/dashboardSidebar.css";
import logo from "../../../assets/asti-india-logo.png";
import { logout } from "../../../shared/services/authService";
interface DashboardSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
import { NavLink, Link } from "react-router-dom";
function DashboardSidebar({
  collapsed,
  setCollapsed,
}: DashboardSidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = () => {
    try {

      logout();
      window.location.href = "/";

    } catch (e) {
      console.error("Logout error:", e);
      logout();
      window.location.href = "/";
    }
  };
  return (
    <>
      {/* Scrollable navigation links container */}
      <div className="sidebar-nav-scroll">
        <div className="row g-3 m-0 w-100">
          {/* Logo + collapse button row */}
          <div className="sidebar-header-row d-flex align-items-center justify-content-between w-100 px-1">
            {/* Logo — hidden when collapsed */}
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
                width="28"
                height="28"
                viewBox="0 0 48 48"
                fill="none"
                style={{
                  transition: "transform .3s",
                  transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <path
                  d="M8 11H40"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M8 24H40"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M8 37H40"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M13.6567 29.6569L7.99988 24L13.6567 18.3431"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          {/* Portals Button */}
          <Link
            to="/admin-portals"
            className={`portal-sidebar-btn h-40px w-100 rounded-3 d-flex align-items-center text-decoration-none navigation-hover ${collapsed ? "justify-content-center p-0" : "justify-content-start px-4"}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zm0 10h6v6h-6v-6zm-10 0h6v6H4v-6z" />
            </svg>
            {!collapsed && <span className="ms-2">Portals</span>}
            {!collapsed && <span className="portal-sidebar-badge ms-auto">Switch</span>}
          </Link>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `h-40px w-100 rounded-3 d-flex align-items-center text-decoration-none navigation-hover ${collapsed
                ? "justify-content-center p-0"
                : "justify-content-start px-4"
              } ${isActive ? "active" : ""}`
            }
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm10 10h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zM17 3c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zM7 13c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z" />
            </svg>

            {!collapsed && <span className="ms-2">Dashboard</span>}
          </NavLink>
          <NavLink
            to="/dashboard/attendance"
            className={({ isActive }) =>
              `h-40px w-100 rounded-3 d-flex align-items-center text-decoration-none navigation-hover ${collapsed
                ? "justify-content-center p-0"
                : "justify-content-start px-4"
              } ${isActive ? "active" : ""}`
            }
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              id="mdi-calendar-month-outline-39769088"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7,12H9V14H7V12M21,6V20A2,2 0 0,1 19,22H5C3.89,22 3,21.1 3,20V6A2,2 0 0,1 5,4H6V2H8V4H16V2H18V4H19A2,2 0 0,1 21,6M5,8H19V6H5V8M19,20V10H5V20H19M15,14V12H17V14H15M11,14V12H13V14H11M7,16H9V18H7V16M15,18V16H17V18H15M11,18V16H13V18H11Z"></path>
            </svg>
            {!collapsed && <span className="ms-2">Attendance</span>}
          </NavLink>
          <NavLink
            to="/dashboard/requirements"
            className={({ isActive }) =>
              `h-40px w-100 rounded-3 d-flex align-items-center text-decoration-none navigation-hover ${collapsed
                ? "justify-content-center p-0"
                : "justify-content-start px-4"
              } ${isActive ? "active" : ""}`
            }
          >
            <svg
              aria-hidden="true"
              width="25px"
              height="25px"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 3C0.447715 3 0 3.44772 0 4C0 4.55228 0.447716 5 1 5H9C9.55228 5 10 4.55228 10 4C10 3.44772 9.55228 3 9 3H1Z"
                fill="currentColor"
              ></path>
              <path
                d="M1 7C0.447715 7 0 7.44772 0 8C0 8.55228 0.447715 9 1 9H7C7.55228 9 8 8.55228 8 8C8 7.44772 7.55228 7 7 7H1Z"
                fill="currentColor"
              ></path>
              <path
                d="M0 12C0 11.4477 0.447715 11 1 11H9C9.55228 11 10 11.4477 10 12C10 12.5523 9.55228 13 9 13H1C0.447716 13 0 12.5523 0 12Z"
                fill="currentColor"
              ></path>
              <path
                d="M15.707 7.20711C16.0975 6.81658 16.0975 6.18342 15.707 5.79289C15.3165 5.40237 14.6833 5.40237 14.2928 5.79289L11.9999 8.08579L11.2115 7.29741C10.821 6.90689 10.1878 6.90689 9.79729 7.29741C9.40676 7.68793 9.40676 8.3211 9.79729 8.71162L11.2928 10.2071C11.6833 10.5976 12.3165 10.5976 12.707 10.2071L15.707 7.20711Z"
                fill="currentColor"
              ></path>
            </svg>
            {!collapsed && <span className="ms-2">Requirement</span>}
          </NavLink>
          <NavLink
            to="/dashboard/dojo"
            className={({ isActive }) =>
              `h-40px w-100 rounded-3 d-flex align-items-center text-decoration-none navigation-hover ${collapsed
                ? "justify-content-center p-0"
                : "justify-content-start px-4"
              } ${isActive ? "active" : ""}`
            }
          >
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            {!collapsed && <span className="ms-2">DOJO</span>}
          </NavLink>
          <NavLink
            to="/dashboard/ctq-monitoring"
            className={({ isActive }) =>
              `h-40px w-100 rounded-3 d-flex align-items-center text-decoration-none navigation-hover ${collapsed
                ? "justify-content-center p-0"
                : "justify-content-start px-4"
              } ${isActive ? "active" : ""}`
            }
          >
            <svg
              aria-hidden="true"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 13.1953C3 13.1953 4.29824 13.7554 5.25301 13.7335C7.26943 13.6872 8.65089 12.1937 10.6306 12.0003C12.4439 11.823 13.6152 13.5619 15.5298 13.5005C17.708 13.4307 21 11.2335 21 11.2335"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.5 14L21 11.2336L19 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                opacity="0.4"
                d="M3 3V21H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {!collapsed && <span className="ms-2">CTQ Monitoring</span>}
          </NavLink>
          {/* <NavLink
            to="/dashboard/report-system-management"
            className={({ isActive }) =>
              `h-40px w-100 rounded-3 d-flex align-items-center text-decoration-none navigation-hover ${collapsed
                ? "justify-content-center p-0"
                : "justify-content-start px-4"
              } ${isActive ? "active" : ""}`
            }
          >
            <svg
              aria-hidden="true"
              width="24"
              height="24"
              viewBox="0 0 48 48"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="48"
                height="48"
                fill="white"
                fillOpacity="0.01"
              ></rect>
              <path
                d="M17 33.9502V42.1102"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              ></path>
              <path
                d="M9 40V42.0556"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              ></path>
              <path
                d="M25 27V42.0714"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              ></path>
              <path
                d="M33 18.9614V42.0878"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              ></path>
              <path
                d="M41 10.9707V42.0833"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              ></path>
              <path
                d="M7 33L34 6"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              ></path>
              <path
                d="M7 22L7 33"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              ></path>
            </svg>
            {!collapsed && <span className="ms-2">Report System</span>}
          
          </NavLink> */}
        </div>
      </div>

      {/* Pinned footer logout button */}
      <div className="sidebar-footer-section w-100">
        <button
          type="button"
          className="sidebar-logout-btn justify-content-center text-center p-0"
          onClick={(e) => {
            handleLogout();
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
            <span className="ms-2" style={{ pointerEvents: "none" }}>
              Logout
            </span>
          )}
        </button>
      </div>


    </>
  );
}
export default DashboardSidebar;
