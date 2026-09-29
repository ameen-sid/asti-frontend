import { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

// Ensure datalabels plugin always recognizes BarElement across Vite chunk boundaries
if (BarElement && !Object.prototype.hasOwnProperty.call(BarElement, Symbol.hasInstance)) {
  Object.defineProperty(BarElement, Symbol.hasInstance, {
    value: (instance: unknown) => {
      const el = instance as { constructor?: { name?: string }; base?: unknown; horizontal?: unknown };
      return Boolean(
        el &&
        (el.constructor?.name === "BarElement" ||
          (el.base !== undefined && el.horizontal !== undefined)),
      );
    },
  });
}

export interface MonthRecord {
  month: string; // "YYYY-MM"
  defects?: number | null;
  target?: number | null;
}

export interface DefectGraphsProps {
  storageKeyA: string;
  storageKeyB: string;
  graphATitle?: string;
  graphBTitle?: string;
  defaultTargetA?: number;
  defaultTargetB?: number;
}

export interface FYMonth {
  key: string; // "YYYY-MM"
  label: string; // "Apr-25"
}

export const getFYMonths = (startYear: number): FYMonth[] => {
  const shortStart = String(startYear).slice(-2);
  const shortEnd = String(startYear + 1).slice(-2);
  return [
    { key: `${startYear}-04`, label: `Apr-${shortStart}` },
    { key: `${startYear}-05`, label: `May-${shortStart}` },
    { key: `${startYear}-06`, label: `Jun-${shortStart}` },
    { key: `${startYear}-07`, label: `Jul-${shortStart}` },
    { key: `${startYear}-08`, label: `Aug-${shortStart}` },
    { key: `${startYear}-09`, label: `Sep-${shortStart}` },
    { key: `${startYear}-10`, label: `Oct-${shortStart}` },
    { key: `${startYear}-11`, label: `Nov-${shortStart}` },
    { key: `${startYear}-12`, label: `Dec-${shortStart}` },
    { key: `${startYear + 1}-01`, label: `Jan-${shortEnd}` },
    { key: `${startYear + 1}-02`, label: `Feb-${shortEnd}` },
    { key: `${startYear + 1}-03`, label: `Mar-${shortEnd}` },
  ];
};

// Default initial dataset matching user reference chart with monthly targets that create a natural wavy target curve
const DEFAULT_SAMPLE_A: MonthRecord[] = [
  { month: "2025-04", defects: 1.28, target: 1.35 },
  { month: "2025-05", defects: 1.97, target: 1.45 },
  { month: "2025-06", defects: 1.25, target: 1.30 },
  { month: "2025-07", defects: 2.00, target: 1.50 },
  { month: "2025-08", defects: 2.37, target: 1.35 },
  { month: "2025-09", defects: 2.04, target: 1.40 },
  { month: "2025-10", defects: 1.30, target: 1.35 },
  { month: "2025-11", defects: 1.54, target: 1.25 },
  { month: "2025-12", defects: 1.00, target: 1.30 },
  { month: "2026-01", defects: 2.03, target: 1.45 },
  { month: "2026-02", defects: 1.78, target: 1.35 },
  { month: "2026-03", defects: null, target: 1.30 },
];

const DEFAULT_SAMPLE_B: MonthRecord[] = [
  { month: "2025-04", defects: 0.35, target: 0.50 },
  { month: "2025-05", defects: 0.65, target: 0.60 },
  { month: "2025-06", defects: 0.40, target: 0.45 },
  { month: "2025-07", defects: 0.85, target: 0.55 },
  { month: "2025-08", defects: 0.95, target: 0.50 },
  { month: "2025-09", defects: 0.70, target: 0.65 },
  { month: "2025-10", defects: 0.45, target: 0.40 },
  { month: "2025-11", defects: 0.55, target: 0.50 },
  { month: "2025-12", defects: 0.30, target: 0.45 },
  { month: "2026-01", defects: 0.80, target: 0.60 },
  { month: "2026-02", defects: 0.60, target: 0.50 },
  { month: "2026-03", defects: null, target: 0.45 },
];

const loadStoredData = (key: string, initialDefault: MonthRecord[] = []): MonthRecord[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      if (initialDefault.length > 0) {
        localStorage.setItem(key, JSON.stringify(initialDefault));
        return initialDefault;
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item) => item && typeof item.month === "string")
        .map((item) => ({
          month: item.month,
          defects: typeof item.defects === "number" ? item.defects : null,
          target: typeof item.target === "number" ? item.target : null,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
    }
  } catch (err) {
    console.error("Failed to load defect data from localStorage key:", key, err);
  }
  return initialDefault;
};

function DefectGraphs({
  storageKeyA,
  storageKeyB,
  graphATitle = "In House Rejection",
  graphBTitle = "Customer Complaints",
  defaultTargetA = 1.35,
  defaultTargetB = 0.5,
}: DefectGraphsProps) {
  const [selectedFY, setSelectedFY] = useState<number>(2026);
  const fyMonths = useMemo(() => getFYMonths(selectedFY), [selectedFY]);

  const [recordsA, setRecordsA] = useState<MonthRecord[]>(() =>
    loadStoredData(storageKeyA, storageKeyA.includes("man-related") ? DEFAULT_SAMPLE_A : []),
  );
  const [recordsB, setRecordsB] = useState<MonthRecord[]>(() =>
    loadStoredData(storageKeyB, storageKeyB.includes("man-related") ? DEFAULT_SAMPLE_B : []),
  );

  useEffect(() => {
    setRecordsA(loadStoredData(storageKeyA, storageKeyA.includes("man-related") ? DEFAULT_SAMPLE_A : []));
    setRecordsB(loadStoredData(storageKeyB, storageKeyB.includes("man-related") ? DEFAULT_SAMPLE_B : []));
  }, [storageKeyA, storageKeyB]);

  // Actual values map
  const actualMapA = useMemo(
    () =>
      Object.fromEntries(
        recordsA.map((d) => [d.month, typeof d.defects === "number" ? d.defects : undefined]),
      ),
    [recordsA],
  );
  const actualMapB = useMemo(
    () =>
      Object.fromEntries(
        recordsB.map((d) => [d.month, typeof d.defects === "number" ? d.defects : undefined]),
      ),
    [recordsB],
  );

  // Target values map (falls back to defaultTarget if not set for that month)
  const targetMapA = useMemo(
    () =>
      Object.fromEntries(
        recordsA.map((d) => [d.month, typeof d.target === "number" ? d.target : undefined]),
      ),
    [recordsA],
  );
  const targetMapB = useMemo(
    () =>
      Object.fromEntries(
        recordsB.map((d) => [d.month, typeof d.target === "number" ? d.target : undefined]),
      ),
    [recordsB],
  );

  // Compute Averages
  const avgActualA = useMemo(() => {
    const vals = fyMonths
      .map((m) => actualMapA[m.key])
      .filter((v): v is number => v !== undefined && v !== null);
    if (vals.length === 0) return null;
    return Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
  }, [fyMonths, actualMapA]);

  const avgTargetA = useMemo(() => {
    const vals = fyMonths
      .map((m) => (targetMapA[m.key] !== undefined ? targetMapA[m.key] : defaultTargetA))
      .filter((v): v is number => v !== undefined && v !== null);
    if (vals.length === 0) return defaultTargetA;
    return Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
  }, [fyMonths, targetMapA, defaultTargetA]);

  const avgActualB = useMemo(() => {
    const vals = fyMonths
      .map((m) => actualMapB[m.key])
      .filter((v): v is number => v !== undefined && v !== null);
    if (vals.length === 0) return null;
    return Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
  }, [fyMonths, actualMapB]);

  const avgTargetB = useMemo(() => {
    const vals = fyMonths
      .map((m) => (targetMapB[m.key] !== undefined ? targetMapB[m.key] : defaultTargetB))
      .filter((v): v is number => v !== undefined && v !== null);
    if (vals.length === 0) return defaultTargetB;
    return Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
  }, [fyMonths, targetMapB, defaultTargetB]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState<"A" | "B">("A");
  const [modalMonth, setModalMonth] = useState(`${selectedFY}-04`);
  const [modalActual, setModalActual] = useState("");
  const [modalTarget, setModalTarget] = useState("");
  const [modalValidationError, setModalValidationError] = useState("");

  // Handle cell click on either ACTUAL or TARGET row
  const handleCellClick = (graph: "A" | "B", monthKey: string) => {
    setSelectedGraph(graph);
    setModalMonth(monthKey);
    const curActual = graph === "A" ? actualMapA[monthKey] : actualMapB[monthKey];
    const curTarget =
      graph === "A"
        ? (targetMapA[monthKey] ?? defaultTargetA)
        : (targetMapB[monthKey] ?? defaultTargetB);

    setModalActual(curActual !== undefined ? String(curActual) : "");
    setModalTarget(curTarget !== undefined ? String(curTarget) : "");
    setModalValidationError("");
    setShowModal(true);
  };

  const handleOpenAddModal = (graph: "A" | "B" = "A") => {
    setSelectedGraph(graph);
    setModalMonth(`${selectedFY}-04`);
    const curActual = graph === "A" ? actualMapA[`${selectedFY}-04`] : actualMapB[`${selectedFY}-04`];
    const curTarget =
      graph === "A"
        ? (targetMapA[`${selectedFY}-04`] ?? defaultTargetA)
        : (targetMapB[`${selectedFY}-04`] ?? defaultTargetB);

    setModalActual(curActual !== undefined ? String(curActual) : "");
    setModalTarget(curTarget !== undefined ? String(curTarget) : "");
    setModalValidationError("");
    setShowModal(true);
  };

  const handleMonthChange = (monthKey: string) => {
    setModalMonth(monthKey);
    const curActual = selectedGraph === "A" ? actualMapA[monthKey] : actualMapB[monthKey];
    const curTarget =
      selectedGraph === "A"
        ? (targetMapA[monthKey] ?? defaultTargetA)
        : (targetMapB[monthKey] ?? defaultTargetB);

    setModalActual(curActual !== undefined ? String(curActual) : "");
    setModalTarget(curTarget !== undefined ? String(curTarget) : "");
    setModalValidationError("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalActual("");
    setModalTarget("");
    setModalValidationError("");
  };

  const handleSaveModal = () => {
    if (!modalMonth || !modalMonth.trim()) {
      setModalValidationError("Please select a month.");
      return;
    }

    let actualNum: number | null = null;
    if (modalActual !== "" && modalActual !== null && modalActual !== undefined) {
      const parsed = Number(modalActual);
      if (isNaN(parsed) || parsed < 0) {
        setModalValidationError("Actual defects must be a non-negative number.");
        return;
      }
      actualNum = Number(parsed.toFixed(2));
    }

    let targetNum: number | null = null;
    if (modalTarget !== "" && modalTarget !== null && modalTarget !== undefined) {
      const parsed = Number(modalTarget);
      if (isNaN(parsed) || parsed < 0) {
        setModalValidationError("Target must be a non-negative number.");
        return;
      }
      targetNum = Number(parsed.toFixed(2));
    }

    const targetKey = selectedGraph === "A" ? storageKeyA : storageKeyB;
    const currentList = selectedGraph === "A" ? recordsA : recordsB;

    const existingIdx = currentList.findIndex((item) => item.month === modalMonth);
    let updatedList: MonthRecord[];

    if (existingIdx >= 0) {
      updatedList = currentList.map((item, idx) =>
        idx === existingIdx
          ? {
            ...item,
            defects: actualNum,
            target: targetNum,
          }
          : item,
      );
    } else {
      updatedList = [
        ...currentList,
        {
          month: modalMonth,
          defects: actualNum,
          target: targetNum,
        },
      ];
    }

    updatedList.sort((a, b) => a.month.localeCompare(b.month));

    try {
      localStorage.setItem(targetKey, JSON.stringify(updatedList));
    } catch (err) {
      console.error("Failed to save data:", err);
    }

    if (selectedGraph === "A") {
      setRecordsA(updatedList);
    } else {
      setRecordsB(updatedList);
    }

    handleCloseModal();
  };

  // Build Chart Data: bars + wavy target curve
    const buildChartData = (
      actualMap: Record<string, number | undefined>,
      targetMap: Record<string, number | undefined>,
      defaultTarget: number,
    ) => {
      const labels = fyMonths.map((m) => m.label);

      const actualData = fyMonths.map((m) =>
        actualMap[m.key] !== undefined && actualMap[m.key] !== null ? actualMap[m.key] : null,
      );

      const targetData = fyMonths.map((m) =>
        targetMap[m.key] !== undefined && targetMap[m.key] !== null ? targetMap[m.key] : defaultTarget,
      );

      // Conditional Bar Colors per month: Red if Actual > Month's Target, Green if Actual <= Month's Target
      const barColors = fyMonths.map((m, idx) => {
        const act = actualData[idx];
        const tgt = targetData[idx];
        if (act === null || act === undefined) return "transparent";
        return act > tgt ? "#ef4444" : "#10b981";
      });

      const hoverBarColors = fyMonths.map((m, idx) => {
        const act = actualData[idx];
        const tgt = targetData[idx];
        if (act === null || act === undefined) return "transparent";
        return act > tgt ? "#dc2626" : "#059669";
      });

      return {
        labels,
        datasets: [
          {
            type: "bar" as const,
            label: "ACTUAL",
            data: actualData,
            backgroundColor: barColors,
            hoverBackgroundColor: hoverBarColors,
            borderRadius: 3,
            maxBarThickness: 34,
            order: 2,
          },
          {
            type: "line" as const,
            label: "TARGET",
            data: targetData,
            borderColor: "#2563eb",
            backgroundColor: "#2563eb",
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "#2563eb",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 1.5,
            tension: 0.4, // <--- Makes the monthly target line wavy & smooth
            fill: false,
            order: 1,
          },
        ],
      };
    };

    const buildChartOptions = (
      actualMap: Record<string, number | undefined>,
      targetMap: Record<string, number | undefined>,
      defaultTarget: number,
    ): ChartOptions<"bar"> => {
      const allActuals = fyMonths
        .map((m) => actualMap[m.key])
        .filter((v): v is number => v !== undefined && v !== null);

      const allTargets = fyMonths.map((m) => targetMap[m.key] ?? defaultTarget);

      const maxVal = Math.max(...allActuals, ...allTargets, 2.5);

      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "start",
            labels: {
              boxWidth: 14,
              boxHeight: 10,
              usePointStyle: false,
              font: {
                size: 11,
                weight: 600,
              },
              generateLabels: () => [
                {
                  text: "ACTUAL (Safe ≤ Target)",
                  fillStyle: "#10b981",
                  strokeStyle: "#10b981",
                  lineWidth: 1,
                  hidden: false,
                  datasetIndex: 0,
                },
                {
                  text: "ACTUAL (Above Target > Target)",
                  fillStyle: "#ef4444",
                  strokeStyle: "#ef4444",
                  lineWidth: 1,
                  hidden: false,
                  datasetIndex: 0,
                },
                {
                  text: "TARGET",
                  fillStyle: "#2563eb",
                  strokeStyle: "#2563eb",
                  lineWidth: 2,
                  hidden: false,
                  datasetIndex: 1,
                },
              ],
            },
          },
          tooltip: {
            backgroundColor: "#1e293b",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            padding: 8,
            cornerRadius: 6,
            callbacks: {
              label: (item) => {
                const monthKey = fyMonths[item.dataIndex]?.key;
                const monthTarget = targetMap[monthKey] ?? defaultTarget;

                if (item.datasetIndex === 1) {
                  return ` TARGET: ${item.raw}`;
                }
                const val = item.raw as number | null;
                if (val === null || val === undefined) return " No actual data";
                const isAbove = val > monthTarget;
                return ` ACTUAL: ${val} ${isAbove ? `(Above Target ${monthTarget} - Warning)` : `(Safe ≤ ${monthTarget})`}`;
              },
            },
          },
          datalabels: {
            display: (context) => {
              if (context.datasetIndex !== 0) return false;
              const val = context.dataset.data[context.dataIndex];
              return val !== null && val !== undefined;
            },
            anchor: "end",
            align: "top",
            offset: 2,
            color: (context) => {
              const val = context.dataset.data[context.dataIndex] as number | null;
              if (val === null || val === undefined) return "transparent";
              const monthKey = fyMonths[context.dataIndex]?.key;
              const tgt = targetMap[monthKey] ?? defaultTarget;
              return val > tgt ? "#dc2626" : "#047857";
            },
            font: {
              size: 10,
              weight: "bold",
            },
            formatter: (val: number | null) => (val !== null && val !== undefined ? val : ""),
          },
        },
        layout: {
          padding: {
            top: 14,
            bottom: 2,
            left: 4,
            right: 8,
          },
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: "#e2e8f0",
            },
            ticks: {
              display: false, // The table directly underneath serves as the X-axis labels
            },
          },
          y: {
            beginAtZero: true,
            suggestedMax: Math.ceil((maxVal + 0.4) * 2) / 2,
            ticks: {
              color: "#64748b",
              stepSize: 0.5,
              font: {
                size: 10,
              },
            },
            grid: {
              color: "#f1f5f9",
            },
          },
        },
      };
    };

    // Render the Excel-like data table below each graph
    const renderExcelDataTable = (
      graphLetter: "A" | "B",
      actualMap: Record<string, number | undefined>,
      targetMap: Record<string, number | undefined>,
      defaultTarget: number,
      averageActual: number | null,
      averageTarget: number | null,
    ) => {
      return (
        <div className="w-100 overflow-x-auto mt-1">
          <table
            className="w-100 text-center"
            style={{
              borderCollapse: "collapse",
              fontSize: "0.76rem",
              border: "1.5px solid #94a3b8",
              backgroundColor: "#ffffff",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9" }}>
                <th
                  style={{
                    border: "1px solid #94a3b8",
                    padding: "4px 6px",
                    textAlign: "left",
                    width: "105px",
                    minWidth: "105px",
                    color: "#334155",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                >
                  0
                </th>
                {fyMonths.map((m) => (
                  <th
                    key={m.key}
                    style={{
                      border: "1px solid #94a3b8",
                      padding: "4px 2px",
                      color: "#334155",
                      fontWeight: 600,
                      fontSize: "0.74rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.label}
                  </th>
                ))}
                <th
                  style={{
                    border: "1px solid #94a3b8",
                    padding: "4px 4px",
                    color: "#1e3a8a",
                    fontWeight: 700,
                    backgroundColor: "#e2e8f0",
                    minWidth: "55px",
                    fontSize: "0.75rem",
                  }}
                >
                  Average
                </th>
              </tr>
            </thead>
            <tbody>
              {/* ACTUAL ROW */}
              <tr>
                <td
                  style={{
                    border: "1px solid #94a3b8",
                    padding: "4px 6px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "#0f766e",
                    backgroundColor: "#f8fafc",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "8px",
                      backgroundColor: "#10b981",
                      marginRight: "6px",
                      verticalAlign: "middle",
                      borderRadius: "1px",
                    }}
                  />
                  ACTUAL
                </td>
                {fyMonths.map((m) => {
                  const act = actualMap[m.key];
                  const tgt = targetMap[m.key] ?? defaultTarget;
                  const isAbove = act !== undefined && act > tgt;
                  return (
                    <td
                      key={m.key}
                      title={`Click to edit ${m.label} Actual / Target`}
                      onClick={() => handleCellClick(graphLetter, m.key)}
                      style={{
                        border: "1px solid #94a3b8",
                        padding: "4px 2px",
                        fontWeight: 600,
                        color: isAbove ? "#dc2626" : "#1e293b",
                        cursor: "pointer",
                        backgroundColor:
                          act !== undefined ? (isAbove ? "#fff1f2" : "#f0fdf4") : "transparent",
                        transition: "background-color 0.15s",
                      }}
                    >
                      {act !== undefined ? act.toFixed(2).replace(/\.00$/, "") : ""}
                    </td>
                  );
                })}
                <td
                  style={{
                    border: "1px solid #94a3b8",
                    padding: "4px 4px",
                    fontWeight: 700,
                    color:
                      averageActual !== null && averageTarget !== null && averageActual > averageTarget
                        ? "#dc2626"
                        : "#0f766e",
                    backgroundColor: "#e2e8f0",
                  }}
                >
                  {averageActual !== null ? averageActual.toFixed(2).replace(/\.00$/, "") : "-"}
                </td>
              </tr>

              {/* TARGET ROW */}
              <tr>
                <td
                  style={{
                    border: "1px solid #94a3b8",
                    padding: "4px 6px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "#1e40af",
                    backgroundColor: "#f8fafc",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "2.5px",
                      backgroundColor: "#2563eb",
                      marginRight: "6px",
                      verticalAlign: "middle",
                    }}
                  />
                  TARGET
                </td>
                {fyMonths.map((m) => {
                  const tgt = targetMap[m.key] ?? defaultTarget;
                  return (
                    <td
                      key={m.key}
                      title={`Click to edit ${m.label} Target`}
                      onClick={() => handleCellClick(graphLetter, m.key)}
                      style={{
                        border: "1px solid #94a3b8",
                        padding: "4px 2px",
                        fontWeight: 600,
                        color: "#1e40af",
                        cursor: "pointer",
                        backgroundColor: "#f0f7ff",
                      }}
                    >
                      {tgt.toFixed(2).replace(/\.00$/, "")}
                    </td>
                  );
                })}
                <td
                  style={{
                    border: "1px solid #94a3b8",
                    padding: "4px 4px",
                    fontWeight: 700,
                    color: "#1e40af",
                    backgroundColor: "#e2e8f0",
                  }}
                >
                  {averageTarget !== null ? averageTarget.toFixed(2).replace(/\.00$/, "") : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    };

    return (
      <div className="w-100">
        {/* Top Controls: Financial Year Switcher */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold text-secondary small">Financial Year:</span>
            <select
              className="form-select form-select-sm rounded-3 fw-medium"
              style={{ width: "135px" }}
              value={selectedFY}
              onChange={(e) => setSelectedFY(Number(e.target.value))}
            >
              <option value={2026}>2026-27</option>
            </select>
          </div>


        </div>

        {/* Side-by-Side Graph Cards */}
        <div className="row g-4">
          {/* Graph A Card */}
          <div className="col-12 col-xl-6">
            <div
              className="card border shadow-sm rounded-4 p-3 p-md-4 h-100 d-flex flex-column justify-content-between"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div>
                {/* Card Header with Title and Add Data button */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                  <div>
                    <h5 className="fw-bold mb-0" style={{ color: "#1e293b", fontSize: "1.1rem" }}>
                      {graphATitle}
                    </h5>
                    <div className="text-muted small" style={{ fontSize: "0.8rem" }}>
                      Monthly Target &amp; Actual tracking
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn text-white d-inline-flex align-items-center gap-2 px-3 py-1 fw-semibold rounded-3 shadow-sm"
                    style={{
                      background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
                      fontSize: "0.84rem",
                    }}
                    onClick={() => handleOpenAddModal("A")}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Month Data
                  </button>
                </div>

                {/* Chart Canvas */}
                <div style={{ minHeight: "260px", height: "260px", position: "relative" }}>
                  <Bar
                    data={buildChartData(actualMapA, targetMapA, defaultTargetA) as any}
                    options={buildChartOptions(actualMapA, targetMapA, defaultTargetA)}
                  />
                </div>

                {/* Integrated Data Table Directly Below Bars */}
                {renderExcelDataTable(
                  "A",
                  actualMapA,
                  targetMapA,
                  defaultTargetA,
                  avgActualA,
                  avgTargetA,
                )}
              </div>
            </div>
          </div>

          {/* Graph B Card */}
          <div className="col-12 col-xl-6">
            <div
              className="card border shadow-sm rounded-4 p-3 p-md-4 h-100 d-flex flex-column justify-content-between"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div>
                {/* Card Header with Title and Add Data button */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                  <div>
                    <h5 className="fw-bold mb-0" style={{ color: "#1e293b", fontSize: "1.1rem" }}>
                      {graphBTitle}
                    </h5>
                    <div className="text-muted small" style={{ fontSize: "0.8rem" }}>
                      Monthly Target &amp; Actual tracking
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn text-white d-inline-flex align-items-center gap-2 px-3 py-1 fw-semibold rounded-3 shadow-sm"
                    style={{
                      background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
                      fontSize: "0.84rem",
                    }}
                    onClick={() => handleOpenAddModal("B")}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Month Data
                  </button>
                </div>

                {/* Chart Canvas */}
                <div style={{ minHeight: "260px", height: "260px", position: "relative" }}>
                  <Bar
                    data={buildChartData(actualMapB, targetMapB, defaultTargetB) as any}
                    options={buildChartOptions(actualMapB, targetMapB, defaultTargetB)}
                  />
                </div>

                {/* Integrated Data Table Directly Below Bars */}
                {renderExcelDataTable(
                  "B",
                  actualMapB,
                  targetMapB,
                  defaultTargetB,
                  avgActualB,
                  avgTargetB,
                )}
              </div>
            </div>
          </div>
        </div>

        {/* -------------------- ADD / UPDATE MONTHLY DATA & TARGET MODAL -------------------- */}
        {showModal && (
          <>
            <div
              className="modal-backdrop fade show"
              style={{ zIndex: 1050, backgroundColor: "rgba(15, 23, 42, 0.5)" }}
              onClick={handleCloseModal}
            />
            <div
              className="modal fade show d-block"
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              style={{ zIndex: 1055 }}
            >
              <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "440px" }}>
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                  <div className="modal-header border-bottom-0 pb-1 pt-4 px-4">
                    <div>
                      <h5 className="modal-title fw-bold text-dark mb-1">Update Month &amp; Target</h5>
                      <p className="text-muted small mb-0">
                        {selectedGraph === "A" ? graphATitle : graphBTitle}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={handleCloseModal}
                    />
                  </div>

                  <div className="modal-body px-4 py-3">
                    {/* Month Selection */}
                    <div className="mb-3">
                      <label
                        htmlFor="modal-month-select"
                        className="form-label fw-semibold text-secondary small mb-1"
                      >
                        Month &amp; Year
                      </label>
                      <select
                        id="modal-month-select"
                        className="form-select rounded-3 fs-6"
                        value={modalMonth}
                        onChange={(e) => handleMonthChange(e.target.value)}
                      >
                        {fyMonths.map((m) => (
                          <option key={m.key} value={m.key}>
                            {m.label} ({m.key})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Defects Count (Actual) */}
                    <div className="mb-3">
                      <label
                        htmlFor="modal-actual-input"
                        className="form-label fw-semibold text-secondary small mb-1"
                      >
                        Actual Defects Value
                      </label>
                      <input
                        id="modal-actual-input"
                        type="number"
                        step="any"
                        min="0"
                        placeholder="e.g. 1.28 (leave blank if not yet recorded)"
                        className="form-control form-control-lg rounded-3 fs-6"
                        value={modalActual}
                        autoFocus
                        onChange={(e) => {
                          setModalActual(e.target.value);
                          setModalValidationError("");
                        }}
                      />
                    </div>

                    {/* Target for this month */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label
                          htmlFor="modal-target-input"
                          className="form-label fw-semibold text-secondary small mb-0"
                        >
                          Target for this Month
                        </label>

                      </div>
                      <input
                        id="modal-target-input"
                        type="number"
                        step="any"
                        min="0"
                        placeholder={`e.g. ${selectedGraph === "A" ? defaultTargetA : defaultTargetB}`}
                        className="form-control form-control-lg rounded-3 fs-6"
                        value={modalTarget}
                        onChange={(e) => {
                          setModalTarget(e.target.value);
                          setModalValidationError("");
                        }}
                      />
                    </div>

                    {modalValidationError && (
                      <div className="alert alert-danger py-2 px-3 small rounded-3 mt-3 mb-0" role="alert">
                        {modalValidationError}
                      </div>
                    )}
                  </div>

                  <div className="modal-footer border-top-0 pt-0 px-4 pb-4">
                    <div className="d-flex gap-2 justify-content-between w-100">
                      <button
                        type="button"
                        className="btn btn-light px-3 py-2 rounded-3 fw-semibold text-secondary"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn text-white px-4 py-2 rounded-3 fw-semibold shadow-sm"
                        style={{
                          background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
                        }}
                        onClick={handleSaveModal}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
}

export default DefectGraphs;
