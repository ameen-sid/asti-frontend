import { useEffect, useState } from 'react';
import type {
  Employee,
  EmployeeFormData,
  EmployeeStatus,
  Department,
  DepartmentFilter,
  StatusFilter,
  StatusBadgeStyle,
} from '../models/employeeManagement';

function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState<string>('');
  const [deptFilter, setDeptFilter] =
    useState<DepartmentFilter>('All Departments');
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('All Status');

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [formData, setFormData] = useState<EmployeeFormData>({
    id: null,
    name: '',
    empId: '',
    email: '',
    designation: '',
    department: '',
    status: 'ACTIVE',
  });

  const departments: DepartmentFilter[] = [
    'All Departments',
    'Production',
    'Quality',
    'Engineering',
    'HR',
    'Finance',
    'IT',
    'Marketing',
  ];

  const statuses: StatusFilter[] = [
    'All Status',
    'ACTIVE',
    'INACTIVE',
  ];

  // ----------------------------------------
  // Load employees from local storage
  // ----------------------------------------

  useEffect(() => {
    const savedEmployees = localStorage.getItem(
      'employeeManagementEmployees'
    );

    if (savedEmployees) {
      try {
        const parsedEmployees: Employee[] = JSON.parse(savedEmployees);
        setEmployees(parsedEmployees);
      } catch (error) {
        console.error('Failed to parse employees:', error);
      }
    } else {
      const defaultEmployees: Employee[] = [
        {
          id: 1,
          name: 'Suresh Nair',
          empId: 'EMP-1021',
          email: 'suresh.nair@asti.in',
          designation: 'Machine Operator',
          department: 'Production',
          status: 'ACTIVE',
        },
        {
          id: 2,
          name: 'Kavita Rao',
          empId: 'EMP-1045',
          email: 'kavita.rao@asti.in',
          designation: 'Quality Analyst',
          department: 'Quality',
          status: 'ACTIVE',
        },
        {
          id: 3,
          name: 'Deepak Singh',
          empId: 'EMP-1063',
          email: null,
          designation: 'Maintenance Tech',
          department: 'Engineering',
          status: 'INACTIVE',
        },
      ];

      setEmployees(defaultEmployees);

      localStorage.setItem(
        'employeeManagementEmployees',
        JSON.stringify(defaultEmployees)
      );
    }
  }, []);

  // ----------------------------------------
  // Save employees
  // ----------------------------------------

  const saveEmployeesToLocal = (
    updatedEmployees: Employee[]
  ): void => {
    setEmployees(updatedEmployees);

    localStorage.setItem(
      'employeeManagementEmployees',
      JSON.stringify(updatedEmployees)
    );
  };

  // ----------------------------------------
  // Status badge
  // ----------------------------------------

  const statusStyle = (
    status: EmployeeStatus
  ): StatusBadgeStyle => {
    const styles: Record<EmployeeStatus, StatusBadgeStyle> = {
      ACTIVE: {
        bg: '#e6f4ea',
        color: '#2e7d32',
      },

      INACTIVE: {
        bg: '#fce4ec',
        color: '#c62828',
      },
    };

    return styles[status];
  };

  // ----------------------------------------
  // Filter employees
  // ----------------------------------------

  const filtered: Employee[] = employees.filter(
    (employee: Employee) => {
      const searchValue = search.toLowerCase();

      const matchSearch =
        employee.name.toLowerCase().includes(searchValue) ||
        employee.empId.toLowerCase().includes(searchValue);

      const matchDept =
        deptFilter === 'All Departments' ||
        employee.department === deptFilter;

      const matchStatus =
        statusFilter === 'All Status' ||
        employee.status === statusFilter;

      return matchSearch && matchDept && matchStatus;
    }
  );

  // ----------------------------------------
  // Stats
  // ----------------------------------------

  const activeCount: number = employees.filter(
    (employee) => employee.status === 'ACTIVE'
  ).length;

  const deptCount: number = new Set(
    employees.map((employee) => employee.department)
  ).size;

  // ----------------------------------------
  // Input change
  // ----------------------------------------

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ----------------------------------------
  // Generate Employee ID
  // ----------------------------------------

  const generateEmpId = (): string => {
    const lastEmpNumber: number =
      employees.length > 0
        ? employees.reduce((max, employee) => {
            const parts = employee.empId.split('-');
            const number = Number(parts[1]);

            return Number.isNaN(number)
              ? max
              : Math.max(max, number);
          }, 1020)
        : 1020;

    return `EMP-${lastEmpNumber + 1}`;
  };

  // ----------------------------------------
  // Add employee
  // ----------------------------------------

  const handleAddEmployee = (): void => {
    const newEmpId = generateEmpId();

    setFormData({
      id: null,
      name: '',
      empId: newEmpId,
      email: '',
      designation: '',
      department: '',
      status: 'ACTIVE',
    });

    setIsEditing(false);
    setShowModal(true);
  };

  // ----------------------------------------
  // Edit employee
  // ----------------------------------------

  const handleEditEmployee = (
    employee: Employee
  ): void => {
    setFormData({
      id: employee.id,
      name: employee.name,
      empId: employee.empId,
      email: employee.email ?? '',
      designation: employee.designation,
      department: employee.department,
      status: employee.status,
    });

    setIsEditing(true);
    setShowModal(true);
  };

  // ----------------------------------------
  // Delete employee
  // ----------------------------------------

  const handleDeleteEmployee = (
    id: number
  ): void => {
    if (
      window.confirm(
        'Are you sure you want to delete this employee?'
      )
    ) {
      const updatedEmployees = employees.filter(
        (employee) => employee.id !== id
      );

      saveEmployeesToLocal(updatedEmployees);
    }
  };

  // ----------------------------------------
  // Submit
  // ----------------------------------------

  const handleSubmit = (): void => {
    if (
      !formData.name.trim() ||
      !formData.empId.trim() ||
      !formData.designation.trim() ||
      !formData.department ||
      !formData.status
    ) {
      alert('Please fill in all required fields');
      return;
    }

    // Check duplicate Employee ID
    const isDuplicate = employees.some(
      (employee) =>
        employee.empId.toLowerCase() ===
          formData.empId.toLowerCase() &&
        (isEditing
          ? employee.id !== formData.id
          : true)
    );

    if (isDuplicate) {
      alert(
        'Employee ID already exists. Please use a unique Employee ID.'
      );
      return;
    }

    if (isEditing && formData.id !== null) {
      // Update employee
      const updatedEmployees: Employee[] =
        employees.map((employee) =>
          employee.id === formData.id
            ? {
                id: formData.id,
                name: formData.name.trim(),
                empId: formData.empId.trim(),
                email: formData.email.trim() || null,
                designation:
                  formData.designation.trim(),
                department:
                  formData.department as Department,
                status: formData.status,
              }
            : employee
        );

      saveEmployeesToLocal(updatedEmployees);
    } else {
      // Add employee
      const newEmployee: Employee = {
        id: Date.now(),
        name: formData.name.trim(),
        empId: formData.empId.trim(),
        email: formData.email.trim() || null,
        designation: formData.designation.trim(),
        department:
          formData.department as Department,
        status: formData.status,
      };

      saveEmployeesToLocal([
        ...employees,
        newEmployee,
      ]);
    }

    setShowModal(false);
  };

  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">
          Employee Management
        </h4>

        <button
          className="btn text-white px-4 py-2 fw-semibold rounded-pill"
          style={{
            background:
              'linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)',
            border: 'none',
            fontSize: '0.88rem',
          }}
          onClick={handleAddEmployee}
        >
          + Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          {
            label: 'Total Employees',
            value: employees.length,
            color: '#222',
          },
          {
            label: 'Active Employees',
            value: `${activeCount} Active`,
            color: '#2e7d32',
          },
          {
            label: 'Departments',
            value: `${deptCount} Depts`,
            color: '#3e6db5',
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="col-md-4"
          >
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

      {/* Filters */}
      <div
        className="d-flex align-items-center gap-3 mb-4 flex-wrap p-3 rounded-3"
        style={{
          background: '#f8f9fa',
          border: '1px solid #e9ecef',
        }}
      >
        {/* Search */}
        <div
          className="input-group"
          style={{ maxWidth: 260 }}
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
              <circle
                cx="11"
                cy="11"
                r="8"
              />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>

          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search by name, employee ID..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{ fontSize: '0.88rem' }}
          />
        </div>

        {/* Department */}
        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#555',
            }}
          >
            DEPT:
          </span>

          <select
            className="form-select form-select-sm"
            style={{
              width: 160,
              fontSize: '0.85rem',
            }}
            value={deptFilter}
            onChange={(e) =>
              setDeptFilter(
                e.target.value as DepartmentFilter
              )
            }
          >
            {departments.map((department) => (
              <option
                key={department}
                value={department}
              >
                {department}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
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
              width: 130,
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
              <option
                key={status}
                value={status}
              >
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
                'Employee Name',
                'Employee ID',
                'Email Address',
                'Designation',
                'Department',
                'Status',
                'Actions',
              ].map((heading, index) => (
                <th
                  key={heading}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#aaa',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    paddingBottom: 10,
                    border: 'none',
                    textAlign:
                      index === 6
                        ? 'right'
                        : 'left',
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((employee) => {
              const badge = statusStyle(
                employee.status
              );

              return (
                <tr
                  key={employee.id}
                  style={{
                    borderBottom:
                      '1px solid #f5f5f5',
                  }}
                >
                  <td className="fw-semibold">
                    {employee.name}
                  </td>

                  <td className="text-muted">
                    {employee.empId}
                  </td>

                  <td
                    style={{
                      color: employee.email
                        ? '#444'
                        : '#bbb',
                      fontStyle: employee.email
                        ? 'normal'
                        : 'italic',
                    }}
                  >
                    {employee.email || 'NULL'}
                  </td>

                  <td>
                    {employee.designation}
                  </td>

                  <td className="text-muted">
                    {employee.department}
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
                      {employee.status}
                    </span>
                  </td>

                  <td className="text-end">
                    {/* Edit */}
                    <button
                      className="btn btn-sm btn-link p-1 me-1"
                      title="Edit"
                      onClick={() =>
                        handleEditEmployee(employee)
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
                        handleDeleteEmployee(
                          employee.id
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
                      ? 'Edit Employee'
                      : 'Add New Employee'}
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

                  {/* Employee Name */}
                  <div className="mb-3">
                    <label className="form-label">
                      Employee Name{' '}
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
                      placeholder="Enter employee name"
                      required
                    />
                  </div>

                  {/* Employee ID */}
                  <div className="mb-3">
                    <label className="form-label">
                      Employee ID{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="empId"
                      value={formData.empId}
                      onChange={handleInputChange}
                      placeholder="Enter employee ID"
                      required
                      readOnly={
                        !isEditing &&
                        formData.empId !== ''
                      }
                    />

                    <small className="text-muted">
                      Must be unique (auto-generated
                      for new employees)
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

                  {/* Designation */}
                  <div className="mb-3">
                    <label className="form-label">
                      Designation{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="Enter designation"
                      required
                    />
                  </div>

                  {/* Department */}
                  <div className="mb-3">
                    <label className="form-label">
                      Department{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <select
                      className="form-select"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">
                        Select Department
                      </option>

                      {departments
                        .filter(
                          (
                            department
                          ): department is Department =>
                            department !==
                            'All Departments'
                        )
                        .map((department) => (
                          <option
                            key={department}
                            value={department}
                          >
                            {department}
                          </option>
                        ))}
                    </select>
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
                      ? 'Update Employee'
                      : 'Add Employee'}
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

export default EmployeeManagement;