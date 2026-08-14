import React from "react";
import "../../../styles/dashboardSidebar.css";


interface DashboardSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
import { NavLink } from "react-router-dom";
function DashboardSidebar({
  collapsed,
  setCollapsed,
}: DashboardSidebarProps) {
  return (
    <>
      <div className="border bg-white">
        <div
          className={`side-bar rounded d-flex flex-column justify-content-between p-2 ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"
            }`}
        >
          {/* three navigations of the sidebar  */}
          <div className="row g-3 m-0 w-100">
            {/* collape button for the side bar  */}
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-sm border-0 bg-transparent"
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
                  stroke-width="1.5"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17.5 14L21 11.2336L19 7"
                  stroke="currentColor"
                  stroke-width="1.5"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <path
                  opacity="0.4"
                  d="M3 3V21H21"
                  stroke="currentColor"
                  stroke-width="1.5"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {!collapsed && <span className="ms-2">CTQ Monitoring</span>}
            </NavLink>
            <NavLink
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
            </NavLink>
          </div>
          {/* logout button  */}
          <div className="d-flex h-30px w-100 align-items-center justify-content-center">
            <svg
              className="me-1"
              aria-hidden="true"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.51428 20H4.51428C3.40971 20 2.51428 19.1046 2.51428 18V6C2.51428 4.89543 3.40971 4 4.51428 4H8.51428V6H4.51428V18H8.51428V20Z"
                fill="red"
              ></path>
              <path
                d="M13.8418 17.385L15.262 15.9768L11.3428 12.0242L20.4857 12.0242C21.038 12.0242 21.4857 11.5765 21.4857 11.0242C21.4857 10.4719 21.038 10.0242 20.4857 10.0242L11.3236 10.0242L15.304 6.0774L13.8958 4.6572L7.5049 10.9941L13.8418 17.385Z"
                fill="red"
              ></path>
            </svg>
            {!collapsed && (
              <p className="mb-0 text-danger fw-semibold">Logout</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default DashboardSidebar;
