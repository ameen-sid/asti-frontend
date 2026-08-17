export type InstructorStatus =
  | 'ACTIVE'
  | 'ON LEAVE'
  | 'INACTIVE';

export type StatusFilter =
  | 'All Status'
  | InstructorStatus;

export interface Instructor {
  id: number;
  name: string;
  instrId: string;
  email: string | null;
  specialization: string;
  courses: number;
  status: InstructorStatus;
}

export interface InstructorFormData {
  id: number | null;
  name: string;
  instrId: string;
  email: string;
  specialization: string;
  courses: number;
  status: InstructorStatus;
}

export interface StatusBadgeStyle {
  bg: string;
  color: string;
}