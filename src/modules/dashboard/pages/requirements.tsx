import React, { useEffect, useState } from "react";
import "../../../styles/requirements.css";
import { Link } from "react-router";

import type {
  Requirements,
  RequirementFormData,
  MonthKey,
  MonthOptions,
  RequirementStatus,
} from "../models/requirements";

function Requirement() {
  // -----------------------------
  // State
  // -----------------------------

  const [showModal, setShowModal] =
    useState<boolean>(false);

  const [isEditing, setIsEditing] =
    useState<boolean>(false);

  const [records, setRecords] =
    useState<Requirements[]>([]);

  const [selectedMonth, setSelectedMonth] =
    useState<MonthKey | "">("");

  const [formData, setFormData] =
    useState<RequirementFormData>({
      id: null,

      unit: "",
      department: "",
      section: "",
      subSection: "",
      line: "",
      machine: "",

      status: "Pending",

      month: "",

      requirementCount: 0,

      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
    });

  // -----------------------------
  // Month options
  // -----------------------------

  const months: MonthOptions[] = [
    { value: "jan", label: "January" },
    { value: "feb", label: "February" },
    { value: "mar", label: "March" },
    { value: "apr", label: "April" },
    { value: "may", label: "May" },
    { value: "jun", label: "June" },
    { value: "jul", label: "July" },
    { value: "aug", label: "August" },
    { value: "sep", label: "September" },
    { value: "oct", label: "October" },
    { value: "nov", label: "November" },
    { value: "dec", label: "December" },
  ];

  // -----------------------------
  // Status options
  // -----------------------------

  const statusOptions: RequirementStatus[] = [
    "Pending",
    "Accepted",
    "Approved",
  ];

  // -----------------------------
  // Load records
  // -----------------------------

  useEffect(() => {
    const savedRecords =
      localStorage.getItem("requirementRecords");

    if (savedRecords) {
      const parsedRecords: Requirements[] =
        JSON.parse(savedRecords);

      setRecords(parsedRecords);
    } else {
      const initialData: Requirements[] = [
        {
          id: 1,
          unit: "Unit A",
          department: "D01-1",
          section: "Section 1",
          subSection: "Sub Section A",
          line: "Engineering",
          machine: "Machine 101",

          status: "Approved",
          month: "aug",

          requirementCount: 5,

          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 5,
          sep: 0,
          oct: 0,
          nov: 0,
          dec: 0,
        },

        {
          id: 2,
          unit: "Unit B",
          department: "D01-2",
          section: "Section 2",
          subSection: "Sub Section B",
          line: "Drafting",
          machine: "Machine 202",

          status: "Pending",
          month: "sep",

          requirementCount: 6,

          jan: 0,
          feb: 0,
          mar: 0,
          apr: 0,
          may: 0,
          jun: 0,
          jul: 0,
          aug: 0,
          sep: 6,
          oct: 0,
          nov: 0,
          dec: 0,
        },
      ];

      setRecords(initialData);

      localStorage.setItem(
        "requirementRecords",
        JSON.stringify(initialData)
      );
    }
  }, []);

  // -----------------------------
  // Save records
  // -----------------------------

  const saveToLocal = (
    newRecords: Requirements[]
  ): void => {
    setRecords(newRecords);

    localStorage.setItem(
      "requirementRecords",
      JSON.stringify(newRecords)
    );
  };

  // -----------------------------
  // Input change
  // -----------------------------

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]:
        name === "requirementCount"
          ? Number(value)
          : value,
    }));
  };

  // -----------------------------
  // Month change
  // -----------------------------

  const handleMonthChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const month = e.target.value as MonthKey | "";

    setSelectedMonth(month);

    setFormData((prev) => ({
      ...prev,
      month,
    }));
  };

  // -----------------------------
  // Add
  // -----------------------------

  const handleAdd = (): void => {
    setFormData({
      id: null,

      unit: "",
      department: "",
      section: "",
      subSection: "",
      line: "",
      machine: "",

      status: "Pending",

      month: "",

      requirementCount: 0,

      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
    });

    setSelectedMonth("");
    setIsEditing(false);
    setShowModal(true);
  };

  // -----------------------------
  // Edit
  // -----------------------------

  const handleEdit = (
    record: Requirements
  ): void => {
    setFormData(record);

    setSelectedMonth(
      record.month || ""
    );

    setIsEditing(true);
    setShowModal(true);
  };

  // -----------------------------
  // Delete
  // -----------------------------

  const handleDelete = (
    id: number
  ): void => {
    if (
      window.confirm(
        "Are you sure you want to delete this record?"
      )
    ) {
      const newRecords = records.filter(
        (record) => record.id !== id
      );

      saveToLocal(newRecords);
    }
  };

  // -----------------------------
  // Submit
  // -----------------------------

  const handleSubmit = (): void => {
    // Validation
    if (
      !formData.unit ||
      !formData.department ||
      !formData.section ||
      !formData.line ||
      !formData.machine ||
      !formData.month ||
      !formData.requirementCount
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // At this point month is guaranteed
    // to be a MonthKey
    const monthKey: MonthKey =
      formData.month;

    // Update selected month's value
    const updatedFormData: RequirementFormData = {
      ...formData,

      [monthKey]:
        formData.requirementCount,
    };

    // -----------------------------
    // Editing existing record
    // -----------------------------

    if (isEditing) {
      if (formData.id === null) {
        return;
      }

      const updatedRecords: Requirements[] =
        records.map((record) =>
          record.id === formData.id
            ? {
                ...updatedFormData,
                id: formData.id,
              }
            : record
        );

      saveToLocal(updatedRecords);
    }

    // -----------------------------
    // Adding new record
    // -----------------------------

    else {
      const newRecord: Requirements = {
        ...updatedFormData,
        id: Date.now(),
      };

      saveToLocal([
        ...records,
        newRecord,
      ]);
    }

    setShowModal(false);
  };

  // -----------------------------
  // Get month label
  // -----------------------------

  const getMonthLabel = (
    monthValue: MonthKey | ""
  ): string => {
    const month = months.find(
      (m) => m.value === monthValue
    );

    return month
      ? month.label
      : monthValue;
  };

  // -----------------------------
  // Status badge class
  // -----------------------------

  const getStatusBadgeClass = (
    status: RequirementStatus
  ): string => {
    switch (status) {
      case "Approved":
        return "status-approved";

      case "Accepted":
        return "status-accepted";

      case "Pending":
        return "status-pending";

      default:
        return "status-pending";
    }
  };

  // -----------------------------
  // Month abbreviation
  // -----------------------------

  const getMonthAbbr = (
    monthValue: MonthKey
  ): string => {
    return monthValue.toUpperCase();
  };

  return (
    <div className="requirement-page">
      {/* Breadcrumb */}
      <div className="darkgrey-bg mb-4 px-4 w-100 h-50px rounded-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center jutify-content-center">
          <Link
            to="/portal"
            className="text-decoration-none text-black d-flex align-items-center"
          >
            <svg
              className="me-2"
              aria-hidden="true"
              width="16px"
              height="16px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.7071 3.29289C17.0976 3.68342 17.0976 4.31658 16.7071 4.70711L9.41421 12L16.7071 19.2929C17.0976 19.6834 17.0976 20.3166 16.7071 20.7071C16.3166 21.0976 15.6834 21.0976 15.2929 20.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L15.2929 3.29289C15.6834 2.90237 16.3166 2.90237 16.7071 3.29289Z"
                fill="#000000"
              ></path>
            </svg>
            Menu
          </Link>
          <h5 className="mb-0 ms-4">Requirements</h5>
        </div>
      </div>

      {/* ATTENDANCE FILTERS-------------------------- */}
      <div className="Attendance Filters border shadow rounded-4 p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between my-2">
          <div className="d-flex align-items-center">
            <h4>Requirements</h4>
          </div>
        </div>
        {/* FILTERS DIV--------------------------------------------- */}
        <div className="d-flex align-item-center justify-content-start flex-wrap p-2 mt-3">
          <div className="dropdown me-2 pink-border rounded-pill pink-text my-fade-pink scale-transition mb-2">
            <button
              className="btn rounded-pill border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Units
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
          <div className="dropdown me-2 pink-border rounded-pill pink-text my-fade-pink scale-transition mb-2">
            <button
              className="btn rounded-pill border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Departments
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
          <div className="dropdown me-2 pink-border rounded-pill pink-text my-fade-pink scale-transition mb-2">
            <button
              className="btn rounded-pill border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Sections
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
          <div className="dropdown me-2 pink-border rounded-pill pink-text my-fade-pink scale-transition mb-2">
            <button
              className="btn rounded-pill border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Lines
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
          <div className="dropdown me-2 pink-border rounded-pill pink-text my-fade-pink scale-transition mb-2">
            <button
              className="btn rounded-pill border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Shifts
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center me-2 mb-2">
            <p className="me-1 mb-0">From:</p>
            <input
              type="date"
              className="h-100 scale-transition p-2 text-black bordere-0 outline-0 pink-border rounded-pill pink-text my-fade-pink"
            />
          </div>
          <div className="d-flex align-items-center me-2 mb-2">
            <p className="me-1 mb-0">To:</p>
            <input
              type="date"
              className="h-100 scale-transition p-2 text-black bordere-0 outline-0 pink-border rounded-pill pink-text my-fade-pink"
            />
          </div>
        </div>
      </div>

      {/* Records Section */}
      <div className="records-section">
        <div className="records-header">
          <div className="records-title-wrapper">
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div>
              <h4 className="records-title">Requirement Records</h4>
              <p className="records-subtitle">
                View and manage manpower Requirements
              </p>
            </div>
          </div>
          <button
            className="btn gradient-bg text-white rounded-pill"
            onClick={handleAdd}
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
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Add Requirement
          </button>
        </div>

        <div className="table-responsive">
          <table className="records-table">
            <thead>
              <tr>
                <th>UNIT</th>
                <th>DEPARTMENT</th>
                <th>SECTION</th>
                <th>SUB-SECTION</th>
                <th>LINE</th>
                <th>MACHINE</th>
                <th>STATUS</th>
                <th className="gradient-bg text-white">JAN</th>
                <th className="gradient-bg text-white">FEB</th>
                <th className="gradient-bg text-white">MAR</th>
                <th className="gradient-bg text-white">APR</th>
                <th className="gradient-bg text-white">MAY</th>
                <th className="gradient-bg text-white">JUN</th>
                <th className="gradient-bg text-white">JUL</th>
                <th className="gradient-bg text-white">AUG</th>
                <th className="gradient-bg text-white">SEP</th>
                <th className="gradient-bg text-white">OCT</th>
                <th className="gradient-bg text-white">NOV</th>
                <th className="gradient-bg text-white">DEC</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.unit}</td>
                  <td>{record.department}</td>
                  <td>{record.section}</td>
                  <td>{record.subSection}</td>
                  <td>{record.line}</td>
                  <td>{record.machine}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusBadgeClass(record.status)}`}
                    >
                      • {record.status}
                    </span>
                  </td>
                  <td className="text-center">{record.jan || 0}</td>
                  <td className="text-center">{record.feb || 0}</td>
                  <td className="text-center">{record.mar || 0}</td>
                  <td className="text-center">{record.apr || 0}</td>
                  <td className="text-center">{record.may || 0}</td>
                  <td className="text-center">{record.jun || 0}</td>
                  <td className="text-center">{record.jul || 0}</td>
                  <td className="text-center">{record.aug || 0}</td>
                  <td className="text-center">{record.sep || 0}</td>
                  <td className="text-center">{record.oct || 0}</td>
                  <td className="text-center">{record.nov || 0}</td>
                  <td className="text-center">{record.dec || 0}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(record)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(record.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={20} className="text-center py-4">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content p-4">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing ? "Edit Requirement" : "Add New Requirement"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    {/* Unit */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Unit <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        placeholder="Enter unit name"
                        required
                      />
                    </div>

                    {/* Department */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Department <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="Enter department name"
                        required
                      />
                    </div>

                    {/* Section */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Section <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="section"
                        value={formData.section}
                        onChange={handleInputChange}
                        placeholder="Enter section name"
                        required
                      />
                    </div>

                    {/* Sub-Section */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Sub-Section</label>
                      <input
                        type="text"
                        className="form-control"
                        name="subSection"
                        value={formData.subSection}
                        onChange={handleInputChange}
                        placeholder="Enter sub-section name"
                      />
                    </div>

                    {/* Line */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Line <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="line"
                        value={formData.line}
                        onChange={handleInputChange}
                        placeholder="Enter line description"
                        required
                      />
                    </div>

                    {/* Machine */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Machine <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="machine"
                        value={formData.machine}
                        onChange={handleInputChange}
                        placeholder="Enter machine details"
                        required
                      />
                    </div>

                    {/* Status */}
                    {/* <div className="col-md-6 mb-3">
                      <label className="form-label">Status <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div> */}

                    {/* Month */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Select Month <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="month"
                        value={formData.month}
                        onChange={handleMonthChange}
                        required
                      >
                        <option value="">-- Select Month --</option>
                        {months.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Requirement Count */}
                    <div className="col-12 mb-3">
                      <label className="form-label">
                        Requirement Count <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="requirementCount"
                        value={formData.requirementCount}
                        onChange={handleInputChange}
                        placeholder="Enter required count"
                        min="0"
                        required
                      />
                      <small className="text-muted">
                        This will be added to the selected month's column
                      </small>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn rounded-pill gradient-bg text-white"
                    onClick={handleSubmit}
                  >
                    {isEditing ? "Update" : "Save"}
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

export default Requirement;
