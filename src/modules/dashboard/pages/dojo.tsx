import React, { useState, useEffect } from "react";
import "../../../styles/dojo.css";
import type { DojoRequirement, DojoFormData, DojoStatus } from "../models/dojo";

const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEAR_OPTIONS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

const STATUS_OPTIONS: DojoStatus[] = [
  "Pending",
  "Planned",
  "In Progress",
  "Completed",
  "Approved",
];

const INITIAL_RECORDS: DojoRequirement[] = [
  {
    id: 1,
    month: "October",
    year: 2026,
    requirementCount: 45,
    status: "In Progress",
    createdAt: "2026-10-01",
  },
  {
    id: 2,
    month: "October",
    year: 2026,
    requirementCount: 30,
    status: "Planned",
    createdAt: "2026-10-02",
  },
  {
    id: 3,
    month: "September",
    year: 2026,
    requirementCount: 60,
    status: "Completed",
    createdAt: "2026-09-05",
  },
  {
    id: 4,
    month: "November",
    year: 2026,
    requirementCount: 25,
    status: "Pending",
    createdAt: "2026-10-03",
  },
];

const DEFAULT_FORM_DATA: DojoFormData = {
  id: null,
  month: MONTH_OPTIONS[new Date().getMonth()],
  year: new Date().getFullYear(),
  requirementCount: "",
  status: "Pending",
};

