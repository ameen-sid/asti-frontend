import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/asti-india-logo.png";
import "../../styles/adminPortal.css";

type PortalName = "dashboard" | "lms" | "cms";
type PortalColor = "pink" | "purple" | "blue";

interface Portal {
  title: string;
  description: string;
  path: string;
  portalName: PortalName;
  color: PortalColor;
}

function AdminPortal() {
  const portals: Portal[] = [
    {
      title: "Dashboard",
      description:
        "Get real-time insights and an overview of key metrics at a glance.",
      path: "/dashboard",
      portalName: "dashboard",
      color: "pink",
    },
    {
      title: "LMS",
      description:
        "Empower learning with engaging content and seamless management.",
      path: "/lms",
      portalName: "lms",
      color: "purple",
    },
    {
      title: "CMS",
      description:
        "Create, manage, and optimize content effortlessly in one powerful platform.",
      path: "#",
      portalName: "cms",
      color: "blue",
    },
  ];

  const icons: Record<PortalName, React.ReactNode> = {
    dashboard: (
      <svg
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="8" y1="9" x2="8" y2="15" />
        <line x1="12" y1="11" x2="12" y2="15" />
        <line x1="16" y1="7" x2="16" y2="15" />
        <line x1="3" y1="8" x2="21" y2="8" />
      </svg>
    ),

    lms: (
      <svg
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
        <path d="M4 5.5v16" />
        <path d="M8 7h8" />
        <path d="M8 11h8" />
      </svg>
    ),

    cms: (
      <svg
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M5 3h10l4 4v14H5z" />
        <path d="M15 3v5h4" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="8" y1="16" x2="14" y2="16" />
      </svg>
    ),
  };

  return (
    <div className="portal-page-container">
      <div className="portal-glow portal-glow-pink"></div>
      <div className="portal-glow portal-glow-blue"></div>

      <div className="portal-wave portal-wave-left"></div>
      <div className="portal-wave portal-wave-right"></div>

      <div className="portal-content">
        <div className="portal-header">
          <img className="portal-logo" src={logo} alt="ASTI India" />

          <h2>Smart Solutions. Stronger Tomorrow.</h2>

          <div className="portal-title-line">
            <span></span>
            <i></i>
          </div>
        </div>

        <div className="portal-cards-wrapper">
          {portals.map((portal) => {
            const CardContent = (
              <div className={`portal-card ${portal.color}`}>
                <div className="portal-icon-wrapper">
                  <div className="portal-icon">
                    {icons[portal.portalName]}
                  </div>
                </div>

                <div className="portal-card-content">
                  <h1 className="text-start">{portal.title}</h1>

                  <div className="portal-small-line"></div>
                </div>

                <div className="portal-arrow">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>

                <div className="card-curve"></div>
              </div>
            );

            return portal.path !== "#" ? (
              <Link
                to={portal.path}
                key={portal.title}
                className="portal-card-link"
              >
                {CardContent}
              </Link>
            ) : (
              <div key={portal.title} className="portal-card-link">
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminPortal;