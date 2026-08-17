import { useEffect, useState } from "react";

import type { ShiftFilter, OperatorData, CertFilter,ShiftStyle,Shift } from "../models/operator";
const machines = [
  "CNC Lathe M-01",
  "CNC Lathe M-02",
  "Press Brake P-03",
  "Press Brake P-04",
  "Welding Station W-02",
  "Welding Station W-03",
  "Milling Machine MM-05",
  "Grinding Machine GM-06",
];

const shifts: ShiftFilter[] = ["All Shifts", "Morning", "Evening", "Night"];

const certs: CertFilter[] = ["All", "Certified", "Not Certified"];

const emptyForm: OperatorData = {
  id: null,
  name: "",
  opId: "",
  email: "",
  machine: "",
  shift: "Morning",
  certified: false,
};

function Operator() {
  const [operators, setOperators] = useState<OperatorData[]>([]);
  const [search, setSearch] = useState<string>("");
  const [shiftFilter, setShiftFilter] = useState<ShiftFilter>("All Shifts");
  const [certFilter, setCertFilter] = useState<CertFilter>("All");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [formData, setFormData] = useState<OperatorData>(emptyForm);

  // --------------------------------------------------
  // Load operators from localStorage
  // --------------------------------------------------

  useEffect(() => {
    const savedOperators = localStorage.getItem("operatorManagementOperators");

    if (savedOperators) {
      try {
        const parsedOperators: OperatorData[] = JSON.parse(savedOperators);

        setOperators(parsedOperators);
      } catch (error) {
        console.error("Failed to parse operators from localStorage:", error);
      }
    } else {
      const defaultOperators: OperatorData[] = [
        {
          id: 1,
          name: "Rajesh Patil",
          opId: "OPR-501",
          email: "rajesh.p@asti.in",
          machine: "CNC Lathe M-01",
          shift: "Morning",
          certified: true,
        },
        {
          id: 2,
          name: "Sunita Joshi",
          opId: "OPR-502",
          email: null,
          machine: "Press Brake P-03",
          shift: "Evening",
          certified: false,
        },
        {
          id: 3,
          name: "Mohit Verma",
          opId: "OPR-503",
          email: "mohit.v@asti.in",
          machine: "Welding Station W-02",
          shift: "Night",
          certified: true,
        },
      ];

      setOperators(defaultOperators);

      localStorage.setItem(
        "operatorManagementOperators",
        JSON.stringify(defaultOperators),
      );
    }
  }, []);

  // --------------------------------------------------
  // Save operators
  // --------------------------------------------------

  const saveOperatorsToLocal = (updatedOperators: OperatorData[]): void => {
    setOperators(updatedOperators);

    localStorage.setItem(
      "operatorManagementOperators",
      JSON.stringify(updatedOperators),
    );
  };

  // --------------------------------------------------
  // Shift badge style
  // --------------------------------------------------

  const shiftStyle = (shift: Shift): ShiftStyle => {
    const styles: Record<Shift, ShiftStyle> = {
      Morning: {
        bg: "#fffde7",
        color: "#f9a825",
      },
      Evening: {
        bg: "#e8eaf6",
        color: "#3949ab",
      },
      Night: {
        bg: "#fce4ec",
        color: "#c62828",
      },
    };

    return styles[shift];
  };

  // --------------------------------------------------
  // Filtering
  // --------------------------------------------------

  const filtered = operators.filter((op) => {
    const searchValue = search.toLowerCase();

    const matchSearch =
      op.name.toLowerCase().includes(searchValue) ||
      op.opId.toLowerCase().includes(searchValue);

    const matchShift = shiftFilter === "All Shifts" || op.shift === shiftFilter;

    const matchCert =
      certFilter === "All" ||
      (certFilter === "Certified" && op.certified) ||
      (certFilter === "Not Certified" && !op.certified);

    return matchSearch && matchShift && matchCert;
  });

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const certifiedCount = operators.filter(
    (operator) => operator.certified,
  ).length;

  const pendingCount = operators.length - certifiedCount;

  // --------------------------------------------------
  // Input handler
  // --------------------------------------------------

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;

      setFormData((previous) => ({
        ...previous,
        [name]: checked,
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Generate Operator ID
  // --------------------------------------------------

  const generateOpId = (): string => {
    const lastOp =
      operators.length > 0
        ? operators.reduce((max, operator) => {
            const parts = operator.opId.split("-");
            const num = parseInt(parts[1] || "0", 10);

            return num > max ? num : max;
          }, 500)
        : 500;

    return `OPR-${lastOp + 1}`;
  };

  // --------------------------------------------------
  // Add operator
  // --------------------------------------------------

  const handleAddOperator = (): void => {
    setFormData({
      ...emptyForm,
      opId: generateOpId(),
    });

    setIsEditing(false);
    setShowModal(true);
  };

  // --------------------------------------------------
  // Edit operator
  // --------------------------------------------------

  const handleEditOperator = (operator: OperatorData): void => {
    setFormData(operator);
    setIsEditing(true);
    setShowModal(true);
  };

  // --------------------------------------------------
  // Delete operator
  // --------------------------------------------------

  const handleDeleteOperator = (id: number | null): void => {
    if (id === null) return;

    if (window.confirm("Are you sure you want to delete this operator?")) {
      const updatedOperators = operators.filter(
        (operator) => operator.id !== id,
      );

      saveOperatorsToLocal(updatedOperators);
    }
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = (): void => {
    if (
      !formData.name ||
      !formData.opId ||
      !formData.machine ||
      !formData.shift
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const isDuplicate = operators.some(
      (operator) =>
        operator.opId.toLowerCase() === formData.opId.toLowerCase() &&
        (isEditing ? operator.id !== formData.id : true),
    );

    if (isDuplicate) {
      alert("Operator ID already exists. Please use a unique ID.");
      return;
    }

    if (isEditing) {
      const updatedOperators = operators.map((operator) =>
        operator.id === formData.id ? formData : operator,
      );

      saveOperatorsToLocal(updatedOperators);
    } else {
      const newOperator: OperatorData = {
        ...formData,
        id: Date.now(),
      };

      saveOperatorsToLocal([...operators, newOperator]);
    }

    setShowModal(false);
  };

  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Operator Management</h4>

        <button
          className="btn text-white px-4 py-2 fw-semibold rounded-pill"
          style={{
            background: "linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)",
            border: "none",
            fontSize: "0.88rem",
          }}
          onClick={handleAddOperator}
        >
          + Add Operator
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Total Operators",
            value: operators.length,
            color: "#222",
          },
          {
            label: "Certified Operators",
            value: `${certifiedCount} Certified`,
            color: "#2e7d32",
          },
          {
            label: "Pending Certification",
            value: `${pendingCount} Pending`,
            color: "#e22b6e",
          },
        ].map((stat, index) => (
          <div key={index} className="col-md-4">
            <div
              className="border rounded-3 p-3"
              style={{ background: "#fafafa" }}
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

      {/* Filters */}
      <div
        className="d-flex align-items-center gap-3 mb-4 flex-wrap p-3 rounded-3"
        style={{
          background: "#f8f9fa",
          border: "1px solid #e9ecef",
        }}
      >
        <div className="input-group" style={{ maxWidth: 280 }}>
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
            placeholder="Search by name or operator ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: "0.88rem" }}
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#555",
            }}
          >
            SHIFT:
          </span>

          <select
            className="form-select form-select-sm"
            style={{
              width: 140,
              fontSize: "0.85rem",
            }}
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value as ShiftFilter)}
          >
            {shifts.map((shift) => (
              <option key={shift} value={shift}>
                {shift}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#555",
            }}
          >
            CERT:
          </span>

          <select
            className="form-select form-select-sm"
            style={{
              width: 150,
              fontSize: "0.85rem",
            }}
            value={certFilter}
            onChange={(e) => setCertFilter(e.target.value as CertFilter)}
          >
            {certs.map((cert) => (
              <option key={cert} value={cert}>
                {cert}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table
          className="table table-hover align-middle mb-0"
          style={{ fontSize: "0.88rem" }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "2px solid #f0f0f0",
              }}
            >
              {[
                "Operator Name",
                "Operator ID",
                "Email Address",
                "Assigned Machine",
                "Shift",
                "Certification",
                "Actions",
              ].map((heading, index) => (
                <th
                  key={index}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#aaa",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    paddingBottom: 10,
                    border: "none",
                    textAlign: index === 6 ? "right" : "left",
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((operator) => {
              const shiftBadge = shiftStyle(operator.shift);

              return (
                <tr
                  key={operator.id}
                  style={{
                    borderBottom: "1px solid #f5f5f5",
                  }}
                >
                  <td className="fw-semibold">{operator.name}</td>

                  <td className="text-muted">{operator.opId}</td>

                  <td
                    style={{
                      color: operator.email ? "#444" : "#bbb",
                      fontStyle: operator.email ? "normal" : "italic",
                    }}
                  >
                    {operator.email || "NULL"}
                  </td>

                  <td>{operator.machine}</td>

                  <td>
                    <span
                      className="px-2 py-1 rounded-2 fw-bold"
                      style={{
                        fontSize: "0.72rem",
                        background: shiftBadge.bg,
                        color: shiftBadge.color,
                      }}
                    >
                      {operator.shift}
                    </span>
                  </td>

                  <td>
                    {operator.certified ? (
                      <span
                        className="px-2 py-1 rounded-2 fw-bold"
                        style={{
                          fontSize: "0.72rem",
                          background: "#e6f4ea",
                          color: "#2e7d32",
                        }}
                      >
                        ✓ CERTIFIED
                      </span>
                    ) : (
                      <span
                        className="px-2 py-1 rounded-2 fw-bold"
                        style={{
                          fontSize: "0.72rem",
                          background: "#fce4ec",
                          color: "#c62828",
                        }}
                      >
                        ✗ PENDING
                      </span>
                    )}
                  </td>

                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-link p-1 me-1"
                      title="Edit"
                      onClick={() => handleEditOperator(operator)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#555"
                        strokeWidth="2"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>

                    <button
                      className="btn btn-sm btn-link p-1"
                      title="Delete"
                      onClick={() => handleDeleteOperator(operator.id)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#e22b6e"
                        strokeWidth="2"
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

        {filtered.length === 0 && (
          <div className="text-center py-5 text-muted">No records found.</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing ? "Edit Operator" : "Add New Operator"}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  {/* Operator Name */}
                  <div className="mb-3">
                    <label className="form-label">
                      Operator Name <span className="text-danger">*</span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter operator name"
                      required
                    />
                  </div>

                  {/* Operator ID */}
                  <div className="mb-3">
                    <label className="form-label">
                      Operator ID <span className="text-danger">*</span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="opId"
                      value={formData.opId}
                      onChange={handleInputChange}
                      placeholder="Enter operator ID"
                      required
                      readOnly={!isEditing && formData.opId !== ""}
                    />

                    <small className="text-muted">
                      Must be unique (auto-generated for new operators)
                    </small>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>

                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Machine */}
                  <div className="mb-3">
                    <label className="form-label">
                      Assigned Machine <span className="text-danger">*</span>
                    </label>

                    <select
                      className="form-select"
                      name="machine"
                      value={formData.machine}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Machine</option>

                      {machines.map((machine) => (
                        <option key={machine} value={machine}>
                          {machine}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Shift */}
                  <div className="mb-3">
                    <label className="form-label">
                      Shift <span className="text-danger">*</span>
                    </label>

                    <select
                      className="form-select"
                      name="shift"
                      value={formData.shift}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>

                  {/* Certification */}
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="certified"
                        name="certified"
                        checked={formData.certified}
                        onChange={handleInputChange}
                      />

                      <label className="form-check-label" htmlFor="certified">
                        Certified Operator
                      </label>
                    </div>

                    <small className="text-muted">
                      Check if the operator is certified
                    </small>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn text-white rounded-pill"
                    onClick={handleSubmit}
                    style={{
                      background:
                        "linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)",
                      border: "none",
                    }}
                  >
                    {isEditing ? "Update Operator" : "Add Operator"}
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

export default Operator;
