export type PaperStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface OptionItem {
  id: string;
  label: string;
  text: string;
}

export interface QuestionItem {
  id: string;
  type: string;
  questionText: string;
  options: OptionItem[];
  correctOptionId: string;
  marks: number;
  negativeMarks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isRequired: boolean;
}

export interface SectionItem {
  id: string;
  name: string;
  subtitle: string;
  questions: QuestionItem[];
}

export type TrainingFileType = 'ppt' | 'video' | 'excel' | 'document';

export interface TrainingFile {
  id: string;
  courseId?: number | string;
  courseName?: string;
  departmentId?: number | string;
  department?: string;
  name: string;
  type: TrainingFileType;
  /** original MIME type e.g. video/mp4, application/vnd.ms-powerpoint */
  mimeType: string;
  /** human-readable file size label */
  sizeLabel: string;
  description?: string;
  createdAt?: string;
  /**
   * Optional base64 dataUrl kept ONLY for small files (PPT) uploaded before
   * the IndexedDB migration.  New uploads should omit this field.
   * @deprecated use trainingFileStore (IndexedDB) instead
   */
  dataUrl?: string;
}

export interface TrainingMaterialItem {
  id: string;
  courseId: number | string;
  courseName?: string;
  departmentId: number | string;
  departmentName?: string;
  name: string;
  type: TrainingFileType;
  mimeType: string;
  sizeLabel: string;
  description?: string;
  uploadedAt: string;
}

export interface QuestionPaper {
  id: string | number;
  title: string;
  subTitle: string;
  description: string;
  code: string;
  courseId?: number | string;
  courseName?: string;
  departmentId?: number | string;
  department: string;
  subDepartment: string;
  lineSection: string;
  allowedTime: number; // in minutes
  passingScore: number; // in %
  status: PaperStatus;
  sections: SectionItem[];
  trainingFiles?: TrainingFile[];
  createdAt: string;
  updatedAt: string;
}
