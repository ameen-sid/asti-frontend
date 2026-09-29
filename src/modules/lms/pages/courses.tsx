import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import type { Course, CourseStatus } from "../models/lmsTypes";
import { INITIAL_COURSES } from "../utils/mockLmsData";
import { getDepartment } from "../services/departmentService";
import type { Department } from "../models/departments";
import { questionPaperService } from "../services/questionPaperService";
import { trainingMaterialService } from "../services/trainingMaterialService";
import type { QuestionPaper, TrainingMaterialItem } from "../models/questionPaper";
import "../../../styles/departments.css";

const CATEGORY_OPTIONS = [
  "Process Training",
  "Equipment Training",
  "Quality Inspection",
  "Safety & Compliance",
  "Machine Operation",
  "Maintenance Standard",
];

const SKILL_LEVELS = ["L0", "L1", "L2", "L3", "L4", "L5"];

const STATUS_OPTIONS: CourseStatus[] = [
  "Draft",
  "Under Review",
  "Active",
  "Inactive",
  "Archived",
];

const INITIAL_FORM: Omit<Course, "id"> = {
  code: "",
  title: "",
  category: "Process Training",
  plant: "Plant 1 - Manesar",
  department: "Production",
  subDepartment: "Wiring Harness",
  section: "Assembly",
  line: "Line 3",
  process: "Connector Assembly",
  machine: "Torque Machine 04",
  skillLevelFrom: "L1",
  skillLevelTo: "L2",
  durationMinutes: 45,
  modulesCount: 6,
  assessmentQuestions: 20,
  passingPercentage: 80,
  dojoRequired: true,
  mandatory: true,
  certificationRequired: true,
  validityMonths: 12,
  status: "Active",
  description: "",
};

import DashboardFilterBar from "../../dashboard/components/dashboardFilterBar";

