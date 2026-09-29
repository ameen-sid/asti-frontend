import type { Requirements, MonthKey, RequirementStatus } from "../models/requirements";

const DEPARTMENTS = [
  {
    name: "Production",
    subDepartments: [
      { name: "Wiring Assembly", sections: ["Cutting Section", "Crimping Section", "Joint Section"], lines: ["Line 1", "Line 2", "Line 3"] },
      { name: "PCB Fabrication", sections: ["SMT Section", "Manual Insertion", "Soldering"], lines: ["Line A", "Line B"] },
      { name: "Final Assembly", sections: ["Enclosure Line", "Testing Cell"], lines: ["Line 1", "Line 2"] },
    ],
  },
  {
    name: "Quality Control",
    subDepartments: [
      { name: "Incoming Inspection", sections: ["Raw Material", "Component Testing"], lines: ["Station 1", "Station 2"] },
      { name: "In-Process Quality", sections: ["Line Inspection", "Audit Cell"], lines: ["Line 1", "Line 2", "Line 3"] },
      { name: "Final QA", sections: ["Reliability Lab", "Out-of-Box Audit"], lines: ["QA-1", "QA-2"] },
    ],
  },
  {
    name: "Maintenance",
    subDepartments: [
      { name: "Mechanical Maintenance", sections: ["Preventive", "Breakdown Response"], lines: ["Shopfloor 1", "Shopfloor 2"] },
      { name: "Electrical & Instrumentation", sections: ["Calibration", "Automation Control"], lines: ["Central Lab"] },
    ],
  },
  {
    name: "Logistics",
    subDepartments: [
      { name: "Warehouse", sections: ["Inbound Receiving", "Dispatch Area"], lines: ["Dock A", "Dock B"] },
      { name: "Internal Transport", sections: ["Material Feeding", "AGV Fleet"], lines: ["Route 1", "Route 2"] },
    ],
  },
];

const SHIFTS = ["Morning", "Evening", "Night"];
const YEARS = ["2024", "2025", "2026"];
const STATUSES: RequirementStatus[] = ["Pending", "Accepted", "Approved"];
const MONTHS: MonthKey[] = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

export function generateRandomRequirements(count: number = 30): Requirements[] {
  const records: Requirements[] = [];
  const baseTimestamp = Date.now() - count * 1000 * 60;

  for (let i = 0; i < count; i++) {
    const deptObj = DEPARTMENTS[i % DEPARTMENTS.length];
    const subDeptObj = deptObj.subDepartments[i % deptObj.subDepartments.length];
    const section = subDeptObj.sections[i % subDeptObj.sections.length];
    const line = subDeptObj.lines[i % subDeptObj.lines.length];

    const shift = SHIFTS[i % SHIFTS.length];
    const year = YEARS[i % YEARS.length];
    const status = STATUSES[i % STATUSES.length];
    const month = MONTHS[i % MONTHS.length];
    const requirementCount = Math.floor(Math.random() * 80) + 20;

    const monthlyValues: Record<MonthKey, number> = {
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
    };

    // Fill the primary selected month with requirementCount
    monthlyValues[month] = requirementCount;

    // Fill some realistic counts for a few other months
    MONTHS.forEach((m) => {
      if (m !== month && Math.random() > 0.4) {
        monthlyValues[m] = Math.floor(Math.random() * 50) + 10;
      }
    });

    records.push({
      id: baseTimestamp + i,
      department: deptObj.name,
      subDepartment: subDeptObj.name,
      section,
      line,
      shift,
      year,
      status,
      month,
      requirementCount,
      ...monthlyValues,
    });
  }

  return records;
}
