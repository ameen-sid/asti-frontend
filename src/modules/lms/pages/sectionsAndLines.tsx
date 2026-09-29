import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../../../styles/departments.css";
import type { Section, Line } from "../models/departments";
import {
  getSections,
  createSection,
  updateSection,
  deleteSection,
} from "../services/sectionService";
import {
  getLines,
  createLine,
  updateLine,
  deleteLine,
} from "../services/lineService";

export default function SectionsAndLines() {
  const navigate = useNavigate();
  const location = useLocation();

  const navState = (location.state as {
    departmentId?: string | number;
    departmentName?: string;
    subDepartmentId?: string | number;
    subDepartmentName?: string;
  }) || {};

  const departmentId = navState.departmentId;
  const departmentName = navState.departmentName || "Department";
  const subDepartmentId = navState.subDepartmentId;
  const subDepartmentName = navState.subDepartmentName || "Sub-Department";

  // Data state
  const [sections, setSections] = useState<Section[]>([]);
  const [lines, setLines] = useState<Line[]>([]);

  const [sectionSearch, setSectionSearch] = useState("");
  const [lineSearch, setLineSearch] = useState("");

  // Section Modals
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [sectionNameInput, setSectionNameInput] = useState("");

  const [showEditSectionModal, setShowEditSectionModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [editSectionNameInput, setEditSectionNameInput] = useState("");

  const [showDeleteSectionModal, setShowDeleteSectionModal] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);

  // Line Modals
  const [showAddLineModal, setShowAddLineModal] = useState(false);
  const [lineNameInput, setLineNameInput] = useState("");
  const [selectedSectionForLine, setSelectedSectionForLine] = useState<number | string>(1);

  const [showEditLineModal, setShowEditLineModal] = useState(false);
  const [selectedLine, setSelectedLine] = useState<Line | null>(null);
  const [editLineNameInput, setEditLineNameInput] = useState("");

  const [showDeleteLineModal, setShowDeleteLineModal] = useState(false);
  const [lineToDelete, setLineToDelete] = useState<Line | null>(null);
  const [expandedSectionId, setExpandedSectionId] = useState(null);

  // Fetch data
  const fetchSectionsData = async () => {
    try {
      const res = await getSections();
      const all: Section[] = res?.data?.data || [];
      const filtered = subDepartmentId
        ? all.filter((s) => String(s.subDepartmentId) === String(subDepartmentId))
        : all;
      setSections(filtered);
      if (filtered.length > 0 && !selectedSectionForLine) {
        setSelectedSectionForLine(filtered[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch sections:", err);
    }
  };

  const fetchLinesData = async () => {
    try {
      const res = await getLines();
      const all: Line[] = res?.data?.data || [];
      const filtered = subDepartmentId
        ? all.filter((l) => String(l.subDepartmentId) === String(subDepartmentId))
        : all;
      setLines(filtered);
    } catch (err) {
      console.error("Failed to fetch lines:", err);
    }
  };

  useEffect(() => {
    fetchSectionsData();
    fetchLinesData();
  }, [subDepartmentId]);

  // Section Handlers
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionNameInput.trim()) return;
    try {
      await createSection(
        sectionNameInput.trim(),
        departmentId || 1,
        subDepartmentId || 1
      );
      setShowAddSectionModal(false);
      setSectionNameInput("");
      fetchSectionsData();
    } catch (err) {
      console.error("Failed to add section:", err);
    }
  };

  const handleSaveEditSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection || !editSectionNameInput.trim()) return;
    try {
      await updateSection(selectedSection.id, editSectionNameInput.trim());
      setShowEditSectionModal(false);
      setSelectedSection(null);
      setEditSectionNameInput("");
      fetchSectionsData();
    } catch (err) {
      console.error("Failed to update section:", err);
    }
  };

  const handleConfirmDeleteSection = async () => {
    if (!sectionToDelete) return;
    try {
      await deleteSection(sectionToDelete.id);
      setShowDeleteSectionModal(false);
      setSectionToDelete(null);
      fetchSectionsData();
    } catch (err) {
      console.error("Failed to delete section:", err);
    }
  };

  // Line Handlers
  const handleAddLine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lineNameInput.trim()) return;
    try {
      await createLine(
        lineNameInput.trim(),
        departmentId || 1,
        subDepartmentId || 1,
        selectedSectionForLine || (sections[0]?.id || 1)
      );
      setShowAddLineModal(false);
      setLineNameInput("");
      fetchLinesData();
    } catch (err) {
      console.error("Failed to add line:", err);
    }
  };

  const handleSaveEditLine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLine || !editLineNameInput.trim()) return;
    try {
      await updateLine(selectedLine.id, editLineNameInput.trim());
      setShowEditLineModal(false);
      setSelectedLine(null);
      setEditLineNameInput("");
      fetchLinesData();
    } catch (err) {
      console.error("Failed to update line:", err);
    }
  };

  const handleConfirmDeleteLine = async () => {
    if (!lineToDelete) return;
    try {
      await deleteLine(lineToDelete.id);
      setShowDeleteLineModal(false);
      setLineToDelete(null);
      fetchLinesData();
    } catch (err) {
      console.error("Failed to delete line:", err);
    }
  };

  const filteredSections = sections.filter((s) =>
    (s.name || "").toLowerCase().includes(sectionSearch.toLowerCase()) ||
    String(s.id || "").toLowerCase().includes(sectionSearch.toLowerCase())
  );

  const filteredLines = lines.filter((l) =>
    (l.name || "").toLowerCase().includes(lineSearch.toLowerCase()) ||
    String(l.id || "").toLowerCase().includes(lineSearch.toLowerCase())
  );

  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">
            Sections & Lines ({subDepartmentName})
          </h4>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold btn-back-nav"
          onClick={() =>
            navigate("/lms/departments/sub-departments", {
              state: { departmentId, departmentName },
            })
          }
        >
          ← Back to Sub-Departments
        </button>
      </div>

      {/* SECTION 1: SECTIONS MANAGEMENT */}
      <div className="border rounded-3 p-3 mb-5 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0 text-dark">Section Management</h5>
          <button
            type="button"
            className="btn btn-asti-gradient px-3 py-2 fw-semibold rounded-pill btn-sm"
            onClick={() => {
              setSectionNameInput("");
              setShowAddSectionModal(true);
            }}
          >
            + Add Section
          </button>
        </div>

        {/* Section Search */}
        <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
          <input
            type="text"
            className="form-control bg-white filter-input-text w-auto"
            style={{ minWidth: "250px" }}
            placeholder="Search sections..."
            value={sectionSearch}
            onChange={(e) => setSectionSearch(e.target.value)}
          />
          <div className="ms-auto text-muted small">
            Showing <strong>{filteredSections.length}</strong> of {sections.length} sections
          </div>
        </div>

        {/* Sections Table */}
        <div className="table-responsive bg-white rounded border">
          <table className="table table-hover align-middle mb-0 dept-table">
            <thead className="table-light">
              <tr className="dept-table-header">
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Section Name</th>
                <th className="py-3 px-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted">
                    No sections found.
                  </td>
                </tr>
              ) : (
                filteredSections.map((sec) => {
                  const isExpanded = expandedSectionId === sec.id;

                  const sectionLines = lines.filter(
                    (line) => Number(line.sectionId) === Number(sec.id)
                  );

                  return (
                    <React.Fragment key={sec.id}>

                      {/* SECTION ROW */}
                      <tr>
                        <td className="px-3">
                          <span className="badge-dept-code">
                            #{sec.id}
                          </span>
                        </td>

                        <td className="px-3 fw-semibold text-dark">
                          {sec.name}
                        </td>

                        <td className="px-3 text-end">
                          <div className="d-inline-flex gap-2">

                            {/* ADD LINE / EXPAND */}
                            <button
                              type="button"
                              className="btn btn-sm rounded-pill btn-subdept-nav"
                              onClick={() => {
                                setExpandedSectionId(
                                  isExpanded ? null : sec.id
                                );

                                // Important:
                                // New line belongs to this section
                                setSelectedSectionForLine(sec.id);
                              }}
                            >
                              {isExpanded ? "Hide Lines" : "Show Lines"}
                            </button>

                            {/* EDIT SECTION */}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary rounded-circle btn-action-circle"
                              onClick={() => {
                                setSelectedSection(sec);
                                setEditSectionNameInput(sec.name);
                                setShowEditSectionModal(true);
                              }}
                              title="Edit Section"
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>

                            {/* DELETE SECTION */}
                            <button
                              type="button"
                              className="btn btn-sm rounded-circle btn-action-delete"
                              onClick={() => {
                                setSectionToDelete(sec);
                                setShowDeleteSectionModal(true);
                              }}
                              title="Delete Section"
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              </svg>
                            </button>

                          </div>
                        </td>
                      </tr>

                      {/* EXPANDED LINE ROW */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={3} className="p-0">
                            <div className="p-3 bg-light border-top border-bottom">

                              {/* LINE HEADER */}
                              <div className="d-flex justify-content-between align-items-center mb-3">

                                <div>
                                  <h6 className="fw-bold mb-1">
                                    Lines — {sec.name}
                                  </h6>

                                  <small className="text-muted">
                                    {sectionLines.length} line
                                    {sectionLines.length !== 1 ? "s" : ""}
                                  </small>
                                </div>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-asti-gradient rounded-pill"
                                  onClick={() => {
                                    setLineNameInput("");
                                    setSelectedSectionForLine(sec.id);
                                    setShowAddLineModal(true);
                                  }}
                                >
                                  + Add Line
                                </button>

                              </div>

                              {/* LINE TABLE */}
                              <div className="table-responsive bg-white rounded border">
                                <table className="table table-hover align-middle mb-0 dept-table">

                                  <thead className="table-light">
                                    <tr className="dept-table-header">
                                      <th className="py-3 px-3">
                                        ID
                                      </th>

                                      <th className="py-3 px-3">
                                        Line Name
                                      </th>

                                      <th className="py-3 px-3 text-end">
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {sectionLines.length === 0 ? (
                                      <tr>
                                        <td
                                          colSpan={3}
                                          className="text-center py-4 text-muted"
                                        >
                                          No lines found for this section.
                                        </td>
                                      </tr>
                                    ) : (
                                      sectionLines.map((line) => (
                                        <tr key={line.id}>

                                          <td className="px-3">
                                            <span className="badge-dept-code">
                                              #{line.id}
                                            </span>
                                          </td>

                                          <td className="px-3 fw-semibold text-dark">
                                            {line.name}
                                          </td>

                                          <td className="px-3 text-end">
                                            <div className="d-inline-flex gap-2 align-items-center">

                                              {/* MACHINES */}
                                              <button
                                                className="btn btn-sm rounded-pill btn-subdept-nav"
                                                onClick={() =>
                                                  navigate(
                                                    "/lms/departments/machines",
                                                    {
                                                      state: {
                                                        departmentId,
                                                        departmentName,
                                                        subDepartmentId,
                                                        subDepartmentName,
                                                        sectionId: sec.id,
                                                        sectionName: sec.name,
                                                        lineId: line.id,
                                                        lineName: line.name,
                                                      },
                                                    }
                                                  )
                                                }
                                              >
                                                Machines →
                                              </button>

                                              {/* EDIT LINE */}
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary rounded-circle btn-action-circle"
                                                onClick={() => {
                                                  setSelectedLine(line);
                                                  setEditLineNameInput(line.name);
                                                  setShowEditLineModal(true);
                                                }}
                                                title="Edit Line"
                                              >
                                                <svg
                                                  width="13"
                                                  height="13"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                >
                                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1-9.5-9.5z" />
                                                </svg>
                                              </button>

                                              {/* DELETE LINE */}
                                              <button
                                                type="button"
                                                className="btn btn-sm rounded-circle btn-action-delete"
                                                onClick={() => {
                                                  setLineToDelete(line);
                                                  setShowDeleteLineModal(true);
                                                }}
                                                title="Delete Line"
                                              >
                                                <svg
                                                  width="13"
                                                  height="13"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                >
                                                  <polyline points="3 6 5 6 21 6" />
                                                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                </svg>
                                              </button>

                                            </div>
                                          </td>

                                        </tr>
                                      ))
                                    )}
                                  </tbody>

                                </table>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}

                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS FOR SECTIONS */}
      {showAddSectionModal && (
        <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Add Section</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddSectionModal(false)}></button>
              </div>
              <form onSubmit={handleAddSection}>
                <div className="modal-body py-3">
                  <div className="mb-2">
                    <label className="form-label fw-semibold small text-muted">
                      Section Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Cutting Section"
                      value={sectionNameInput}
                      onChange={(e) => setSectionNameInput(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowAddSectionModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-asti-gradient rounded-pill px-4 fw-semibold">
                    Add Section
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showEditSectionModal && selectedSection && (
        <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Edit Section</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditSectionModal(false)}></button>
              </div>
              <form onSubmit={handleSaveEditSection}>
                <div className="modal-body py-3">
                  <div className="mb-2">
                    <label className="form-label fw-semibold small text-muted">
                      Section Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editSectionNameInput}
                      onChange={(e) => setEditSectionNameInput(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowEditSectionModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-asti-gradient rounded-pill px-4 fw-semibold">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteSectionModal && sectionToDelete && (
        <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-danger">Delete Section</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteSectionModal(false)}></button>
              </div>
              <div className="modal-body py-3">
                <p className="mb-0 text-secondary">
                  Are you sure you want to delete section <br />
                  <strong>"{sectionToDelete.name}"</strong>?
                </p>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowDeleteSectionModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger rounded-pill px-4 fw-semibold" onClick={handleConfirmDeleteSection}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS FOR LINES */}
      {showAddLineModal && (
        <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Add Line</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddLineModal(false)}></button>
              </div>
              <form onSubmit={handleAddLine}>
                <div className="modal-body py-3">
                  <div className="mb-2">
                    <label className="form-label fw-semibold small text-muted">
                      Line Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Line 1"
                      value={lineNameInput}
                      onChange={(e) => setLineNameInput(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowAddLineModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-asti-gradient rounded-pill px-4 fw-semibold">
                    Add Line
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showEditLineModal && selectedLine && (
        <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Edit Line</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditLineModal(false)}></button>
              </div>
              <form onSubmit={handleSaveEditLine}>
                <div className="modal-body py-3">
                  <div className="mb-2">
                    <label className="form-label fw-semibold small text-muted">
                      Line Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editLineNameInput}
                      onChange={(e) => setEditLineNameInput(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowEditLineModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-asti-gradient rounded-pill px-4 fw-semibold">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteLineModal && lineToDelete && (
        <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-danger">Delete Line</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteLineModal(false)}></button>
              </div>
              <div className="modal-body py-3">
                <p className="mb-0 text-secondary">
                  Are you sure you want to delete line <br />
                  <strong>"{lineToDelete.name}"</strong>?
                </p>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowDeleteLineModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger rounded-pill px-4 fw-semibold" onClick={handleConfirmDeleteLine}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
