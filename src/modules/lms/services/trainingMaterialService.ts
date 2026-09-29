import type { TrainingMaterialItem, TrainingFileType } from "../models/questionPaper";
import { trainingFileStore } from "./trainingFileStore";

const STORAGE_KEY = "asti_training_materials";

export const INITIAL_TRAINING_MATERIALS: TrainingMaterialItem[] = [
  {
    id: "TM-001",
    courseId: 1,
    courseName: "Connector Assembly Training",
    departmentId: 1,
    departmentName: "Production",
    name: "Connector Assembly SOP.pptx",
    type: "ppt",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    sizeLabel: "2.4 MB",
    description: "Standard Operating Procedure for multipin connector insertion, terminal locking, and click-sound confirmation.",
    uploadedAt: "2026-09-20",
  },
  {
    id: "TM-002",
    courseId: 1,
    courseName: "Connector Assembly Training",
    departmentId: 1,
    departmentName: "Production",
    name: "Torque Specs & Standard.xlsx",
    type: "excel",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    sizeLabel: "450 KB",
    description: "Torque tolerance metrics and parameter verification standards.",
    uploadedAt: "2026-09-21",
  },
  {
    id: "TM-003",
    courseId: 1,
    courseName: "Connector Assembly Training",
    departmentId: 1,
    departmentName: "Production",
    name: "Connector Assembly Demo.mp4",
    type: "video",
    mimeType: "video/mp4",
    sizeLabel: "14.2 MB",
    description: "Video demonstration of terminal insertion and tactile confirmation.",
    uploadedAt: "2026-09-22",
  },
  {
    id: "TM-004",
    courseId: 2,
    courseName: "Terminal Crimping Standard",
    departmentId: 1,
    departmentName: "Production",
    name: "Crimping Height & Pull-Test Guide.pptx",
    type: "ppt",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    sizeLabel: "3.1 MB",
    description: "Quality guidelines on crimp height measurement and micro-section analysis.",
    uploadedAt: "2026-09-22",
  },
  {
    id: "TM-005",
    courseId: 2,
    courseName: "Terminal Crimping Standard",
    departmentId: 1,
    departmentName: "Production",
    name: "Crimp Parameter Matrix.xlsx",
    type: "excel",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    sizeLabel: "512 KB",
    description: "Wire gauge vs terminal part number crimping specifications.",
    uploadedAt: "2026-09-23",
  },
];

export const trainingMaterialService = {
  getAll(): TrainingMaterialItem[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRAINING_MATERIALS));
      return INITIAL_TRAINING_MATERIALS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRAINING_MATERIALS));
        return INITIAL_TRAINING_MATERIALS;
      }
      return parsed;
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRAINING_MATERIALS));
      return INITIAL_TRAINING_MATERIALS;
    }
  },

  getByCourseId(courseId: number | string | null | undefined): TrainingMaterialItem[] {
    if (!courseId && courseId !== 0) return [];
    const list = this.getAll();
    return list.filter((item) => String(item.courseId) === String(courseId));
  },

  getByDepartmentId(deptId: number | string | null | undefined): TrainingMaterialItem[] {
    if (!deptId && deptId !== 0) return [];
    const list = this.getAll();
    return list.filter((item) => String(item.departmentId) === String(deptId));
  },

  getById(id: string): TrainingMaterialItem | null {
    const list = this.getAll();
    return list.find((item) => item.id === id) || null;
  },

  async save(
    item: Partial<TrainingMaterialItem> & {
      name: string;
      courseId: number | string;
      departmentId: number | string;
      type: TrainingFileType;
    },
    fileBlob?: Blob
  ): Promise<TrainingMaterialItem> {
    const list = this.getAll();
    const now = new Date().toISOString().split("T")[0];
    const newId = item.id || `TM-${Date.now()}`;

    if (fileBlob) {
      await trainingFileStore.save(newId, fileBlob);
    }

    const newItem: TrainingMaterialItem = {
      id: newId,
      name: item.name,
      courseId: item.courseId,
      courseName: item.courseName || "",
      departmentId: item.departmentId,
      departmentName: item.departmentName || "",
      type: item.type,
      mimeType: item.mimeType || "application/octet-stream",
      sizeLabel: item.sizeLabel || "Unknown size",
      description: item.description || "",
      uploadedAt: item.uploadedAt || now,
    };

    const existingIdx = list.findIndex((m) => m.id === newId);
    let updatedList: TrainingMaterialItem[];
    if (existingIdx >= 0) {
      list[existingIdx] = newItem;
      updatedList = [...list];
    } else {
      updatedList = [newItem, ...list];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return newItem;
  },

  async delete(id: string): Promise<boolean> {
    const list = this.getAll();
    const filtered = list.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    try {
      await trainingFileStore.remove(id);
    } catch (e) {
      console.warn("Could not remove blob from IndexedDB", e);
    }
    return true;
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
