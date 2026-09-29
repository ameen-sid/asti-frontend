import React, { useState, useMemo } from "react";
import "../../../styles/departments.css";

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface PermissionItem {
  id: string;
  name: string;
  description: string;
}

interface ModuleGroup {
  id: string;
  title: string;
  description: string;
  permissions: PermissionItem[];
}

interface RoleItem {
  id: string;
  name: string;
  category: "STAFF" | "OPERATOR";
  description: string;
  userCount: number;
}

// ─── Master Data ─────────────────────────────────────────────────────────────

const DEFAULT_ROLES: RoleItem[] = [
  {
    id: "admin",
    name: "Admin",
    category: "STAFF",
    description: "Full system administration and LMS operations",
    userCount: 4,
  },
  {
    id: "manager",
    name: "Manager",
    category: "STAFF",
    description: "Department and production team management",
    userCount: 8,
  },
  {
    id: "hr",
    name: "HR",
    category: "STAFF",
    description: "Employee records and training administration",
    userCount: 6,
  },
  {
    id: "engineer",
    name: "Engineer",
    category: "STAFF",
    description: "Technical, process standards and LMS operations",
    userCount: 14,
  },
  {
    id: "operator",
    name: "Operator",
    category: "OPERATOR",
    description: "Assigned learning, training and examination access",
    userCount: 142,
  },
];

