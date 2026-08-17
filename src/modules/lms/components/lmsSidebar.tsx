import React from "react";
import "../../../styles/dashboardSidebar.css";
import { NavLink } from "react-router-dom";

interface LMSSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
function LMSSidebar({ collapsed, setCollapsed }:LMSSidebarProps) {
  const links = [
    { to: "/lms", name: "Overview", end: true },
    { to: "/lms/user-management", name: "User Management" },
    { to: "/lms/employee-management", name: "Employee Management" },
    { to: "/lms/instructor", name: "Instructor " },
    { to: "/lms/operator", name: "Operator " },
    { to: "/lms/course-management", name: "Course Management" },
    { to: "/lms/departments", name: "Departments" },
  ];

  return (
    <>
      <div className="border bg-white">
        <div
          className={`side-bar rounded d-flex flex-column justify-content-between p-2 ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"
            }`}
        >
          <div className="row g-3 m-0 w-100">
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-sm border-0 bg-transparent"
                onClick={() => setCollapsed((prev) => !prev)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                  fill="none"
                  style={{
                    transition: "transform .3s",
                    transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path d="M8 11H40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <path d="M8 24H40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <path d="M8 37H40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <path d="M13.6567 29.6569L7.99988 24L13.6567 18.3431" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `h-40px w-100 rounded-3 d-flex align-items-center text-decoration-none navigation-hover ${collapsed ? "justify-content-center p-0" : "justify-content-start px-4"
                  } ${isActive ? "active" : ""}`
                }
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  {/* Generic icon */}
                  <path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm10 10h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zM17 3c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zM7 13c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z" />
                </svg>
                {!collapsed && <span className="ms-2 text-nowrap" style={{ fontSize: '0.9rem' }}>{link.name}</span>}
              </NavLink>
            ))}
          </div>

          <div className="d-flex h-30px w-100 align-items-center justify-content-center">
            <svg
              className="me-1"
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8.51428 20H4.51428C3.40971 20 2.51428 19.1046 2.51428 18V6C2.51428 4.89543 3.40971 4 4.51428 4H8.51428V6H4.51428V18H8.51428V20Z" fill="red"></path>
              <path d="M13.8418 17.385L15.262 15.9768L11.3428 12.0242L20.4857 12.0242C21.038 12.0242 21.4857 11.5765 21.4857 11.0242C21.4857 10.4719 21.038 10.0242 20.4857 10.0242L11.3236 10.0242L15.304 6.0774L13.8958 4.6572L7.5049 10.9941L13.8418 17.385Z" fill="red"></path>
            </svg>
            {!collapsed && <p className="mb-0 text-danger fw-semibold" style={{ fontSize: '0.9rem' }}>Logout</p>}
          </div>
        </div>
      </div>
    </>
  );
}
export default LMSSidebar;
