import { useEffect, useState, type ChangeEvent } from 'react';
import type {
  Instructor,
  InstructorFormData,
  InstructorStatus,
  StatusFilter,
  StatusBadgeStyle,
} from '../models/instructor';

function InstructorManagement() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('All Status');

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [formData, setFormData] = useState<InstructorFormData>({
    id: null,
    name: '',
    instrId: '',
    email: '',
    specialization: '',
    courses: 0,
    status: 'ACTIVE',
  });

  const statuses: StatusFilter[] = [
    'All Status',
    'ACTIVE',
    'ON LEAVE',
    'INACTIVE',
  ];

  // =========================
  // Load instructors
  // =========================
  useEffect(() => {
    const savedInstructors = localStorage.getItem(
      'instructorManagementInstructors'
    );

    if (savedInstructors) {
      try {
        const parsedInstructors: Instructor[] =
          JSON.parse(savedInstructors);

        setInstructors(parsedInstructors);
      } catch (error) {
        console.error(
          'Failed to parse instructors from localStorage:',
          error
        );
      }
    } else {
      const defaultInstructors: Instructor[] = [
        {
          id: 1,
          name: 'Dr. Ananya Krishnan',
          instrId: 'INS-301',
          email: 'ananya.k@asti.in',
          specialization: 'Mechanical Engineering',
          courses: 4,
          status: 'ACTIVE',
        },
        {
          id: 2,
          name: 'Prof. Manoj Tiwari',
          instrId: 'INS-302',
          email: null,
          specialization: 'Quality Control',
          courses: 2,
          status: 'ACTIVE',
        },
        {
          id: 3,
          name: 'Ms. Divya Pillai',
          instrId: 'INS-303',
          email: 'divya.p@asti.in',
          specialization: 'Safety Procedures',
          courses: 3,
          status: 'ON LEAVE',
        },
      ];

      setInstructors(defaultInstructors);

      localStorage.setItem(
        'instructorManagementInstructors',
        JSON.stringify(defaultInstructors)
      );
    }
  }, []);

  // =========================
  // Save instructors
  // =========================
  const saveInstructorsToLocal = (
    updatedInstructors: Instructor[]
  ): void => {
    setInstructors(updatedInstructors);

    localStorage.setItem(
      'instructorManagementInstructors',
      JSON.stringify(updatedInstructors)
    );
  };

  // =========================
  // Status badge style
  // =========================
  const statusStyle = (
    status: InstructorStatus
  ): StatusBadgeStyle => {
    const styles: Record<
      InstructorStatus,
      StatusBadgeStyle
    > = {
      ACTIVE: {
        bg: '#e6f4ea',
        color: '#2e7d32',
      },

      'ON LEAVE': {
        bg: '#fff8e1',
        color: '#f57f17',
      },

      INACTIVE: {
        bg: '#fce4ec',
        color: '#c62828',
      },
    };

    return styles[status];
  };

  // =========================
  // Filtering
  // =========================
  const filtered: Instructor[] = instructors.filter(
    (instructor) => {
      const searchValue = search.toLowerCase();

      const matchSearch =
        instructor.name
          .toLowerCase()
          .includes(searchValue) ||
        instructor.instrId
          .toLowerCase()
          .includes(searchValue);

      const matchStatus =
        statusFilter === 'All Status' ||
        instructor.status === statusFilter;

      return matchSearch && matchStatus;
    }
  );

  // =========================
  // Statistics
  // =========================
  const activeCount: number = instructors.filter(
    (instructor) => instructor.status === 'ACTIVE'
  ).length;

  const totalCourses: number = instructors.reduce(
    (sum, instructor) => sum + instructor.courses,
    0
  );

  // =========================
  // Input change
  // =========================
  const handleInputChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;

    if (name === 'courses') {
      setFormData((prev) => ({
        ...prev,
        courses: Number(value),
      }));

      return;
    }

    if (name === 'status') {
      setFormData((prev) => ({
        ...prev,
        status: value as InstructorStatus,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Add instructor
  // =========================
  const handleAddInstructor = (): void => {
    const newInstrId = generateInstrId();

    setFormData({
      id: null,
      name: '',
      instrId: newInstrId,
      email: '',
      specialization: '',
      courses: 0,
      status: 'ACTIVE',
    });

    setIsEditing(false);
    setShowModal(true);
  };

  // =========================
  // Edit instructor
  // =========================
  const handleEditInstructor = (
    instructor: Instructor
  ): void => {
    setFormData({
      id: instructor.id,
      name: instructor.name,
      instrId: instructor.instrId,
      email: instructor.email ?? '',
      specialization: instructor.specialization,
      courses: instructor.courses,
      status: instructor.status,
    });

    setIsEditing(true);
    setShowModal(true);
  };

  // =========================
  // Delete instructor
  // =========================
  const handleDeleteInstructor = (
    id: number
  ): void => {
    if (
      window.confirm(
        'Are you sure you want to delete this instructor?'
      )
    ) {
      const updatedInstructors = instructors.filter(
        (instructor) => instructor.id !== id
      );

      saveInstructorsToLocal(updatedInstructors);
    }
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = (): void => {
    if (
      !formData.name ||
      !formData.instrId ||
      !formData.specialization ||
      !formData.status
    ) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.courses < 0) {
      alert('Number of courses cannot be negative');
      return;
    }

    const isDuplicate = instructors.some(
      (instructor) =>
        instructor.instrId.toLowerCase() ===
          formData.instrId.toLowerCase() &&
        (isEditing
          ? instructor.id !== formData.id
          : true)
    );

    if (isDuplicate) {
      alert(
        'Instructor ID already exists. Please use a unique ID.'
      );
      return;
    }

    if (isEditing && formData.id !== null) {
      const updatedInstructors = instructors.map(
        (instructor) =>
          instructor.id === formData.id
            ? {
                ...formData,
                id: formData.id,
                email: formData.email || null,
              }
            : instructor
      );

      saveInstructorsToLocal(updatedInstructors);
    } else {
      const newInstructor: Instructor = {
        id: Date.now(),
        name: formData.name,
        instrId: formData.instrId,
        email: formData.email || null,
        specialization: formData.specialization,
        courses: formData.courses,
        status: formData.status,
      };

      saveInstructorsToLocal([
        ...instructors,
        newInstructor,
      ]);
    }

    setShowModal(false);
  };

  // =========================
  // Generate instructor ID
  // =========================
  const generateInstrId = (): string => {
    const lastIns =
      instructors.length > 0
        ? instructors.reduce((max, instructor) => {
            const parts = instructor.instrId.split('-');
            const num = Number(parts[1]);

            return !Number.isNaN(num) && num > max
              ? num
              : max;
          }, 300)
        : 300;

    return `INS-${lastIns + 1}`;
  };

  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">
          Instructor Management
        </h4>

        <button
          className="btn text-white px-4 py-2 fw-semibold rounded-pill"
          style={{
            background:
              'linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)',
            border: 'none',
            fontSize: '0.88rem',
          }}
          onClick={handleAddInstructor}
        >
          + Add Instructor
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          {
            label: 'Total Instructors',
            value: instructors.length,
            color: '#222',
          },
          {
            label: 'Active Instructors',
            value: `${activeCount} Active`,
            color: '#3e6db5',
          },
          {
            label: 'Courses Assigned',
            value: `${totalCourses} Courses`,
            color: '#e22b6e',
          },
        ].map((stat, index) => (
          <div key={index} className="col-md-4">
            <div
              className="border rounded-3 p-3"
              style={{ background: '#fafafa' }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {stat.label}
              </div>

              <div
                className="fw-bold mt-1"
                style={{
                  fontSize: '1.4rem',
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div
        className="d-flex align-items-center gap-3 mb-4 flex-wrap p-3 rounded-3"
        style={{
          background: '#f8f9fa',
          border: '1px solid #e9ecef',
        }}
      >
        <div
          className="input-group"
          style={{ maxWidth: 280 }}
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
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{ fontSize: '0.88rem' }}
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#555',
            }}
          >
            STATUS:
          </span>

          <select
            className="form-select form-select-sm"
            style={{
              width: 140,
              fontSize: '0.85rem',
            }}
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as StatusFilter
              )
            }
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table
          className="table table-hover align-middle mb-0"
          style={{ fontSize: '0.88rem' }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '2px solid #f0f0f0',
              }}
            >
              {[
                'Instructor Name',
                'Instructor ID',
                'Email Address',
                'Specialization',
                'Courses',
                'Status',
                'Actions',
              ].map((heading, index) => (
                <th
                  key={index}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#aaa',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    paddingBottom: 10,
                    border: 'none',
                    textAlign:
                      index === 6 ? 'right' : 'left',
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((instructor) => {
              const badge = statusStyle(
                instructor.status
              );

              return (
                <tr
                  key={instructor.id}
                  style={{
                    borderBottom:
                      '1px solid #f5f5f5',
                  }}
                >
                  <td className="fw-semibold">
                    {instructor.name}
                  </td>

                  <td className="text-muted">
                    {instructor.instrId}
                  </td>

                  <td
                    style={{
                      color: instructor.email
                        ? '#444'
                        : '#bbb',
                      fontStyle: instructor.email
                        ? 'normal'
                        : 'italic',
                    }}
                  >
                    {instructor.email || 'NULL'}
                  </td>

                  <td>
                    {instructor.specialization}
                  </td>

                  <td>
                    <span
                      className="fw-semibold"
                      style={{ color: '#3e6db5' }}
                    >
                      {instructor.courses}
                    </span>
                  </td>

                  <td>
                    <span
                      className="px-2 py-1 rounded-2 fw-bold"
                      style={{
                        fontSize: '0.72rem',
                        background: badge.bg,
                        color: badge.color,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {instructor.status}
                    </span>
                  </td>

                  <td className="text-end">
                    {/* Edit */}
                    <button
                      className="btn btn-sm btn-link p-1 me-1"
                      title="Edit"
                      onClick={() =>
                        handleEditInstructor(
                          instructor
                        )
                      }
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

                    {/* Delete */}
                    <button
                      className="btn btn-sm btn-link p-1"
                      title="Delete"
                      onClick={() =>
                        handleDeleteInstructor(
                          instructor.id
                        )
                      }
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
          <div className="text-center py-5 text-muted">
            No records found.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div
            className="modal fade show d-block"
            tabIndex={-1}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">

                {/* Modal Header */}
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing
                      ? 'Edit Instructor'
                      : 'Add New Instructor'}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setShowModal(false)
                    }
                  ></button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">

                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label">
                      Instructor Name{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter instructor name"
                      required
                    />
                  </div>

                  {/* Instructor ID */}
                  <div className="mb-3">
                    <label className="form-label">
                      Instructor ID{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="instrId"
                      value={formData.instrId}
                      onChange={handleInputChange}
                      placeholder="Enter instructor ID"
                      required
                      readOnly={
                        !isEditing &&
                        formData.instrId !== ''
                      }
                    />

                    <small className="text-muted">
                      Must be unique (auto-generated for
                      new instructors)
                    </small>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Specialization */}
                  <div className="mb-3">
                    <label className="form-label">
                      Specialization{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="specialization"
                      value={
                        formData.specialization
                      }
                      onChange={handleInputChange}
                      placeholder="Enter specialization"
                      required
                    />
                  </div>

                  {/* Courses */}
                  <div className="mb-3">
                    <label className="form-label">
                      Number of Courses
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="courses"
                      value={formData.courses}
                      onChange={handleInputChange}
                      placeholder="Enter number of courses"
                      min="0"
                    />
                  </div>

                  {/* Status */}
                  <div className="mb-3">
                    <label className="form-label">
                      Status{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="ACTIVE">
                        ACTIVE
                      </option>

                      <option value="ON LEAVE">
                        ON LEAVE
                      </option>

                      <option value="INACTIVE">
                        INACTIVE
                      </option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill"
                    onClick={() =>
                      setShowModal(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn text-white rounded-pill"
                    onClick={handleSubmit}
                    style={{
                      background:
                        'linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)',
                      border: 'none',
                    }}
                  >
                    {isEditing
                      ? 'Update Instructor'
                      : 'Add Instructor'}
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

export default InstructorManagement;