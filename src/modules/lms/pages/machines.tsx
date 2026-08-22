import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../../../styles/departments.css";
import type { Machine } from "../models/departments";
import {
  getMachines,
  createMachine,
  updateMachine,
  deleteMachine,
} from "../services/machineService";

export default function Machines() {
  const navigate = useNavigate();
  const location = useLocation();

  const navState = (location.state as {
    departmentId?: string | number;
    departmentName?: string;
    subDepartmentId?: string | number;
    subDepartmentName?: string;
    sectionId?: string | number;
    lineId?: string | number;
    lineName?: string;
  }) || {};

  const departmentId = navState.departmentId || 1;
  const departmentName = navState.departmentName || "Department";
  const subDepartmentId = navState.subDepartmentId || 1;
  const subDepartmentName = navState.subDepartmentName || "Sub-Department";
  const sectionId = navState.sectionId || 1;
  const lineId = navState.lineId;
  const lineName = navState.lineName || "Line";

  const [machines, setMachines] = useState<Machine[]>([]);
  const [search, setSearch] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [editNameInput, setEditNameInput] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null);

  const fetchMachinesData = async () => {
    try {
      const res = await getMachines();
      const all: Machine[] = res?.data?.data || [];
      const filtered = lineId
        ? all.filter((m) => String(m.lineId) === String(lineId))
        : all;
      setMachines(filtered);
    } catch (err) {
      console.error("Failed to fetch machines:", err);
    }
  };

  useEffect(() => {
    fetchMachinesData();
  }, [lineId]);

  const filteredMachines = machines.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
    String(m.id || "").toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const handleAddMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    try {
      await createMachine(
        nameInput.trim(),
        departmentId,
        subDepartmentId,
        sectionId,
        lineId || 1
      );
      setShowAddModal(false);
      setNameInput("");
      fetchMachinesData();
    } catch (err) {
      console.error("Failed to add machine:", err);
    }
  };

  const handleOpenEditModal = (machine: Machine) => {
    setSelectedMachine(machine);
    setEditNameInput(machine.name);
    setShowEditModal(true);
  };

  const handleSaveEditMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachine || !editNameInput.trim()) return;

    try {
      await updateMachine(selectedMachine.id, editNameInput.trim());
      setShowEditModal(false);
      setSelectedMachine(null);
      setEditNameInput("");
      fetchMachinesData();
    } catch (err) {
      console.error("Failed to update machine:", err);
    }
  };

  const handleOpenDeleteModal = (machine: Machine) => {
    setMachineToDelete(machine);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!machineToDelete) return;

    try {
      await deleteMachine(machineToDelete.id);
      setShowDeleteModal(false);
      setMachineToDelete(null);
      fetchMachinesData();
    } catch (err) {
      console.error("Failed to delete machine:", err);
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
          <li className="breadcrumb-item text-muted">{departmentName}</li>
          <li className="breadcrumb-item text-muted">{subDepartmentName}</li>
          <li className="breadcrumb-item text-muted">{lineName}</li>
          <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">
            Machines
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Machine Management ({lineName})</h4>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold btn-back-nav"
            onClick={() =>
              navigate("/lms/departments/sections-lines", {
                state: { departmentId, departmentName, subDepartmentId, subDepartmentName },
              })
            }
          >
            ← Back to Sections & Lines
          </button>

          <button
            type="button"
            className="btn btn-asti-gradient px-4 py-2 fw-semibold rounded-pill"
            onClick={() => {
              setNameInput("");
              setShowAddModal(true);
            }}
          >
            + Add Machine
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: "Line Name", value: lineName, colorClass: "stat-card-value-primary" },
          { label: "Machines Count", value: `${machines.length} Machines`, colorClass: "stat-card-value-dark" },
        ].map((stat, i) => (
          <div key={i} className="col-md-6">
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
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className="form-control bg-white border-start-0 ps-0 filter-input-text"
            placeholder="Search machines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ms-auto text-muted filter-count-info">
          Showing <strong>{filteredMachines.length}</strong> of {machines.length}
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 dept-table">
          <thead className="table-light">
            <tr className="dept-table-header">
              <th className="py-3 px-3">ID</th>
              <th className="py-3 px-3">Machine Name</th>
              <th className="py-3 px-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMachines.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-5 text-muted">
                  No machines found.
                </td>
              </tr>
            ) : (
              filteredMachines.map((m) => (
                <tr key={m.id}>
                  <td className="px-3">
                    <span className="badge-dept-code">#{m.id}</span>
                  </td>
                  <td className="px-3 fw-semibold text-dark">{m.name}</td>
                  <td className="px-3 text-end">
                    <div className="d-inline-flex gap-2 align-items-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary rounded-circle btn-action-circle"
                        onClick={() => handleOpenEditModal(m)}
                        title="Edit Machine"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm rounded-circle btn-action-delete"
                        onClick={() => handleOpenDeleteModal(m)}
                        title="Delete Machine"
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Add Machine</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>

              <form onSubmit={handleAddMachine}>
                <div className="modal-body py-3">
                  <div className="mb-2">
                    <label className="form-label fw-semibold small text-muted">
                      Machine Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. CNC Milling Machine A"
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
                    Add Machine
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedMachine && (
        <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Edit Machine</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>

              <form onSubmit={handleSaveEditMachine}>
                <div className="modal-body py-3">
                  <div className="mb-2">
                    <label className="form-label fw-semibold small text-muted">
                      Machine Name <span className="text-danger">*</span>
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
      {showDeleteModal && machineToDelete && (
        <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-danger">Delete Machine</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>

              <div className="modal-body py-3">
                <p className="mb-0 text-secondary">
                  Are you sure you want to delete machine <br />
                  <strong>"{machineToDelete.name}"</strong>?
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