const PERMISSION_MODULES: ModuleGroup[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Access to operational metrics, plant overview, and monitoring panels",
    permissions: [
      { id: "dash_view", name: "View Dashboard", description: "Allow this role to view the overview dashboard and high-level KPIs" },
      { id: "dash_analytics", name: "View Analytics & Metrics", description: "Allow access to detailed plant and station performance analytics" },
      { id: "dash_export", name: "Export Dashboard Reports", description: "Allow exporting summary sheets and monitoring logs" },
    ],
  },
  {
    id: "courses",
    title: "Courses",
    description: "Manage SOP courses, skill requirements, and module catalogs",
    permissions: [
      { id: "crs_view", name: "View Courses", description: "Allow this role to view courses catalog and details" },
      { id: "crs_add", name: "Add Course", description: "Allow creating new automotive training courses and modules" },
      { id: "crs_edit", name: "Edit Course", description: "Allow modifying existing courses, prerequisites, and criteria" },
      { id: "crs_delete", name: "Delete Course", description: "Allow archiving or removing courses from the LMS catalog" },
      { id: "crs_assign", name: "Assign Course", description: "Allow assigning mandatory or optional courses to operators" },
    ],
  },
  {
    id: "training_material",
    title: "Training Material",
    description: "Course resources, PowerPoint presentations, Excel SOPs, and video modules",
    permissions: [
      { id: "tm_view", name: "View Training Material", description: "Allow opening and previewing PPT, Excel, and video resources" },
      { id: "tm_add", name: "Add Training Material", description: "Allow uploading new training documents and videos to courses" },
      { id: "tm_edit", name: "Edit Training Material", description: "Allow editing material details, notes, and file replacements" },
      { id: "tm_delete", name: "Delete Training Material", description: "Allow removing uploaded materials from courses" },
    ],
  },
  {
    id: "question_papers",
    title: "Question Papers",
    description: "Assessment templates, sections, multiple-choice questions, and passing marks",
    permissions: [
      { id: "qp_view", name: "View Question Papers", description: "Allow viewing published and draft evaluation question papers" },
      { id: "qp_create", name: "Create Question Paper", description: "Allow drafting new questions, sections, and answer keys" },
      { id: "qp_edit", name: "Edit Question Paper", description: "Allow updating question contents, marks, and passing criteria" },
      { id: "qp_delete", name: "Delete Question Paper", description: "Allow deleting question papers from the LMS repository" },
      { id: "qp_assign", name: "Assign Question Paper", description: "Allow scheduling question papers for training evaluations" },
    ],
  },
  {
    id: "examination",
    title: "Examination",
    description: "Computer-based examination portal, timer, evaluation, and test results",
    permissions: [
      { id: "exam_view", name: "View Examinations", description: "Allow viewing examination schedules and active sessions" },
      { id: "exam_conduct", name: "Conduct Examination", description: "Allow starting and supervising computer-based assessments" },
      { id: "exam_results", name: "View Results", description: "Allow inspecting scorecards, pass/fail status, and answer sheets" },
      { id: "exam_evaluate", name: "Evaluate Examination", description: "Allow verifying scores and approving operator qualifications" },
    ],
  },
  {
    id: "dojo",
    title: "DOJO Management",
    description: "Shop-floor hands-on practical training, station qualifying, and certifications",
    permissions: [
      { id: "dojo_view", name: "View DOJO", description: "Allow viewing DOJO training schedules and operator progress" },
      { id: "dojo_manage", name: "Manage DOJO", description: "Allow managing stations, practical test jigs, and criteria" },
      { id: "dojo_assign", name: "Assign Training", description: "Allow assigning operators to practical DOJO batches" },
      { id: "dojo_skill", name: "View Skill Levels", description: "Allow accessing operator skill level progression metrics" },
    ],
  },
  {
    id: "employee",
    title: "Employee Management",
    description: "Personnel directory, designations, shifts, and line placement details",
    permissions: [
      { id: "emp_view", name: "View Employees", description: "Allow viewing the operator and staff employee master list" },
      { id: "emp_add", name: "Add Employee", description: "Allow onboarding and adding new employee records" },
      { id: "emp_edit", name: "Edit Employee", description: "Allow updating employee personal, skill, and department data" },
      { id: "emp_delete", name: "Delete Employee", description: "Allow archiving or deactivating employee profiles" },
    ],
  },
  {
    id: "department",
    title: "Department Management",
    description: "Hierarchy of Departments, Sub-Departments, Sections, Lines, and Machines",
    permissions: [
      { id: "dept_view", name: "View Departments", description: "Allow viewing company organizational structures and plant lines" },
      { id: "dept_add", name: "Add Department", description: "Allow creating new departments, sections, and production lines" },
      { id: "dept_edit", name: "Edit Department", description: "Allow renaming or updating department placement records" },
      { id: "dept_delete", name: "Delete Department", description: "Allow removing departments or line configurations" },
    ],
  },
  {
    id: "reports",
    title: "Reports",
    description: "Compliance auditing, evaluation summaries, and LMS operational reports",
    permissions: [
      { id: "rep_view", name: "View Reports", description: "Allow accessing training completion and assessment reports" },
      { id: "rep_export", name: "Export Reports", description: "Allow downloading audit summaries and Excel compliance data" },
    ],
  },
  {
    id: "roles_permissions",
    title: "Roles & Permissions",
    description: "System role definitions, module permissions, and access privileges",
    permissions: [
      { id: "role_view", name: "View Roles", description: "Allow inspecting roles and their configured permission sets" },
      { id: "role_add", name: "Add Role", description: "Allow defining new staff and operator role profiles" },
      { id: "role_edit", name: "Edit Role", description: "Allow modifying role descriptions and settings" },
      { id: "role_manage", name: "Manage Permissions", description: "Allow updating module access toggles and capabilities" },
    ],
  },
];

// Default permission presets for realistic demonstration
const ROLE_DEFAULTS: Record<string, string[]> = {
  admin: PERMISSION_MODULES.flatMap((m) => m.permissions.map((p) => p.id)),
  manager: [
    "dash_view", "dash_analytics", "dash_export",
    "crs_view", "crs_add", "crs_edit", "crs_assign",
    "tm_view", "tm_add", "tm_edit",
    "qp_view", "qp_create", "qp_assign",
    "exam_view", "exam_results",
    "dojo_view", "dojo_manage", "dojo_assign", "dojo_skill",
    "emp_view", "dept_view",
    "rep_view", "rep_export",
    "role_view",
  ],
  hr: [
    "dash_view",
    "crs_view", "crs_assign",
    "tm_view",
    "qp_view",
    "exam_view", "exam_results",
    "dojo_view", "dojo_skill",
    "emp_view", "emp_add", "emp_edit", "emp_delete",
    "dept_view",
    "rep_view", "rep_export",
    "role_view",
  ],
  engineer: [
    "dash_view", "dash_analytics",
    "crs_view", "crs_add", "crs_edit",
    "tm_view", "tm_add", "tm_edit", "tm_delete",
    "qp_view", "qp_create", "qp_edit",
    "exam_view", "exam_conduct", "exam_results", "exam_evaluate",
    "dojo_view", "dojo_manage", "dojo_skill",
    "emp_view", "dept_view",
  ],
  operator: [
    "crs_view",
    "tm_view",
    "exam_view", "exam_conduct",
    "dojo_view",
  ],
};

