export type MonthKey =
  | "jan"
  | "feb"
  | "mar"
  | "apr"
  | "may"
  | "jun"
  | "jul"
  | "aug"
  | "sep"
  | "oct"
  | "nov"
  | "dec";
export interface MonthOptions {
  value: MonthKey;
  label: string;
}
export type RequirementStatus =
  | "Pending"
  | "Accepted"
  | "Approved";
export interface Requirements{
    id: number;

    department: string;
    subDepartment: string;
    section: string;
    line: string;
    shift: string;
    year: string;

    status: RequirementStatus;

    month: MonthKey | "";

    requirementCount: number;

    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
}

export interface RequirementFormData {
    id: number | null;

    department: string;
    subDepartment: string;
    section: string;
    line: string;
    shift: string;
    year: string;

    status: RequirementStatus;

    month: MonthKey | "";

    requirementCount: number;

    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
}
