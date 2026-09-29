import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import "../../../styles/requirements.css";
import DashboardFilterBar from "../components/dashboardFilterBar";
import type {
  Requirements,
  RequirementFormData,
  MonthKey,
  MonthOptions,
  RequirementStatus,
} from "../models/requirements";
import { generateRandomRequirements } from "../utils/randomRequirements";

const SHIFT_OPTIONS = ["A", "B", "C", "General"];

function Requirement() {
  // -----------------------------
  // State
  // -----------------------------

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [records, setRecords] = useState<Requirements[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [selectedMonth, setSelectedMonth] = useState<MonthKey | "">("");

  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [formData, setFormData] = useState<RequirementFormData>({
    id: null,
    department: "",
    subDepartment: "",
    section: "",
    line: "",
    shift: "",
    year: "",
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
  // Load records (from localStorage or generate random)
  // -----------------------------

  useEffect(() => {
    const saved = localStorage.getItem("requirementRecords");
    if (saved) {
      const parsed: Requirements[] = JSON.parse(saved);
      setRecords(parsed);
    } else {
      const generated = generateRandomRequirements(30);
      setRecords(generated);
      localStorage.setItem("requirementRecords", JSON.stringify(generated));
    }
  }, []);

  // -----------------------------
  // Save helper
  // -----------------------------

  const saveToLocal = (newRecords: Requirements[]) => {
    setRecords(newRecords);
    localStorage.setItem("requirementRecords", JSON.stringify(newRecords));
  };

  // -----------------------------
  // Excel Upload Handler
  // -----------------------------

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result as string;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData: any[] = XLSX.utils.sheet_to_json(ws);
        if (!rawData || rawData.length === 0) {
          alert("The uploaded Excel file is empty.");
          return;
        }
        const newRecords: Requirements[] = rawData.map((row, idx) => ({
          id: Date.now() + idx,
          department: row["department"] || "",
          subDepartment: row["subDepartment"] || row["sub_section"] || "",
          section: row["section"] || "",
          line: row["line"] || "",
          shift: row["shift"] || "",
          year: row["year"]?.toString() || "",
          status: row["status"] || "Pending",
          month: (row["month"] || "jan").toLowerCase() as MonthKey,
          requirementCount: Number(row["requirementCount"] || 0),
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
        }));
        const combined = [...records, ...newRecords];
        saveToLocal(combined);
        setUploadMessage(`Successfully imported ${newRecords.length} records from Excel!`);
        setTimeout(() => setUploadMessage(null), 4000);
      } catch (err) {
        console.error("Failed to parse Excel file:", err);
        alert("Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.");
      } finally {
        if (e.target) e.target.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  // -----------------------------
  // Input change
  // -----------------------------

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "requirementCount" ? Number(value) : value,
    }));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value as MonthKey | "";
    setSelectedMonth(month);
    setFormData((prev) => ({ ...prev, month }));
  };

  // -----------------------------
  // Add
  // -----------------------------

  const handleAdd = (): void => {
    setFormData({
      id: null,
      department: "",
      subDepartment: "",
      section: "",
      line: "",
      shift: "",
      year: "",
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

  const handleEdit = (record: Requirements): void => {
    setFormData(record);
    setSelectedMonth(record.month || "");
    setIsEditing(true);
    setShowModal(true);
  };

  // -----------------------------
  // Delete
  // -----------------------------

  const handleDelete = (id: number): void => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const newRecords = records.filter((r) => r.id !== id);
      saveToLocal(newRecords);
    }
  };

  // -----------------------------
  // Submit
  // -----------------------------

  const handleSubmit = (): void => {
    if (
      !formData.department ||
      !formData.subDepartment ||
      !formData.section ||
      !formData.line ||
      !formData.shift ||
      !formData.year ||
      !formData.month ||
      !formData.requirementCount
    ) {
      alert("Please fill in all required fields");
      return;
    }
    const monthKey: MonthKey = formData.month as MonthKey;
    const updatedFormData: RequirementFormData = {
      ...formData,
      [monthKey]: formData.requirementCount,
    };
    if (isEditing) {
      if (formData.id === null) return;
      const updated = records.map((r) => (r.id === formData.id ? { ...updatedFormData, id: formData.id } : r));
      saveToLocal(updated);
    } else {
      const newRec: Requirements = { ...updatedFormData, id: Date.now() };
      saveToLocal([...records, newRec]);
    }
    setShowModal(false);
  };

  // -----------------------------
  // Filter & Pagination helpers
  // -----------------------------

  const handleClearFilters = () => {
    setSelectedFilters({});
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const filteredRecords = records.filter((r) => {
    if (selectedFilters["Departments"] && r.department !== selectedFilters["Departments"]) return false;
    if (selectedFilters["Sub Departments"] && r.subDepartment !== selectedFilters["Sub Departments"]) return false;
    if (selectedFilters["Sections"] && r.section !== selectedFilters["Sections"]) return false;
    if (selectedFilters["Lines"] && r.line !== selectedFilters["Lines"]) return false;
    if (selectedFilters["Shift"] && r.shift !== selectedFilters["Shift"]) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));
  const displayedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // -----------------------------
  // Get month label
  // -----------------------------

  const getMonthLabel = (monthValue: MonthKey | ""): string => {
    const month = months.find((m) => m.value === monthValue);
    return month ? month.label : monthValue;
  };

  // -----------------------------
  // Status badge class
  // -----------------------------

  const getStatusBadgeClass = (status: RequirementStatus): string => {
    switch (status) {
      case "Approved":
        return "status-approved";
      case "Accepted":
        return "status-accepted";
      default:
        return "status-pending";
    }
  };

  // -----------------------------
  // Render
  // -----------------------------

  return (
    <div className="requirement-page">
      <DashboardFilterBar
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        handleClearFilters={handleClearFilters}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />

      {/* Records Section */}
      <div className="records-section">
        <div className="records-header">
          <div className="records-title-wrapper">
            <div className="gradient-bg p-2 rounded-3 text-white">
              {/* SVG omitted for brevity */}
            </div>
            <div>
              <h4 className="records-title">Requirement Records</h4>
              <p className="records-subtitle">View and manage manpower Requirements</p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            {/* Hidden Excel File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              onChange={handleExcelUpload}
            />
            {/* Upload Excel Button */}
            <button
              type="button"
              className="btn btn-outline-success rounded-pill d-flex align-items-center px-3 py-2 fw-semibold shadow-sm"
              onClick={() => fileInputRef.current?.click()}
              title="Import requirements from Excel (.xlsx, .xls)"
              style={{ fontSize: "0.88rem" }}
            >
              {/* SVG omitted */} Upload Excel
            </button>
            {/* Add Requirement Button */}
            <button className="btn gradient-bg text-white rounded-pill" onClick={handleAdd}>
              {/* SVG omitted */} Add Requirement
            </button>
          </div>
        </div>

        {/* Upload Success Alert */}
        {uploadMessage && (
          <div
            className="alert alert-success alert-dismissible fade show py-2 px-3 mb-3 d-flex align-items-center justify-content-between"
            role="alert"
          >
            <div className="d-flex align-items-center gap-2">
              {/* SVG omitted */}
              <span>{uploadMessage}</span>
            </div>
            <button type="button" className="btn-close py-2" onClick={() => setUploadMessage(null)} aria-label="Close" />
          </div>
        )}

        <div className="table-responsive">
          <table className="records-table">
            <thead>
              <tr>
                <th>DEPARTMENT</th>
                <th>SUB-DEPARTMENT</th>
                <th>SECTION</th>
                <th>LINE</th>
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
              {displayedRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.department}</td>
                  <td>{record.subDepartment}</td>
                  <td>{record.section}</td>
                  <td>{record.line}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(record.status)}`}>• {record.status}</span>
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
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(record)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(record.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayedRecords.length === 0 && (
                <tr>
                  <td colSpan={18} className="text-center py-4">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div>
            <button className="btn btn-sm btn-outline-primary me-2" onClick={goToPrev} disabled={currentPage === 1}>
              Prev
            </button>
            <button className="btn btn-sm btn-outline-primary" onClick={goToNext} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <>
            <div className="modal-backdrop fade show" />
            <div className="modal fade show d-block" tabIndex={-1}>
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content p-4">
                  <div className="modal-header">
                    <h5 className="modal-title">{isEditing ? "Edit Requirement" : "Add New Requirement"}</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      {/* Department */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Department <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" name="department" value={formData.department} onChange={handleInputChange} placeholder="Enter department name" required />
                      </div>

                      {/* Sub-Department */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Sub-Department <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" name="subDepartment" value={formData.subDepartment || ""} onChange={handleInputChange} placeholder="Enter sub-department name" required />
                      </div>

                      {/* Section */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Section <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" name="section" value={formData.section} onChange={handleInputChange} placeholder="Enter section name" required />
                      </div>

                      {/* Line */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Line <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" name="line" value={formData.line} onChange={handleInputChange} placeholder="Enter line description" required />
                      </div>

                      {/* Shift */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Shift <span className="text-danger">*</span>
                        </label>
                        <select className="form-select" name="shift" value={formData.shift || ""} onChange={handleInputChange} required>
                          <option value="">-- Select Shift --</option>
                          {SHIFT_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Year */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Year <span className="text-danger">*</span>
                        </label>
                        <input type="number" className="form-control" name="year" value={formData.year || ""} onChange={handleInputChange} placeholder="Enter year" min="2000" max="2100" required />
                      </div>

                      {/* Month */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Select Month <span className="text-danger">*</span>
                        </label>
                        <select className="form-select" name="month" value={formData.month} onChange={handleMonthChange} required>
                          <option value="">-- Select Month --</option>
                          {months.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Requirement Count */}
                      <div className="col-12 mb-3">
                        <label className="form-label">
                          Requirement Count <span className="text-danger">*</span>
                        </label>
                        <input type="number" className="form-control" name="requirementCount" value={formData.requirementCount} onChange={handleInputChange} placeholder="Enter required count" min="0" required />
                        <small className="text-muted">This will be added to the selected month's column</small>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowModal(false)}>
                      Close
                    </button>
                    <button type="button" className="btn rounded-pill gradient-bg text-white" onClick={handleSubmit}>
                      {isEditing ? "Update" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Requirement;
