export type UserRole =
  | "ADMIN"
  | "INSTRUCTOR"
  | "OPERATOR"
  | "MANAGER";

export type Department =
  | "Operations"
  | "Training"
  | "Production"
  | "HR"
  | "Finance"
  | "IT";

export type RoleFilter = "All Roles" | UserRole;

export type DepartmentFilter = "All Departments" | Department;

export interface User {
  id: number;
  name: string;
  username: string;
  email: string | null;
  role: UserRole;
  department: Department;
}

export interface UserFormData {
  id: number | null;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  department: Department | "";
}

export interface RoleBadgeStyle {
  bg: string;
  color: string;
}

export interface StatsCard {
  label: string;
  value: string | number;
  color: string;
}