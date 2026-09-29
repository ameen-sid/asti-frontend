import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import type {
  OperatorAssignment,
  AssignmentStatus,
  AssignmentType,
} from "../models/lmsTypes";
import {
  INITIAL_OPERATOR_ASSIGNMENTS,
  CERTIFIED_OPERATOR_OPTIONS,
} from "../utils/mockLmsData";
import "../../../styles/departments.css";
import DashboardFilterBar from "../../dashboard/components/dashboardFilterBar";
import { getDepartment } from "../services/departmentService";
import { getSubDepartments } from "../services/subDepartmentService";
import { getSections } from "../services/sectionService";
import { getLines } from "../services/lineService";
import { getMachines } from "../services/machineService";
import type { Department, SubDepartment, Section, Line, Machine } from "../models/departments";

const ASSIGNMENT_STATUSES: AssignmentStatus[] = [
  "Available",
  "Assigned",
  "Certification Expiring",
  "Expired",
];

const SHIFTS = ["Shift A", "Shift B", "Shift C", "Shift General"];
const SKILL_LEVELS = ["L0", "L1", "L2", "L3", "L4", "L5"];
const ASSIGNMENT_TYPES: AssignmentType[] = [
  "Permanent",
  "Temporary",
  "Backup",
  "Job Rotation",
];

