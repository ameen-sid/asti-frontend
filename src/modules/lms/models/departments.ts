export interface SubDepartment {
  id: string | number;
  name: string;
  departmentId?: string | number;
  sections?: Section[];
}

export interface Department {
  id: string | number;
  name: string;
  subDepartments?: SubDepartment[];
}

export interface Section {
  id: string | number;
  name: string;
  departmentId?: string | number;
  subDepartmentId?: string | number;
  lines?: Line[];
}

export interface Line {
  id: string | number;
  name: string;
  departmentId?: string | number;
  subDepartmentId?: string | number;
  sectionId?: string | number;
  machines?: Machine[];
}

export interface Machine {
  id: string | number;
  name: string;
  departmentId?: string | number;
  subDepartmentId?: string | number;
  sectionId?: string | number;
  lineId?: string | number;
}