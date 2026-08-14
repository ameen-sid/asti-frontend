import { useEffect, useState } from "react";
import type {
  User,
  UserFormData,
  UserRole,
  RoleFilter,
  DepartmentFilter,
} from "../models/userManagement";

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("All Roles");
  const [deptFilter, setDeptFilter] =
    useState<DepartmentFilter>("All Departments");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [formData, setFormData] = useState<UserFormData>({
    id: null,
    name: "",
    username: "",
    email: "",
    role: "OPERATOR",
    department: "",
  });

  const roles: RoleFilter[] = [
    "All Roles",
    "ADMIN",
    "INSTRUCTOR",
    "OPERATOR",
    "MANAGER",
  ];

  const departments: DepartmentFilter[] = [
    "All Departments",
    "Operations",
    "Training",
    "Production",
    "HR",
    "Finance",
    "IT",
  ];

  // --------------------------------------------------
  // Load users from localStorage
  // --------------------------------------------------
  useEffect(() => {
    const savedUsers = localStorage.getItem("userManagementUsers");

    if (savedUsers) {
      try {
        const parsedUsers: User[] = JSON.parse(savedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error("Failed to parse users from localStorage:", error);
      }
    } else {
      const defaultUsers: User[] = [
        {
          id: 1,
          name: "Arjun Sharma",
          username: "arjuns",
          email: "arjun.sharma@asti.in",
          role: "ADMIN",
          department: "Operations",
        },
        {
          id: 2,
          name: "Priya Mehta",
          username: "priyam",
          email: "priya.mehta@asti.in",
          role: "INSTRUCTOR",
          department: "Training",
        },
        {
          id: 3,
          name: "Ravi Kumar",
          username: "ravikumar",
          email: null,
          role: "OPERATOR",
          department: "Production",
        },
      ];

      setUsers(defaultUsers);

      localStorage.setItem(
        "userManagementUsers",
        JSON.stringify(defaultUsers)
      );
    }
  }, []);

  // --------------------------------------------------
  // Save users to localStorage
  // --------------------------------------------------
  const saveUsersToLocal = (updatedUsers: User[]): void => {
    setUsers(updatedUsers);

    localStorage.setItem(
      "userManagementUsers",
      JSON.stringify(updatedUsers)
    );
  };

  // --------------------------------------------------
  // Role badge
  // --------------------------------------------------
  const roleBadgeStyle = (role: UserRole) => {
    const map: Record<
      UserRole,
      {
        bg: string;
        color: string;
      }
    > = {
      ADMIN: {
        bg: "#e8eafd",
        color: "#3e6db5",
      },
      INSTRUCTOR: {
        bg: "#e6f4ea",
        color: "#2e7d32",
      },
      OPERATOR: {
        bg: "#fff3e0",
        color: "#e65100",
      },
      MANAGER: {
        bg: "#fce4ec",
        color: "#c62828",
      },
    };

    return map[role] || {
      bg: "#f0f0f0",
      color: "#555",
    };
  };

  // --------------------------------------------------
  // Filter users
  // --------------------------------------------------
  const filtered = users.filter((user) => {
    const searchValue = search.toLowerCase();

    const matchSearch =
      user.name.toLowerCase().includes(searchValue) ||
      user.username.toLowerCase().includes(searchValue);

    const matchRole =
      roleFilter === "All Roles" ||
      user.role === roleFilter;

    const matchDept =
      deptFilter === "All Departments" ||
      user.department === deptFilter;

    return matchSearch && matchRole && matchDept;
  });

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------
  const totalProfiles = users.length;

  const instructorCount = users.filter(
    (user) => user.role === "INSTRUCTOR"
  ).length;

  const adminCount = users.filter(
    (user) => user.role === "ADMIN"
  ).length;

  // --------------------------------------------------
  // Input change
  // --------------------------------------------------
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Add user
  // --------------------------------------------------
  const handleAddUser = (): void => {
    setFormData({
      id: null,
      name: "",
      username: "",
      email: "",
      role: "OPERATOR",
      department: "",
    });

    setIsEditing(false);
    setShowModal(true);
  };

  // --------------------------------------------------
  // Edit user
  // --------------------------------------------------
  const handleEditUser = (user: User): void => {
    setFormData({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email ?? "",
      role: user.role,
      department: user.department,
    });

    setIsEditing(true);
    setShowModal(true);
  };

  // --------------------------------------------------
  // Delete user
  // --------------------------------------------------
  const handleDeleteUser = (id: number): void => {
    if (
      window.confirm(
        "Are you sure you want to delete this user?"
      )
    ) {
      const updatedUsers = users.filter(
        (user) => user.id !== id
      );

      saveUsersToLocal(updatedUsers);
    }
  };

  // --------------------------------------------------
  // Submit user
  // --------------------------------------------------
  const handleSubmit = (): void => {
    if (
      !formData.name.trim() ||
      !formData.username.trim() ||
      !formData.role ||
      !formData.department
    ) {
      alert(
        "Please fill in all required fields (Name, Username, Role, and Department)"
      );
      return;
    }

    // Check duplicate username
    const isDuplicate = users.some(
      (user) =>
        user.username.toLowerCase() ===
          formData.username.trim().toLowerCase() &&
        (isEditing ? user.id !== formData.id : true)
    );

    if (isDuplicate) {
      alert(
        "Username already exists. Please choose a different username."
      );
      return;
    }

    if (isEditing && formData.id !== null) {
      const updatedUser: User = {
        id: formData.id,
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim() || null,
        role: formData.role,
        department: formData.department,
      };

      const updatedUsers = users.map((user) =>
        user.id === formData.id ? updatedUser : user
      );

      saveUsersToLocal(updatedUsers);
    } else {
      const newUser: User = {
        id: Date.now(),
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim() || null,
        role: formData.role,
        department: formData.department,
      };

      saveUsersToLocal([...users, newUser]);
    }

    setShowModal(false);
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">
          User Management
        </h4>

        <button
          type="button"
          className="btn text-white px-4 py-2 fw-semibold rounded-pill"
          style={{
            background:
              "linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)",
            border: "none",
            fontSize: "0.88rem",
          }}
          onClick={handleAddUser}
        >
          + Create User Profile
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Total Profiles",
            value: totalProfiles,
            color: "#222",
          },
          {
            label: "Instructor Roles",
            value: `${instructorCount} Instructor${
              instructorCount !== 1 ? "s" : ""
            }`,
            color: "#3e6db5",
          },
          {
            label: "Admin Roles",
            value: `${adminCount} Admin${
              adminCount !== 1 ? "s" : ""
            }`,
            color: "#e22b6e",
          },
        ].map((stat, index) => (
          <div key={index} className="col-md-4">
            <div
              className="border rounded-3 p-3"
              style={{ background: "#fafafa" }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#999",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {stat.label}
              </div>

              <div
                className="fw-bold mt-1"
                style={{
                  fontSize: "1.4rem",
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div
        className="d-flex align-items-center gap-3 mb-4 flex-wrap p-3 rounded-3"
        style={{
          background: "#f8f9fa",
          border: "1px solid #e9ecef",
        }}
      >
        {/* Search */}
        <div
          className="input-group"
          style={{ maxWidth: 260 }}
        >
          <span className="input-group-text bg-white border-end-0">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#999"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>

          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search by name, username..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{ fontSize: "0.88rem" }}
          />
        </div>

        {/* Role Filter */}
        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#555",
            }}
          >
            ROLE:
          </span>

          <select
            className="form-select form-select-sm"
            style={{
              width: 140,
              fontSize: "0.85rem",
            }}
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(
                e.target.value as RoleFilter
              )
            }
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#555",
            }}
          >
            DEPT:
          </span>

          <select
            className="form-select form-select-sm"
            style={{
              width: 160,
              fontSize: "0.85rem",
            }}
            value={deptFilter}
            onChange={(e) =>
              setDeptFilter(
                e.target.value as DepartmentFilter
              )
            }
          >
            {departments.map((department) => (
              <option
                key={department}
                value={department}
              >
                {department}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table
          className="table table-hover align-middle mb-0"
          style={{ fontSize: "0.88rem" }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "2px solid #f0f0f0",
              }}
            >
              {[
                "Portal Name",
                "Username (UID)",
                "Email Address",
                "Role Assignment",
                "Department Name",
                "Actions",
              ].map((heading, index) => (
                <th
                  key={index}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#aaa",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    paddingBottom: 10,
                    border: "none",
                    textAlign:
                      index === 5 ? "right" : "left",
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((user) => {
              const badge = roleBadgeStyle(user.role);

              return (
                <tr
                  key={user.id}
                  style={{
                    borderBottom:
                      "1px solid #f5f5f5",
                  }}
                >
                  <td className="fw-semibold">
                    {user.name}
                  </td>

                  <td className="text-muted">
                    {user.username}
                  </td>

                  <td
                    style={{
                      color: user.email
                        ? "#444"
                        : "#bbb",
                      fontStyle: user.email
                        ? "normal"
                        : "italic",
                    }}
                  >
                    {user.email || "NULL"}
                  </td>

                  <td>
                    <span
                      className="px-2 py-1 rounded-2 fw-bold"
                      style={{
                        fontSize: "0.72rem",
                        background: badge.bg,
                        color: badge.color,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="text-muted">
                    {user.department}
                  </td>

                  <td className="text-end">
                    {/* Edit */}
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-1 me-1"
                      title="Edit"
                      onClick={() =>
                        handleEditUser(user)
                      }
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#555"
                        strokeWidth="2"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-1"
                      title="Delete"
                      onClick={() =>
                        handleDeleteUser(user.id)
                      }
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#e22b6e"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-5 text-muted">
            No records found.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div
            className="modal fade show d-block"
            tabIndex={-1}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing
                      ? "Edit User Profile"
                      : "Create New User Profile"}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setShowModal(false)
                    }
                  ></button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label">
                      Full Name{" "}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Username */}
                  <div className="mb-3">
                    <label className="form-label">
                      Username (UID){" "}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter username"
                    />

                    <small className="text-muted">
                      Must be unique
                    </small>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Role */}
                  <div className="mb-3">
                    <label className="form-label">
                      Role Assignment{" "}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="ADMIN">
                        ADMIN
                      </option>
                      <option value="INSTRUCTOR">
                        INSTRUCTOR
                      </option>
                      <option value="OPERATOR">
                        OPERATOR
                      </option>
                      <option value="MANAGER">
                        MANAGER
                      </option>
                    </select>
                  </div>

                  {/* Department */}
                  <div className="mb-3">
                    <label className="form-label">
                      Department Name{" "}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <select
                      className="form-select"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                    >
                      <option value="">
                        Select Department
                      </option>

                      {departments
                        .filter(
                          (department) =>
                            department !==
                            "All Departments"
                        )
                        .map((department) => (
                          <option
                            key={department}
                            value={department}
                          >
                            {department}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill"
                    onClick={() =>
                      setShowModal(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn text-white rounded-pill"
                    onClick={handleSubmit}
                    style={{
                      background:
                        "linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)",
                      border: "none",
                    }}
                  >
                    {isEditing
                      ? "Update User"
                      : "Create User"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserManagement;