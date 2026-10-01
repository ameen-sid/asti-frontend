import axios from "axios";
import type { DojoRequirement, DojoStatus } from "../models/dojo";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const getHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export interface FetchDojoQueryParams {
  month?: string;
  year?: number | string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface DojoRequirementResponse {
  id: number;
  month: string;
  year: number;
  requirementCount: number;
  status: DojoStatus;
  createdAt: string;
  updatedAt: string;
}

export async function fetchDojoRequirements(params?: FetchDojoQueryParams): Promise<DojoRequirement[]> {
  const query = new URLSearchParams();
  if (params?.month) query.append("month", params.month);
  if (params?.year) query.append("year", String(params.year));
  if (params?.status) query.append("status", params.status);
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  const qs = query.toString();
  const url = `${API_BASE_URL}/v1/requirements${qs ? `?${qs}` : ""}`;

  const response = await axios.get(url, getHeaders());
  const items: DojoRequirementResponse[] = response.data?.data || [];
  return items.map((item) => ({
    id: item.id,
    month: item.month,
    year: item.year,
    requirementCount: item.requirementCount,
    status: item.status,
    createdAt: item.createdAt?.slice(0, 10),
  }));
}

export async function createDojoRequirement(data: { month: string; year: number; requirementCount: number; status?: DojoStatus; }): Promise<DojoRequirement> {
  const response = await axios.post(
    `${API_BASE_URL}/v1/requirements`,
    data,
    getHeaders()
  );
  const created: DojoRequirementResponse = response.data?.data;
  return {
    id: created.id,
    month: created.month,
    year: created.year,
    requirementCount: created.requirementCount,
    status: created.status,
    createdAt: created.createdAt?.slice(0, 10),
  };
}

export async function updateDojoRequirement(id: number | string, data: { month?: string; year?: number; requirementCount?: number; status?: DojoStatus; }): Promise<DojoRequirement> {
  const response = await axios.patch(`${API_BASE_URL}/v1/requirements/${id}`, data, getHeaders());
  const updated: DojoRequirementResponse = response.data?.data;
  return {
    id: updated.id,
    month: updated.month,
    year: updated.year,
    requirementCount: updated.requirementCount,
    status: updated.status,
    createdAt: updated.createdAt?.slice(0, 10),
  };
}

export async function deleteDojoRequirement(id: number | string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/v1/requirements/${id}`, getHeaders());
}