import React from "react";
import { SHIFT_OPTIONS, UNIT_OPTIONS } from "../utils/filterHierarchy";
import { useFilterHierarchy } from "../hooks/useFilterHierarchy";

export interface DashboardFilterBarProps {
  selectedFilters: { [key: string]: string };
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
  handleClearFilters?: () => void;
  fromDate?: string;
  setFromDate?: (date: string) => void;
  toDate?: string;
  setToDate?: (date: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function DashboardFilterBar({
  selectedFilters,
  setSelectedFilters,
  handleClearFilters,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  className = "ctq-filter-bar border rounded-4 shadow-sm p-3 mt-3 mb-4",
  children,
}: DashboardFilterBarProps) {
  // Selected IDs (stored as numeric strings or empty)
  const selectedDeptId = selectedFilters["DepartmentId"]
    ? Number(selectedFilters["DepartmentId"])
    : undefined;
  const selectedSubDeptId = selectedFilters["SubDepartmentId"]
    ? Number(selectedFilters["SubDepartmentId"])
    : undefined;
  const selectedSectionId = selectedFilters["SectionId"]
    ? Number(selectedFilters["SectionId"])
    : undefined;

  // Fetch options from backend APIs using the hierarchy hook
  const { departments, subDepartments, sections, lines } =
    useFilterHierarchy(selectedDeptId, selectedSubDeptId, selectedSectionId);

  // Filter change handler ensuring hierarchical resets
  const handleFilterChange = (filterKey: string, value: string) => {
    setSelectedFilters((prev) => {
      const next = { ...prev, [filterKey]: value };

      if (filterKey === "DepartmentId") {
        // Find the department name for display
        const dept = departments.find((d) => String(d.id) === value);
        if (dept) next["Departments"] = dept.name;
        else delete next["Departments"];
        // Reset children
        delete next["SubDepartmentId"];
        delete next["Sub Departments"];
        delete next["SectionId"];
        delete next["Sections"];
        delete next["LineId"];
        delete next["Lines"];
      } else if (filterKey === "SubDepartmentId") {
        const subDept = subDepartments.find((d) => String(d.id) === value);
        if (subDept) next["Sub Departments"] = subDept.name;
        else delete next["Sub Departments"];
        // Reset children
        delete next["SectionId"];
        delete next["Sections"];
        delete next["LineId"];
        delete next["Lines"];
      } else if (filterKey === "SectionId") {
        const section = sections.find((d) => String(d.id) === value);
        if (section) next["Sections"] = section.name;
        else delete next["Sections"];
        // Reset children
        delete next["LineId"];
        delete next["Lines"];
      } else if (filterKey === "LineId") {
        const line = lines.find((d) => String(d.id) === value);
        if (line) next["Lines"] = line.name;
        else delete next["Lines"];
      }

      if (!value) {
        delete next[filterKey];
      }

      return next;
    });
  };

  return (
    <div className={className} style={{ background: "#fafbff" }}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="row w-100 g-0 mt-3 d-flex justify-content-between align-items-center">
          {/* Filter label */}
          <div className="col-1 d-flex align-items-center mb-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span
              className="ms-1 fw-semibold"
              style={{ fontSize: "0.82rem", color: "#3d3d3d" }}
            >
              Filters
            </span>
          </div>

          <div className="col-11 flex-wrap d-flex justify-content-start align-items-center">
            {/* 1. Units Filter (Untouched - Always Enabled) */}
            <select
              className="ctq-filter-select me-1 mb-3"
              value={selectedFilters["Units"] || ""}
              onChange={(e) => handleFilterChange("Units", e.target.value)}
              title="Unit Filter"
            >
              <option value="">Units</option>
              {UNIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            {/* 2. Departments Filter (Always Enabled - from API) */}
            <select
              className="ctq-filter-select me-1 mb-3"
              value={selectedFilters["DepartmentId"] || ""}
              onChange={(e) =>
                handleFilterChange("DepartmentId", e.target.value)
              }
              title="Select Department"
            >
              <option value="">Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={String(dept.id)}>
                  {dept.name}
                </option>
              ))}
            </select>

            {/* 3. Sub Departments Filter (Enabled only when Department is selected - from API) */}
            <select
              className="ctq-filter-select me-1 mb-3"
              disabled={!selectedDeptId}
              value={selectedFilters["SubDepartmentId"] || ""}
              onChange={(e) =>
                handleFilterChange("SubDepartmentId", e.target.value)
              }
              title={
                !selectedDeptId
                  ? "Select a Department first to enable Sub Departments"
                  : "Select Sub Department"
              }
            >
              <option value="">
                {!selectedDeptId
                  ? "Sub Departments (Select Dept first)"
                  : "Sub Departments"}
              </option>
              {subDepartments.map((sub) => (
                <option key={sub.id} value={String(sub.id)}>
                  {sub.name}
                </option>
              ))}
            </select>

            {/* 4. Sections Filter (Enabled only when Sub Department is selected - from API) */}
            <select
              className="ctq-filter-select me-1 mb-3"
              disabled={!selectedSubDeptId}
              value={selectedFilters["SectionId"] || ""}
              onChange={(e) =>
                handleFilterChange("SectionId", e.target.value)
              }
              title={
                !selectedSubDeptId
                  ? "Select a Sub Department first to enable Sections"
                  : "Select Section"
              }
            >
              <option value="">
                {!selectedSubDeptId
                  ? "Sections (Select Sub Dept first)"
                  : "Sections"}
              </option>
              {sections.map((sec) => (
                <option key={sec.id} value={String(sec.id)}>
                  {sec.name}
                </option>
              ))}
            </select>

            {/* 5. Lines Filter (Enabled only when Section is selected - from API) */}
            <select
              className="ctq-filter-select me-1 mb-3"
              disabled={!selectedSectionId}
              value={selectedFilters["LineId"] || ""}
              onChange={(e) =>
                handleFilterChange("LineId", e.target.value)
              }
              title={
                !selectedSectionId
                  ? "Select a Section first to enable Lines"
                  : "Select Line"
              }
            >
              <option value="">
                {!selectedSectionId
                  ? "Lines (Select Section first)"
                  : "Lines"}
              </option>
              {lines.map((line) => (
                <option key={line.id} value={String(line.id)}>
                  {line.name}
                </option>
              ))}
            </select>

            {/* 6. Shifts Filter (Always Enabled - Shift A, B, General etc) */}
            <select
              className="ctq-filter-select me-1 mb-3"
              value={selectedFilters["Shifts"] || ""}
              onChange={(e) => handleFilterChange("Shifts", e.target.value)}
              title="Select Shift"
            >
              <option value="">Shifts</option>
              {SHIFT_OPTIONS.map((shift) => (
                <option key={shift} value={shift}>
                  {shift}
                </option>
              ))}
            </select>

            {/* Clear Filters Button */}
            <button
              type="button"
              className="ctq-filter-clear-btn mb-3"
              onClick={() => {
                if (handleClearFilters) {
                  handleClearFilters();
                } else {
                  setSelectedFilters({});
                  if (setFromDate) setFromDate("");
                  if (setToDate) setToDate("");
                }
              }}
              title="Clear all filters"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Clear
            </button>

            {children}

            {/* Optional Date Range Filters */}
            {setFromDate && setToDate && (
              <>
                <div className="d-flex align-items-center gap-2 mb-3 ms-2">
                  <label
                    style={{
                      fontSize: "0.72rem",
                      color: "#888",
                      fontWeight: 600,
                      letterSpacing: "0.03em",
                    }}
                  >
                    FROM
                  </label>
                  <input
                    type="date"
                    className="ctq-filter-date-input"
                    value={fromDate || ""}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="d-flex align-items-center gap-2 mb-3 ms-2">
                  <label
                    style={{
                      fontSize: "0.72rem",
                      color: "#888",
                      fontWeight: 600,
                      letterSpacing: "0.03em",
                    }}
                  >
                    TO
                  </label>
                  <input
                    type="date"
                    className="ctq-filter-date-input"
                    value={toDate || ""}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