function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem("lms_courses");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_COURSES;
      }
    }
    return INITIAL_COURSES;
  });

  const [loading] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string>("");
  const [departmentsList, setDepartmentsList] = useState<Department[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Fetch departments from existing Department API
  useEffect(() => {
    getDepartment()
      .then((res) => {
        const depts = res?.data?.data || [];
        setDepartmentsList(depts);
        // Link departmentId for existing courses if missing
        setCourses((prev) => {
          let updated = false;
          const mapped = prev.map((c) => {
            if (!c.departmentId) {
              const matched = depts.find(
                (d: Department) => d.name.toLowerCase() === (c.department || "").toLowerCase()
              );
              if (matched) {
                updated = true;
                return { ...c, departmentId: Number(matched.id) };
              }
            }
            return c;
          });
          if (updated) {
            localStorage.setItem("lms_courses", JSON.stringify(mapped));
            return mapped;
          }
          return prev;
        });
      })
      .catch((err) => {
        console.warn("Could not load departments from API:", err);
      });
  }, []);

  // Filters - exactly matching Dashboard Overview cascading hierarchy
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
  const [skillFilter, setSkillFilter] = useState<string>("All Skill Levels");
  const [statusFilter, setStatusFilter] = useState<string>("All Statuses");

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Add / Edit Modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Course, "id">>(INITIAL_FORM);
  const [formError, setFormError] = useState<string>("");

  // View Details Modal
  const [viewCourse, setViewCourse] = useState<Course | null>(null);

  // Assign Modal
  const [assignCourse, setAssignCourse] = useState<Course | null>(null);
  const [assignTarget, setAssignTarget] = useState<string>("All Operators in Line");

  // Import Modal
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync to local storage
  const saveCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
    localStorage.setItem("lms_courses", JSON.stringify(newCourses));
  };

  // KPIs
  const totalCourses = courses.length;
  const activeCourses = courses.filter((c) => c.status === "Active").length;
  const mandatoryCourses = courses.filter((c) => c.mandatory).length;
  const certificationCourses = courses.filter((c) => c.certificationRequired).length;

  // Filter logic respecting backend hierarchy
  const filteredCourses = courses.filter((course) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchText = `${course.title} ${course.code} ${course.category} ${course.process} ${course.description || ""}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    if (
      selectedFilters["Departments"] &&
      course.department.toLowerCase() !== selectedFilters["Departments"].toLowerCase()
    ) {
      return false;
    }
    if (
      selectedFilters["Sub Departments"] &&
      course.subDepartment &&
      course.subDepartment.toLowerCase() !== selectedFilters["Sub Departments"].toLowerCase()
    ) {
      return false;
    }
    if (
      selectedFilters["Sections"] &&
      course.section &&
      course.section.toLowerCase() !== selectedFilters["Sections"].toLowerCase()
    ) {
      return false;
    }
    if (
      selectedFilters["Lines"] &&
      course.line &&
      course.line.toLowerCase() !== selectedFilters["Lines"].toLowerCase()
    ) {
      return false;
    }
    if (categoryFilter !== "All Categories" && course.category !== categoryFilter) return false;
    if (skillFilter !== "All Skill Levels" && course.skillLevelTo !== skillFilter && course.skillLevelFrom !== skillFilter) return false;
    if (statusFilter !== "All Statuses" && course.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / itemsPerPage));
  const displayedCourses = filteredCourses.slice(
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
    setCategoryFilter("All Categories");
    setSkillFilter("All Skill Levels");
    setStatusFilter("All Statuses");
    setCurrentPage(1);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    const defaultDept = departmentsList[0];
    setFormData({
      ...INITIAL_FORM,
      departmentId: defaultDept ? Number(defaultDept.id) : undefined,
      department: defaultDept ? defaultDept.name : "Production",
    });
    setIsEditing(false);
    setEditingId(null);
    setFormError("");
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (course: Course) => {
    setFormData({
      code: course.code,
      title: course.title,
      category: course.category,
      plant: course.plant,
      departmentId: course.departmentId,
      department: course.department,
      subDepartment: course.subDepartment,
      section: course.section,
      line: course.line,
      process: course.process,
      machine: course.machine,
      skillLevelFrom: course.skillLevelFrom,
      skillLevelTo: course.skillLevelTo,
      durationMinutes: course.durationMinutes,
      modulesCount: course.modulesCount,
      assessmentQuestions: course.assessmentQuestions,
      passingPercentage: course.passingPercentage,
      dojoRequired: course.dojoRequired,
      mandatory: course.mandatory,
      certificationRequired: course.certificationRequired,
      validityMonths: course.validityMonths,
      status: course.status,
      description: course.description || "",
    });
    setIsEditing(true);
    setEditingId(course.id);
    setFormError("");
    setShowModal(true);
  };

  // Save Course
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Course title is required.");
      return;
    }
    if (!formData.code.trim()) {
      setFormError("Course code is required.");
      return;
    }
    if (!formData.department.trim()) {
      setFormError("Department is required. Please select a valid Department.");
      return;
    }
    if (formData.passingPercentage < 1 || formData.passingPercentage > 100) {
      setFormError("Passing percentage must be between 1 and 100.");
      return;
    }

    if (isEditing && editingId) {
      const updated = courses.map((c) =>
        c.id === editingId ? { ...formData, id: editingId } : c
      );
      saveCourses(updated);
      setSuccessToast(`Course "${formData.title}" updated successfully!`);
    } else {
      const newCourse: Course = {
        ...formData,
        id: Date.now(),
      };
      saveCourses([newCourse, ...courses]);
      setSuccessToast(`Course "${formData.title}" created successfully!`);
    }

    setShowModal(false);
  };

  // Navigate to add Question Paper under this Course
  const handleAddQuestionPaper = (c: Course) => {
    navigate("/lms/create-question-paper", {
      state: {
        courseId: c.id,
        departmentId: c.departmentId,
        courseName: c.title,
        department: c.department,
      },
    });
  };

  // Navigate to add Training Material under this Course
  const handleAddTrainingMaterial = (c: Course) => {
    navigate("/lms/training-material", {
      state: {
        courseId: c.id,
        departmentId: c.departmentId,
        courseName: c.title,
        department: c.department,
      },
    });
  };



  // Toggle Active/Inactive
  const handleToggleStatus = (course: Course) => {
    const nextStatus: CourseStatus = course.status === "Active" ? "Inactive" : "Active";
    const updated = courses.map((c) =>
      c.id === course.id ? { ...c, status: nextStatus } : c
    );
    saveCourses(updated);
    setSuccessToast(`Course status changed to ${nextStatus}.`);
  };

  // Archive Course
  const handleArchive = (course: Course) => {
    if (window.confirm(`Archive course "${course.title}"?`)) {
      const updated = courses.map((c) =>
        c.id === course.id ? { ...c, status: "Archived" as CourseStatus } : c
      );
      saveCourses(updated);
      setSuccessToast(`Course "${course.title}" archived.`);
    }
  };

  // Export Courses Excel
  const handleExportCourses = () => {
    const rows = filteredCourses.map((c) => ({
      Code: c.code,
      Title: c.title,
      Category: c.category,
      Plant: c.plant,
      Department: c.department,
      SubDepartment: c.subDepartment,
      Section: c.section,
      Line: c.line,
      Process: c.process,
      Machine: c.machine,
      SkillFrom: c.skillLevelFrom,
      SkillTo: c.skillLevelTo,
      DurationMinutes: c.durationMinutes,
      Modules: c.modulesCount,
      Questions: c.assessmentQuestions,
      PassPercentage: c.passingPercentage,
      DOJORequired: c.dojoRequired ? "Yes" : "No",
      Mandatory: c.mandatory ? "Yes" : "No",
      Certification: c.certificationRequired ? "Yes" : "No",
      ValidityMonths: c.validityMonths,
      Status: c.status,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Courses");
    XLSX.writeFile(wb, `Courses_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Import Excel
  const handleImportExcel = () => {
    if (!uploadFile) {
      setUploadError("Please select an Excel file.");
      return;
    }
    setUploading(true);
    setUploadError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json: any[] = XLSX.utils.sheet_to_json(sheet);
        if (!json || json.length === 0) {
          setUploadError("Excel file is empty.");
          setUploading(false);
          return;
        }
        const imported: Course[] = json.map((row, idx) => ({
          id: Date.now() + idx,
          code: row["Code"] || row["code"] || `CRS-${Date.now()}-${idx}`,
          title: row["Title"] || row["title"] || "Imported Course",
          category: row["Category"] || row["category"] || "Process Training",
          plant: row["Plant"] || row["plant"] || "Plant 1 - Manesar",
          department: row["Department"] || row["department"] || "Production",
          subDepartment: row["SubDepartment"] || row["subDepartment"] || "Wiring Harness",
          section: row["Section"] || row["section"] || "Assembly",
          line: row["Line"] || row["line"] || "Line 3",
          process: row["Process"] || row["process"] || "Assembly",
          machine: row["Machine"] || row["machine"] || "-",
          skillLevelFrom: row["SkillFrom"] || row["skillLevelFrom"] || "L1",
          skillLevelTo: row["SkillTo"] || row["skillLevelTo"] || "L2",
          durationMinutes: Number(row["DurationMinutes"] || 45),
          modulesCount: Number(row["Modules"] || 5),
          assessmentQuestions: Number(row["Questions"] || 15),
          passingPercentage: Number(row["PassPercentage"] || 80),
          dojoRequired: row["DOJORequired"] === "Yes" || row["dojoRequired"] === true,
          mandatory: row["Mandatory"] === "Yes" || row["mandatory"] === true,
          certificationRequired: row["Certification"] === "Yes" || row["certificationRequired"] === true,
          validityMonths: Number(row["ValidityMonths"] || 12),
          status: (row["Status"] || "Active") as CourseStatus,
          description: row["Description"] || "",
        }));

        saveCourses([...imported, ...courses]);
        setSuccessToast(`Successfully imported ${imported.length} courses!`);
        setShowUploadModal(false);
        setUploadFile(null);
      } catch (err) {
        setUploadError("Failed to parse file. Ensure it is a valid Excel document.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsBinaryString(uploadFile);
  };

  const getStatusBadge = (status: CourseStatus) => {
    switch (status) {
      case "Active":
        return { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" };
      case "Draft":
        return { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" };
      case "Under Review":
        return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
      case "Inactive":
        return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
      case "Archived":
        return { bg: "#f3f4f6", color: "#6b7280", border: "#d1d5db" };
      default:
        return { bg: "#f8fafc", color: "#334155", border: "#e2e8f0" };
    }
  };

  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">
      {/* Toast */}
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
            label: "Total Courses",
            value: totalCourses,
            color: "#1d4ed8",
            bgClass: "my-fade-blue",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            ),
          },
          {
            label: "Active Courses",
            value: `${activeCourses} Published`,
            color: "#059669",
            bgClass: "bg-emerald-50",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            ),
          },
          {
            label: "Mandatory Courses",
            value: `${mandatoryCourses} Core SOPs`,
            color: "#d97706",
            bgClass: "my-fade-yellow",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ),
          },
          {
            label: "Certification Courses",
            value: `${certificationCourses} DOJO Ready`,
            color: "#4338ca",
            bgClass: "my-fade-purple",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15l-2 5l9-9l-9-9l2 5l-8 4z" />
                <circle cx="12" cy="12" r="9" />
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

      {/* FILTERS BAR - Same filters & enableness as Dashboard Overview */}
      <DashboardFilterBar
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        handleClearFilters={handleClearFilters}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        className="ctq-filter-bar border rounded-4 shadow-sm p-3 mb-4"
      >
        {/* Search */}
        <div className="ctq-filter-search-group me-1 mb-3">
          <svg className="ctq-filter-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="ctq-filter-search-input"
            placeholder="Search course, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <select
          className="ctq-filter-select me-1 mb-3"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All Categories">All Categories</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Skill Level Filter */}
        <select
          className="ctq-filter-select me-1 mb-3"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
        >
          <option value="All Skill Levels">All Skill Levels</option>
          {SKILL_LEVELS.map((sk) => (
            <option key={sk} value={sk}>
              Level {sk}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="ctq-filter-select me-1 mb-3"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All Statuses">All Statuses</option>
          {STATUS_OPTIONS.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </DashboardFilterBar>

      {/* Action Bar */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="text-muted" style={{ fontSize: "0.88rem" }}>
          Showing <strong>{filteredCourses.length}</strong> matching courses
        </div>
        <div className="d-flex align-items-center gap-2">
          {/* <button
            type="button"
            className="btn btn-outline-success px-3 py-2 fw-semibold rounded-pill d-flex align-items-center shadow-sm"
            onClick={() => setShowUploadModal(true)}
            title="Import courses from Excel"
            style={{ fontSize: "0.88rem" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Import Courses
          </button> */}

          <button
            type="button"
            className="btn btn-asti-gradient px-4 py-2 fw-semibold rounded-pill d-flex align-items-center"
            onClick={handleOpenAdd}
          >
            <span className="me-1" style={{ fontSize: "1.1rem", lineHeight: 1 }}>
              +
            </span>
            Add Course
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table key={refreshKey} className="table table-hover align-middle mb-0 dept-table">
          <thead>
            <tr className="dept-table-header">
              <th className="py-3 px-3">COURSE</th>
              <th className="py-3 px-3">CATEGORY</th>
              <th className="py-3 px-3">DEPARTMENT & PLACEMENT</th>
              <th className="py-3 px-3">SKILL LEVEL</th>
              <th className="py-3 px-3">DURATION & MODULES</th>
              <th className="py-3 px-3">ASSESSMENT</th>
              <th className="py-3 px-3">STATUS</th>
              <th className="py-3 px-3 text-end">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="mt-2 text-muted" style={{ fontSize: "0.85rem" }}>
                    Loading courses...
                  </div>
                </td>
              </tr>
            ) : displayedCourses.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-5 text-muted">
                  <div className="mb-2">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  No matching courses found.
                </td>
              </tr>
            ) : (
              displayedCourses.map((c) => {
                const badge = getStatusBadge(c.status);
                const qpCount = questionPaperService.getByCourseId(c.id).length;
                const tmCount = trainingMaterialService.getByCourseId(c.id).length;
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {/* Course */}
                    <td className="px-3">
                      <div>
                        <div className="fw-semibold text-dark" style={{ fontSize: "0.92rem" }}>
                          {c.title}
                        </div>
                        <div className="d-flex align-items-center gap-1 mt-1 flex-wrap">
                          <span className="badge-dept-code" style={{ fontSize: "0.72rem", padding: "0.15rem 0.45rem" }}>
                            {c.code}
                          </span>
                          {c.mandatory && (
                            <span
                              className="badge"
                              style={{ backgroundColor: "#fef3c7", color: "#92400e", fontSize: "0.68rem" }}
                            >
                              Mandatory
                            </span>
                          )}
                          <span className="badge bg-light text-primary border" style={{ fontSize: "0.68rem" }} title="Question Papers for this course">
                            QP: <strong>{qpCount}</strong>
                          </span>
                          <span className="badge bg-light text-success border" style={{ fontSize: "0.68rem" }} title="Training Materials for this course">
                            Materials: <strong>{tmCount}</strong>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-3">
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: "#f0fdf4",
                          color: "#166534",
                          border: "1px solid #bbf7d0",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                        }}
                      >
                        {c.category}
                      </span>
                    </td>

                    {/* Department & Placement */}
                    <td className="px-3">
                      <div className="fw-medium text-dark">{c.department}</div>
                      <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                        {[c.section, c.line].filter(Boolean).join(" • ")}
                      </div>
                    </td>

                    {/* Skill Level */}
                    <td className="px-3">
                      <div
                        className="badge rounded-pill fw-bold"
                        style={{
                          backgroundColor: "#eff6ff",
                          color: "#1d4ed8",
                          border: "1px solid #bfdbfe",
                          fontSize: "0.76rem",
                        }}
                      >
                        {c.skillLevelFrom} → {c.skillLevelTo}
                      </div>
                    </td>

                    {/* Duration & Modules */}
                    <td className="px-3">
                      <div className="text-dark fw-medium" style={{ fontSize: "0.85rem" }}>
                        {c.durationMinutes} min • {c.modulesCount} Modules
                      </div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        Validity: {c.validityMonths} Months
                      </div>
                    </td>

                    {/* Assessment */}
                    <td className="px-3">
                      <div style={{ fontSize: "0.85rem", color: "#1e293b", fontWeight: 500 }}>
                        {c.assessmentQuestions} Qs • Pass {c.passingPercentage}%
                      </div>
                      {c.dojoRequired && (
                        <span
                          className="badge rounded-pill mt-1"
                          style={{
                            backgroundColor: "#f5f3ff",
                            color: "#6d28d9",
                            border: "1px solid #ddd6fe",
                            fontSize: "0.68rem",
                          }}
                        >
                          DOJO Required
                        </span>
                      )}
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
                        {c.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="px-3 text-end text-nowrap">
                      <div className="d-inline-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary py-1 px-2 fw-semibold rounded-pill"
                          style={{ fontSize: "0.75rem" }}
                          onClick={() => handleAddQuestionPaper(c)}
                          title="Add Question Paper for this Course"
                        >
                          + QP
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success py-1 px-2 fw-semibold rounded-pill"
                          style={{ fontSize: "0.75rem" }}
                          onClick={() => handleAddTrainingMaterial(c)}
                          title="Add Training Material for this Course"
                        >
                          + Material
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary py-1 px-2 fw-semibold rounded-pill"
                          style={{ fontSize: "0.75rem" }}
                          onClick={() => setViewCourse(c)}
                          title="View & Manage Course details, Question Papers and Materials"
                        >
                          Manage
                        </button>
                        <div className="dropdown d-inline-block">
                          <button
                            className="btn btn-sm btn-light rounded-circle shadow-none p-1"
                            type="button"
                            id={`dropdown-${c.id}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ width: "30px", height: "30px" }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="5" r="2" />
                              <circle cx="12" cy="12" r="2" />
                              <circle cx="12" cy="19" r="2" />
                            </svg>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 py-1" style={{ fontSize: "0.85rem" }}>
                            <li>
                              <button className="dropdown-item py-2" onClick={() => setViewCourse(c)}>
                                View / Manage
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item py-2" onClick={() => handleOpenEdit(c)}>
                                Edit Course
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item py-2 text-primary"
                                onClick={() => {
                                  setAssignCourse(c);
                                }}
                              >
                                Assign Operators
                              </button>
                            </li>

                            <li>
                              <button className="dropdown-item py-2" onClick={() => handleToggleStatus(c)}>
                                {c.status === "Active" ? "Deactivate" : "Activate"}
                              </button>
                            </li>
                            <li>
                              <hr className="dropdown-divider my-1" />
                            </li>
                            <li>
                              <button className="dropdown-item py-2 text-danger" onClick={() => handleArchive(c)}>
                                Archive Course
                              </button>
                            </li>
                          </ul>
                        </div>
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
          Showing <strong>{filteredCourses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
          <strong>{Math.min(currentPage * itemsPerPage, filteredCourses.length)}</strong> of{" "}
          <strong>{filteredCourses.length}</strong> courses
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
      {/* 1. ADD / EDIT COURSE MODAL                                */}
      {/* ========================================================= */}
      {showModal && (
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
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="modal-title fw-bold text-dark mb-0">
                        {isEditing ? "Edit Automotive Course" : "Create New Automotive Course"}
                      </h5>
                      <small className="text-muted">Standard Operating Procedure & Training Specification</small>
                    </div>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>

                <form onSubmit={handleSaveCourse}>
                  <div className="modal-body p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                    {formError && (
                      <div className="alert alert-danger py-2 px-3 mb-3 rounded-3" style={{ fontSize: "0.85rem" }}>
                        {formError}
                      </div>
                    )}

                    <div className="row g-3">
                      {/* Code & Title */}
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Course Code *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. CRS-ASM-009"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-8">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Course Title *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Connector Assembly Training"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>

                      {/* Category & Status */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Category
                        </label>
                        <select
                          className="form-select"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Course Status
                        </label>
                        <select
                          className="form-select"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as CourseStatus })}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Placement Hierarchy */}
                      <div className="col-12 mt-3">
                        <h6 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "0.88rem" }}>
                          Factory & Production Placement
                        </h6>
                      </div>


                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Department *
                        </label>
                        <select
                          className="form-select"
                          value={formData.departmentId || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            const found = departmentsList.find((d) => String(d.id) === val);
                            setFormData({
                              ...formData,
                              departmentId: found ? Number(found.id) : undefined,
                              department: found ? found.name : "",
                            });
                          }}
                          required
                        >
                          <option value="">Select Department</option>
                          {departmentsList.length > 0 ? (
                            departmentsList.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))
                          ) : (
                            <option value="1">Production</option>
                          )}
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Sub-Department
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.subDepartment}
                          onChange={(e) => setFormData({ ...formData, subDepartment: e.target.value })}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Section
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.section}
                          onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Line
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.line}
                          onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Machine / Tool
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Torque Machine 04"
                          value={formData.machine}
                          onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                        />
                      </div>

                      {/* Training Specs & Skill Levels */}
                      <div className="col-12 mt-3">
                        <h6 className="fw-bold text-dark border-bottom pb-2 mb-2" style={{ fontSize: "0.88rem" }}>
                          Skill Progression & Evaluation Criteria
                        </h6>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Skill From
                        </label>
                        <select
                          className="form-select"
                          value={formData.skillLevelFrom}
                          onChange={(e) => setFormData({ ...formData, skillLevelFrom: e.target.value })}
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
                          Skill To
                        </label>
                        <select
                          className="form-select"
                          value={formData.skillLevelTo}
                          onChange={(e) => setFormData({ ...formData, skillLevelTo: e.target.value })}
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
                          Duration (Mins)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          min="5"
                          value={formData.durationMinutes}
                          onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                          required
                        />
                      </div>

                      <div className="col-md-3">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Modules Count
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          value={formData.modulesCount}
                          onChange={(e) => setFormData({ ...formData, modulesCount: Number(e.target.value) })}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Questions Count
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          value={formData.assessmentQuestions}
                          onChange={(e) => setFormData({ ...formData, assessmentQuestions: Number(e.target.value) })}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Passing Score (%)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          max="100"
                          value={formData.passingPercentage}
                          onChange={(e) => setFormData({ ...formData, passingPercentage: Number(e.target.value) })}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          Validity (Months)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          value={formData.validityMonths}
                          onChange={(e) => setFormData({ ...formData, validityMonths: Number(e.target.value) })}
                          required
                        />
                      </div>

                      {/* Checkboxes */}
                      <div className="col-12 mt-2">
                        <div className="d-flex gap-4 flex-wrap">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="checkDojo"
                              checked={formData.dojoRequired}
                              onChange={(e) => setFormData({ ...formData, dojoRequired: e.target.checked })}
                            />
                            <label className="form-check-label fw-semibold" htmlFor="checkDojo" style={{ fontSize: "0.85rem" }}>
                              DOJO Practical Training Required
                            </label>
                          </div>

                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="checkMandatory"
                              checked={formData.mandatory}
                              onChange={(e) => setFormData({ ...formData, mandatory: e.target.checked })}
                            />
                            <label className="form-check-label fw-semibold" htmlFor="checkMandatory" style={{ fontSize: "0.85rem" }}>
                              Mandatory Training for Station
                            </label>
                          </div>

                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="checkCert"
                              checked={formData.certificationRequired}
                              onChange={(e) => setFormData({ ...formData, certificationRequired: e.target.checked })}
                            />
                            <label className="form-check-label fw-semibold" htmlFor="checkCert" style={{ fontSize: "0.85rem" }}>
                              Issues Official ASTI Certificate
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="col-12 mt-2">
                        <label className="form-label fw-semibold" style={{ fontSize: "0.82rem" }}>
                          SOP & Course Description
                        </label>
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="Provide operating procedures, quality critical points, and learning objectives..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-top px-4 py-3">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-asti-gradient rounded-pill px-4">
                      {isEditing ? "Save Changes" : "Create Course"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 2. VIEW COURSE DETAILS MODAL                              */}
      {/* ========================================================= */}
      {viewCourse && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow-lg border-0 rounded-4">
                <div className="modal-header border-bottom pb-3">
                  <div>
                    <span className="badge-dept-code mb-1 d-inline-block">{viewCourse.code}</span>
                    <h5 className="modal-title fw-bold text-dark mb-0">{viewCourse.title}</h5>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setViewCourse(null)} />
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="p-3 rounded-3 bg-light">
                        <div className="text-muted fw-semibold" style={{ fontSize: "0.75rem" }}>
                          CATEGORY & STATUS
                        </div>
                        <div className="fw-bold text-dark mt-1">{viewCourse.category}</div>
                        <div className="mt-1">
                          <span className="badge bg-success">{viewCourse.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 rounded-3 bg-light">
                        <div className="text-muted fw-semibold" style={{ fontSize: "0.75rem" }}>
                          SKILL PROGRESSION
                        </div>
                        <div className="fw-bold text-primary mt-1" style={{ fontSize: "1.1rem" }}>
                          Level {viewCourse.skillLevelFrom} → Level {viewCourse.skillLevelTo}
                        </div>
                        <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                          DOJO Practical: {viewCourse.dojoRequired ? "Mandatory" : "Not Required"}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="p-3 rounded-3 border">
                        <div className="text-muted fw-semibold mb-2" style={{ fontSize: "0.75rem" }}>
                          DEPLOYMENT LOCATION & TOOLING
                        </div>
                        <div className="row g-2" style={{ fontSize: "0.88rem" }}>
                          <div className="col-md-4">
                            <strong>Department:</strong> {viewCourse.department}
                          </div>
                          <div className="col-md-4">
                            <strong>Sub-Dept:</strong> {viewCourse.subDepartment || "-"}
                          </div>
                          <div className="col-md-4">
                            <strong>Section:</strong> {viewCourse.section}
                          </div>
                          <div className="col-md-4">
                            <strong>Line:</strong> {viewCourse.line}
                          </div>
                          <div className="col-md-4">
                            <strong>Machine:</strong> {viewCourse.machine || "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="p-3 rounded-3 border">
                        <div className="text-muted fw-semibold mb-2" style={{ fontSize: "0.75rem" }}>
                          ASSESSMENT & CERTIFICATION
                        </div>
                        <div className="row g-2" style={{ fontSize: "0.88rem" }}>
                          <div className="col-md-3">
                            <strong>Duration:</strong> {viewCourse.durationMinutes} Minutes
                          </div>
                          <div className="col-md-3">
                            <strong>Modules:</strong> {viewCourse.modulesCount} Chapters
                          </div>
                          <div className="col-md-3">
                            <strong>Assessment:</strong> {viewCourse.assessmentQuestions} Qs
                          </div>
                          <div className="col-md-3">
                            <strong>Pass Criteria:</strong> {viewCourse.passingPercentage}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {viewCourse.description && (
                      <div className="col-12">
                        <div className="p-3 rounded-3 bg-light">
                          <div className="text-muted fw-semibold mb-1" style={{ fontSize: "0.75rem" }}>
                            DESCRIPTION & OBJECTIVES
                          </div>
                          <p className="text-dark mb-0" style={{ fontSize: "0.88rem", lineHeight: 1.5 }}>
                            {viewCourse.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Question Papers Section for this Course */}
                    {(() => {
                      const coursePapers: QuestionPaper[] = questionPaperService.getByCourseId(viewCourse.id);
                      return (
                        <div className="col-12 mt-3">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: "0.92rem" }}>
                              Question Papers ({coursePapers.length})
                            </h6>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary rounded-pill px-3"
                              style={{ fontSize: "0.78rem" }}
                              onClick={() => {
                                const target = viewCourse;
                                setViewCourse(null);
                                handleAddQuestionPaper(target);
                              }}
                            >
                              + Add Question Paper
                            </button>
                          </div>
                          {coursePapers.length === 0 ? (
                            <div className="p-3 rounded-3 border bg-light text-center text-muted" style={{ fontSize: "0.85rem" }}>
                              No question papers created for this course yet. Click "+ Add Question Paper" to create one.
                            </div>
                          ) : (
                            <div className="table-responsive rounded-3 border">
                              <table className="table table-sm table-hover align-middle mb-0" style={{ fontSize: "0.83rem" }}>
                                <thead className="table-light">
                                  <tr>
                                    <th className="py-2 px-3">Paper Name</th>
                                    <th className="py-2 px-2">Code</th>
                                    <th className="py-2 px-2 text-center">Questions</th>
                                    <th className="py-2 px-2">Duration & Pass</th>
                                    <th className="py-2 px-2 text-center">Status</th>
                                    <th className="py-2 px-3 text-end">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {coursePapers.map((qp) => {
                                    const totalQ = (qp.sections || []).reduce(
                                      (s, sec) => s + (sec.questions || []).length,
                                      0
                                    );
                                    return (
                                      <tr key={qp.id}>
                                        <td className="px-3 fw-medium text-dark">{qp.title}</td>
                                        <td className="px-2 text-muted">{qp.code}</td>
                                        <td className="px-2 text-center">{totalQ} Qs</td>
                                        <td className="px-2">{qp.allowedTime}m • Pass {qp.passingScore}%</td>
                                        <td className="px-2 text-center">
                                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill">
                                            {qp.status}
                                          </span>
                                        </td>
                                        <td className="px-3 text-end">
                                          <div className="d-inline-flex gap-1">
                                            <button
                                              type="button"
                                              className="btn btn-xs btn-outline-info rounded-pill px-2 py-0"
                                              style={{ fontSize: "0.75rem" }}
                                              onClick={() => {
                                                navigate(`/lms/preview-question-paper?id=${qp.id}`);
                                              }}
                                            >
                                              Preview
                                            </button>
                                            <button
                                              type="button"
                                              className="btn btn-xs btn-outline-primary rounded-pill px-2 py-0"
                                              style={{ fontSize: "0.75rem" }}
                                              onClick={() => {
                                                const target = viewCourse;
                                                setViewCourse(null);
                                                navigate(`/lms/create-question-paper?id=${qp.id}`, {
                                                  state: {
                                                    courseId: target.id,
                                                    departmentId: target.departmentId,
                                                    courseName: target.title,
                                                    department: target.department,
                                                  },
                                                });
                                              }}
                                            >
                                              Edit
                                            </button>
                                            <button
                                              type="button"
                                              className="btn btn-xs btn-outline-danger rounded-pill px-2 py-0"
                                              style={{ fontSize: "0.75rem" }}
                                              onClick={() => {
                                                if (window.confirm(`Delete question paper "${qp.title}"?`)) {
                                                  questionPaperService.delete(qp.id);
                                                  setRefreshKey((k) => k + 1);
                                                }
                                              }}
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Training Materials Section for this Course */}
                    {(() => {
                      const courseMaterials: TrainingMaterialItem[] = trainingMaterialService.getByCourseId(viewCourse.id);
                      return (
                        <div className="col-12 mt-3">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: "0.92rem" }}>
                              Training Materials ({courseMaterials.length})
                            </h6>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success rounded-pill px-3"
                              style={{ fontSize: "0.78rem" }}
                              onClick={() => {
                                const target = viewCourse;
                                setViewCourse(null);
                                handleAddTrainingMaterial(target);
                              }}
                            >
                              + Add Training Material
                            </button>
                          </div>
                          {courseMaterials.length === 0 ? (
                            <div className="p-3 rounded-3 border bg-light text-center text-muted" style={{ fontSize: "0.85rem" }}>
                              No training materials uploaded for this course yet. Click "+ Add Training Material" to upload PPT, Excel or Video.
                            </div>
                          ) : (
                            <div className="table-responsive rounded-3 border">
                              <table className="table table-sm table-hover align-middle mb-0" style={{ fontSize: "0.83rem" }}>
                                <thead className="table-light">
                                  <tr>
                                    <th className="py-2 px-3">Material Name</th>
                                    <th className="py-2 px-2 text-center">Type</th>
                                    <th className="py-2 px-2">Size</th>
                                    <th className="py-2 px-2">Upload Date</th>
                                    <th className="py-2 px-3 text-end">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {courseMaterials.map((tm) => (
                                    <tr key={tm.id}>
                                      <td className="px-3">
                                        <div className="fw-medium text-dark">{tm.name}</div>
                                        {tm.description && (
                                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                                            {tm.description}
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-2 text-center">
                                        <span
                                          className={`badge rounded-pill ${tm.type === "ppt"
                                            ? "bg-purple-subtle text-purple border"
                                            : tm.type === "excel"
                                              ? "bg-success-subtle text-success border border-success-subtle"
                                              : "bg-info-subtle text-info border border-info-subtle"
                                            }`}
                                          style={{
                                            fontSize: "0.72rem",
                                            backgroundColor: tm.type === "ppt" ? "#ede9fe" : undefined,
                                            color: tm.type === "ppt" ? "#6d28d9" : undefined,
                                          }}
                                        >
                                          {tm.type.toUpperCase()}
                                        </span>
                                      </td>
                                      <td className="px-2 text-muted">{tm.sizeLabel}</td>
                                      <td className="px-2 text-muted">{tm.uploadedAt}</td>
                                      <td className="px-3 text-end">
                                        <div className="d-inline-flex gap-1">
                                          <button
                                            type="button"
                                            className="btn btn-xs btn-outline-primary rounded-pill px-2 py-0"
                                            style={{ fontSize: "0.75rem" }}
                                            onClick={() => {
                                              const target = viewCourse;
                                              setViewCourse(null);
                                              navigate("/lms/training-material", {
                                                state: {
                                                  courseId: target.id,
                                                  departmentId: target.departmentId,
                                                  courseName: target.title,
                                                  department: target.department,
                                                  selectedMaterialId: tm.id,
                                                },
                                              });
                                            }}
                                          >
                                            View / Open
                                          </button>
                                          <button
                                            type="button"
                                            className="btn btn-xs btn-outline-danger rounded-pill px-2 py-0"
                                            style={{ fontSize: "0.75rem" }}
                                            onClick={async () => {
                                              if (window.confirm(`Delete training material "${tm.name}"?`)) {
                                                await trainingMaterialService.delete(tm.id);
                                                setRefreshKey((k) => k + 1);
                                              }
                                            }}
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setViewCourse(null)}>
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-asti-gradient rounded-pill px-4"
                    onClick={() => {
                      const c = viewCourse;
                      setViewCourse(null);
                      handleOpenEdit(c);
                    }}
                  >
                    Edit Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 3. ASSIGN COURSE MODAL                                    */}
      {/* ========================================================= */}
      {assignCourse && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg border-0 rounded-4">
                <div className="modal-header border-bottom pb-3">
                  <div>
                    <h5 className="modal-title fw-bold text-dark mb-0">Assign Course to Operators</h5>
                    <small className="text-muted">{assignCourse.title} ({assignCourse.code})</small>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setAssignCourse(null)} />
                </div>
                <div className="modal-body p-4">
                  <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                    Select Target Operator Group
                  </label>
                  <select
                    className="form-select mb-3"
                    value={assignTarget}
                    onChange={(e) => setAssignTarget(e.target.value)}
                  >
                    <option value="All Operators in Line">All Operators in {assignCourse.line}</option>
                    <option value="All Operators in Section">All Operators in {assignCourse.section}</option>
                    <option value="Level L1 Operators">All Operators requiring {assignCourse.skillLevelTo} upgrade</option>
                    <option value="Direct Production Operators">Direct Production Shift A & B</option>
                  </select>

                  <div className="alert alert-info py-2 px-3 mb-0" style={{ fontSize: "0.85rem" }}>
                    Assigning will auto-enroll the selected target operators and trigger DOJO practical prerequisites upon theory completion.
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setAssignCourse(null)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-asti-gradient rounded-pill px-4"
                    onClick={() => {
                      setSuccessToast(`Course assigned successfully to "${assignTarget}"!`);
                      setAssignCourse(null);
                    }}
                  >
                    Confirm Assignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 4. IMPORT EXCEL MODAL                                     */}
      {/* ========================================================= */}
      {showUploadModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg border-0 rounded-4">
                <div className="modal-header border-bottom pb-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "42px", height: "42px", backgroundColor: "#ecfdf5", color: "#059669" }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="modal-title fw-bold text-dark mb-0">Import Courses via Excel</h5>
                      <small className="text-muted">Bulk upload training modules (.xlsx, .xls)</small>
                    </div>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)} />
                </div>
                <div className="modal-body p-4">
                  {uploadError && (
                    <div className="alert alert-danger py-2 px-3 mb-3 rounded-3" style={{ fontSize: "0.85rem" }}>
                      {uploadError}
                    </div>
                  )}

                  <div
                    className="border border-2 border-dashed rounded-4 p-4 text-center mb-3"
                    style={{ backgroundColor: "#f8fafc", borderColor: "#cbd5e1", cursor: "pointer" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="d-none"
                      accept=".xlsx,.xls"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadFile(e.target.files[0]);
                          setUploadError("");
                        }
                      }}
                    />
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" className="mb-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <div className="fw-semibold text-dark" style={{ fontSize: "0.92rem" }}>
                      {uploadFile ? uploadFile.name : "Click to select or drag & drop Excel file"}
                    </div>
                    <small className="text-muted">Supports Microsoft Excel (.xlsx, .xls)</small>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-decoration-none p-0"
                      onClick={handleExportCourses}
                    >
                      Download Excel Template
                    </button>
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowUploadModal(false)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-asti-gradient rounded-pill px-4"
                    disabled={!uploadFile || uploading}
                    onClick={handleImportExcel}
                  >
                    {uploading ? "Importing..." : "Upload & Process"}
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

export default Courses;