function OperatorDistributor() {
  const [assignments, setAssignments] = useState<OperatorAssignment[]>(() => {
    const saved = localStorage.getItem("lms_operator_assignments");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_OPERATOR_ASSIGNMENTS;
      }
    }
    return INITIAL_OPERATOR_ASSIGNMENTS;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string>("");

  // Filters — using DashboardFilterBar cascading hierarchy
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});
  const [search, setSearch] = useState<string>("");
  const [shiftFilter, setShiftFilter] = useState<string>("All Shifts");
  const [skillFilter, setSkillFilter] = useState<string>("All Skill Levels");
  const [certFilter, setCertFilter] = useState<string>("All Certifications");
  const [statusFilter, setStatusFilter] = useState<string>("All Statuses");

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Assign Modal
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>(
    CERTIFIED_OPERATOR_OPTIONS[0]?.operatorId || ""
  );

  // Cascading Selection State for Assign Modal from API
  const [departmentsList, setDepartmentsList] = useState<Department[]>([]);
  const [subDepartmentsList, setSubDepartmentsList] = useState<SubDepartment[]>([]);
  const [sectionsList, setSectionsList] = useState<Section[]>([]);
  const [linesList, setLinesList] = useState<Line[]>([]);
  const [machinesList, setMachinesList] = useState<Machine[]>([]);

  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [selectedSubDeptId, setSelectedSubDeptId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedLineId, setSelectedLineId] = useState<string>("");
  const [selectedMachine, setSelectedMachine] = useState<string>("");

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [deptRes, subDeptRes, secRes, lineRes, macRes] = await Promise.allSettled([
          getDepartment(),
          getSubDepartments(),
          getSections(),
          getLines(),
          getMachines(),
        ]);
        if (deptRes.status === "fulfilled") {
          const depts = deptRes.value?.data?.data || [];
          setDepartmentsList(depts);
          if (depts.length > 0 && !selectedDeptId) {
            setSelectedDeptId(String(depts[0].id));
          }
        }
        if (subDeptRes.status === "fulfilled") {
          setSubDepartmentsList(subDeptRes.value?.data?.data || []);
        }
        if (secRes.status === "fulfilled") {
          setSectionsList(secRes.value?.data?.data || []);
        }
        if (lineRes.status === "fulfilled") {
          setLinesList(lineRes.value?.data?.data || []);
        }
        if (macRes.status === "fulfilled") {
          setMachinesList(macRes.value?.data?.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch master data in OperatorDistributor:", err);
      }
    };
    fetchMasterData();
  }, []);

  // Filtered child lists based on selected parent IDs
  const filteredSubDepts = subDepartmentsList.filter(
    (s) => !selectedDeptId || String(s.departmentId) === String(selectedDeptId)
  );
  const filteredSections = sectionsList.filter(
    (sec) => !selectedSubDeptId || String(sec.subDepartmentId) === String(selectedSubDeptId)
  );
  const filteredLines = linesList.filter(
    (l) => !selectedSectionId || String(l.sectionId) === String(selectedSectionId)
  );
  const filteredMachines = machinesList.filter(
    (m) => !selectedLineId || String(m.lineId) === String(selectedLineId)
  );

  const currentDept = departmentsList.find((d) => String(d.id) === String(selectedDeptId));
  const currentSubDept = subDepartmentsList.find((s) => String(s.id) === String(selectedSubDeptId));
  const currentSection = sectionsList.find((sec) => String(sec.id) === String(selectedSectionId));
  const currentLine = linesList.find((l) => String(l.id) === String(selectedLineId));

  const [shift, setShift] = useState<string>("Shift A");
  const [skillLevel, setSkillLevel] = useState<string>("L3");
  const [assignmentType, setAssignmentType] = useState<AssignmentType>("Permanent");
  const [effectiveFrom, setEffectiveFrom] = useState<string>(new Date().toISOString().slice(0, 10));
  const [effectiveTo, setEffectiveTo] = useState<string>(
    `${new Date().getFullYear() + 1}-${new Date().toISOString().slice(5, 10)}`
  );
  const [remarks, setRemarks] = useState<string>("");
  const [assignError, setAssignError] = useState<string>("");

  // Report Modal
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportType, setReportType] = useState<string>("Certified Operator List");
  const [reportDept, setReportDept] = useState<string>("All Departments");
  const [reportShift, setReportShift] = useState<string>("All Shifts");
  const [reportSkill, setReportSkill] = useState<string>("All Skill Levels");
  const [reportStatus, setReportStatus] = useState<string>("All Statuses");

  const saveAssignments = (list: OperatorAssignment[]) => {
    setAssignments(list);
    localStorage.setItem("lms_operator_assignments", JSON.stringify(list));
  };

  // KPIs
  const totalCertifiedOperators = CERTIFIED_OPERATOR_OPTIONS.length;
  const assignedCount = assignments.filter((a) => a.assignmentStatus === "Assigned").length;
  const availableCount = assignments.filter((a) => a.assignmentStatus === "Available").length;
  const machinesCovered = Array.from(new Set(assignments.map((a) => a.machine))).filter(Boolean).length;

  // Options from data
  const departmentOptions = Array.from(new Set(assignments.map((a) => a.currentDepartment))).filter(Boolean);
  const sectionOptions = Array.from(new Set(assignments.map((a) => a.section))).filter(Boolean);
  const lineOptions = Array.from(new Set(assignments.map((a) => a.line))).filter(Boolean);
  const certOptions = Array.from(new Set(assignments.map((a) => a.certificationName))).filter(Boolean);

  // Filtering
  const filteredAssignments = assignments.filter((item) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = `${item.operatorId} ${item.operatorName} ${item.machine} ${item.line} ${item.processName}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    if (
      selectedFilters["Departments"] &&
      item.currentDepartment.toLowerCase() !== selectedFilters["Departments"].toLowerCase()
    ) return false;
    if (
      selectedFilters["Sub Departments"] &&
      item.subDepartment &&
      item.subDepartment.toLowerCase() !== selectedFilters["Sub Departments"].toLowerCase()
    ) return false;
    if (
      selectedFilters["Sections"] &&
      item.section &&
      item.section.toLowerCase() !== selectedFilters["Sections"].toLowerCase()
    ) return false;
    if (
      selectedFilters["Lines"] &&
      item.line &&
      item.line.toLowerCase() !== selectedFilters["Lines"].toLowerCase()
    ) return false;
    if (shiftFilter !== "All Shifts" && item.shift !== shiftFilter) return false;
    if (skillFilter !== "All Skill Levels" && item.skillLevel !== skillFilter) return false;
    if (certFilter !== "All Certifications" && item.certificationName !== certFilter) return false;
    if (statusFilter !== "All Statuses" && item.assignmentStatus !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAssignments.length / itemsPerPage));
  const displayedAssignments = filteredAssignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleClearFilters = () => {
    setSelectedFilters({});
    setSearch("");
    setShiftFilter("All Shifts");
    setSkillFilter("All Skill Levels");
    setCertFilter("All Certifications");
    setStatusFilter("All Statuses");
    setCurrentPage(1);
  };


  const handleDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    setSelectedSubDeptId("");
    setSelectedSectionId("");
    setSelectedLineId("");
    setSelectedMachine("");
  };

  const handleSubDeptChange = (subId: string) => {
    setSelectedSubDeptId(subId);
    setSelectedSectionId("");
    setSelectedLineId("");
    setSelectedMachine("");
  };

  const handleSectionChange = (secId: string) => {
    setSelectedSectionId(secId);
    setSelectedLineId("");
    setSelectedMachine("");
  };

  const handleLineChange = (lineId: string) => {
    setSelectedLineId(lineId);
    setSelectedMachine("");
  };

  // Submit Assignment
  const handleAssignOperator = (e: React.FormEvent) => {
    e.preventDefault();
    const op = CERTIFIED_OPERATOR_OPTIONS.find((o) => o.operatorId === selectedOperatorId);
    if (!op) {
      setAssignError("Please select a valid certified operator.");
      return;
    }
    if (!effectiveFrom) {
      setAssignError("Effective From date is required.");
      return;
    }

    // Check if operator already has an assignment and update or add new
    const existingIndex = assignments.findIndex((a) => a.operatorId === op.operatorId);

    const newRecord: OperatorAssignment = {
      id: existingIndex >= 0 ? assignments[existingIndex].id : Date.now(),
      operatorId: op.operatorId,
      operatorName: op.operatorName,
      certificationName: op.certification,
      processName: op.process,
      skillLevel: skillLevel,
      plant: "Plant 1 - Manesar",
      currentDepartment: currentDept?.name || "Production",
      subDepartment: currentSubDept?.name || "General",
      section: currentSection?.name || "General",
      line: currentLine?.name || "General",
      station: "General",
      machine: selectedMachine || "Unassigned",
      shift: shift,
      assignmentStatus: "Assigned",
      assignmentType: assignmentType,
      validityDate: op.validTill,
      effectiveFrom: effectiveFrom,
      effectiveTo: effectiveTo,
      remarks: remarks || "Assigned via Operator Distributor Module.",
      lastUpdated: new Date().toISOString().slice(0, 10),
    };

    let updatedList: OperatorAssignment[];
    if (existingIndex >= 0) {
      updatedList = [...assignments];
      updatedList[existingIndex] = newRecord;
    } else {
      updatedList = [newRecord, ...assignments];
    }

    saveAssignments(updatedList);
    setSuccessToast(`Operator ${op.operatorName} successfully assigned to ${newRecord.machine} (${newRecord.shift})!`);
    setShowAssignModal(false);
    setAssignError("");
  };

  // Quick Unassign
  const handleUnassign = (item: OperatorAssignment) => {
    const updated = assignments.map((a) =>
      a.id === item.id
        ? {
          ...a,
          assignmentStatus: "Available" as AssignmentStatus,
          remarks: "Operator unassigned and moved to available pool.",
        }
        : a
    );
    saveAssignments(updated);
    setSuccessToast(`Operator ${item.operatorName} is now Marked as Available.`);
  };

  // Quick Reassign Shift
  const handleChangeShift = (item: OperatorAssignment, newShift: string) => {
    const updated = assignments.map((a) =>
      a.id === item.id ? { ...a, shift: newShift } : a
    );
    saveAssignments(updated);
    setSuccessToast(`Shift for ${item.operatorName} updated to ${newShift}.`);
  };

  // Export Excel
  const handleExportAssignments = () => {
    const rows = filteredAssignments.map((a) => ({
      OperatorID: a.operatorId,
      Name: a.operatorName,
      Certification: a.certificationName,
      SkillLevel: a.skillLevel,
      Department: a.currentDepartment,
      SubDepartment: a.subDepartment,
      Section: a.section,
      Line: a.line,
      Process: a.processName,
      Station: a.station,
      Machine: a.machine,
      Shift: a.shift,
      Status: a.assignmentStatus,
      AssignmentType: a.assignmentType,
      Validity: a.validityDate,
      EffectiveFrom: a.effectiveFrom,
      EffectiveTo: a.effectiveTo,
      Remarks: a.remarks,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Operator_Assignments");
    XLSX.writeFile(wb, `Operator_Distribution_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const getStatusBadge = (status: AssignmentStatus) => {
    switch (status) {
      case "Available":
        return { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" };
      case "Assigned":
        return { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" };
      case "Certification Expiring":
        return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
      case "Expired":
        return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
      default:
        return { bg: "#f8fafc", color: "#334155", border: "#e2e8f0" };
    }
  };

  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">
      {/* Toast Alert */}
      {successToast && (
        <div
          className="alert alert-success d-flex align-items-center justify-content-between py-2 px-3 mb-3 shadow-sm rounded-3"
          style={{ borderLeft: "5px solid #059669", fontSize: "0.9rem" }}
          role="alert"
        >
          <div className="d-flex align-items-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" className="me-2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <strong>{successToast}</strong>
          </div>
          <button type="button" className="btn-close" style={{ fontSize: "0.75rem" }} onClick={() => setSuccessToast("")} />
        </div>
      )}

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Certified Operators",
            value: totalCertifiedOperators,
            color: "#1d4ed8",
            bgClass: "my-fade-blue",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            ),
          },
          {
            label: "Assigned Operators",
            value: `${assignedCount} Deployed`,
            color: "#059669",
            bgClass: "bg-emerald-50",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ),
          },
          {
            label: "Available Operators",
            value: `${availableCount} Standby`,
            color: "#0284c7",
            bgClass: "my-fade-cyan",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ),
          },
          {
            label: "Machines Covered",
            value: `${machinesCovered} Stations`,
            color: "#7c3aed",
            bgClass: "my-fade-purple",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            ),
          },
        ].map((stat, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card-box d-flex align-items-center p-3 h-100">
              <div
                className={`me-3 rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 ${stat.bgClass}`}
                style={{ width: "46px", height: "46px", color: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="stat-card-label">{stat.label}</div>
                <div className="stat-card-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar — unified DashboardFilterBar with cascading hierarchy */}
      <DashboardFilterBar
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        handleClearFilters={handleClearFilters}
      >
        {/* Search */}
        <div className="ctq-filter-search-group">
          <svg className="ctq-filter-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="ctq-filter-search-input"
            placeholder="Search Name, ID, Machine, Process..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Shift */}
        <select className="ctq-filter-select" value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)}>
          <option value="All Shifts">All Shifts</option>
          {SHIFTS.map((sh) => (
            <option key={sh} value={sh}>{sh}</option>
          ))}
        </select>

        {/* Skill Level */}
        <select className="ctq-filter-select" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
          <option value="All Skill Levels">All Skill Levels</option>
          {SKILL_LEVELS.map((sk) => (
            <option key={sk} value={sk}>Level {sk}</option>
          ))}
        </select>

        {/* Certification */}
        <select className="ctq-filter-select" value={certFilter} onChange={(e) => setCertFilter(e.target.value)}>
          <option value="All Certifications">All Certifications</option>
          {certOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Status */}
        <select className="ctq-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All Statuses">All Statuses</option>
          {ASSIGNMENT_STATUSES.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>

        {/* Local clear trigger */}
        {(search ||
          Object.keys(selectedFilters).length > 0 ||
          shiftFilter !== "All Shifts" ||
          skillFilter !== "All Skill Levels" ||
          certFilter !== "All Certifications" ||
          statusFilter !== "All Statuses") && (
            <button type="button" className="ctq-filter-clear-btn" onClick={handleClearFilters}>
              Clear
            </button>
          )}

        {/* Action buttons placed in right slot via filter bar children */}
        <div className="ms-auto d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-primary px-3 py-2 fw-semibold rounded-pill d-flex align-items-center shadow-sm"
            onClick={() => setShowReportModal(true)}
            style={{ fontSize: "0.88rem" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Report
          </button>
          {/* <button
            type="button"
            className="btn btn-asti-gradient px-4 py-2 fw-semibold rounded-pill d-flex align-items-center"
            onClick={() => { setAssignError(""); setShowAssignModal(true); }}
          >
            <span className="me-1" style={{ fontSize: "1.1rem", lineHeight: 1 }}>+</span>
            Assign
          </button> */}
        </div>
      </DashboardFilterBar>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 dept-table">
          <thead>
            <tr className="dept-table-header">
              <th className="py-3 px-3">OPERATOR</th>
              <th className="py-3 px-3">CERTIFICATION</th>
              <th className="py-3 px-3">SKILL LEVEL</th>
              <th className="py-3 px-3">CURRENT DEPARTMENT</th>
              <th className="py-3 px-3">LINE / PROCESS</th>
              <th className="py-3 px-3">MACHINE</th>
              <th className="py-3 px-3">SHIFT</th>
              <th className="py-3 px-3">ASSIGNMENT STATUS</th>
              <th className="py-3 px-3">VALIDITY</th>
              <th className="py-3 px-3 text-end">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : displayedAssignments.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-5 text-muted">
                  <div className="mb-2">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                    </svg>
                  </div>
                  No matching operator assignment records found.
                </td>
              </tr>
            ) : (
              displayedAssignments.map((item) => {
                const badge = getStatusBadge(item.assignmentStatus);
                return (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {/* Operator */}
                    <td className="px-3">
                      <div>
                        <div className="fw-semibold text-dark" style={{ fontSize: "0.92rem" }}>
                          {item.operatorName}
                        </div>
                        <span className="badge-dept-code" style={{ fontSize: "0.72rem" }}>
                          {item.operatorId}
                        </span>
                      </div>
                    </td>

                    {/* Certification */}
                    <td className="px-3">
                      <div className="fw-semibold text-primary" style={{ fontSize: "0.85rem" }}>
                        {item.certificationName}
                      </div>
                      <small className="text-muted">{item.processName}</small>
                    </td>

                    {/* Skill Level */}
                    <td className="px-3">
                      <span
                        className="badge rounded-pill fw-bold"
                        style={{
                          backgroundColor: "#eff6ff",
                          color: "#1d4ed8",
                          border: "1px solid #bfdbfe",
                          fontSize: "0.78rem",
                        }}
                      >
                        {item.skillLevel}
                      </span>
                    </td>

                    {/* Current Department */}
                    <td className="px-3">
                      <div className="fw-medium text-dark">{item.currentDepartment}</div>
                      <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                        {[item.section, item.line].filter(Boolean).join(" • ")}
                      </div>
                    </td>

                    {/* Line / Process */}
                    <td className="px-3">
                      <div className="text-dark fw-medium" style={{ fontSize: "0.85rem" }}>
                        {item.line}
                      </div>
                      <div className="text-muted" style={{ fontSize: "0.76rem" }}>
                        {item.processName}
                      </div>
                    </td>

                    {/* Machine */}
                    <td className="px-3">
                      <span className="text-dark" style={{ fontSize: "0.85rem" }}>
                        {item.machine || "-"}
                      </span>
                    </td>

                    {/* Shift */}
                    <td className="px-3">
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: "#f1f5f9",
                          color: "#334155",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.72rem",
                        }}
                      >
                        {item.shift}
                      </span>
                    </td>

                    {/* Assignment Status */}
                    <td className="px-3">
                      <span
                        className="px-2 py-1 rounded-pill fw-bold"
                        style={{
                          fontSize: "0.72rem",
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          letterSpacing: "0.04em",
                          display: "inline-block",
                        }}
                      >
                        {item.assignmentStatus.toUpperCase()}
                      </span>
                    </td>

                    {/* Validity */}
                    <td className="px-3">
                      <div className="text-dark" style={{ fontSize: "0.82rem" }}>
                        Valid till {item.validityDate}
                      </div>
                      <small className="text-muted">{item.assignmentType}</small>
                    </td>

                    {/* Actions Menu */}
                    <td className="px-3 text-end">
                      <div className="dropdown d-inline-block">
                        <button
                          className="btn btn-sm btn-light rounded-circle shadow-none p-1"
                          type="button"
                          id={`dropdown-assign-${item.id}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{ width: "32px", height: "32px" }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                          </svg>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 py-1" style={{ fontSize: "0.85rem" }}>
                          <li>
                            <button
                              className="dropdown-item py-2"
                              onClick={() => {
                                setSelectedOperatorId(item.operatorId);
                                setShowAssignModal(true);
                              }}
                            >
                              Reassign / Change Station
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item py-2"
                              onClick={() => handleChangeShift(item, item.shift === "Shift A" ? "Shift B" : "Shift A")}
                            >
                              Switch Shift ({item.shift === "Shift A" ? "B" : "A"})
                            </button>
                          </li>
                          {item.assignmentStatus === "Assigned" && (
                            <li>
                              <button className="dropdown-item py-2 text-warning" onClick={() => handleUnassign(item)}>
                                Mark as Available
                              </button>
                            </li>
                          )}
                          <li>
                            <hr className="dropdown-divider my-1" />
                          </li>
                          <li>
                            <button
                              className="dropdown-item py-2 text-muted"
                              onClick={() => {
                                alert(`Operator Assignment Details:\nPlant: ${item.plant}\nRemarks: ${item.remarks}`);
                              }}
                            >
                              View Assignment Log
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="d-flex align-items-center justify-content-between mt-4 flex-wrap gap-2">
        <div className="text-muted" style={{ fontSize: "0.85rem" }}>
          Showing <strong>{filteredAssignments.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
          <strong>{Math.min(currentPage * itemsPerPage, filteredAssignments.length)}</strong> of{" "}
          <strong>{filteredAssignments.length}</strong> operators
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="fw-semibold text-muted px-2" style={{ fontSize: "0.85rem" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. ASSIGN OPERATOR MODAL (Cascading Dropdowns)            */}
      {/* ========================================================= */}
      {showAssignModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow-lg border-0 rounded-4">
                <div className="modal-header border-bottom pb-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "42px", height: "42px", backgroundColor: "#eff6ff", color: "#1d4ed8" }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="modal-title fw-bold text-dark mb-0">Assign Certified Operator</h5>
                      <small className="text-muted">Allocate DOJO-certified workforce to shopfloor stations</small>
                    </div>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)} />
                </div>

                <form onSubmit={handleAssignOperator}>
                  <div className="modal-body p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                    {assignError && (
                      <div className="alert alert-danger py-2 px-3 mb-3 rounded-3" style={{ fontSize: "0.85rem" }}>
                        {assignError}
                      </div>
                    )}

                    {/* Operator Selection (Only Certified/Qualified!) */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                        Select Certified Operator * (DOJO Qualified Only)
                      </label>
                      <select
                        className="form-select form-select-lg fw-semibold"
                        value={selectedOperatorId}
                        onChange={(e) => {
                          setSelectedOperatorId(e.target.value);
                          const op = CERTIFIED_OPERATOR_OPTIONS.find((o) => o.operatorId === e.target.value);
                          if (op) setSkillLevel(op.skillLevel);
                        }}
                        required
                      >
                        {CERTIFIED_OPERATOR_OPTIONS.map((op) => (
                          <option key={op.operatorId} value={op.operatorId}>
                            {op.operatorId} - {op.operatorName} ({op.certification} • Level {op.skillLevel})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3 bg-light rounded-3 mb-3">
                      <div className="d-flex justify-content-between text-muted" style={{ fontSize: "0.8rem" }}>
                        <span>
                          Selected Certification:{" "}
                          <strong className="text-dark">
                            {CERTIFIED_OPERATOR_OPTIONS.find((o) => o.operatorId === selectedOperatorId)?.certification}
                          </strong>
                        </span>
                        <span>
                          DOJO Validity:{" "}
                          <strong className="text-success">
                            {CERTIFIED_OPERATOR_OPTIONS.find((o) => o.operatorId === selectedOperatorId)?.validTill}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Cascading Hierarchy from Master APIs */}
                    <h6 className="fw-bold text-dark border-bottom pb-2 mb-3" style={{ fontSize: "0.88rem" }}>
                      Deployment Hierarchy (Department → Sub-Department → Section → Line → Machine)
                    </h6>

                    <div className="row g-3">
                      {/* Department */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Department *
                        </label>
                        <select
                          className="form-select"
                          value={selectedDeptId}
                          onChange={(e) => handleDeptChange(e.target.value)}
                          required
                        >
                          <option value="">Select Department</option>
                          {departmentsList.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Sub-Department */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Sub-Department
                        </label>
                        <select
                          className="form-select"
                          value={selectedSubDeptId}
                          onChange={(e) => handleSubDeptChange(e.target.value)}
                          disabled={!selectedDeptId}
                        >
                          <option value="">Select Sub-Department</option>
                          {filteredSubDepts.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Section */}
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Section
                        </label>
                        <select
                          className="form-select"
                          value={selectedSectionId}
                          onChange={(e) => handleSectionChange(e.target.value)}
                          disabled={!selectedSubDeptId}
                        >
                          <option value="">Select Section</option>
                          {filteredSections.map((sec) => (
                            <option key={sec.id} value={sec.id}>
                              {sec.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Line */}
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Line
                        </label>
                        <select
                          className="form-select"
                          value={selectedLineId}
                          onChange={(e) => handleLineChange(e.target.value)}
                          disabled={!selectedSectionId}
                        >
                          <option value="">Select Line</option>
                          {filteredLines.map((line) => (
                            <option key={line.id} value={line.id}>
                              {line.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Machine */}
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Machine / Equipment
                        </label>
                        <select
                          className="form-select"
                          value={selectedMachine}
                          onChange={(e) => setSelectedMachine(e.target.value)}
                          disabled={!selectedLineId}
                        >
                          <option value="">Select Machine</option>
                          {filteredMachines.map((m) => (
                            <option key={m.id} value={m.name}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Shift & Assignment Type */}
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Shift *
                        </label>
                        <select className="form-select" value={shift} onChange={(e) => setShift(e.target.value)}>
                          {SHIFTS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Skill Level *
                        </label>
                        <select
                          className="form-select"
                          value={skillLevel}
                          onChange={(e) => setSkillLevel(e.target.value)}
                        >
                          {SKILL_LEVELS.map((sk) => (
                            <option key={sk} value={sk}>
                              Level {sk}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Assignment Type *
                        </label>
                        <select
                          className="form-select"
                          value={assignmentType}
                          onChange={(e) => setAssignmentType(e.target.value as AssignmentType)}
                        >
                          {ASSIGNMENT_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Dates */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Effective From *
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={effectiveFrom}
                          onChange={(e) => setEffectiveFrom(e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Effective To
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={effectiveTo}
                          onChange={(e) => setEffectiveTo(e.target.value)}
                        />
                      </div>

                      {/* Remarks */}
                      <div className="col-12">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Remarks / Assignment Notes
                        </label>
                        <textarea
                          className="form-control"
                          rows={2}
                          placeholder="e.g. Primary operator for new launch line. Verified zero defects in DOJO."
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-top px-4 py-3">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowAssignModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-asti-gradient rounded-pill px-4">
                      Assign Operator
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 2. REPORT MODAL (Comprehensive Analytics & Export)        */}
      {/* ========================================================= */}
      {showReportModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow-lg border-0 rounded-4">
                <div className="modal-header border-bottom pb-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "42px", height: "42px", backgroundColor: "#eff6ff", color: "#1d4ed8" }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="modal-title fw-bold text-dark mb-0">Operator Distribution Report</h5>
                      <small className="text-muted">Generate certified workforce allocation and coverage metrics</small>
                    </div>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setShowReportModal(false)} />
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3 mb-3">
                    {/* Report Type */}
                    <div className="col-12">
                      <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                        Select Report Type
                      </label>
                      <select
                        className="form-select form-select-lg fw-semibold"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                      >
                        <option value="Certified Operator List">1. Certified Operator List</option>
                        <option value="Operator vs Machine Assignment">2. Operator vs Machine Assignment</option>
                        <option value="Department-wise Distribution">3. Department-wise Distribution</option>
                        <option value="Line-wise Distribution">4. Line-wise Distribution</option>
                        <option value="Machine-wise Qualified Operators">5. Machine-wise Qualified Operators</option>
                        <option value="Available vs Assigned Operators">6. Available vs Assigned Operators</option>
                        <option value="Certification Expiry Report">7. Certification Expiry Report</option>
                      </select>
                    </div>

                    {/* Report Scope Filters */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                        Department Scope
                      </label>
                      <select className="form-select" value={reportDept} onChange={(e) => setReportDept(e.target.value)}>
                        <option value="All Departments">All Departments</option>
                        {departmentsList.length > 0
                          ? departmentsList.map((d) => (
                              <option key={d.id} value={d.name}>
                                {d.name}
                              </option>
                            ))
                          : departmentOptions.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                        Shift Scope
                      </label>
                      <select className="form-select" value={reportShift} onChange={(e) => setReportShift(e.target.value)}>
                        <option value="All Shifts">All Shifts</option>
                        {SHIFTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Summary Metric Preview Box */}
                  <div className="border rounded-3 p-3 bg-light mb-3">
                    <h6 className="fw-bold text-dark mb-2" style={{ fontSize: "0.85rem" }}>
                      Report Summary ({reportType})
                    </h6>
                    <div className="row g-2 text-muted" style={{ fontSize: "0.82rem" }}>
                      <div className="col-sm-3">
                        Total Records: <strong className="text-dark">{assignments.length}</strong>
                      </div>
                      <div className="col-sm-3">
                        Active In Shift: <strong className="text-success">{assignedCount}</strong>
                      </div>
                      <div className="col-sm-3">
                        Available Buffer: <strong className="text-primary">{availableCount}</strong>
                      </div>
                      <div className="col-sm-3">
                        Expiring Soon:{" "}
                        <strong className="text-warning">
                          {assignments.filter((a) => a.assignmentStatus === "Certification Expiring").length}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                    Select an action below to generate spreadsheet reports or print the official allocation register for audit compliance.
                  </p>
                </div>

                <div className="modal-footer border-top px-4 py-3 d-flex justify-content-between">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowReportModal(false)}>
                    Close
                  </button>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary rounded-pill px-3 d-flex align-items-center"
                      onClick={() => window.print()}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                      Print
                    </button>
                    <button
                      type="button"
                      className="btn btn-success rounded-pill px-4 d-flex align-items-center"
                      onClick={() => {
                        handleExportAssignments();
                        setShowReportModal(false);
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Export Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default OperatorDistributor;
