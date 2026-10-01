import axios from "axios";
import { cmsEndpoints } from "../../../api/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const getHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export interface DefectRecordItem {
  id?: number;
  category: "MAN_RELATED" | "TOTAL";
  defectType: "IN_HOUSE_REJECTION" | "CUSTOMER_COMPLAINTS";
  month: string; // "YYYY-MM"
  defects?: number | null;
  target?: number | null;
}

export async function fetchCmsDefects(
  category: "MAN_RELATED" | "TOTAL",
  defectType?: "IN_HOUSE_REJECTION" | "CUSTOMER_COMPLAINTS",
  year?: number | string,
): Promise<DefectRecordItem[]> {
  try {
    const params = new URLSearchParams();
    params.append("category", category);
    if (defectType) params.append("defectType", defectType);
    if (year) params.append("year", String(year));

    const response = await axios.get(
      `${API_BASE_URL}${cmsEndpoints.GET_DEFECTS_API}?${params.toString()}`,
      getHeaders(),
    );
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching CMS defects:", error);
    throw error;
  }
}

export async function saveCmsDefect(record: {
  category: "MAN_RELATED" | "TOTAL";
  defectType: "IN_HOUSE_REJECTION" | "CUSTOMER_COMPLAINTS";
  month: string;
  defects?: number | null;
  target?: number | null;
}): Promise<DefectRecordItem> {
  const response = await axios.post(
    `${API_BASE_URL}${cmsEndpoints.SAVE_DEFECTS_API}`,
    record,
    getHeaders(),
  );
  return response.data?.data;
}

export async function bulkSaveCmsDefects(
  records: Array<{
    category: "MAN_RELATED" | "TOTAL";
    defectType: "IN_HOUSE_REJECTION" | "CUSTOMER_COMPLAINTS";
    month: string;
    defects?: number | null;
    target?: number | null;
  }>,
): Promise<DefectRecordItem[]> {
  const response = await axios.post(
    `${API_BASE_URL}${cmsEndpoints.SAVE_DEFECTS_API}`,
    { records },
    getHeaders(),
  );
  return response.data?.data;
}