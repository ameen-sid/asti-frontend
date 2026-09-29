export type CourseStatus = "Draft" | "Under Review" | "Active" | "Inactive" | "Archived";

export interface Course {
  id: number;
  code: string;
  title: string;
  category: string;
  plant: string;
  departmentId?: number;
  department: string;
  subDepartmentId?: number;
  subDepartment: string;
  section: string;
  line: string;
  process: string;
  machine: string;
  skillLevelFrom: string;
  skillLevelTo: string;
  durationMinutes: number;
  modulesCount: number;
  assessmentQuestions: number;
  passingPercentage: number;
  dojoRequired: boolean;
  mandatory: boolean;
  certificationRequired: boolean;
  validityMonths: number;
  status: CourseStatus;
  description?: string;
  createdAt?: string;
}

export type DojoTrainingStatus =
  | "Not Assigned"
  | "Assigned"
  | "Training"
  | "Evaluation Pending"
  | "Qualified"
  | "Certified"
  | "Retraining Required"
  | "Expired";

export type DojoCertificationStatus =
  | "Certified"
  | "In Progress"
  | "Evaluation Pending"
  | "Retraining Required"
  | "Expired";

export interface DojoTraining {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  subDepartment: string;
  section: string;
  line: string;
  process: string;
  machine: string;
  skillLevelFrom: string;
  skillLevelTo: string;
  trainingProgress: number; // 0 - 100
  practicalScore: number; // 0 - 100
  certificationStatus: DojoCertificationStatus;
  status: DojoTrainingStatus;
  trainerName?: string;
  supervisorName?: string;
  startDate?: string;
  completionDate?: string;
  certificateNumber?: string;
  certificateIssuedDate?: string;
  validTill?: string;
  evaluationRemarks?: string;
}

export type AssignmentStatus =
  | "Available"
  | "Assigned"
  | "Certification Expiring"
  | "Expired";

export type AssignmentType =
  | "Permanent"
  | "Temporary"
  | "Backup"
  | "Job Rotation";

export interface OperatorAssignment {
  id: number;
  operatorId: string;
  operatorName: string;
  certificationName: string;
  processName: string;
  skillLevel: string;
  plant: string;
  currentDepartment: string;
  subDepartment: string;
  section: string;
  line: string;
  station: string;
  machine: string;
  shift: string;
  assignmentStatus: AssignmentStatus;
  assignmentType: AssignmentType;
  validityDate: string;
  effectiveFrom: string;
  effectiveTo: string;
  remarks: string;
  lastUpdated?: string;
}

export interface PlantHierarchy {
  id: string;
  name: string;
  departments: {
    id: string;
    name: string;
    subDepartments: {
      id: string;
      name: string;
      sections: {
        id: string;
        name: string;
        lines: {
          id: string;
          name: string;
          processes: {
            id: string;
            name: string;
            stations: {
              id: string;
              name: string;
              machines: string[];
            }[];
          }[];
        }[];
      }[];
    }[];
  }[];
}
