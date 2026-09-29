import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx";
import type { QuestionPaper, TrainingFileType, TrainingMaterialItem } from "../models/questionPaper";
import type { Course } from "../models/lmsTypes";
import { questionPaperService } from "../services/questionPaperService";
import { trainingMaterialService } from "../services/trainingMaterialService";
import { trainingFileStore } from "../services/trainingFileStore";
import { INITIAL_COURSES } from "../utils/mockLmsData";

// ─── Viewers ─────────────────────────────────────────────────────────────────

/**
 * Displays a PPT file with fallback download card
 */
function PptViewer({ file, objectUrl }: { file: { name: string; sizeLabel: string; mimeType?: string }; objectUrl: string }) {
  return (
    <div className="mb-3">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          background: "linear-gradient(135deg,#ede9fe,#faf5ff)",
          borderRadius: "10px 10px 0 0",
          border: "1.5px solid #c4b5fd",
          borderBottom: "none",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <span style={{ fontWeight: 700, color: "#4c1d95", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {file.name}
        </span>
        <span style={{ fontSize: "0.75rem", color: "#7c3aed", whiteSpace: "nowrap" }}>{file.sizeLabel}</span>
        <a
          href={objectUrl}
          download={file.name}
          className="btn btn-sm text-white"
          style={{
            background: "#7c3aed",
            fontSize: "0.78rem",
            fontWeight: 600,
            textDecoration: "none",
            borderRadius: 6,
            padding: "4px 12px",
          }}
        >
          Download PPT
        </a>
      </div>
      <object
        data={objectUrl}
        type={file.mimeType || "application/vnd.ms-powerpoint"}
        width="100%"
        style={{ height: 420, border: "1.5px solid #c4b5fd", borderTop: "none", borderRadius: "0 0 10px 10px", background: "#f5f3ff" }}
      >
        <div style={{ padding: 32, textAlign: "center", color: "#6d28d9" }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <p className="fw-semibold mb-2">Inline PPT presentation viewer preview.</p>
          <a href={objectUrl} download={file.name} style={{ color: "#7c3aed", fontWeight: 700 }}>
            Click here to download and view &ldquo;{file.name}&rdquo;
          </a>
        </div>
      </object>
    </div>
  );
}

/**
 * Plays a video from an object URL (blob:// URL from IndexedDB).
 */
function VideoPlayer({ file, objectUrl }: { file: { name: string; sizeLabel: string }; objectUrl: string }) {
  return (
    <div className="mb-3">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          background: "linear-gradient(135deg,#e0f2fe,#f0f9ff)",
          borderRadius: "10px 10px 0 0",
          border: "1.5px solid #7dd3fc",
          borderBottom: "none",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
        <span style={{ fontWeight: 700, color: "#0c4a6e", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {file.name}
        </span>
        <span style={{ fontSize: "0.75rem", color: "#0284c7", whiteSpace: "nowrap" }}>{file.sizeLabel}</span>
      </div>
      <video
        controls
        src={objectUrl}
        style={{
          width: "100%",
          borderRadius: "0 0 10px 10px",
          border: "1.5px solid #7dd3fc",
          borderTop: "none",
          background: "#000",
          maxHeight: 460,
        }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

/**
 * Excel viewer with sheet preview and download link
 */
function ExcelViewer({ file, objectUrl }: { file: { name: string; sizeLabel: string }; objectUrl: string }) {
  const [data, setData] = useState<string[][]>([]);

  useEffect(() => {
    if (!objectUrl) return;
    fetch(objectUrl)
      .then((res) => res.arrayBuffer())
      .then((buf) => {
        try {
          const wb = XLSX.read(buf, { type: "array" });
          const firstSheet = wb.Sheets[wb.SheetNames[0]];
          const json: string[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          setData(json.slice(0, 15));
        } catch {
          // Ignore parse errors for mock blobs
        }
      })
      .catch(() => {});
  }, [objectUrl]);

  return (
    <div className="mb-3">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          background: "linear-gradient(135deg,#ecfdf5,#f0fdf4)",
          borderRadius: "10px 10px 0 0",
          border: "1.5px solid #a7f3d0",
          borderBottom: "none",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span style={{ fontWeight: 700, color: "#065f46", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {file.name}
        </span>
        <span style={{ fontSize: "0.75rem", color: "#059669", whiteSpace: "nowrap" }}>{file.sizeLabel}</span>
        <a
          href={objectUrl}
          download={file.name}
          className="btn btn-sm text-white"
          style={{
            background: "#059669",
            fontSize: "0.78rem",
            fontWeight: 600,
            textDecoration: "none",
            borderRadius: 6,
            padding: "4px 12px",
          }}
        >
          Download Excel
        </a>
      </div>
      <div
        style={{
          padding: "12px",
          maxHeight: 280,
          overflowY: "auto",
          background: "#fff",
          border: "1.5px solid #a7f3d0",
          borderRadius: "0 0 10px 10px",
        }}
      >
        {data.length > 0 ? (
          <table className="table table-sm table-bordered mb-0" style={{ fontSize: "0.8rem" }}>
            <tbody>
              {data.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx === 0 ? "table-light fw-bold" : ""}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{String(cell ?? "")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-muted text-center py-3" style={{ fontSize: "0.85rem" }}>
            Spreadsheet preview: {file.name}. Click Download to inspect formulas and full sheets.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function TrainingMaterial() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. Read Course context from location.state or query params
  const initialCourseId =
    location.state?.courseId ||
    searchParams.get("courseId") ||
    sessionStorage.getItem("asti_selected_course_id") ||
    "";

  // 2. Read Question Paper / Trainee info if provided
  const rawPaperId =
    searchParams.get("qpId") ||
    searchParams.get("paperId") ||
    searchParams.get("id") ||
    searchParams.get("qp_id") ||
    location.state?.paperId ||
    location.state?.qpId ||
    location.state?.qp_id ||
    location.state?.id ||
    sessionStorage.getItem("asti_selected_paper_id") ||
    "";

  const paperId =
    rawPaperId === "No Paper ID Provided" || rawPaperId === "undefined" || rawPaperId === "null"
      ? ""
      : rawPaperId;

  const employeeId =
    location.state?.employeeId ||
    searchParams.get("employeeId") ||
    sessionStorage.getItem("asti_selected_employee_id") ||
    "";

  const employeeName =
    location.state?.employeeName ||
    searchParams.get("employeeName") ||
    sessionStorage.getItem("asti_selected_employee_name") ||
    "";

  // State
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | number>(initialCourseId || 1);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [materials, setMaterials] = useState<TrainingMaterialItem[]>([]);
  const [activeMaterialId, setActiveMaterialId] = useState<string | null>(null);
  const [objectUrls, setObjectUrls] = useState<Record<string, string>>({});

  // Upload Form State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadDescription, setUploadDescription] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Courses
  useEffect(() => {
    const raw = localStorage.getItem("lms_courses");
    let list: Course[] = INITIAL_COURSES;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) list = parsed;
      } catch {}
    }
    setCoursesList(list);

    // If an initialCourseId was provided, match it
    const active = list.find((c) => String(c.id) === String(selectedCourseId)) || list[0];
    if (active) {
      setSelectedCourse(active);
      setSelectedCourseId(active.id);
      sessionStorage.setItem("asti_selected_course_id", String(active.id));
    }
  }, [selectedCourseId]);

  // Load Course Materials
  const loadCourseMaterials = () => {
    if (!selectedCourseId) return;
    const items = trainingMaterialService.getByCourseId(selectedCourseId);
    setMaterials(items);
    if (items.length > 0 && !activeMaterialId) {
      setActiveMaterialId(items[0].id);
    }
  };

  useEffect(() => {
    loadCourseMaterials();
  }, [selectedCourseId]);

  // If paperId was given, load the question paper
  useEffect(() => {
    if (paperId) {
      const resolved = questionPaperService.getById(paperId);
      if (resolved) {
        setPaper(resolved);
        sessionStorage.setItem("asti_selected_paper_id", String(resolved.id));
        // If paper has courseId, synchronize course view
        if (resolved.courseId && resolved.courseId !== selectedCourseId) {
          setSelectedCourseId(resolved.courseId);
        }
      }
    }
  }, [paperId]);

  // Generate object URLs for materials and paper training files from IndexedDB
  useEffect(() => {
    const createdUrls: Record<string, string> = {};

    const allFileIds: Array<{ id: string; blobFallback?: Blob }> = [];

    materials.forEach((m) => allFileIds.push({ id: m.id }));
    (paper?.trainingFiles || []).forEach((f) => allFileIds.push({ id: f.id }));

    Promise.all(
      allFileIds.map(async (item) => {
        try {
          const blob = await trainingFileStore.get(item.id);
          if (blob) {
            createdUrls[item.id] = URL.createObjectURL(blob);
          } else {
            // Create a mock fallback blob so user can interact and preview immediately
            const dummyBlob = new Blob([`Mock file content for ${item.id}`], { type: "text/plain" });
            createdUrls[item.id] = URL.createObjectURL(dummyBlob);
          }
        } catch {
          // ignore
        }
      })
    ).then(() => setObjectUrls(createdUrls));

    return () => {
      Object.values(createdUrls).forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [materials, paper]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!uploadTitle.trim()) {
        setUploadTitle(file.name);
      }
    }
  };

  // Determine file type category
  const getFileType = (fileName: string): TrainingFileType => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "ppt" || ext === "pptx") return "ppt";
    if (ext === "xls" || ext === "xlsx" || ext === "csv") return "excel";
    if (ext === "mp4" || ext === "webm" || ext === "mov" || ext === "mkv") return "video";
    return "document";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  };

  // Save Training Material to Course
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      alert("Please select a Course.");
      return;
    }
    if (!selectedFile) {
      alert("Please select a file to upload (PPT, Excel, or Video).");
      return;
    }
    if (!uploadTitle.trim()) {
      alert("Please enter a material title.");
      return;
    }

    setIsUploading(true);
    try {
      const type = getFileType(selectedFile.name);
      const sizeLabel = formatFileSize(selectedFile.size);

      const savedItem = await trainingMaterialService.save(
        {
          name: uploadTitle.trim(),
          type,
          mimeType: selectedFile.type || "application/octet-stream",
          sizeLabel,
          description: uploadDescription.trim(),
          courseId: selectedCourse.id,
          courseName: selectedCourse.title,
          departmentId: selectedCourse.departmentId || 1,
          departmentName: selectedCourse.department,
        },
        selectedFile
      );

      // Reload materials
      loadCourseMaterials();
      setActiveMaterialId(savedItem.id);
      showToast(`Training material "${savedItem.name}" uploaded successfully for course "${selectedCourse.title}"!`);

      // Reset Form
      setUploadTitle("");
      setUploadDescription("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowUploadModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save training material. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Material
  const handleDeleteMaterial = async (id: string, name: string) => {
    if (window.confirm(`Delete training material "${name}"?`)) {
      await trainingMaterialService.delete(id);
      loadCourseMaterials();
      showToast(`Material "${name}" removed.`);
    }
  };

  const startExamination = () => {
    const targetId = String(paper?.id || paperId || "QP-ASTI-01");
    sessionStorage.setItem("asti_selected_paper_id", targetId);

    navigate(
      `/lms/examination?qpId=${encodeURIComponent(targetId)}&paperId=${encodeURIComponent(targetId)}`,
      {
        state: {
          paperId: targetId,
          qpId: targetId,
          paperCode: paper?.code,
          employeeId,
          employeeName,
        },
      }
    );
  };

  const activeMaterial = materials.find((m) => m.id === activeMaterialId) || materials[0];

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

      <div className="bg-white rounded-3 shadow-sm border p-4">
        {/* Top Header & Navigation */}
        <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4 gap-3">
          <div>
            <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill mb-2">
              LMS MASTER TRAINING HUB
            </span>
            <h2 className="fw-bold mb-1 text-dark">
              Course Training Material &amp; Resources
            </h2>
            <p className="text-muted mb-0">
              Department &rarr; Course relationship. Standard Operating Procedures, PPT decks, Excel matrices &amp; Video demonstrations.
            </p>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <button
              className="btn btn-outline-secondary px-3 rounded-pill"
              onClick={() => navigate("/lms/courses")}
            >
              &larr; Back to Courses
            </button>
            <button
              className="btn btn-asti-gradient px-4 fw-semibold rounded-pill d-flex align-items-center gap-2"
              onClick={() => setShowUploadModal(true)}
            >
              <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>+</span>
              Upload Material
            </button>
            {paper && (
              <button
                className="btn btn-success px-4 fw-semibold rounded-pill d-flex align-items-center gap-2"
                onClick={startExamination}
              >
                Start Examination
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Course Context Banner */}
        <div
          className="p-3 rounded-3 mb-4 border d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm"
          style={{ background: "linear-gradient(135deg, #f8fafc 0%, #ede9fe 100%)" }}
        >
          <div>
            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <span className="badge bg-primary rounded-pill px-3 py-1 fw-bold" style={{ fontSize: "0.75rem" }}>
                SELECTED COURSE
              </span>
              <h4 className="fw-bold text-dark mb-0">{selectedCourse?.title || "Automotive Course"}</h4>
              <span className="badge bg-light text-dark border px-2 py-1">{selectedCourse?.code}</span>
            </div>
            <div className="text-secondary" style={{ fontSize: "0.88rem" }}>
              <strong>Department:</strong> <span className="text-primary fw-semibold">{selectedCourse?.department || "Production"}</span>
              {selectedCourse?.subDepartment && <span> &bull; Sub-Dept: <strong>{selectedCourse.subDepartment}</strong></span>}
              {selectedCourse?.section && <span> &bull; Section: <strong>{selectedCourse.section}</strong></span>}
              {selectedCourse?.line && <span> &bull; Line: <strong>{selectedCourse.line}</strong></span>}
            </div>
          </div>

          {/* Course Switcher (allows choosing any course from dropdown) */}
          <div className="d-flex align-items-center gap-2">
            <label className="text-muted fw-semibold mb-0" style={{ fontSize: "0.82rem" }}>
              Switch Course:
            </label>
            <select
              className="form-select form-select-sm shadow-sm"
              style={{ width: "260px", fontWeight: 600 }}
              value={selectedCourseId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedCourseId(id);
                const found = coursesList.find((c) => String(c.id) === String(id));
                if (found) setSelectedCourse(found);
              }}
            >
              {coursesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Trainee Banner if in Examination Prep flow */}
        {(employeeId || employeeName) && (
          <div className="alert alert-info border-0 rounded-3 mb-4 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-primary text-white p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <strong className="d-block text-dark">Trainee Operator: {employeeName || "Trainee"}</strong>
                <span className="small text-muted">Employee ID: {employeeId}</span>
              </div>
            </div>
            <button className="btn btn-sm btn-primary px-3 rounded-pill" onClick={startExamination}>
              Proceed to Exam &rarr;
            </button>
          </div>
        )}

        {/* Course Materials Grid & Viewer Layout */}
        <div className="row g-4">
          {/* Left Column: Material Items List */}
          <div className="col-lg-5 col-xl-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-dark mb-0">Course Materials ({materials.length})</h5>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                onClick={() => setShowUploadModal(true)}
              >
                + Add File
              </button>
            </div>

            {materials.length === 0 ? (
              <div className="p-4 border rounded-3 bg-light text-center text-muted">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="mb-2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <div className="fw-semibold">No materials uploaded yet</div>
                <small className="d-block mb-3">Upload PPT, Excel spreadsheets, or Video demonstrations for this course.</small>
                <button
                  type="button"
                  className="btn btn-sm btn-primary rounded-pill px-3"
                  onClick={() => setShowUploadModal(true)}
                >
                  Upload First Material
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2" style={{ maxHeight: "650px", overflowY: "auto" }}>
                {materials.map((m) => {
                  const isActive = m.id === activeMaterial?.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setActiveMaterialId(m.id)}
                      className={`p-3 rounded-3 border transition-all cursor-pointer ${
                        isActive ? "border-primary bg-primary-subtle shadow-sm" : "bg-white hover-shadow"
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-start justify-content-between gap-2">
                        <div className="d-flex align-items-start gap-2">
                          {/* Type Icon Badge */}
                          <div
                            className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                            style={{
                              backgroundColor:
                                m.type === "ppt" ? "#ede9fe" : m.type === "excel" ? "#dcfce7" : "#e0f2fe",
                              color:
                                m.type === "ppt" ? "#7c3aed" : m.type === "excel" ? "#16a34a" : "#0284c7",
                              width: 36,
                              height: 36,
                              flexShrink: 0,
                            }}
                          >
                            {m.type === "ppt" ? (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="3" width="20" height="14" rx="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                              </svg>
                            ) : m.type === "excel" ? (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                              </svg>
                            ) : (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="23 7 16 12 23 17 23 7" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="fw-bold text-dark" style={{ fontSize: "0.88rem" }}>
                              {m.name}
                            </div>
                            <div className="d-flex align-items-center gap-2 mt-1">
                              <span
                                className="badge rounded-pill fw-semibold"
                                style={{
                                  fontSize: "0.68rem",
                                  backgroundColor:
                                    m.type === "ppt" ? "#ede9fe" : m.type === "excel" ? "#dcfce7" : "#e0f2fe",
                                  color:
                                    m.type === "ppt" ? "#7c3aed" : m.type === "excel" ? "#16a34a" : "#0284c7",
                                }}
                              >
                                {m.type.toUpperCase()}
                              </span>
                              <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                                {m.sizeLabel}
                              </span>
                              <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                                &bull; {m.uploadedAt}
                              </span>
                            </div>
                            {m.description && (
                              <div className="text-secondary mt-1" style={{ fontSize: "0.78rem" }}>
                                {m.description}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger p-0"
                          title="Delete material"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMaterial(m.id, m.name);
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Active Material Viewer */}
          <div className="col-lg-7 col-xl-8">
            <div className="p-4 border rounded-3 bg-light h-100">
              {activeMaterial ? (
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                    <div>
                      <span className="badge bg-secondary-subtle text-dark border px-2 py-1 rounded-pill mb-1">
                        ACTIVE RESOURCE
                      </span>
                      <h4 className="fw-bold text-dark mb-0">{activeMaterial.name}</h4>
                      <small className="text-muted">
                        Course: {selectedCourse?.title} &bull; Dept: {selectedCourse?.department}
                      </small>
                    </div>

                    {objectUrls[activeMaterial.id] && (
                      <a
                        href={objectUrls[activeMaterial.id]}
                        download={activeMaterial.name}
                        className="btn btn-outline-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download Original
                      </a>
                    )}
                  </div>

                  {activeMaterial.description && (
                    <div className="p-3 bg-white rounded-3 border mb-3 text-secondary" style={{ fontSize: "0.85rem" }}>
                      <strong>Description &amp; Objective:</strong> {activeMaterial.description}
                    </div>
                  )}

                  {/* Render based on file type */}
                  {activeMaterial.type === "ppt" && (
                    <PptViewer file={activeMaterial} objectUrl={objectUrls[activeMaterial.id] || ""} />
                  )}

                  {activeMaterial.type === "video" && (
                    <VideoPlayer file={activeMaterial} objectUrl={objectUrls[activeMaterial.id] || ""} />
                  )}

                  {activeMaterial.type === "excel" && (
                    <ExcelViewer file={activeMaterial} objectUrl={objectUrls[activeMaterial.id] || ""} />
                  )}

                  {activeMaterial.type === "document" && (
                    <div className="p-4 bg-white rounded-3 border text-center">
                      <p className="fw-bold mb-2">Document File: {activeMaterial.name}</p>
                      <a
                        href={objectUrls[activeMaterial.id] || ""}
                        download={activeMaterial.name}
                        className="btn btn-primary rounded-pill px-4"
                      >
                        Download Document
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5 text-center text-muted">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="mb-2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <h6 className="fw-bold">No Resource Selected</h6>
                  <p className="small mb-0">Select a material from the list or upload a new file for this course.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* UPLOAD TRAINING MATERIAL MODAL                            */}
      {/* ========================================================= */}
      {showUploadModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg border-0 rounded-4">
                <div className="modal-header border-bottom pb-3">
                  <div>
                    <h5 className="modal-title fw-bold text-dark mb-0">Upload Course Training Material</h5>
                    <small className="text-muted">
                      Course: <strong>{selectedCourse?.title}</strong> ({selectedCourse?.department})
                    </small>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)} />
                </div>

                <form onSubmit={handleUploadSubmit}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                        Course (Locked)
                      </label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={`${selectedCourse?.title} — [${selectedCourse?.department}]`}
                        disabled
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                        Select File (PPT, Excel, or Video) *
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="form-control"
                        accept=".ppt,.pptx,.xls,.xlsx,.csv,.mp4,.webm,.mkv,.mov"
                        onChange={handleFileChange}
                        required
                      />
                      <div className="form-text" style={{ fontSize: "0.78rem" }}>
                        Supports PowerPoint (.ppt, .pptx), Excel (.xlsx, .xls), and Video (.mp4, .webm).
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                        Material Title *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Standard Operating Procedure SOP"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                        Description / Notes (Optional)
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Brief summary of procedures, safety notices, or inspection guidelines..."
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="modal-footer border-top px-4 py-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill px-4"
                      onClick={() => setShowUploadModal(false)}
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-asti-gradient rounded-pill px-4"
                      disabled={isUploading || !selectedFile}
                    >
                      {isUploading ? "Uploading..." : "Save to Course"}
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

export default TrainingMaterial;
