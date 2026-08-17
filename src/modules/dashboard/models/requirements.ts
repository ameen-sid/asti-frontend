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

    unit: string;
    department: string;
    section: string;
    subSection: string;
    line: string;
    machine: string;

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

    unit: string;
    department: string;
    section: string;
    subSection: string;
    line: string;
    machine: string;

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