function Dojo() {
  const [records, setRecords] = useState<DojoRequirement[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<DojoFormData>(DEFAULT_FORM_DATA);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Filter states
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState<number | "">("");
  const [filterStatus, setFilterStatus] = useState("");

  // Load records from localStorage or seed
  useEffect(() => {
    const saved = localStorage.getItem("asti_dojo_requirements");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Normalize any old structure if needed
        const normalized = parsed.map((item: any) => ({
          id: item.id || Date.now(),
          month: item.month || (item.monthYear ? getMonthNameFromYM(item.monthYear) : "October"),
          year: item.year || (item.monthYear ? Number(item.monthYear.slice(0, 4)) : 2026),
          requirementCount: item.requirementCount ?? (Number(item.planned) || 0),
          status: item.status || "Pending",
          createdAt: item.createdAt || new Date().toISOString().slice(0, 10),
        }));
        setRecords(normalized);
      } catch {
        setRecords(INITIAL_RECORDS);
        localStorage.setItem("asti_dojo_requirements", JSON.stringify(INITIAL_RECORDS));
      }
    } else {
      setRecords(INITIAL_RECORDS);
      localStorage.setItem("asti_dojo_requirements", JSON.stringify(INITIAL_RECORDS));
    }
  }, []);

  const getMonthNameFromYM = (ym: string) => {
    const parts = ym.split("-");
    if (parts.length === 2) {
      const idx = Number(parts[1]) - 1;
      return MONTH_OPTIONS[idx] || MONTH_OPTIONS[0];
    }
    return MONTH_OPTIONS[0];
  };

  const saveRecords = (newRecords: DojoRequirement[]) => {
    setRecords(newRecords);
    localStorage.setItem("asti_dojo_requirements", JSON.stringify(newRecords));
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      month: MONTH_OPTIONS[new Date().getMonth()],
      year: new Date().getFullYear(),
      requirementCount: "",
      status: "Pending",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEditModal = (item: DojoRequirement) => {
    setIsEditing(true);
    setFormData({
      id: item.id,
      month: item.month,
      year: item.year,
      requirementCount: item.requirementCount,
      status: item.status,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this DOJO requirement?")) {
      const updated = records.filter((r) => r.id !== id);
      saveRecords(updated);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "requirementCount"
          ? value === ""
            ? ""
            : Number(value)
          : name === "year"
            ? Number(value)
            : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!formData.month) {
      errors.month = "Please select a month.";
    }
    if (!formData.year) {
      errors.year = "Please select a year.";
    }
    if (formData.requirementCount === "" || Number(formData.requirementCount) < 0) {
      errors.requirementCount = "Please enter a valid requirement count (0 or more).";
    }
    if (!formData.status) {
      errors.status = "Please select a status.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const count = Number(formData.requirementCount) || 0;

    if (isEditing && formData.id != null) {
      const updated = records.map((r) =>
        r.id === formData.id
          ? {
            ...r,
            month: formData.month,
            year: Number(formData.year),
            requirementCount: count,
            status: formData.status,
          }
          : r
      );
      saveRecords(updated);
    } else {
      const newRecord: DojoRequirement = {
        id: Date.now(),
        month: formData.month,
        year: Number(formData.year),
        requirementCount: count,
        status: formData.status,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      saveRecords([newRecord, ...records]);
    }

    setShowModal(false);
  };

  // Filter records
  const filteredRecords = records.filter((r) => {
    if (filterMonth && r.month !== filterMonth) return false;
    if (filterYear !== "" && r.year !== Number(filterYear)) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

  // Calculate KPIs
  const totalRequirements = records.length;
  const totalRequirementCount = records.reduce(
    (sum, r) => sum + (Number(r.requirementCount) || 0),
    0
  );
  const inProgressCount = records.filter((r) => r.status === "In Progress").length;
  const completedCount = records.filter(
    (r) => r.status === "Completed" || r.status === "Approved"
  ).length;

  const getStatusBadgeClass = (status: DojoStatus) => {
    switch (status) {
      case "Approved":
      case "Completed":
        return "completed";
      case "In Progress":
        return "in-progress";
      case "Pending":
      case "Planned":
      default:
        return "pending";
    }
  };

  return (
    <div className="dojo-page">
      {/* Metric KPI Summary Cards */}
      <div className="dojo-kpi-grid">
        <div className="dojo-kpi-card">
          <div>
            <div className="dojo-kpi-label">Total DOJO Requirements</div>
            <div className="dojo-kpi-value">{totalRequirements}</div>
            <div className="dojo-kpi-subtext">Active requirement records</div>
          </div>
          <div className="dojo-kpi-icon blue">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
        </div>

        <div className="dojo-kpi-card">
          <div>
            <div className="dojo-kpi-label">Total Requirement Count</div>
            <div className="dojo-kpi-value">{totalRequirementCount}</div>
            <div className="dojo-kpi-subtext">Cumulative planned targets</div>
          </div>
          <div className="dojo-kpi-icon emerald">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>

        <div className="dojo-kpi-card">
          <div>
            <div className="dojo-kpi-label">In Progress</div>
            <div className="dojo-kpi-value">{inProgressCount}</div>
            <div className="dojo-kpi-subtext">Batches currently active</div>
          </div>
          <div className="dojo-kpi-icon amber">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <div className="dojo-kpi-card">
          <div>
            <div className="dojo-kpi-label">Completed / Approved</div>
            <div className="dojo-kpi-value">{completedCount}</div>
            <div className="dojo-kpi-subtext">Fulfilled requirements</div>
          </div>
          <div className="dojo-kpi-icon purple">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="dojo-filter-bar">
        <div className="row g-3 align-items-center">
          <div className="col-md-3">
            <select
              className="form-select rounded-pill"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {MONTH_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select rounded-pill"
              value={filterYear}
              onChange={(e) =>
                setFilterYear(e.target.value === "" ? "" : Number(e.target.value))
              }
            >
              <option value="">All Years</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select rounded-pill"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 text-md-end">
            {(filterMonth || filterYear !== "" || filterStatus) && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                onClick={() => {
                  setFilterMonth("");
                  setFilterYear("");
                  setFilterStatus("");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Records Section */}
      <div className="dojo-records-section">
        <div className="dojo-records-header">
          <div className="dojo-records-title-wrapper">
            <div className="gradient-bg p-2 rounded-3 text-white">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <h4 className="dojo-records-title">DOJO Requirement Records</h4>
              <p className="dojo-records-subtitle">
                View and manage DOJO qualification and training requirements
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn gradient-bg text-white rounded-pill d-inline-flex align-items-center"
            onClick={handleOpenAddModal}
          >
            <svg
              className="me-2"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Add DOJO Requirement
          </button>
        </div>

        <div className="table-responsive">
          <table className="dojo-records-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>#</th>
                <th>MONTH</th>
                <th>YEAR</th>
                <th style={{ textAlign: "center" }}>REQUIREMENT COUNT</th>
                <th>STATUS</th>
                <th style={{ width: "120px", textAlign: "center" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No DOJO requirements found. Click "Add DOJO Requirement" to create one.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => {
                  const badgeClass = getStatusBadgeClass(record.status);
                  return (
                    <tr key={record.id}>
                      <td className="text-muted fw-semibold">{index + 1}</td>
                      <td>
                        <div className="dojo-month-pill">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <span>{record.month}</span>
                        </div>
                      </td>
                      <td>
                        <span className="dojo-year-pill">{record.year}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="dojo-count-pill">
                          {record.requirementCount}
                        </span>
                      </td>
                      <td>
                        <span className={`dojo-status-badge ${badgeClass}`}>
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: "currentColor",
                            }}
                          ></span>
                          {record.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <button
                            type="button"
                            className="dojo-action-btn"
                            title="Edit"
                            onClick={() => handleOpenEditModal(record)}
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="dojo-action-btn delete"
                            title="Delete"
                            onClick={() => handleDelete(record.id)}
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - ONLY Month, Year, Requirement Count, Status */}
      {showModal && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowModal(false)}
          ></div>
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content p-3 p-md-4 border-0 shadow rounded-4">
                <div className="modal-header pb-2 border-bottom-0">
                  <h5 className="modal-title fw-bold text-dark">
                    {isEditing ? "Edit DOJO Requirement" : "Add DOJO Requirement"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  ></button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body py-3">
                    <div className="row g-3">
                      {/* 1. Month Dropdown */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">
                          Month <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${formErrors.month ? "is-invalid" : ""
                            }`}
                          name="month"
                          value={formData.month}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">-- Select Month --</option>
                          {MONTH_OPTIONS.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                        {formErrors.month && (
                          <div className="invalid-feedback">{formErrors.month}</div>
                        )}
                      </div>

                      {/* 2. Year Dropdown */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">
                          Year <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${formErrors.year ? "is-invalid" : ""
                            }`}
                          name="year"
                          value={formData.year}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">-- Select Year --</option>
                          {YEAR_OPTIONS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                        {formErrors.year && (
                          <div className="invalid-feedback">{formErrors.year}</div>
                        )}
                      </div>

                      {/* 3. Requirement Count */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">
                          Requirement Count <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          className={`form-control ${formErrors.requirementCount ? "is-invalid" : ""
                            }`}
                          name="requirementCount"
                          value={formData.requirementCount}
                          onChange={handleInputChange}
                          placeholder="Enter requirement count"
                          required
                        />
                        {formErrors.requirementCount && (
                          <div className="invalid-feedback">
                            {formErrors.requirementCount}
                          </div>
                        )}
                      </div>

                      {/* 4. Status Dropdown */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">
                          Status <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${formErrors.status ? "is-invalid" : ""
                            }`}
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          required
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {formErrors.status && (
                          <div className="invalid-feedback">{formErrors.status}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer pt-2 border-top-0 d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary rounded-pill px-4"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn rounded-pill gradient-bg text-white px-4"
                    >
                      {isEditing ? "Update" : "Save"}
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

export default Dojo;
