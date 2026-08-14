import React, { useEffect, useState } from "react";
import type {
  Department,
  Section,
  Line,
  SubSection,
  Machine,
} from "../models/departments";

const STORAGE_KEY = "lms_departments";

/* =========================================================
   Local Storage
========================================================= */

function loadData(): Department[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    return JSON.parse(data) as Department[];
  } catch {
    return [];
  }
}

function saveData(data: Department[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* =========================================================
   ID Generator
========================================================= */

function genId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  );
}

/* =========================================================
   Types
========================================================= */

type ModalType =
  | "dept"
  | "section"
  | "line"
  | "subsection"
  | "machine";

interface ModalContext {
  deptId?: string;
  sectionId?: string;
  lineId?: string;
  subsectionId?: string;
}

interface ModalState {
  type: ModalType;
  context: ModalContext;
}

/* =========================================================
   Modal Metadata
========================================================= */

const MODAL_META: Record<
  ModalType,
  {
    title: string;
    placeholder: string;
    label: string;
  }
> = {
  dept: {
    title: "Add Department",
    placeholder: "Enter department name...",
    label: "Department Name",
  },

  section: {
    title: "Add Section",
    placeholder: "Enter section name...",
    label: "Section Name",
  },

  line: {
    title: "Add Line",
    placeholder: "Enter line name...",
    label: "Line Name",
  },

  subsection: {
    title: "Add Sub-section",
    placeholder: "Enter sub-section name...",
    label: "Sub-section Name",
  },

  machine: {
    title: "Add Machine",
    placeholder: "Enter machine name...",
    label: "Machine Name",
  },
};

/* =========================================================
   Level Configuration
========================================================= */

type LevelType =
  | "dept"
  | "section"
  | "line"
  | "subsection"
  | "machine";

interface LevelConfig {
  bg: string;
  border: string;
  dot: string;
  label: string;
  indent: number;
}

const LEVEL: Record<LevelType, LevelConfig> = {
  dept: {
    bg: "#f0f4ff",
    border: "#c7d7f8",
    dot: "#3e6db5",
    label: "Department",
    indent: 0,
  },

  section: {
    bg: "#fff7f0",
    border: "#fcd9be",
    dot: "#f97316",
    label: "Section",
    indent: 24,
  },

  line: {
    bg: "#f0fff8",
    border: "#b6ecd8",
    dot: "#22c55e",
    label: "Line",
    indent: 48,
  },

  subsection: {
    bg: "#fdf4ff",
    border: "#e8c7f8",
    dot: "#a855f7",
    label: "Sub-section",
    indent: 72,
  },

  machine: {
    bg: "#f9f9f9",
    border: "#e5e7eb",
    dot: "#6b7280",
    label: "Machine",
    indent: 96,
  },
};

/* =========================================================
   Icons
========================================================= */

interface ChevronIconProps {
  open: boolean;
}

