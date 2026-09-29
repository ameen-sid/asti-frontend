export type DojoStatus = "Pending" | "Planned" | "In Progress" | "Completed" | "Approved";

export interface DojoRequirement {
  id: string | number;
  month: string;              // e.g., "January", "February", etc.
  year: number;               // e.g., 2026
  requirementCount: number;   // required headcount / count
  status: DojoStatus;
  createdAt?: string;
}

export interface DojoFormData {
  id?: string | number | null;
  month: string;
  year: number | "";
  requirementCount: number | "";
  status: DojoStatus;
}
