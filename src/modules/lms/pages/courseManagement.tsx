import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/departments.css";
import "../../../styles/createqQuestionPaper.css";
import type { QuestionPaper, PaperStatus } from "../models/questionPaper";
import { questionPaperService } from "../services/questionPaperService";
import type { Employee } from "../models/employeeManagement";
import { getEmployee } from "../services/employeeService";

type StatusFilter = "All Status" | PaperStatus;

export function CourseManagement() {
  const navigate = useNavigate();
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Status");
  const [deptFilter, setDeptFilter] = useState<string>("All Departments");

  const [courseFilter, setCourseFilter] = useState<string>("All Courses");
  const [coursesList, setCoursesList] = useState<Array<{ id: number | string; title: string }>>([]);

  // Preview Modal State
  const [previewPaper, setPreviewPaper] = useState<QuestionPaper | null>(null);

  // Delete Confirmation Modal State
  const [paperToDelete, setPaperToDelete] = useState<QuestionPaper | null>(
    null,
  );

  // Training Attend Modal State
  const [paperToTrain, setPaperToTrain] = useState<QuestionPaper | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load question papers from localStorage service
  const loadPapers = () => {
    const list = questionPaperService.getAll();
    setPapers(list);
  };

  useEffect(() => {
    loadPapers();
    const saved = localStorage.getItem("lms_courses");
    if (saved) {
      try {
        setCoursesList(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Status badge styling
  const statusStyle = (status: PaperStatus) => {
    const map: Record<
      PaperStatus,
      { bg: string; color: string; border: string }
    > = {
      PUBLISHED: {
        bg: "#ecfdf5",
        color: "#059669",
        border: "1px solid #a7f3d0",
      },
      DRAFT: {
        bg: "#fef3c7",
        color: "#d97706",
        border: "1px solid #fde68a",
      },
      ARCHIVED: {
        bg: "#f1f5f9",
        color: "#64748b",
        border: "1px solid #cbd5e1",
      },
    };
    return map[status] || map.DRAFT;
  };

  // Filtered papers
  const filtered: QuestionPaper[] = papers.filter((paper) => {
    const q = search.toLowerCase();
    const matchSearch =
      (paper.title || "").toLowerCase().includes(q) ||
      (paper.code || "").toLowerCase().includes(q) ||
      (paper.department || "").toLowerCase().includes(q) ||
      (paper.courseName || "").toLowerCase().includes(q) ||
      (paper.subTitle || "").toLowerCase().includes(q);

    const matchStatus =
      statusFilter === "All Status" || paper.status === statusFilter;
    const matchDept =
      deptFilter === "All Departments" || paper.department === deptFilter;
    const matchCourse =
      courseFilter === "All Courses" || String(paper.courseId) === courseFilter;

    return matchSearch && matchStatus && matchDept && matchCourse;
  });

  // Calculate stats
  const publishedCount = papers.filter((p) => p.status === "PUBLISHED").length;
  const totalQuestions = papers.reduce(
    (sum, p) =>
      sum +
      (p.sections || []).reduce(
        (sSum, sec) => sSum + (sec.questions || []).length,
        0,
      ),
    0,
  );
  const avgTime =
    papers.length > 0
      ? Math.round(
          papers.reduce((sum, p) => sum + (p.allowedTime || 0), 0) /
            papers.length,
        )
      : 0;

  // Actions
  const handleCreatePaper = () => {
    navigate("/lms/create-question-paper");
  };

  const handleEditPaper = (paper: QuestionPaper) => {
    navigate(`/lms/create-question-paper?id=${paper.id}`, {
      state: {
        courseId: paper.courseId,
        departmentId: paper.departmentId,
        courseName: paper.courseName,
        department: paper.department,
      },
    });
  };

  const handlePreviewPaper = (paper: QuestionPaper) => {
    navigate(`/lms/preview-question-paper?id=${paper.id}`);
  };
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [employeeFound, setEmployeeFound] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  useEffect(() => {
    console.log("Fetching employees on component mount");
    const getEmploeeData = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const res = await getEmployee({
          sortBy: "id",
          sortOrder: "desc",
        });
        console.log("API response:", res);
        const data = res?.data?.data || [];
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Failed to fetch employees:", err);
        setErrorMessage(
          err?.response?.data?.message ||
            "Failed to fetch employees from server.",
        );
      } finally {
        setLoading(false);
      }
    };
    getEmploeeData();
  }, []);
  const searchEmployee = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("these are the employees-- ", employees);

    console.log("Searching the employee");

    const employeeId = (
      event.currentTarget.elements.namedItem("employeeId") as HTMLInputElement
    ).value;

    console.log(employeeId);
    if (!employeeId) {
      console.log("Employee ID is empty");
      setErrorMessage("Please enter an employee ID.");
      return;
    } else {
      // console.log("Employee ID is NOT empty");
      // setErrorMessage("Employee not found");
      const employee = employees.find(
        (emp) => emp.employeeId.toString() === employeeId,
      );
      if (employee) {
        console.log("Employee found: ", employee);
        setErrorMessage("");
        setEmployeeFound(true);
        setCurrentEmployee(employee);
        return;
      } else {
        console.log("Employee not found");
        setEmployeeFound(false);
        setCurrentEmployee(null);
        return;
      }
    }
  };
  const startTraining = (paper: QuestionPaper) => {
    if (paper?.id) {
      sessionStorage.setItem("asti_selected_paper_id", String(paper.id));
    }
    if (currentEmployee?.employeeId) {
      sessionStorage.setItem("asti_selected_employee_id", String(currentEmployee.employeeId));
    }
    if (currentEmployee?.fullName) {
      sessionStorage.setItem("asti_selected_employee_name", currentEmployee.fullName);
    }

    navigate(
      `/lms/training-material?qpId=${encodeURIComponent(paper.id)}&paperId=${encodeURIComponent(paper.id)}`,
      {
        state: {
          paperId: paper.id,
          qpId: paper.id,
          paperCode: paper.code,
          employeeId: currentEmployee?.employeeId,
          employeeName: currentEmployee?.fullName,
        },
      }
    );
  };
  const handleConfirmDelete = () => {
    if (!paperToDelete) return;
    questionPaperService.delete(paperToDelete.id);
    showToast(`Deleted question paper "${paperToDelete.title}"`);
    setPaperToDelete(null);
    loadPapers();
  };

  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="qp-toast-notice">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Total Question Papers",
            value: papers.length,
            color: "#1d4ed8",
            bgClass: "my-fade-blue",
            stroke: "#1d4ed8",
            icon: (
              <svg
                width="20"
                height="20"
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
            ),
          },
          {
            label: "Published Papers",
            value: `${publishedCount} Active`,
            color: "#059669",
            bgClass: "my-fade-blue",
            stroke: "#059669",
            icon: (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ),
          },
          {
            label: "Total Questions",
            value: `${totalQuestions} Questions`,
            color: "#4338ca",
            bgClass: "my-fade-purple",
            stroke: "#4338ca",
            icon: (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            ),
          },
          {
            label: "Avg Allowed Time",
            value: `${avgTime} Mins`,
            color: "#d97706",
            bgClass: "my-fade-blue",
            stroke: "#d97706",
            icon: (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            ),
          },
        ].map((stat, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card-box d-flex align-items-center p-3">
              <div
                className={`me-3 rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 ${stat.bgClass}`}
                style={{ width: "46px", height: "46px", color: stat.stroke }}
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

      {/* Filters Bar */}
      <div className="ctq-filter-bar border rounded-4 shadow-sm p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center flex-wrap gap-2">
          {/* Filter Icon Label */}
          <div className="d-flex align-items-center me-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span
              className="ms-1 fw-semibold"
              style={{ fontSize: "0.82rem", color: "#3d3d3d" }}
            >
              Filters
            </span>
          </div>

          {/* Search Input */}
          <div className="ctq-filter-search-group">
            <svg
              className="ctq-filter-search-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="ctq-filter-search-input"
              placeholder="Search by title, code, dept..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="d-flex align-items-center">
            <select
              className="ctq-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="All Status">All Status</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="DRAFT">DRAFT</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="d-flex align-items-center">
            <select
              className="ctq-filter-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="All Departments">All Departments</option>
              <option value="Production">Production</option>
              <option value="Quality Control">Quality Control</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          {/* Course Filter */}
          <div className="d-flex align-items-center">
            <select
              className="ctq-filter-select"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="All Courses">All Courses</option>
              {coursesList.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {(statusFilter !== "All Status" ||
            deptFilter !== "All Departments" ||
            courseFilter !== "All Courses" ||
            search) && (
            <button
              type="button"
              className="ctq-filter-clear-btn"
              onClick={() => {
                setStatusFilter("All Status");
                setDeptFilter("All Departments");
                setCourseFilter("All Courses");
                setSearch("");
              }}
            >
              Clear
            </button>
          )}
        </div>
        <button
          className="btn btn-asti-gradient px-4 py-2 fw-semibold rounded-pill d-inline-flex align-items-center gap-2"
          onClick={handleCreatePaper}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Question Paper
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 dept-table">
          <thead>
            <tr className="dept-table-header">
              <th className="py-3 px-3">Paper Title &amp; Module</th>
              <th className="py-3 px-3">Paper Code / Ref</th>
              <th className="py-3 px-3">Department &amp; Line</th>
              <th className="py-3 px-3">Allowed Time</th>
              <th className="py-3 px-3">Passing Score</th>
              <th className="py-3 px-3">Questions</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((paper) => {
              const badge = statusStyle(paper.status);
              const qCount = (paper.sections || []).reduce(
                (acc, s) => acc + (s.questions || []).length,
                0,
              );

              return (
                <tr
                  key={paper.id}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  {/* Title & Subtitle */}
                  <td className="px-3">
                    <div
                      className="fw-bold text-dark"
                      onClick={() => handleEditPaper(paper)}
                      title="Click to edit question paper"
                      style={{ cursor: "pointer" }}
                    >
                      {paper.title}
                    </div>
                    {paper.subTitle && (
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {paper.subTitle}
                      </div>
                    )}
                  </td>

                  {/* Code */}
                  <td className="px-3">
                    <span
                      className="badge-dept-code"
                      style={{ fontSize: "0.78rem" }}
                    >
                      {paper.code || "ASTI-QP"}
                    </span>
                  </td>

                  {/* Department & Course */}
                  <td className="px-3">
                    <div
                      className="text-dark fw-semibold"
                      style={{ fontSize: "0.88rem" }}
                    >
                      {paper.department}
                    </div>
                    {paper.courseName ? (
                      <div className="text-primary fw-medium" style={{ fontSize: "0.78rem" }}>
                        Course: {paper.courseName}
                      </div>
                    ) : (
                      <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                        {paper.subDepartment || "General"} •{" "}
                        {paper.lineSection || "Line 1"}
                      </div>
                    )}
                  </td>

                  {/* Time Allowed */}
                  <td className="px-3">
                    <span
                      className="badge bg-light text-dark border px-2 py-1"
                      style={{ fontSize: "0.82rem" }}
                    >
                      ⏱️ {paper.allowedTime || 60} Mins
                    </span>
                  </td>

                  {/* Passing Score */}
                  <td className="px-3">
                    <span
                      className="fw-bold"
                      style={{ color: "#1d4ed8", fontSize: "0.88rem" }}
                    >
                      {paper.passingScore || 20}%
                    </span>
                  </td>

                  {/* Total Questions */}
                  <td className="px-3">
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                      {qCount} Qs ({(paper.sections || []).length} Secs)
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
                        border: badge.border,
                        letterSpacing: "0.04em",
                        display: "inline-block",
                      }}
                    >
                      {paper.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-3 text-end">
                    {/* Preview Button */}
                    <button
                      type="button"
                      className="btn-action-circle me-1"
                      title="Preview paper"
                      onClick={() => handlePreviewPaper(paper)}
                      style={{ cursor: "pointer" }}
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
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      className="btn-action-circle me-1"
                      title="Edit question paper"
                      onClick={() => handleEditPaper(paper)}
                      style={{ cursor: "pointer" }}
                    >
                      <svg
                        width="14"
                        height="14"
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
                    {/* Attend Question Paper Button */}
                    <button
                      type="button"
                      className="btn fw-semibold my-3 me-1 fs-small-button text-primary border border-primary-subtle px-2 py-1 rounded-pill"
                      title="Attend training"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setPaperToTrain(paper);
                        setEmployeeFound(false);
                        setCurrentEmployee(null);
                        setErrorMessage("");
                      }}
                    >
                      Training Attend
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      className="btn-action-delete me-1"
                      title="Delete question paper"
                      onClick={() => setPaperToDelete(paper)}
                      style={{ cursor: "pointer" }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-5">
            <div className="mb-3 text-muted">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
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
            {papers.length === 0 ? (
              <>
                <h6 className="fw-bold text-dark mb-1">
                  No Question Papers Created Yet
                </h6>
                <p className="text-muted mb-3" style={{ fontSize: "0.88rem" }}>
                  Get started by creating your first technical evaluation test
                  paper.
                </p>
                <button
                  type="button"
                  className="btn btn-asti-gradient px-4 py-2 fw-semibold rounded-pill"
                  onClick={handleCreatePaper}
                >
                  + Create Question Paper
                </button>
              </>
            ) : (
              <>
                <h6 className="fw-bold text-dark mb-1">
                  No matching question papers
                </h6>
                <p className="text-muted mb-2" style={{ fontSize: "0.88rem" }}>
                  Try changing your search term or filters.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm rounded-pill"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All Status");
                    setDeptFilter("All Departments");
                  }}
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {paperToDelete && (
        <div
          className="qp-modal-overlay"
          onClick={() => setPaperToDelete(null)}
        >
          <div className="qp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-danger mb-0 d-flex align-items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Delete Question Paper
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setPaperToDelete(null)}
              ></button>
            </div>
            <p className="text-muted mb-4" style={{ fontSize: "0.92rem" }}>
              Are you sure you want to delete{" "}
              <strong>"{paperToDelete.title}"</strong> ({paperToDelete.code})?
              This action cannot be undone.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() => setPaperToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                Delete Paper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Question Paper Preview Modal */}
      {previewPaper && (
        <div className="qp-modal-overlay" onClick={() => setPreviewPaper(null)}>
          <div
            className="qp-preview-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Exam Paper Body */}
            <div className="qp-exam-paper">
              {/* Paper Header: Logo + Title */}
              <div className="qp-exam-header">
                <img
                  className="qp-exam-logo"
                  src="/asti-logo.png"
                  alt="ASTI Logo"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="qp-exam-title-block">
                  <div className="qp-exam-org-name">
                    Automotive Stamping Technology India Pvt. Ltd.
                  </div>
                  <div className="qp-exam-main-title">{previewPaper.title}</div>
                  <div className="qp-exam-subtitle">
                    {previewPaper.subTitle || "Technical Assessment"}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close ms-2"
                  onClick={() => setPreviewPaper(null)}
                />
              </div>

              {/* Info Table */}
              <div className="qp-exam-info-table">
                <table>
                  <thead>
                    <tr>
                      <th>Paper Code / Ref</th>
                      <th>Department</th>
                      <th>Sub Dept / Line</th>
                      <th>Time Allowed</th>
                      <th>Pass Score</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{previewPaper.code || "ASTI-QP"}</td>
                      <td>{previewPaper.department}</td>
                      <td>
                        {previewPaper.subDepartment} –{" "}
                        {previewPaper.lineSection}
                      </td>
                      <td>{previewPaper.allowedTime} Mins</td>
                      <td>{previewPaper.passingScore}%</td>
                      <td>{previewPaper.status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Instructions */}
              <div className="qp-exam-instructions">
                <strong>Instructions:</strong> Read all questions carefully
                before answering. Each question carries marks as indicated.
                Negative marking applies where specified. Total sections:{" "}
                {(previewPaper.sections || []).length}.
              </div>

              {/* Sections and Questions */}
              <div className="preview-sections-body">
                {!previewPaper.sections ||
                previewPaper.sections.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    No sections or questions configured in this paper yet.
                  </div>
                ) : (
                  previewPaper.sections.map((sec, secIdx) => {
                    let qGlobalOffset = 0;
                    for (let i = 0; i < secIdx; i++) {
                      qGlobalOffset += (
                        previewPaper.sections[i]?.questions || []
                      ).length;
                    }
                    const sectionMarks = sec.questions.reduce(
                      (sum, q) => sum + (q.marks || 0),
                      0,
                    );
                    return (
                      <div key={sec.id} className="mb-4">
                        <div className="qp-exam-section-header">
                          <span>
                            {sec.name}: {sec.subtitle}
                          </span>
                          <span>
                            {sec.questions.length} Q(s) · {sectionMarks} Marks
                          </span>
                        </div>

                        {sec.questions.map((q, qIdx) => (
                          <div key={q.id} className="qp-exam-question">
                            <div className="qp-exam-q-text">
                              <span className="qp-exam-q-num">
                                Q{qGlobalOffset + qIdx + 1}.
                              </span>
                              <span>{q.questionText}</span>
                              <span className="qp-exam-q-marks">
                                [{q.marks} {q.marks > 1 ? "Marks" : "Mark"}]
                              </span>
                            </div>

                            <div className="qp-exam-options-grid">
                              {(q.options && q.options.length > 0
                                ? q.options
                                : [
                                    {
                                      id: `${q.id}-a`,
                                      label: "A",
                                      text: "Option A",
                                    },
                                    {
                                      id: `${q.id}-b`,
                                      label: "B",
                                      text: "Option B",
                                    },
                                    {
                                      id: `${q.id}-c`,
                                      label: "C",
                                      text: "Option C",
                                    },
                                    {
                                      id: `${q.id}-d`,
                                      label: "D",
                                      text: "Option D",
                                    },
                                  ]
                              ).map((opt) => (
                                <div key={opt.id} className="qp-exam-option">
                                  <span className="qp-exam-option-letter">
                                    ({opt.label})
                                  </span>
                                  <span>{opt.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="qp-preview-modal-footer">
              <button
                type="button"
                className="btn btn-outline-primary px-3"
                onClick={() => {
                  const toEdit = previewPaper;
                  setPreviewPaper(null);
                  handleEditPaper(toEdit);
                }}
              >
                Edit Question Paper
              </button>
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={() => setPreviewPaper(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Training Attend Modal */}
      {paperToTrain && (
        <div
          className="qp-modal-overlay"
          onClick={() => setPaperToTrain(null)}
        >
          <div
            className="qp-modal-card"
            style={{ maxWidth: "500px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {employeeFound ? (
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold mb-0">Start Training</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setPaperToTrain(null)}
                  ></button>
                </div>
                <div className="mb-4">
                  <div className="p-3 bg-light rounded mb-3 border">
                    <div className="small text-muted mb-1">Selected Paper</div>
                    <strong className="text-primary">{paperToTrain.title}</strong>
                    <div className="small text-muted">{paperToTrain.code}</div>
                  </div>
                  <p className="fw-semibold mb-1">
                    Employee ID : {currentEmployee?.employeeId}
                  </p>
                  <p className="fw-semibold mb-1">
                    Employee Name : {currentEmployee?.fullName}
                  </p>
                  <p className="fw-semibold mb-0">
                    DOJO : {currentEmployee?.isDojo ? "Yes" : "No"}
                  </p>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setPaperToTrain(null)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success px-4"
                    onClick={() => {
                      const p = paperToTrain;
                      setPaperToTrain(null);
                      startTraining(p);
                    }}
                  >
                    Start Training
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={searchEmployee}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold mb-0">Search Employee</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setPaperToTrain(null)}
                  ></button>
                </div>
                <div className="mb-3">
                  <div className="p-2 px-3 bg-light rounded mb-3 border small">
                    <span className="text-muted">Paper: </span>
                    <strong>{paperToTrain.title}</strong>
                  </div>
                  <label className="form-label fw-semibold">Employee ID :</label>
                  <input
                    name="employeeId"
                    className="form-control"
                    type="text"
                    placeholder="Enter Employee ID"
                    autoFocus
                  />
                  {errorMessage && (
                    <p className="text-danger small mt-2 mb-0">{errorMessage}</p>
                  )}
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setPaperToTrain(null)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-success px-4">
                    Search
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseManagement;
