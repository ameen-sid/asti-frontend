import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import "../../../styles/departments.css";
import type { SubDepartment } from "../models/departments";
import {
  getSubDepartments,
  createSubDepartment,
  updateSubDepartment,
  deleteSubDepartment,
} from "../services/subDepartmentService";
import { useEffect, useState } from "react";

export default function SubDepartments() {
  const { deptName } = useParams<{ deptName: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Location state passed from departments page
  const navState = (location.state as { departmentId?: string | number; departmentName?: string }) || {};
  const departmentId = navState.departmentId;
  const decodedDeptName = navState.departmentName || (deptName ? decodeURIComponent(deptName) : "Department");

  const [subDepartments, setSubDepartments] = useState<SubDepartment[]>([]);
  const [search, setSearch] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SubDepartment | null>(null);
  const [editNameInput, setEditNameInput] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subToDelete, setSubToDelete] = useState<SubDepartment | null>(null);

  const fetchSubDepartments = async () => {
    try {
      const response = await getSubDepartments();
      const allSubs: SubDepartment[] = response?.data?.data || [];
      // Filter by departmentId if available
      const filtered = departmentId
        ? allSubs.filter((s) => String(s.departmentId) === String(departmentId))
        : allSubs;
      setSubDepartments(filtered);
    } catch (error) {
      console.error("Failed to fetch sub-departments:", error);
    }
  };

  useEffect(() => {
    fetchSubDepartments();
  }, [departmentId]);

  const filteredSubs = subDepartments.filter((sub) =>
    (sub.name || "").toLowerCase().includes(search.toLowerCase()) ||
    String(sub.id || "").toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const handleAddSubDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    try {
      await createSubDepartment(nameInput.trim(), departmentId || 1);
      setShowAddModal(false);
      setNameInput("");
      fetchSubDepartments();
    } catch (error) {
      console.error("Failed to add sub-department:", error);
    }
  };

  const handleOpenEditModal = (sub: SubDepartment) => {
    setSelectedSub(sub);
    setEditNameInput(sub.name);
    setShowEditModal(true);
  };

  const handleSaveEditSubDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub || !editNameInput.trim()) return;

    try {
      await updateSubDepartment(selectedSub.id, editNameInput.trim());
      setShowEditModal(false);
      setSelectedSub(null);
      setEditNameInput("");
      fetchSubDepartments();
    } catch (error) {
      console.error("Failed to update sub-department:", error);
    }
  };

  const handleOpenDeleteModal = (sub: SubDepartment) => {
    setSubToDelete(sub);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!subToDelete) return;

    try {
      await deleteSubDepartment(subToDelete.id);
      setShowDeleteModal(false);
      setSubToDelete(null);
      fetchSubDepartments();
    } catch (error) {
      console.error("Failed to delete sub-department:", error);
    }
  };

  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-2">
        <ol className="breadcrumb mb-0 breadcrumb-font-size">
          <li className="breadcrumb-item">
            <Link to="/lms/departments" className="breadcrumb-link-primary">
              Departments
            </Link>
          </li>
          <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">
            {decodedDeptName}
          </li>
          <li className="breadcrumb-item active text-muted" aria-current="page">
            Sub-Departments
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Sub-Departments: {decodedDeptName}</h4>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold btn-back-nav"
            onClick={() => navigate("/lms/departments")}
          >
            ← Back to Departments
          </button>

          <button
            type="button"
            className="btn btn-asti-gradient px-4 py-2 fw-semibold rounded-pill"
            onClick={() => {
              setNameInput("");
              setShowAddModal(true);
            }}
          >
            + Add Sub-Department
          </button>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Department Name",
            value: decodedDeptName,
            colorClass: "stat-card-value-primary",
          },
          {
            label: "Sub-Departments Count",
            value: `${subDepartments.length} Sub-Depts`,
            colorClass: "stat-card-value-dark",
          },
        ].map((stat, index) => (
          <div key={index} className="col-md-6">
            <div className="stat-card-box">
              <div className="stat-card-label">{stat.label}</div>
              <div className={`stat-card-value-sub ${stat.colorClass}`}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="d-flex align-items-center gap-3 mb-4 flex-wrap filter-bar-container">
        <div className="input-group filter-search-group">
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
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className="form-control bg-white border-start-0 ps-0 filter-input-text"
            placeholder="Search sub-departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ms-auto text-muted filter-count-info">
          Showing <strong>{filteredSubs.length}</strong> of {subDepartments.length}
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 dept-table">
          <thead className="table-light">
            <tr className="dept-table-header">
              <th className="py-3 px-3">ID</th>
              <th className="py-3 px-3">Sub-Department Name</th>
              <th className="py-3 px-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubs.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-5 text-muted">
                  No sub-departments found.
                </td>
              </tr>
            ) : (
              filteredSubs.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-3">
                    <span className="badge-dept-code">#{sub.id}</span>
                  </td>
                  <td className="px-3">
                    <span className="fw-semibold text-dark">{sub.name}</span>
                  </td>
                  <td className="px-3 text-end">
                    <div className="d-inline-flex gap-2 align-items-center">
                      <button
                        className="btn btn-sm rounded-pill btn-subdept-nav"
                        onClick={() =>
                          navigate("/lms/departments/sections-lines", {
                            state: {
                              departmentId,
                              departmentName: decodedDeptName,
                              subDepartmentId: sub.id,
                              subDepartmentName: sub.name,
                            },
                          })
                        }
                      >
                        Sections & Lines →
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary rounded-circle btn-action-circle"
                        onClick={() => handleOpenEditModal(sub)}
                        title="Edit Sub-Department"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm rounded-circle btn-action-delete"
                        onClick={() => handleOpenDeleteModal(sub)}
                        title="Delete Sub-Department"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

      {/* Add Sub-Department Modal */}
      {showAddModal && (
        <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Add Sub-Department</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>

              <form onSubmit={handleAddSubDepartment}>
                <div className="modal-body py-3">
                  <div className="mb-2">
                    <label className="form-label fw-semibold small text-muted">
                      Sub-Department Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Assembly Line A"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-asti-gradient rounded-pill px-4 fw-semibold">
                    Add Sub-Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sub-Department Modal */}
      {showEditModal && selectedSub && (
        <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Edit Sub-Department</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>

              <form onSubmit={handleSaveEditSubDepartment}>
                <div className="modal-body py-3">
                  <div className="mb-2">
                    <label className="form-label fw-semibold small text-muted">
                      Sub-Department Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editNameInput}
                      onChange={(e) => setEditNameInput(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowEditModal(false)}>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && subToDelete && (
        <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-danger">Delete Sub-Department</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>

              <div className="modal-body py-3">
                <p className="mb-0 text-secondary">
                  Are you sure you want to delete sub-department <br />
                  <strong>"{subToDelete.name}"</strong>?
                </p>
              </div>

              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger rounded-pill px-4 fw-semibold" onClick={handleConfirmDelete}>
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