// ─── Component ───────────────────────────────────────────────────────────────

export function RolesPermissions() {
  const [roles, setRoles] = useState<RoleItem[]>(DEFAULT_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("admin");
  const [roleSearch, setRoleSearch] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Role Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>("");
  const [newRoleType, setNewRoleType] = useState<"Staff" | "Operator">("Staff");
  const [newRoleDescription, setNewRoleDescription] = useState<string>("");

  // Store permissions state keyed by roleId -> Set of permission IDs
  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>(() => {
    const initial: Record<string, Record<string, boolean>> = {};
    DEFAULT_ROLES.forEach((r) => {
      const activeIds = ROLE_DEFAULTS[r.id] || [];
      const map: Record<string, boolean> = {};
      PERMISSION_MODULES.forEach((m) => {
        m.permissions.forEach((p) => {
          map[p.id] = activeIds.includes(p.id);
        });
      });
      initial[r.id] = map;
    });
    return initial;
  });

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];
  const currentPermissions = rolePermissions[selectedRole.id] || {};

  // All permission count
  const allPermissionsCount = useMemo(() => {
    return PERMISSION_MODULES.reduce((acc, m) => acc + m.permissions.length, 0);
  }, []);

  // Selected count for active role
  const selectedCount = useMemo(() => {
    return Object.values(currentPermissions).filter(Boolean).length;
  }, [currentPermissions]);

  // Filter roles by search
  const filteredRoles = useMemo(() => {
    const q = roleSearch.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [roles, roleSearch]);

  const staffRoles = filteredRoles.filter((r) => r.category === "STAFF");
  const operatorRoles = filteredRoles.filter((r) => r.category === "OPERATOR");

  // Toggle individual permission
  const handleTogglePermission = (permId: string) => {
    setRolePermissions((prev) => {
      const current = prev[selectedRole.id] || {};
      return {
        ...prev,
        [selectedRole.id]: {
          ...current,
          [permId]: !current[permId],
        },
      };
    });
  };

  // Toggle Select All for a module
  const handleToggleModule = (module: ModuleGroup) => {
    const allEnabled = module.permissions.every((p) => currentPermissions[p.id]);
    setRolePermissions((prev) => {
      const current = { ...(prev[selectedRole.id] || {}) };
      module.permissions.forEach((p) => {
        current[p.id] = !allEnabled;
      });
      return {
        ...prev,
        [selectedRole.id]: current,
      };
    });
  };

  // Reset to default
  const handleReset = () => {
    const defaultIds = ROLE_DEFAULTS[selectedRole.id] || [];
    setRolePermissions((prev) => {
      const resetMap: Record<string, boolean> = {};
      PERMISSION_MODULES.forEach((m) => {
        m.permissions.forEach((p) => {
          resetMap[p.id] = defaultIds.includes(p.id);
        });
      });
      return {
        ...prev,
        [selectedRole.id]: resetMap,
      };
    });
    setToastMessage(`Permissions for "${selectedRole.name}" reset to defaults.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Save UI feedback
  const handleSave = () => {
    setToastMessage(`Permissions for "${selectedRole.name}" updated successfully!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Add new role (UI only)
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newId = newRoleName.trim().toLowerCase().replace(/\s+/g, "_");
    const roleCat: "STAFF" | "OPERATOR" = newRoleType === "Operator" ? "OPERATOR" : "STAFF";

    const newRole: RoleItem = {
      id: newId,
      name: newRoleName.trim(),
      category: roleCat,
      description: newRoleDescription.trim() || `${newRoleName.trim()} role profile`,
      userCount: 0,
    };

    setRoles((prev) => [...prev, newRole]);
    setRolePermissions((prev) => ({
      ...prev,
      [newId]: {},
    }));
    setSelectedRoleId(newId);

    setNewRoleName("");
    setNewRoleDescription("");
    setNewRoleType("Staff");
    setShowAddModal(false);

    setToastMessage(`Role "${newRole.name}" created successfully!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="container-fluid p-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg p-3 bg-dark text-white rounded-3 d-flex align-items-center gap-2"
          style={{ zIndex: 9999, fontSize: "0.9rem" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Roles &amp; Permissions</h2>
          <p className="text-muted mb-0" style={{ fontSize: "0.92rem" }}>
            Manage access levels and module permissions for staff and operators.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-asti-gradient px-4 py-2 fw-semibold rounded-pill d-flex align-items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>+</span>
          Add Role
        </button>
      </div>

      {/* Main Dual-Panel Layout */}
      <div className="row g-4">
        {/* ========================================================= */}
        {/* LEFT PANEL — ROLES LIST (~28-30%)                         */}
        {/* ========================================================= */}
        <div className="col-12 col-lg-4 col-xl-3">
          <div className="bg-white rounded-3 border shadow-sm p-3 h-100">
            {/* Panel Title */}
            <div className="d-flex align-items-center justify-content-between mb-3 px-1">
              <h5 className="fw-bold text-dark mb-0">Roles</h5>
              <span className="badge bg-light text-muted border rounded-pill">
                {roles.length} Roles
              </span>
            </div>

            {/* Search Input */}
            <div className="mb-3">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search roles..."
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Roles List */}
            <div className="d-flex flex-column gap-3">
              {/* STAFF SECTION */}
              <div>
                <div
                  className="text-muted fw-bold px-2 mb-2"
                  style={{ fontSize: "0.72rem", letterSpacing: "0.08em" }}
                >
                  STAFF
                </div>
                <div className="d-flex flex-column gap-1">
                  {staffRoles.map((role) => {
                    const isSelected = role.id === selectedRole.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRoleId(role.id)}
                        className={`text-start w-100 p-2 px-3 rounded-3 border-0 transition-all ${
                          isSelected
                            ? "bg-primary text-white shadow-sm"
                            : "bg-white text-dark hover-bg-light"
                        }`}
                        style={{
                          transition: "all 0.15s ease",
                          cursor: "pointer",
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          {/* Role Icon */}
                          <div
                            className={`rounded-circle p-1 d-flex align-items-center justify-content-center ${
                              isSelected ? "bg-white text-primary" : "bg-light text-primary"
                            }`}
                            style={{ width: 28, height: 28, flexShrink: 0 }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </div>

                          <div className="flex-grow-1 overflow-hidden">
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="fw-bold text-truncate" style={{ fontSize: "0.88rem" }}>
                                {role.name}
                              </span>
                              <span
                                className={`badge rounded-pill ${
                                  isSelected ? "bg-white text-primary" : "bg-light text-muted border"
                                }`}
                                style={{ fontSize: "0.68rem" }}
                              >
                                {role.userCount}
                              </span>
                            </div>
                            <div
                              className={`text-truncate ${isSelected ? "text-white-50" : "text-muted"}`}
                              style={{ fontSize: "0.74rem" }}
                            >
                              {role.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {staffRoles.length === 0 && (
                    <div className="text-muted small px-2 py-1">No matching staff roles</div>
                  )}
                </div>
              </div>

              {/* OPERATOR SECTION */}
              <div>
                <div
                  className="text-muted fw-bold px-2 mb-2"
                  style={{ fontSize: "0.72rem", letterSpacing: "0.08em" }}
                >
                  OPERATOR
                </div>
                <div className="d-flex flex-column gap-1">
                  {operatorRoles.map((role) => {
                    const isSelected = role.id === selectedRole.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRoleId(role.id)}
                        className={`text-start w-100 p-2 px-3 rounded-3 border-0 transition-all ${
                          isSelected
                            ? "bg-primary text-white shadow-sm"
                            : "bg-white text-dark hover-bg-light"
                        }`}
                        style={{
                          transition: "all 0.15s ease",
                          cursor: "pointer",
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          {/* Role Icon */}
                          <div
                            className={`rounded-circle p-1 d-flex align-items-center justify-content-center ${
                              isSelected ? "bg-white text-primary" : "bg-light text-primary"
                            }`}
                            style={{ width: 28, height: 28, flexShrink: 0 }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="7" r="4" />
                              <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
                            </svg>
                          </div>

                          <div className="flex-grow-1 overflow-hidden">
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="fw-bold text-truncate" style={{ fontSize: "0.88rem" }}>
                                {role.name}
                              </span>
                              <span
                                className={`badge rounded-pill ${
                                  isSelected ? "bg-white text-primary" : "bg-light text-muted border"
                                }`}
                                style={{ fontSize: "0.68rem" }}
                              >
                                {role.userCount}
                              </span>
                            </div>
                            <div
                              className={`text-truncate ${isSelected ? "text-white-50" : "text-muted"}`}
                              style={{ fontSize: "0.74rem" }}
                            >
                              {role.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {operatorRoles.length === 0 && (
                    <div className="text-muted small px-2 py-1">No matching operator roles</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL — PERMISSIONS (~70-72%)                       */}
        {/* ========================================================= */}
        <div className="col-12 col-lg-8 col-xl-9">
          <div className="bg-white rounded-3 border shadow-sm p-4">
            {/* Header: Selected Role Information */}
            <div className="d-flex flex-wrap justify-content-between align-items-start border-bottom pb-3 mb-4 gap-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h3 className="fw-bold text-dark mb-0">
                    {selectedRole.name} Permissions
                  </h3>
                  <span
                    className={`badge rounded-pill px-3 py-1 ${
                      selectedRole.category === "STAFF"
                        ? "bg-primary-subtle text-primary border border-primary-subtle"
                        : "bg-success-subtle text-success border border-success-subtle"
                    }`}
                    style={{ fontSize: "0.75rem", fontWeight: 600 }}
                  >
                    {selectedRole.category === "STAFF" ? "Staff Role" : "Operator Role"}
                  </span>
                </div>
                <p className="text-muted mb-1" style={{ fontSize: "0.88rem" }}>
                  {selectedRole.description}. Configure access to LMS modules and actions.
                </p>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <span className="badge bg-light text-secondary border px-2 py-1" style={{ fontSize: "0.78rem" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="me-1">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    Users with this role: <strong>{selectedRole.userCount}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons at top right */}
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3 rounded-pill"
                  onClick={handleReset}
                >
                  Reset Defaults
                </button>
                <button
                  type="button"
                  className="btn btn-asti-gradient btn-sm px-4 fw-semibold rounded-pill"
                  onClick={handleSave}
                >
                  Save Permissions
                </button>
              </div>
            </div>

            {/* Permission Summary Cards (3 small cards) */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-4">
                <div className="p-3 rounded-3 border bg-light stat-card-box">
                  <div className="stat-card-label">Total Permissions</div>
                  <div className="stat-card-value text-dark d-flex align-items-baseline gap-1">
                    <span>{allPermissionsCount}</span>
                    <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                      system actions
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-4">
                <div className="p-3 rounded-3 border bg-light stat-card-box">
                  <div className="stat-card-label">Selected</div>
                  <div className="stat-card-value text-primary d-flex align-items-baseline gap-1">
                    <span>{selectedCount}</span>
                    <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                      of {allPermissionsCount} enabled
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-4">
                <div className="p-3 rounded-3 border bg-light stat-card-box">
                  <div className="stat-card-label">Modules</div>
                  <div className="stat-card-value text-dark d-flex align-items-baseline gap-1">
                    <span>{PERMISSION_MODULES.length}</span>
                    <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                      LMS domains
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Permission Groups (10 Modules) */}
            <div className="d-flex flex-column gap-3">
              {PERMISSION_MODULES.map((module) => {
                const allSelected = module.permissions.every((p) => currentPermissions[p.id]);
                const someSelected = module.permissions.some((p) => currentPermissions[p.id]);
                const activeCount = module.permissions.filter((p) => currentPermissions[p.id]).length;

                return (
                  <div key={module.id} className="border rounded-3 p-3 bg-white shadow-xs">
                    {/* Module Header Bar */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between pb-2 mb-2 border-bottom gap-2">
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="fw-bold text-dark mb-0" style={{ fontSize: "0.95rem" }}>
                            {module.title}
                          </h6>
                          <span
                            className={`badge rounded-pill ${
                              activeCount > 0 ? "bg-primary-subtle text-primary" : "bg-light text-muted border"
                            }`}
                            style={{ fontSize: "0.68rem" }}
                          >
                            {activeCount}/{module.permissions.length} enabled
                          </span>
                        </div>
                        <small className="text-muted" style={{ fontSize: "0.78rem" }}>
                          {module.description}
                        </small>
                      </div>

                      {/* Select All Toggle for this module */}
                      <button
                        type="button"
                        onClick={() => handleToggleModule(module)}
                        className={`btn btn-sm py-1 px-3 rounded-pill fw-semibold border ${
                          allSelected
                            ? "btn-primary text-white"
                            : someSelected
                            ? "btn-outline-primary"
                            : "btn-outline-secondary"
                        }`}
                        style={{ fontSize: "0.75rem" }}
                      >
                        {allSelected ? "Deselect All" : "Select All"}
                      </button>
                    </div>

                    {/* Permissions Rows in this Module */}
                    <div className="d-flex flex-column">
                      {module.permissions.map((perm, idx) => {
                        const isChecked = Boolean(currentPermissions[perm.id]);
                        const isLast = idx === module.permissions.length - 1;

                        return (
                          <div
                            key={perm.id}
                            className={`d-flex align-items-center justify-content-between py-2 px-1 ${
                              !isLast ? "border-bottom border-light" : ""
                            }`}
                          >
                            <div className="me-3">
                              <label
                                htmlFor={`switch-${selectedRole.id}-${perm.id}`}
                                className="fw-semibold text-dark mb-0 cursor-pointer"
                                style={{ fontSize: "0.85rem", cursor: "pointer" }}
                              >
                                {perm.name}
                              </label>
                              <div className="text-muted" style={{ fontSize: "0.76rem" }}>
                                {perm.description}
                              </div>
                            </div>

                            {/* Modern Toggle Switch */}
                            <div className="form-check form-switch m-0 d-flex align-items-center gap-2">
                              <input
                                className="form-check-input cursor-pointer"
                                type="checkbox"
                                role="switch"
                                id={`switch-${selectedRole.id}-${perm.id}`}
                                checked={isChecked}
                                onChange={() => handleTogglePermission(perm.id)}
                                style={{
                                  width: "2.4em",
                                  height: "1.25em",
                                  cursor: "pointer",
                                }}
                              />
                              <span
                                className="fw-bold"
                                style={{
                                  fontSize: "0.72rem",
                                  minWidth: "26px",
                                  color: isChecked ? "#1d4ed8" : "#94a3b8",
                                }}
                              >
                                {isChecked ? "ON" : "OFF"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Action Bar */}
            <div className="d-flex justify-content-between align-items-center pt-4 mt-4 border-top">
              <span className="text-muted" style={{ fontSize: "0.82rem" }}>
                Changes apply only to role <strong>{selectedRole.name}</strong>.
              </span>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 rounded-pill"
                  onClick={handleReset}
                  style={{ fontSize: "0.88rem" }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-asti-gradient px-4 fw-semibold rounded-pill"
                  onClick={handleSave}
                  style={{ fontSize: "0.88rem" }}
                >
                  Save Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ADD ROLE MODAL (UI ONLY)                                  */}
      {/* ========================================================= */}
      {showAddModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg border-0 rounded-4">
                <div className="modal-header border-bottom pb-3">
                  <div>
                    <h5 className="modal-title fw-bold text-dark mb-0">Create New Role</h5>
                    <small className="text-muted">Define access category and baseline description</small>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  />
                </div>

                <form onSubmit={handleCreateRole}>
                  <div className="modal-body p-4">
                    {/* Role Name */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                        Role Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Quality Inspector, Team Lead"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        required
                      />
                    </div>

                    {/* Role Type */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                        Role Type *
                      </label>
                      <select
                        className="form-select"
                        value={newRoleType}
                        onChange={(e) => setNewRoleType(e.target.value as "Staff" | "Operator")}
                      >
                        <option value="Staff">Staff</option>
                        <option value="Operator">Operator</option>
                      </select>
                      <div className="form-text" style={{ fontSize: "0.78rem" }}>
                        Select whether this role is for executive Staff or shop-floor Operator.
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Brief summary of duties and operational permissions..."
                        value={newRoleDescription}
                        onChange={(e) => setNewRoleDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="modal-footer border-top px-4 py-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill px-4"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-asti-gradient rounded-pill px-4"
                    >
                      Create Role
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RolesPermissions;