function ChevronIcon({ open }: ChevronIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 0.22s",
        transform: open
          ? "rotate(90deg)"
          : "rotate(0deg)",
        flexShrink: 0,
      }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function DeleteIcon() {
  return (
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

      <path d="M10 11v6" />
      <path d="M14 11v6" />

      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

/* =========================================================
   Tree Row
========================================================= */

interface TreeRowProps {
  type: LevelType;
  name: string;
  badge?: string;
  children?: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  onDelete: () => void;
  defaultOpen?: boolean;
}

function TreeRow({
  type,
  name,
  badge,
  children,
  onAdd,
  addLabel,
  onDelete,
  defaultOpen = false,
}: TreeRowProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const lvl = LEVEL[type];

  const isMachine = type === "machine";

  return (
    <div
      style={{
        marginLeft: lvl.indent,
      }}
    >
      {/* Row */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: lvl.bg,
          border: `1px solid ${lvl.border}`,
          borderRadius: 10,
          padding: "7px 12px",
          marginBottom: 6,
          cursor: isMachine ? "default" : "pointer",
          userSelect: "none",
          transition: "box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            "0 2px 8px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
        onClick={() => {
          if (!isMachine) {
            setOpen((value) => !value);
          }
        }}
      >
        {/* Chevron */}

        <span
          style={{
            color: lvl.dot,
            minWidth: 16,
          }}
        >
          {!isMachine && <ChevronIcon open={open} />}
        </span>

        {/* Dot */}

        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: lvl.dot,
            flexShrink: 0,
          }}
        />

        {/* Level */}

        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            color: lvl.dot,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            background: "rgba(255,255,255,0.6)",
            borderRadius: 6,
            padding: "1px 6px",
            flexShrink: 0,
          }}
        >
          {lvl.label}
        </span>

        {/* Name */}

        <span
          style={{
            fontWeight: 600,
            fontSize: "0.88rem",
            flex: 1,
            color: "#1a1a2e",
          }}
        >
          {name}
        </span>

        {/* Badge */}

        {badge !== undefined && (
          <span
            style={{
              fontSize: "0.7rem",
              color: "#888",
              background: "rgba(255,255,255,0.7)",
              border: "1px solid #ddd",
              borderRadius: 20,
              padding: "1px 8px",
              marginRight: 4,
            }}
          >
            {badge}
          </span>
        )}

        {/* Actions */}

        <span
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            gap: 4,
            alignItems: "center",
          }}
        >
          {onAdd && (
            <button
              type="button"
              title={addLabel}
              onClick={onAdd}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: lvl.dot,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "3px 8px",
                fontSize: "0.7rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <PlusIcon />

              {addLabel}
            </button>
          )}

          <button
            type="button"
            title="Delete"
            onClick={onDelete}
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "transparent",
              color: "#e22b6e",
              border: "1px solid #fca5c0",
              borderRadius: 6,
              padding: "3px 7px",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "#fff0f5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "transparent";
            }}
          >
            <DeleteIcon />
          </button>
        </span>
      </div>

      {/* Children */}

      {!isMachine && open && (
        <div style={{ marginBottom: 4 }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   Main Department Page
========================================================= */

function Departments() {
  const [departments, setDepartments] =
    useState<Department[]>(loadData);

  const [modal, setModal] =
    useState<ModalState | null>(null);

  const [inputVal, setInputVal] =
    useState<string>("");

  const [search, setSearch] =
    useState<string>("");

  /* =====================================================
     Save Departments
  ===================================================== */

  useEffect(() => {
    saveData(departments);
  }, [departments]);

  /* =====================================================
     Stats
  ===================================================== */

  const totalDepts = departments.length;

  const totalSections = departments.reduce(
    (sum, department) =>
      sum + department.sections.length,
    0
  );

  const totalMachines = departments.reduce(
    (departmentSum, department) =>
      departmentSum +
      department.sections.reduce(
        (sectionSum, section) =>
          sectionSum +
          section.lines.reduce(
            (lineSum, line) =>
              lineSum +
              line.subsections.reduce(
                (subSectionSum, subsection) =>
                  subSectionSum +
                  subsection.machines.length,
                0
              ),
            0
          ),
        0
      ),
    0
  );

  /* =====================================================
     Modal
  ===================================================== */

  const openModal = (
    type: ModalType,
    context: ModalContext = {}
  ) => {
    setModal({
      type,
      context,
    });

    setInputVal("");
  };

  const closeModal = () => {
    setModal(null);
    setInputVal("");
  };

  /* =====================================================
     Add
  ===================================================== */

  const handleAdd = () => {
    if (!inputVal.trim() || !modal) {
      return;
    }

    const value = inputVal.trim();

    setDepartments((previous) => {
      const updated: Department[] =
        JSON.parse(JSON.stringify(previous));

      if (modal.type === "dept") {
        const newDepartment: Department = {
          id: genId(),
          name: value,
          sections: [],
        };

        updated.push(newDepartment);
      }

      else if (modal.type === "section") {
        const department = updated.find(
          (department) =>
            department.id === modal.context.deptId
        );

        if (department) {
          const newSection: Section = {
            id: genId(),
            name: value,
            lines: [],
          };

          department.sections.push(newSection);
        }
      }

      else if (modal.type === "line") {
        const department = updated.find(
          (department) =>
            department.id === modal.context.deptId
        );

        const section = department?.sections.find(
          (section) =>
            section.id === modal.context.sectionId
        );

        if (section) {
          const newLine: Line = {
            id: genId(),
            name: value,
            subsections: [],
          };

          section.lines.push(newLine);
        }
      }

      else if (modal.type === "subsection") {
        const department = updated.find(
          (department) =>
            department.id === modal.context.deptId
        );

        const section = department?.sections.find(
          (section) =>
            section.id === modal.context.sectionId
        );

        const line = section?.lines.find(
          (line) =>
            line.id === modal.context.lineId
        );

        if (line) {
          const newSubSection: SubSection = {
            id: genId(),
            name: value,
            machines: [],
          };

          line.subsections.push(newSubSection);
        }
      }

      else if (modal.type === "machine") {
        const department = updated.find(
          (department) =>
            department.id === modal.context.deptId
        );

        const section = department?.sections.find(
          (section) =>
            section.id === modal.context.sectionId
        );

        const line = section?.lines.find(
          (line) =>
            line.id === modal.context.lineId
        );

        const subsection =
          line?.subsections.find(
            (subsection) =>
              subsection.id ===
              modal.context.subsectionId
          );

        if (subsection) {
          const newMachine: Machine = {
            id: genId(),
            name: value,
          };

          subsection.machines.push(newMachine);
        }
      }

      return updated;
    });

    closeModal();
  };

  /* =====================================================
     Delete
  ===================================================== */

  const deleteDept = (deptId: string) => {
    setDepartments((previous) =>
      previous.filter(
        (department) => department.id !== deptId
      )
    );
  };

  const deleteSection = (
    deptId: string,
    sectionId: string
  ) => {
    setDepartments((previous) =>
      previous.map((department) =>
        department.id !== deptId
          ? department
          : {
              ...department,
              sections:
                department.sections.filter(
                  (section) =>
                    section.id !== sectionId
                ),
            }
      )
    );
  };

  const deleteLine = (
    deptId: string,
    sectionId: string,
    lineId: string
  ) => {
    setDepartments((previous) =>
      previous.map((department) =>
        department.id !== deptId
          ? department
          : {
              ...department,
              sections:
                department.sections.map(
                  (section) =>
                    section.id !== sectionId
                      ? section
                      : {
                          ...section,
                          lines:
                            section.lines.filter(
                              (line) =>
                                line.id !== lineId
                            ),
                        }
                ),
            }
      )
    );
  };

  const deleteSub = (
    deptId: string,
    sectionId: string,
    lineId: string,
    subsectionId: string
  ) => {
    setDepartments((previous) =>
      previous.map((department) =>
        department.id !== deptId
          ? department
          : {
              ...department,
              sections:
                department.sections.map(
                  (section) =>
                    section.id !== sectionId
                      ? section
                      : {
                          ...section,
                          lines:
                            section.lines.map(
                              (line) =>
                                line.id !== lineId
                                  ? line
                                  : {
                                      ...line,
                                      subsections:
                                        line.subsections.filter(
                                          (subsection) =>
                                            subsection.id !==
                                            subsectionId
                                        ),
                                    }
                            ),
                        }
                ),
            }
      )
    );
  };

  const deleteMachine = (
    deptId: string,
    sectionId: string,
    lineId: string,
    subsectionId: string,
    machineId: string
  ) => {
    setDepartments((previous) =>
      previous.map((department) =>
        department.id !== deptId
          ? department
          : {
              ...department,
              sections:
                department.sections.map(
                  (section) =>
                    section.id !== sectionId
                      ? section
                      : {
                          ...section,
                          lines:
                            section.lines.map(
                              (line) =>
                                line.id !== lineId
                                  ? line
                                  : {
                                      ...line,
                                      subsections:
                                        line.subsections.map(
                                          (subsection) =>
                                            subsection.id !==
                                            subsectionId
                                              ? subsection
                                              : {
                                                  ...subsection,
                                                  machines:
                                                    subsection.machines.filter(
                                                      (machine) =>
                                                        machine.id !==
                                                        machineId
                                                    ),
                                                }
                                        ),
                                    }
                            ),
                        }
                ),
            }
      )
    );
  };

  /* =====================================================
     Search
  ===================================================== */

  const filterTerm = search.toLowerCase();

  const visibleDepts = filterTerm
    ? departments.filter((department) =>
        department.name
          .toLowerCase()
          .includes(filterTerm) ||

        department.sections.some((section) =>
          section.name
            .toLowerCase()
            .includes(filterTerm) ||

          section.lines.some((line) =>
            line.name
              .toLowerCase()
              .includes(filterTerm) ||

            line.subsections.some(
              (subsection) =>
                subsection.name
                  .toLowerCase()
                  .includes(filterTerm) ||

                subsection.machines.some(
                  (machine) =>
                    machine.name
                      .toLowerCase()
                      .includes(filterTerm)
                )
            )
          )
        )
      )
    : departments;

  const meta = modal
    ? MODAL_META[modal.type]
    : null;

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">
          Departments
        </h4>

        <button
          type="button"
          className="btn text-white px-4 py-2 fw-semibold rounded-pill"
          style={{
            background:
              "linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)",
            border: "none",
            fontSize: "0.88rem",
          }}
          onClick={() => openModal("dept")}
        >
          + Add Department
        </button>
      </div>

      {/* Stats */}

      <div className="row g-3 mb-4">
        {[
          {
            label: "Total Departments",
            value: totalDepts,
            color: "#222",
          },
          {
            label: "Total Sections",
            value: totalSections,
            color: "#3e6db5",
          },
          {
            label: "Total Machines",
            value: totalMachines,
            color: "#e22b6e",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="col-md-4"
          >
            <div
              className="border rounded-3 p-3"
              style={{
                background: "#fafafa",
              }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#999",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {stat.label}
              </div>

              <div
                className="fw-bold mt-1"
                style={{
                  fontSize: "1.4rem",
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}

      <div
        className="d-flex align-items-center gap-3 mb-3 p-3 rounded-3"
        style={{
          background: "#f8f9fa",
          border: "1px solid #e9ecef",
        }}
      >
        <div
          className="input-group"
          style={{
            maxWidth: 320,
          }}
        >
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
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>

          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search departments, sections, machines..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              fontSize: "0.88rem",
            }}
          />
        </div>

        <small
          className="text-muted ms-auto"
          style={{
            fontSize: "0.78rem",
          }}
        >
          Click a row to expand and reveal its
          children
        </small>
      </div>

      {/* Legend */}

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        {Object.entries(LEVEL).map(
          ([key, level]) => (
            <span
              key={key}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: "0.72rem",
                color: "#666",
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: level.dot,
                  display: "inline-block",
                }}
              />

              {level.label}
            </span>
          )
        )}
      </div>

      {/* Tree */}

      <div style={{ minHeight: 80 }}>
        {visibleDepts.length === 0 ? (
          <div
            className="text-center py-5"
            style={{
              color: "#bbb",
              fontSize: "0.9rem",
            }}
          >
            {departments.length === 0
              ? 'No departments yet. Click "+ Add Department" to get started.'
              : "No results match your search."}
          </div>
        ) : (
          visibleDepts.map((department) => (
            <TreeRow
              key={department.id}
              type="dept"
              name={department.name}
              badge={`${department.sections.length} section${
                department.sections.length !== 1
                  ? "s"
                  : ""
              }`}
              onAdd={() =>
                openModal("section", {
                  deptId: department.id,
                })
              }
              addLabel="Add Section"
              onDelete={() =>
                deleteDept(department.id)
              }
              defaultOpen={!!filterTerm}
            >
              {department.sections.map(
                (section) => (
                  <TreeRow
                    key={section.id}
                    type="section"
                    name={section.name}
                    badge={`${section.lines.length} line${
                      section.lines.length !== 1
                        ? "s"
                        : ""
                    }`}
                    onAdd={() =>
                      openModal("line", {
                        deptId: department.id,
                        sectionId: section.id,
                      })
                    }
                    addLabel="Add Line"
                    onDelete={() =>
                      deleteSection(
                        department.id,
                        section.id
                      )
                    }
                    defaultOpen={!!filterTerm}
                  >
                    {section.lines.map(
                      (line) => (
                        <TreeRow
                          key={line.id}
                          type="line"
                          name={line.name}
                          badge={`${line.subsections.length} sub-section${
                            line.subsections.length !==
                            1
                              ? "s"
                              : ""
                          }`}
                          onAdd={() =>
                            openModal(
                              "subsection",
                              {
                                deptId:
                                  department.id,
                                sectionId:
                                  section.id,
                                lineId:
                                  line.id,
                              }
                            )
                          }
                          addLabel="Add Sub-section"
                          onDelete={() =>
                            deleteLine(
                              department.id,
                              section.id,
                              line.id
                            )
                          }
                          defaultOpen={!!filterTerm}
                        >
                          {line.subsections.map(
                            (subsection) => (
                              <TreeRow
                                key={subsection.id}
                                type="subsection"
                                name={
                                  subsection.name
                                }
                                badge={`${subsection.machines.length} machine${
                                  subsection.machines
                                    .length !== 1
                                    ? "s"
                                    : ""
                                }`}
                                onAdd={() =>
                                  openModal(
                                    "machine",
                                    {
                                      deptId:
                                        department.id,
                                      sectionId:
                                        section.id,
                                      lineId:
                                        line.id,
                                      subsectionId:
                                        subsection.id,
                                    }
                                  )
                                }
                                addLabel="Add Machine"
                                onDelete={() =>
                                  deleteSub(
                                    department.id,
                                    section.id,
                                    line.id,
                                    subsection.id
                                  )
                                }
                                defaultOpen={
                                  !!filterTerm
                                }
                              >
                                {subsection.machines.map(
                                  (machine) => (
                                    <TreeRow
                                      key={machine.id}
                                      type="machine"
                                      name={
                                        machine.name
                                      }
                                      onDelete={() =>
                                        deleteMachine(
                                          department.id,
                                          section.id,
                                          line.id,
                                          subsection.id,
                                          machine.id
                                        )
                                      }
                                    />
                                  )
                                )}
                              </TreeRow>
                            )
                          )}
                        </TreeRow>
                      )
                    )}
                  </TreeRow>
                )
              )}
            </TreeRow>
          ))
        )}
      </div>

      {/* Modal */}

      {modal && meta && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{
            background: "rgba(0,0,0,0.35)",
          }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-content border-0 shadow-lg rounded-4">

              {/* Header */}

              <div className="modal-header border-0 pb-1 pt-4 px-4">
                <div>
                  <h5
                    className="modal-title fw-bold mb-0"
                    style={{
                      color: "#1a1a2e",
                    }}
                  >
                    {meta.title}
                  </h5>

                  <small className="text-muted">
                    {modal.context.deptId &&
                    departments.find(
                      (department) =>
                        department.id ===
                        modal.context.deptId
                    )?.name
                      ? `Department: ${
                          departments.find(
                            (department) =>
                              department.id ===
                              modal.context.deptId
                          )?.name
                        }`
                      : "New top-level entry"}
                  </small>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>

              {/* Body */}

              <div className="modal-body px-4 py-3">
                <label
                  className="form-label fw-semibold"
                  style={{
                    fontSize: "0.82rem",
                    color: "#555",
                  }}
                >
                  {meta.label}
                </label>

                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder={meta.placeholder}
                  value={inputVal}
                  onChange={(e) =>
                    setInputVal(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAdd();
                    }
                  }}
                  autoFocus
                  style={{
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              {/* Footer */}

              <div className="modal-footer border-0 px-4 pb-4 pt-1 gap-2">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4"
                  style={{
                    fontSize: "0.88rem",
                  }}
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn text-white rounded-pill px-4 fw-semibold"
                  style={{
                    background:
                      "linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)",
                    border: "none",
                    fontSize: "0.88rem",
                  }}
                  onClick={handleAdd}
                  disabled={!inputVal.trim()}
                >
                  Add
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Departments;