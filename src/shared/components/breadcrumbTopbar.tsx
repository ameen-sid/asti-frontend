import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/breadcrumbTopbar.css";

// Map URL segments to readable labels
const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  lms: "LMS",
  attendance: "Attendance",
  requirements: "Requirements",
  dojo: "DOJO",
  "ctq-monitoring": "CTQ Monitoring",
  "report-system-management": "Report System",
  "user-management": "User Management",
  "employee-management": "Employee Management",
  courses: "Courses",
  "dojo-management": "DOJO Management",
  "operator-distributor": "Operator Distributor",
  instructor: "Instructor",
  operator: "Operator",
  "course-management": "Question Paper Management",
  "question-paper-management": "Question Paper Management",
  "create-question-paper": "Create Question Paper",
  departments: "Departments",
  "sub-departments": "Sub-Departments",
  "sections-lines": "Sections & Lines",
  machines: "Machines",
};

function toLabel(segment: string): string {
  return (
    segmentLabels[segment] ||
    segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

function BreadcrumbTopbar() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Build cumulative breadcrumb paths
  const crumbs = pathSegments.map((segment, i) => ({
    label: toLabel(segment),
    path: "/" + pathSegments.slice(0, i + 1).join("/"),
    isLast: i === pathSegments.length - 1,
  }));

  return (
    <div className="breadcrumb-topbar">
      {/* Breadcrumb trail */}
      <nav className="breadcrumb-trail" aria-label="Breadcrumb">
        {crumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.path}>
            {idx > 0 && (
              <span className="breadcrumb-sep">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            )}
            {crumb.isLast ? (
              <span className="breadcrumb-item-active">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="breadcrumb-item-link">
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
}

export default BreadcrumbTopbar;
