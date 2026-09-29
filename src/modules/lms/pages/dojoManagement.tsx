import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import type {
  DojoTraining,
  DojoTrainingStatus,
  DojoCertificationStatus,
} from "../models/lmsTypes";
import { INITIAL_DOJO_TRAININGS } from "../utils/mockLmsData";
import "../../../styles/departments.css";

import DashboardFilterBar from "../../dashboard/components/dashboardFilterBar";
import { getDepartment } from "../services/departmentService";
import { getSubDepartments } from "../services/subDepartmentService";
import { getSections } from "../services/sectionService";
import { getLines } from "../services/lineService";
import { getMachines } from "../services/machineService";
import type { Department, SubDepartment, Section, Line, Machine } from "../models/departments";

const TRAINING_STATUSES: DojoTrainingStatus[] = [
  "Not Assigned",
  "Assigned",
  "Training",
  "Evaluation Pending",
  "Qualified",
  "Certified",
  "Retraining Required",
  "Expired",
];

const CERTIFICATION_STATUSES: DojoCertificationStatus[] = [
  "Certified",
  "In Progress",
  "Evaluation Pending",
  "Retraining Required",
  "Expired",
];

const SKILL_LEVELS = ["L0", "L1", "L2", "L3", "L4", "L5"];

function DojoManagement() {
  const [trainings, setTrainings] = useState<DojoTraining[]>(() => {
    const saved = localStorage.getItem("lms_dojo_trainings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DOJO_TRAININGS;
      }
    }
    return INITIAL_DOJO_TRAININGS;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string>("");

  // Filters - exactly matching Dashboard Overview cascading hierarchy
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [skillFilter, setSkillFilter] = useState<string>("All Skill Levels");
  const [trainingStatusFilter, setTrainingStatusFilter] = useState<string>("All Training Statuses");
  const [certStatusFilter, setCertStatusFilter] = useState<string>("All Certifications");

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Modals state
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [departmentsList, setDepartmentsList] = useState<Department[]>([]);
  const [subDepartmentsList, setSubDepartmentsList] = useState<SubDepartment[]>([]);
  const [sectionsList, setSectionsList] = useState<Section[]>([]);
  const [linesList, setLinesList] = useState<Line[]>([]);
  const [machinesList, setMachinesList] = useState<Machine[]>([]);

  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [selectedSubDeptId, setSelectedSubDeptId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedLineId, setSelectedLineId] = useState<string>("");

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const [deptRes, subDeptRes, secRes, lineRes, macRes] = await Promise.allSettled([
          getDepartment(),
          getSubDepartments(),
          getSections(),
          getLines(),
          getMachines(),
        ]);
        if (deptRes.status === "fulfilled") setDepartmentsList(deptRes.value?.data?.data || []);
        if (subDeptRes.status === "fulfilled") setSubDepartmentsList(subDeptRes.value?.data?.data || []);
        if (secRes.status === "fulfilled") setSectionsList(secRes.value?.data?.data || []);
        if (lineRes.status === "fulfilled") setLinesList(lineRes.value?.data?.data || []);
        if (macRes.status === "fulfilled") setMachinesList(macRes.value?.data?.data || []);
      } catch (e) {
        console.error("Failed to load hierarchy in DojoManagement:", e);
      }
    };
    fetchHierarchy();
  }, []);

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

  const [assignForm, setAssignForm] = useState({
    employeeId: "EMP014",
    employeeName: "Siddharth Rao",
    department: "",
    subDepartment: "",
    section: "",
    line: "",
    process: "Connector Assembly",
    machine: "",
    skillLevelFrom: "L1",
    skillLevelTo: "L2",
    trainerName: "Vikram Singh (Master Trainer)",
    supervisorName: "Sanjay Sharma",
  });

  const [evaluationModalItem, setEvaluationModalItem] = useState<DojoTraining | null>(null);
  const [evalScore, setEvalScore] = useState<number>(85);
  const [evalRemarks, setEvalRemarks] = useState<string>("");

  const [certificateModalItem, setCertificateModalItem] = useState<DojoTraining | null>(null);
  const [viewDetailsItem, setViewDetailsItem] = useState<DojoTraining | null>(null);

  const saveTrainings = (list: DojoTraining[]) => {
    setTrainings(list);
    localStorage.setItem("lms_dojo_trainings", JSON.stringify(list));
  };

  // KPIs
  const totalTrainings = trainings.length;
  const trainingInProgress = trainings.filter(
    (t) => t.status === "Training" || t.status === "Assigned" || t.status === "Evaluation Pending"
  ).length;
  const certifiedOperators = trainings.filter((t) => t.certificationStatus === "Certified").length;
  const retrainingRequired = trainings.filter((t) => t.status === "Retraining Required").length;

  // Filter logic respecting backend hierarchy
  const filteredTrainings = trainings.filter((t) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = `${t.employeeId} ${t.employeeName} ${t.process} ${t.machine}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    if (
      selectedFilters["Departments"] &&
      t.department.toLowerCase() !== selectedFilters["Departments"].toLowerCase()
    ) {
      return false;
    }
    if (
      selectedFilters["Sub Departments"] &&
      t.subDepartment &&
      t.subDepartment.toLowerCase() !== selectedFilters["Sub Departments"].toLowerCase()
    ) {
      return false;
    }
    if (
      selectedFilters["Sections"] &&
      t.section &&
      t.section.toLowerCase() !== selectedFilters["Sections"].toLowerCase()
    ) {
      return false;
    }
    if (
      selectedFilters["Lines"] &&
      t.line &&
      t.line.toLowerCase() !== selectedFilters["Lines"].toLowerCase()
    ) {
      return false;
    }
    if (skillFilter !== "All Skill Levels" && t.skillLevelTo !== skillFilter && t.skillLevelFrom !== skillFilter) return false;
    if (trainingStatusFilter !== "All Training Statuses" && t.status !== trainingStatusFilter) return false;
    if (certStatusFilter !== "All Certifications" && t.certificationStatus !== certStatusFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTrainings.length / itemsPerPage));
  const displayedTrainings = filteredTrainings.slice(
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
    setFromDate("");
    setToDate("");
    setSearch("");
    setSkillFilter("All Skill Levels");
    setTrainingStatusFilter("All Training Statuses");
    setCertStatusFilter("All Certifications");
    setCurrentPage(1);
  };

  // Submit New Assignment
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTraining: DojoTraining = {
      id: Date.now(),
      ...assignForm,
      trainingProgress: 10,
      practicalScore: 0,
      certificationStatus: "In Progress",
      status: "Assigned",
      startDate: new Date().toISOString().slice(0, 10),
      evaluationRemarks: "Assigned to station practical training.",
    };
    saveTrainings([newTraining, ...trainings]);
    setSuccessToast(`DOJO Training assigned to ${assignForm.employeeName} (${assignForm.employeeId})!`);
    setShowAssignModal(false);
  };

  // Submit Evaluation
  const handleSaveEvaluation = () => {
    if (!evaluationModalItem) return;
    const isPassed = evalScore >= 80;
    const updated = trainings.map((item) => {
      if (item.id === evaluationModalItem.id) {
        return {
          ...item,
          practicalScore: evalScore,
          trainingProgress: 100,
          status: isPassed ? ("Certified" as DojoTrainingStatus) : ("Retraining Required" as DojoTrainingStatus),
          certificationStatus: isPassed ? ("Certified" as DojoCertificationStatus) : ("Retraining Required" as DojoCertificationStatus),
          completionDate: new Date().toISOString().slice(0, 10),
          certificateNumber: isPassed ? (item.certificateNumber || `DOJO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
          certificateIssuedDate: isPassed ? new Date().toISOString().slice(0, 10) : undefined,
          validTill: isPassed ? `${new Date().getFullYear() + 2}-03-31` : undefined,
          evaluationRemarks: evalRemarks || (isPassed ? "Practical evaluation passed with standard cycle times." : "Cycle time and quality checklist failed. Retraining scheduled."),
        };
      }
      return item;
    });

    saveTrainings(updated);
    setSuccessToast(
      isPassed
        ? `Evaluation recorded: ${evaluationModalItem.employeeName} is now CERTIFIED!`
        : `Evaluation recorded: ${evaluationModalItem.employeeName} requires retraining.`
    );
    setEvaluationModalItem(null);
  };

  // Quick Certify
  const handleQuickCertify = (item: DojoTraining) => {
    const updated = trainings.map((t) =>
      t.id === item.id
        ? {
            ...t,
            trainingProgress: 100,
            practicalScore: Math.max(85, t.practicalScore || 85),
            status: "Certified" as DojoTrainingStatus,
            certificationStatus: "Certified" as DojoCertificationStatus,
            certificateNumber: t.certificateNumber || `DOJO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            certificateIssuedDate: new Date().toISOString().slice(0, 10),
            validTill: `${new Date().getFullYear() + 2}-03-31`,
          }
        : t
    );
    saveTrainings(updated);
    setSuccessToast(`Operator ${item.employeeName} certified successfully!`);
  };

  // Retrain
  const handleTriggerRetraining = (item: DojoTraining) => {
    const updated = trainings.map((t) =>
      t.id === item.id
        ? {
            ...t,
            trainingProgress: 25,
            status: "Retraining Required" as DojoTrainingStatus,
            certificationStatus: "Retraining Required" as DojoCertificationStatus,
            evaluationRemarks: "Re-assigned to refresher practical sessions due to process changes or score expiry.",
          }
        : t
    );
    saveTrainings(updated);
    setSuccessToast(`Refresher DOJO training initiated for ${item.employeeName}.`);
  };

  // Export DOJO Report Excel
  const handleExportExcel = () => {
    const rows = filteredTrainings.map((t) => ({
      EmployeeID: t.employeeId,
      EmployeeName: t.employeeName,
      Department: t.department,
      Section: t.section,
      Line: t.line,
      Process: t.process,
      Machine: t.machine,
      SkillProgression: `${t.skillLevelFrom} → ${t.skillLevelTo}`,
      Progress: `${t.trainingProgress}%`,
      PracticalScore: `${t.practicalScore}%`,
      Certification: t.certificationStatus,
      Status: t.status,
      CertificateNo: t.certificateNumber || "-",
      ValidTill: t.validTill || "-",
      Trainer: t.trainerName || "-",
      Remarks: t.evaluationRemarks || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DOJO_Trainings");
    XLSX.writeFile(wb, `DOJO_Management_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const getStatusBadge = (st: DojoTrainingStatus) => {
    switch (st) {
      case "Certified":
      case "Qualified":
        return { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" };
      case "Training":
      case "Assigned":
        return { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" };
      case "Evaluation Pending":
        return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
      case "Retraining Required":
        return { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" };
      case "Expired":
        return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
      default:
        return { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" };
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
            label: "Total DOJO Trainings",
            value: totalTrainings,
            color: "#1d4ed8",
            bgClass: "my-fade-blue",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ),
          },
          {
            label: "Training In Progress",
            value: `${trainingInProgress} Active`,
            color: "#0284c7",
            bgClass: "my-fade-cyan",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
              </svg>
            ),
          },
          {
            label: "Certified Operators",
            value: `${certifiedOperators} Qualified`,
            color: "#059669",
            bgClass: "bg-emerald-50",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ),
          },
          {
            label: "Retraining Required",
            value: `${retrainingRequired} Action Needed`,
            color: "#c2410c",
            bgClass: "my-fade-yellow",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
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
            placeholder="Search Employee ID, Name, Machine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Skill Level */}
        <select className="ctq-filter-select" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
          <option value="All Skill Levels">All Skill Levels</option>
          {SKILL_LEVELS.map((s) => (
            <option key={s} value={s}>Level {s}</option>
          ))}
        </select>

        {/* Training Status */}
        <select className="ctq-filter-select" value={trainingStatusFilter} onChange={(e) => setTrainingStatusFilter(e.target.value)}>
          <option value="All Training Statuses">All Training Statuses</option>
          {TRAINING_STATUSES.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>

        {/* Certification Status */}
        <select className="ctq-filter-select" value={certStatusFilter} onChange={(e) => setCertStatusFilter(e.target.value)}>
          <option value="All Certifications">All Certifications</option>
          {CERTIFICATION_STATUSES.map((cs) => (
            <option key={cs} value={cs}>{cs}</option>
          ))}
        </select>

        {/* Clear */}
        {(search ||
          Object.keys(selectedFilters).length > 0 ||
          skillFilter !== "All Skill Levels" ||
          trainingStatusFilter !== "All Training Statuses" ||
          certStatusFilter !== "All Certifications") && (
          <button type="button" className="ctq-filter-clear-btn" onClick={handleClearFilters}>
            Clear
          </button>
        )}

        {/* Action Buttons */}
        <div className="ms-auto d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary px-3 py-2 fw-semibold rounded-pill d-flex align-items-center shadow-sm"
            onClick={handleExportExcel}
            style={{ fontSize: "0.88rem" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export / Report
          </button>
          <button
            type="button"
            className="btn btn-asti-gradient px-4 py-2 fw-semibold rounded-pill d-flex align-items-center"
            onClick={() => setShowAssignModal(true)}
          >
            <span className="me-1" style={{ fontSize: "1.1rem", lineHeight: 1 }}>+</span>
            Assign DOJO Training
          </button>
        </div>
      </DashboardFilterBar>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 dept-table">
          <thead>
            <tr className="dept-table-header">
              <th className="py-3 px-3">EMPLOYEE</th>
              <th className="py-3 px-3">DEPARTMENT & PLACEMENT</th>
              <th className="py-3 px-3">DOJO / PROCESS</th>
              <th className="py-3 px-3">MACHINE</th>
              <th className="py-3 px-3">SKILL LEVEL</th>
              <th className="py-3 px-3">TRAINING PROGRESS</th>
              <th className="py-3 px-3">PRACTICAL SCORE</th>
              <th className="py-3 px-3">CERTIFICATION</th>
              <th className="py-3 px-3">STATUS</th>
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
            ) : displayedTrainings.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-5 text-muted">
                  <div className="mb-2">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                    </svg>
                  </div>
                  No matching DOJO training records found.
                </td>
              </tr>
            ) : (
              displayedTrainings.map((t) => {
                const badge = getStatusBadge(t.status);
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {/* Employee */}
                    <td className="px-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-2 text-white fw-bold shadow-sm flex-shrink-0"
                          style={{
                            width: "36px",
                            height: "36px",
                            backgroundColor: "#1d4ed8",
                            fontSize: "0.85rem",
                          }}
                        >
                          {t.employeeName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold text-dark" style={{ fontSize: "0.92rem" }}>
                            {t.employeeName}
                          </div>
                          <span className="badge-dept-code" style={{ fontSize: "0.72rem" }}>
                            {t.employeeId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Department & Placement */}
                    <td className="px-3">
                      <div className="fw-medium text-dark">{t.department}</div>
                      <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                        {[t.section, t.line].filter(Boolean).join(" • ")}
                      </div>
                    </td>

                    {/* Process */}
                    <td className="px-3">
                      <span className="fw-medium text-dark" style={{ fontSize: "0.88rem" }}>
                        {t.process}
                      </span>
                    </td>

                    {/* Machine */}
                    <td className="px-3">
                      <span className="text-dark" style={{ fontSize: "0.85rem" }}>
                        {t.machine || "-"}
                      </span>
                    </td>

                    {/* Skill Level */}
                    <td className="px-3">
                      <span
                        className="badge rounded-pill fw-bold"
                        style={{
                          backgroundColor: "#eff6ff",
                          color: "#1d4ed8",
                          border: "1px solid #bfdbfe",
                          fontSize: "0.76rem",
                        }}
                      >
                        {t.skillLevelFrom} → {t.skillLevelTo}
                      </span>
                    </td>

                    {/* Progress */}
                    <td className="px-3" style={{ minWidth: "130px" }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold" style={{ fontSize: "0.78rem", color: "#334155" }}>
                          {t.trainingProgress}%
                        </span>
                      </div>
                      <div className="progress" style={{ height: "6px", backgroundColor: "#e2e8f0" }}>
                        <div
                          className={`progress-bar ${
                            t.trainingProgress === 100
                              ? "bg-success"
                              : t.trainingProgress > 50
                              ? "bg-primary"
                              : "bg-warning"
                          }`}
                          role="progressbar"
                          style={{ width: `${t.trainingProgress}%` }}
                        />
                      </div>
                    </td>

                    {/* Score */}
                    <td className="px-3">
                      {t.practicalScore > 0 ? (
                        <span
                          className={`badge rounded-pill px-2 py-1 fw-bold ${
                            t.practicalScore >= 80 ? "bg-success" : "bg-danger"
                          }`}
                          style={{ fontSize: "0.78rem" }}
                        >
                          {t.practicalScore}%
                        </span>
                      ) : (
                        <span className="text-muted" style={{ fontSize: "0.78rem" }}>
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Certification */}
                    <td className="px-3">
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: t.certificationStatus === "Certified" ? "#ecfdf5" : "#f8fafc",
                          color: t.certificationStatus === "Certified" ? "#059669" : "#64748b",
                          border: t.certificationStatus === "Certified" ? "1px solid #a7f3d0" : "1px solid #e2e8f0",
                          fontSize: "0.72rem",
                        }}
                      >
                        {t.certificationStatus}
                      </span>
                    </td>

                    {/* Status */}
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
                        {t.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 text-end">
                      <div className="dropdown d-inline-block">
                        <button
                          className="btn btn-sm btn-light rounded-circle shadow-none p-1"
                          type="button"
                          id={`dropdown-dojo-${t.id}`}
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
                            <button className="dropdown-item py-2" onClick={() => setViewDetailsItem(t)}>
                              View Workflow Details
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item py-2 text-primary"
                              onClick={() => {
                                setEvaluationModalItem(t);
                                setEvalScore(t.practicalScore || 85);
                                setEvalRemarks(t.evaluationRemarks || "");
                              }}
                            >
                              Start / Record Evaluation
                            </button>
                          </li>
                          {t.practicalScore > 0 && (
                            <li>
                              <button
                                className="dropdown-item py-2"
                                onClick={() => {
                                  alert(`Recorded Practical Score for ${t.employeeName}: ${t.practicalScore}%`);
                                }}
                              >
                                View Score Breakdown
                              </button>
                            </li>
                          )}
                          {t.status !== "Certified" && (
                            <li>
                              <button className="dropdown-item py-2 text-success" onClick={() => handleQuickCertify(t)}>
                                Certify Operator
                              </button>
                            </li>
                          )}
                          <li>
                            <button className="dropdown-item py-2 text-warning" onClick={() => handleTriggerRetraining(t)}>
                              Schedule Retraining
                            </button>
                          </li>
                          {t.certificationStatus === "Certified" && (
                            <li>
                              <hr className="dropdown-divider my-1" />
                              <button className="dropdown-item py-2 fw-semibold text-primary" onClick={() => setCertificateModalItem(t)}>
                                View DOJO Certificate
                              </button>
                            </li>
                          )}
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
          Showing <strong>{filteredTrainings.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
          <strong>{Math.min(currentPage * itemsPerPage, filteredTrainings.length)}</strong> of{" "}
          <strong>{filteredTrainings.length}</strong> operators
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
      {/* 1. ASSIGN DOJO TRAINING MODAL                             */}
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
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="modal-title fw-bold text-dark mb-0">Assign DOJO Practical Training</h5>
                      <small className="text-muted">Onboard operator to shopfloor hands-on certification</small>
                    </div>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)} />
                </div>
                <form onSubmit={handleAssignSubmit}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Employee ID *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={assignForm.employeeId}
                          onChange={(e) => setAssignForm({ ...assignForm, employeeId: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-8">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Operator Name *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={assignForm.employeeName}
                          onChange={(e) => setAssignForm({ ...assignForm, employeeName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Department *
                        </label>
                        <select
                          className="form-select"
                          value={selectedDeptId}
                          onChange={(e) => {
                            const id = e.target.value;
                            setSelectedDeptId(id);
                            setSelectedSubDeptId("");
                            setSelectedSectionId("");
                            setSelectedLineId("");
                            const dept = departmentsList.find((d) => String(d.id) === id);
                            setAssignForm({
                              ...assignForm,
                              department: dept?.name || "",
                              subDepartment: "",
                              section: "",
                              line: "",
                              machine: "",
                            });
                          }}
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

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Sub-Department
                        </label>
                        <select
                          className="form-select"
                          value={selectedSubDeptId}
                          onChange={(e) => {
                            const id = e.target.value;
                            setSelectedSubDeptId(id);
                            setSelectedSectionId("");
                            setSelectedLineId("");
                            const sub = subDepartmentsList.find((s) => String(s.id) === id);
                            setAssignForm({
                              ...assignForm,
                              subDepartment: sub?.name || "",
                              section: "",
                              line: "",
                              machine: "",
                            });
                          }}
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

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Section
                        </label>
                        <select
                          className="form-select"
                          value={selectedSectionId}
                          onChange={(e) => {
                            const id = e.target.value;
                            setSelectedSectionId(id);
                            setSelectedLineId("");
                            const sec = sectionsList.find((s) => String(s.id) === id);
                            setAssignForm({
                              ...assignForm,
                              section: sec?.name || "",
                              line: "",
                              machine: "",
                            });
                          }}
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

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Line
                        </label>
                        <select
                          className="form-select"
                          value={selectedLineId}
                          onChange={(e) => {
                            const id = e.target.value;
                            setSelectedLineId(id);
                            const line = linesList.find((l) => String(l.id) === id);
                            setAssignForm({
                              ...assignForm,
                              line: line?.name || "",
                              machine: "",
                            });
                          }}
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

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Target Process *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={assignForm.process}
                          onChange={(e) => setAssignForm({ ...assignForm, process: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Assigned Machine / Tool
                        </label>
                        <select
                          className="form-select"
                          value={assignForm.machine}
                          onChange={(e) => setAssignForm({ ...assignForm, machine: e.target.value })}
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

                      <div className="col-md-3">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Skill From
                        </label>
                        <select
                          className="form-select"
                          value={assignForm.skillLevelFrom}
                          onChange={(e) => setAssignForm({ ...assignForm, skillLevelFrom: e.target.value })}
                        >
                          {SKILL_LEVELS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Target Skill To
                        </label>
                        <select
                          className="form-select"
                          value={assignForm.skillLevelTo}
                          onChange={(e) => setAssignForm({ ...assignForm, skillLevelTo: e.target.value })}
                        >
                          {SKILL_LEVELS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Designated DOJO Master Trainer
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={assignForm.trainerName}
                          onChange={(e) => setAssignForm({ ...assignForm, trainerName: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-top px-4 py-3">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowAssignModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-asti-gradient rounded-pill px-4">
                      Assign DOJO Training
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 2. RECORD / CONTINUE EVALUATION MODAL                     */}
      {/* ========================================================= */}
      {evaluationModalItem && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg border-0 rounded-4">
                <div className="modal-header border-bottom pb-3">
                  <div>
                    <h5 className="modal-title fw-bold text-dark mb-0">Record Practical DOJO Score</h5>
                    <small className="text-muted">
                      {evaluationModalItem.employeeName} ({evaluationModalItem.employeeId}) • {evaluationModalItem.process}
                    </small>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setEvaluationModalItem(null)} />
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                      Practical Score Percentage (Passing &gt;= 80%)
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control form-control-lg fw-bold text-primary"
                        min="0"
                        max="100"
                        value={evalScore}
                        onChange={(e) => setEvalScore(Number(e.target.value))}
                      />
                      <span className="input-group-text fw-bold">%</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-semibold text-muted" style={{ fontSize: "0.8rem" }}>
                        Evaluation Result:
                      </span>
                      <span className={`fw-bold ${evalScore >= 80 ? "text-success" : "text-danger"}`} style={{ fontSize: "0.85rem" }}>
                        {evalScore >= 80 ? "QUALIFIED / CERTIFIED" : "FAIL - RETRAINING REQUIRED"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                      Trainer Remarks & Cycle Time Observations
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Note cycle adherence, zero defect compliance, or specific failure reasons..."
                      value={evalRemarks}
                      onChange={(e) => setEvalRemarks(e.target.value)}
                    />
                  </div>

                  <div className="alert alert-light border py-2 px-3 mb-0" style={{ fontSize: "0.82rem" }}>
                    <strong>Workflow:</strong> Upon submitting, the score will be certified and the operator will become available in the{" "}
                    <strong>Operator Distributor</strong> module.
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setEvaluationModalItem(null)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-asti-gradient rounded-pill px-4" onClick={handleSaveEvaluation}>
                    Save Evaluation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 3. DOJO CERTIFICATE MODAL                                 */}
      {/* ========================================================= */}
      {certificateModalItem && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
                <div className="modal-header border-bottom pb-2">
                  <h6 className="modal-title fw-bold text-dark">ASTI DOJO Practical Skill Certificate</h6>
                  <button type="button" className="btn-close" onClick={() => setCertificateModalItem(null)} />
                </div>
                <div className="modal-body p-4 bg-light text-center">
                  <div
                    className="p-5 rounded-4 shadow-sm mx-auto position-relative"
                    style={{
                      maxWidth: "700px",
                      backgroundColor: "#ffffff",
                      border: "8px double #1e3a8a",
                    }}
                  >
                    <div className="text-uppercase tracking-wider fw-bold text-primary mb-1" style={{ letterSpacing: "0.15em", fontSize: "0.85rem" }}>
                      ASTI INDIA ELECTRONICS PRIVATE LIMITED
                    </div>
                    <h3 className="fw-bold text-dark mb-0" style={{ fontFamily: "Georgia, serif" }}>
                      DOJO SKILL CERTIFICATION
                    </h3>
                    <p className="text-muted" style={{ fontSize: "0.82rem" }}>
                      CERTIFICATE NO: <strong>{certificateModalItem.certificateNumber || "DOJO-2025-0891"}</strong>
                    </p>

                    <div className="my-4">
                      <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>This is to certify that</p>
                      <h4 className="fw-bold text-dark text-decoration-underline" style={{ color: "#1e3a8a" }}>
                        {certificateModalItem.employeeName}
                      </h4>
                      <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                        Employee ID: <strong>{certificateModalItem.employeeId}</strong> • Department: <strong>{certificateModalItem.department}</strong>
                      </p>
                    </div>

                    <p className="text-muted px-4" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
                      has demonstrated practical competence and scored{" "}
                      <strong className="text-success">{certificateModalItem.practicalScore}%</strong> on the shopfloor practical evaluation for{" "}
                      <strong>{certificateModalItem.process}</strong> on machine <strong>{certificateModalItem.machine}</strong>, achieving skill progression to{" "}
                      <strong className="text-primary">{certificateModalItem.skillLevelTo}</strong>.
                    </p>

                    <div className="row mt-5 pt-3 border-top text-muted" style={{ fontSize: "0.82rem" }}>
                      <div className="col-4">
                        <div className="fw-bold text-dark">{certificateModalItem.trainerName || "Vikram Singh"}</div>
                        <small>Master DOJO Trainer</small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold text-dark">{certificateModalItem.certificateIssuedDate || "15 Aug 2025"}</div>
                        <small>Issued Date</small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold text-dark">{certificateModalItem.validTill || "31 Mar 2027"}</div>
                        <small>Valid Till</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setCertificateModalItem(null)}>
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill px-4"
                    onClick={() => {
                      window.print();
                    }}
                  >
                    Print Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 4. VIEW DETAILS MODAL                                     */}
      {/* ========================================================= */}
      {viewDetailsItem && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow-lg border-0 rounded-4">
                <div className="modal-header border-bottom pb-3">
                  <div>
                    <h5 className="modal-title fw-bold text-dark mb-0">DOJO Training Workflow Lifecycle</h5>
                    <small className="text-muted">
                      {viewDetailsItem.employeeName} ({viewDetailsItem.employeeId})
                    </small>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setViewDetailsItem(null)} />
                </div>
                <div className="modal-body p-4">
                  {/* Workflow Stepper */}
                  <div className="p-3 mb-4 rounded-3 bg-light border">
                    <h6 className="fw-bold text-dark mb-3" style={{ fontSize: "0.88rem" }}>
                      Automotive DOJO Certification Lifecycle
                    </h6>
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 text-center">
                      {[
                        { step: "Assigned", done: true },
                        { step: "Training", done: viewDetailsItem.trainingProgress >= 50 },
                        { step: "Practical Eval", done: viewDetailsItem.practicalScore > 0 },
                        { step: "Trainer Approval", done: viewDetailsItem.practicalScore >= 80 },
                        { step: "Supervisor Sign-off", done: viewDetailsItem.status === "Certified" },
                        { step: "Certified", done: viewDetailsItem.certificationStatus === "Certified" },
                      ].map((st, i) => (
                        <div key={i} className="d-flex align-items-center">
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                              st.done ? "bg-success text-white" : "bg-white border text-muted"
                            }`}
                            style={{ width: "30px", height: "30px", fontSize: "0.8rem" }}
                          >
                            {st.done ? "✓" : i + 1}
                          </div>
                          <span className="ms-1 me-2 fw-semibold" style={{ fontSize: "0.78rem" }}>
                            {st.step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row g-3" style={{ fontSize: "0.88rem" }}>
                    <div className="col-md-6">
                      <strong>Process:</strong> {viewDetailsItem.process}
                    </div>
                    <div className="col-md-6">
                      <strong>Machine:</strong> {viewDetailsItem.machine}
                    </div>
                    <div className="col-md-6">
                      <strong>Skill Target:</strong> {viewDetailsItem.skillLevelFrom} → {viewDetailsItem.skillLevelTo}
                    </div>
                    <div className="col-md-6">
                      <strong>Score:</strong> {viewDetailsItem.practicalScore}%
                    </div>
                    <div className="col-12">
                      <strong>Trainer Remarks:</strong> {viewDetailsItem.evaluationRemarks || "Standard progression observed."}
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setViewDetailsItem(null)}>
                    Close
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

export default DojoManagement;
