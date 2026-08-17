export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export type Department =
  | 'Production'
  | 'Quality'
  | 'Engineering'
  | 'HR'
  | 'Finance'
  | 'IT'
  | 'Marketing';

export type DepartmentFilter = 'All Departments' | Department;

export type StatusFilter = 'All Status' | EmployeeStatus;

export interface Employee {
  id: number;
  name: string;
  empId: string;
  email: string | null;
  designation: string;
  department: Department;
  status: EmployeeStatus;
}

export interface EmployeeFormData {
  id: number | null;
  name: string;
  empId: string;
  email: string;
  designation: string;
  department: Department | '';
  status: EmployeeStatus;
}

export interface StatusBadgeStyle {
  bg: string;
  color: string;
}