import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export interface FilterOption {
  id: number;
  name: string;
}

interface UseFilterHierarchyResult {
  departments: FilterOption[];
  subDepartments: FilterOption[];
  sections: FilterOption[];
  lines: FilterOption[];
  isLoading: boolean;
}

/**
 * Fetches filter hierarchy data from the backend APIs.
 * - Departments are fetched on mount.
 * - Sub-departments are fetched when a departmentId is provided.
 * - Sections are fetched when a subDepartmentId is provided.
 * - Lines are fetched when a sectionId is provided.
 */
export function useFilterHierarchy(
  selectedDepartmentId?: number,
  selectedSubDepartmentId?: number,
  selectedSectionId?: number
): UseFilterHierarchyResult {
  const [departments, setDepartments] = useState<FilterOption[]>([]);
  const [subDepartments, setSubDepartments] = useState<FilterOption[]>([]);
  const [sections, setSections] = useState<FilterOption[]>([]);
  const [lines, setLines] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch departments on mount
  useEffect(() => {
    let cancelled = false;
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/v1/departments`,
          getHeaders()
        );
        if (!cancelled) {
          const data = res.data?.data || [];
          setDepartments(
            data.map((d: any) => ({ id: d.id, name: d.name }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch departments:", err);
        if (!cancelled) setDepartments([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchDepartments();
    return () => { cancelled = true; };
  }, []);

  // Fetch sub-departments when departmentId changes
  useEffect(() => {
    let cancelled = false;
    if (!selectedDepartmentId) {
      setSubDepartments([]);
      return;
    }
    const fetchSubDepartments = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/v1/sub-departments?departmentId=${selectedDepartmentId}`,
          getHeaders()
        );
        if (!cancelled) {
          const data = res.data?.data || [];
          setSubDepartments(
            data.map((d: any) => ({ id: d.id, name: d.name }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch sub-departments:", err);
        if (!cancelled) setSubDepartments([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchSubDepartments();
    return () => { cancelled = true; };
  }, [selectedDepartmentId]);

  // Fetch sections when subDepartmentId changes
  useEffect(() => {
    let cancelled = false;
    if (!selectedSubDepartmentId) {
      setSections([]);
      return;
    }
    const fetchSections = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/v1/sections?subDepartmentId=${selectedSubDepartmentId}`,
          getHeaders()
        );
        if (!cancelled) {
          const data = res.data?.data || [];
          setSections(
            data.map((d: any) => ({ id: d.id, name: d.name }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch sections:", err);
        if (!cancelled) setSections([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchSections();
    return () => { cancelled = true; };
  }, [selectedSubDepartmentId]);

  // Fetch lines when sectionId changes
  useEffect(() => {
    let cancelled = false;
    if (!selectedSectionId) {
      setLines([]);
      return;
    }
    const fetchLines = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/v1/lines?sectionId=${selectedSectionId}`,
          getHeaders()
        );
        if (!cancelled) {
          const data = res.data?.data || [];
          setLines(
            data.map((d: any) => ({ id: d.id, name: d.name }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch lines:", err);
        if (!cancelled) setLines([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchLines();
    return () => { cancelled = true; };
  }, [selectedSectionId]);

  return { departments, subDepartments, sections, lines, isLoading };
}
