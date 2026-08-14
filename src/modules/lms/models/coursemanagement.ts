export type CourseStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export type StatusFilter = 'All Status' | CourseStatus;

export interface Course {
  id: number;
  title: string;
  code: string;
  instructor: string;
  startDate: string;
  endDate: string;
  enrolled: number;
  status: CourseStatus;
}

export interface CourseFormData {
  id: number | null;
  title: string;
  code: string;
  instructor: string;
  startDate: string;
  endDate: string;
  enrolled: number;
  status: CourseStatus;
}

export interface StatusBadgeStyle {
  bg: string;
  color: string;
}