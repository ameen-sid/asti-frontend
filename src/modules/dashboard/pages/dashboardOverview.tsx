import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import DashboardFilterBar from "../components/dashboardFilterBar";
import profileSvg1 from "../../../assets/purple-profile.png";
import profileSvg2 from "../../../assets/blue-profile.png";
import profileSvg3 from "../../../assets/blue-profile.png";
import profileSvg4 from "../../../assets/yellow-profile.png";

import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

// Ensure datalabels plugin always recognizes BarElement across Vite chunk boundaries
if (BarElement && !Object.prototype.hasOwnProperty.call(BarElement, Symbol.hasInstance)) {
  Object.defineProperty(BarElement, Symbol.hasInstance, {
    value: (instance: any) =>
      Boolean(
        instance &&
        (instance.constructor?.name === "BarElement" ||
          (instance.base !== undefined && instance.horizontal !== undefined)),
      ),
  });
}
function DashboardOverview() {
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleClearFilters = () => {
    setSelectedFilters({});
    setFromDate("");
    setToDate("");
  };

  const data: ChartData<"bar"> = {
    labels: [
      "26 Jul",
      "27 Jul",
      "28 Jul",
      "29 Jul",
      "30 Jul",
      "31 Jul",
      "1 Aug",
      "2 Aug",
      "3 Aug",
      "4 Aug",
      "5 Aug",
      "6 Aug",
      "7 Aug",
      "8 Aug",
      "9 Aug",
      "10 Aug",
      "11 Aug",
      "12 Aug",
      "13 Aug",
      "14 Aug",
      "15 Aug",
      "16 Aug",
    ],
    datasets: [
      {
        label: "Required",
        data: [75, 60, 55, 70, 65, 20, 32, 56, 43, 23, 10, 54, 64, 24, 34, 44, 54, 64, 74, 84, 94, 104],
        backgroundColor: "#f59e0b",
        borderRadius: 5,
        barThickness: 25,
        inflateAmount: -2,
      },
      {
        label: "Allocation",
        data: [55, 50, 45, 60, 55, 70, 60, 95, 70, 65, 20, 14, 24, 43, 24, 55, 70, 12, 32, 55, 60, 80],
        backgroundColor: "#1e40af",
        borderRadius: 5,
        barThickness: 25,
        inflateAmount: -2,
      },
      {
        label: "Actual Present",
        data: [60, 30, 28, 40, 38, 50, 50, 45, 60, 55, 30, 44, 54, 64, 74, 84, 94, 104, 104, 104, 104, 104],
        backgroundColor: "#2563eb",
        borderRadius: 5,
        barThickness: 25,
        inflateAmount: -2,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    layout: {
      padding: {
        top: 22,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "top",
        offset: 2,
        clip: false,
        color: "#1E293B",
        font: {
          size: 11,
          weight: "bold",
        },
        formatter: (value: number) => value,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#1E293B",
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 115,

        grid: {
          color: "#e2e8f0",
        },

        ticks: {
          display: true,
          color: "#1E293B",
        },

        border: {
          display: false,
        },
      },
    },
  };

  const dailyAbsenteeismData: ChartData<"bar"> = {
    labels: [
      "26 Jul",
      "27 Jul",
      "28 Jul",
      "29 Jul",
      "30 Jul",
      "31 Jul",
      "1 Aug",
      "2 Aug",
      "3 Aug",
      "4 Aug",
      "5 Aug",
      "6 Aug",
      "7 Aug",
      "8 Aug",
      "9 Aug",
      "10 Aug",
      "11 Aug",
      "12 Aug",
      "13 Aug",
      "14 Aug",
      "15 Aug",

    ],
    datasets: [
      {
        // label: "none",
        data: [15, 18, 12, 20, 16, 8, 14, 22, 17, 10, 12, 18, 14, 12, 10, 8, 9, 10, 5, 8, 9, 11],
        backgroundColor: "#1d4ed8",
        hoverBackgroundColor: "#1e40af",
        borderRadius: 6,
        barThickness: 22,
      },
    ],
  };

  const dailyAbsenteeismOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 22,
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "bottom",
        labels: {
          color: "#1E293B",
          font: {
            weight: 600,
          },
        },
      },
      datalabels: {
        anchor: "end",
        align: "top",
        offset: 2,
        clip: false,
        color: "#1E293B",
        font: {
          size: 11,
          weight: "bold",
        },
        formatter: (value: number) => value,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#1E293B",
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 26,
        ticks: {
          stepSize: 5,
          color: "#1E293B",
        },
        grid: {
          color: "#e2e8f0",
        },
      },
    },
  };

  const dailyAttritionData: ChartData<"bar"> = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Weekly Attrition",
        data: [8, 12, 6, 14],
        backgroundColor: "#172554",
        hoverBackgroundColor: "#0f172a",
        borderRadius: 6,
        barThickness: 32,
      },
    ],
  };

  const dailyAttritionOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 22,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#1E293B",
          font: {
            weight: 600,
          },
        },
      },
      datalabels: {
        anchor: "end",
        align: "top",
        offset: 2,
        clip: false,
        color: "#1E293B",
        font: {
          size: 11,
          weight: "bold",
        },
        formatter: (value: number) => value,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#1E293B",
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 18,
        ticks: {
          stepSize: 4,
          color: "#1E293B",
        },
        grid: {
          color: "#e2e8f0",
        },
      },
    },
  };

  const secondManpowerData: ChartData<"bar"> = {
    labels: [
      "26 Jul",
      "27 Jul",
      "28 Jul",
      "29 Jul",
      "30 Jul",
      "31 Jul",
      "1 Aug",
      "2 Aug",
      "3 Aug",
      "4 Aug",
      "5 Aug",
      "6 Aug",
      "7 Aug",
      "8 Aug",
      "9 Aug",
      "10 Aug",
      "11 Aug",
      "12 Aug",
      "13 Aug",
      "14 Aug",
      "15 Aug",
    ],
    datasets: [
      {
        label: "Planned",
        data: [72, 64, 58, 68, 62, 28, 36, 58, 48, 29, 34, 44, 54, 64, 74, 84, 94, 104, 104, 104, 104, 104],
        backgroundColor: "#3b82f6",
        borderRadius: 5,
        barThickness: 25,
        inflateAmount: -2,
      },
      {
        label: "Deployed",
        data: [60, 52, 46, 62, 56, 68, 58, 88, 65, 60, 30, 44, 54, 64, 74, 84, 94, 104, 104, 104, 104, 104],
        backgroundColor: "#5B6FAF",
        borderRadius: 5,
        barThickness: 25,
        inflateAmount: -2,
      },
      {
        label: "Optimal",
        data: [58, 32, 26, 42, 36, 48, 46, 42, 58, 52, 30, 44, 54, 64, 74, 84, 94, 104, 104, 104, 104, 104],
        backgroundColor: "#172554",
        borderRadius: 5,
        barThickness: 25,
        inflateAmount: -2,
      },
    ],
  };

  const secondManpowerOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    layout: {
      padding: {
        top: 22,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "top",
        offset: 2,
        clip: false,
        color: "#1E293B",
        font: {
          size: 11,
          weight: "bold",
        },
        formatter: (value: number) => value,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#1E293B",
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 110,
        grid: {
          color: "#e2e8f0",
        },
        ticks: {
          display: true,
          color: "#1E293B",
        },
        border: {
          display: false,
        },
      },
    },
  };

  // ─── Skill Level Distribution (L0–L4) ──────────────────────────
  const skillLevelData: ChartData<"bar"> = {
    labels: ["L0", "L1", "L2", "L3", "L4"],
    datasets: [
      {
        label: "Required",
        data: [120, 95, 80, 60, 35],
        backgroundColor: "#4F46A5",
        borderRadius: 5,
        barThickness: 40,
        inflateAmount: -2,
      },
      {
        label: "Allocation",
        data: [100, 88, 72, 55, 30],
        backgroundColor: "#4F46A5",
        borderRadius: 5,
        barThickness: 40,
        inflateAmount: -2,
      },
      {
        label: "Actual Present",
        data: [85, 76, 65, 48, 24],
        backgroundColor: "#14B8A6",
        borderRadius: 5,
        barThickness: 40,
        inflateAmount: -2,
      },
    ],
  };

  const skillLevelOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    layout: {
      padding: {
        top: 22,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "top",
        offset: 2,
        clip: false,
        color: "#1E293B",
        font: {
          size: 11,
          weight: "bold",
        },
        formatter: (value: number) => value,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#1E293B",
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 150,
        grid: {
          color: "#e2e8f0",
        },
        ticks: {
          display: true,
          color: "#1E293B",
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <>
      <div className="h-auto shadow border p-4">
        {/* FILTERS DIV--------------------------------------------- */}
        <DashboardFilterBar
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          handleClearFilters={handleClearFilters}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          className="ctq-filter-bar border rounded-4 shadow-sm p-3 mt-3"
        />

        {/* FOUR KPI CARDS ----------------------  */}
        <div className="row g-0 g-0 my-4">
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <div className="row g-0 p-3 border shadow rounded-4">
              <div className="col center-elements" >
                <svg width="43px" height="43px" viewBox="0 0 24 24" fill="#1e40af" xmlns="http://www.w3.org/2000/svg">

                  <rect x="0" fill="none" width="24" height="24"></rect>

                  <g>

                    <path d="M24 14.6c0 .6-1.2 1-2.6 1.2-.9-1.7-2.7-3-4.8-3.9.2-.3.4-.5.6-.8h.8c3.1-.1 6 1.8 6 3.5zM6.8 11H6c-3.1 0-6 1.9-6 3.6 0 .6 1.2 1 2.6 1.2.9-1.7 2.7-3 4.8-3.9l-.6-.9zm5.2 1c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 1c-4.1 0-8 2.6-8 5 0 2 8 2 8 2s8 0 8-2c0-2.4-3.9-5-8-5zm5.7-3h.3c1.7 0 3-1.3 3-3s-1.3-3-3-3c-.5 0-.9.1-1.3.3.8 1 1.3 2.3 1.3 3.7 0 .7-.1 1.4-.3 2zM6 10h.3C6.1 9.4 6 8.7 6 8c0-1.4.5-2.7 1.3-3.7C6.9 4.1 6.5 4 6 4 4.3 4 3 5.3 3 7s1.3 3 3 3z"></path>

                  </g>

                </svg>
              </div>
              <div className="col d-flex flex-column justify-content-center align-items-start">
                <p className="text-secondary" style={{ fontSize: "0.85rem" }}>
                  Total Manpower
                </p>
                <p className="fw-semibold fs-5" style={{ color: "#1e40af" }}>
                  1,250
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <div className="row g-0 p-3 border shadow rounded-4">
              <div className="col center-elements">
                <svg width="55px" height="55px" viewBox="0 0 24 24">
                  <path fill-rule="fill" clip-rule="evenodd" d="M6.83333 11.8333C8.44167 11.8333 9.75 10.525 9.75 8.91667C9.75 7.30833 8.44167 6 6.83333 6C5.225 6 3.91667 7.30833 3.91667 8.91667C3.91667 10.525 5.225 11.8333 6.83333 11.8333ZM21 15.3333V12.8333H23.5V11.1667H21V8.66666H19.3333V11.1667H16.8333V12.8333H19.3333V15.3333H21ZM6.83333 13.2917C4.88333 13.2917 1 14.2667 1 16.2083V17.6667H12.6667V16.2083C12.6667 14.2667 8.78333 13.2917 6.83333 13.2917ZM6.83333 14.9583C5.34166 14.9583 3.65 15.5167 2.95 16H10.7167C10.0167 15.5167 8.325 14.9583 6.83333 14.9583ZM8.08333 8.91667C8.08333 8.225 7.525 7.66667 6.83333 7.66667C6.14167 7.66667 5.58333 8.225 5.58333 8.91667C5.58333 9.60833 6.14167 10.1667 6.83333 10.1667C7.525 10.1667 8.08333 9.60833 8.08333 8.91667ZM11 11.8333C12.6083 11.8333 13.9167 10.525 13.9167 8.91667C13.9167 7.30833 12.6083 6 11 6C10.8 6 10.6 6.01667 10.4083 6.05833C11.0417 6.84167 11.4167 7.83333 11.4167 8.91667C11.4167 10 11.025 10.9833 10.3917 11.7667C10.5917 11.8083 10.7917 11.8333 11 11.8333ZM14.3333 16.2083C14.3333 15.075 13.7667 14.1917 12.9333 13.5167C14.8 13.9083 16.8333 14.8 16.8333 16.2083V17.6667H14.3333V16.2083Z" fill="#1e40af"></path>
                </svg>
              </div>
              <div className="col d-flex flex-column justify-content-center align-items-start">
                <p className="text-secondary" style={{ fontSize: "0.85rem" }}>
                  Total Present
                </p>
                <p className="fw-semibold fs-5" style={{ color: "#1e40af" }}>
                  1,148
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <div className="row g-0 p-3 border shadow rounded-4">
              <div className="col center-elements">
                <svg aria-hidden="true" enable-background="new 0 0 24 24" height="40" viewBox="0 0 24 24" width="40" fill="#1e40af"><rect fill="none" height="24" width="24"></rect><path d="M18,10c0-0.55,0.45-1,1-1h4c0.55,0,1,0.45,1,1s-0.45,1-1,1h-4C18.45,11,18,10.55,18,10z M8,4C5.79,4,4,5.79,4,8s1.79,4,4,4 s4-1.79,4-4S10.21,4,8,4z M8,13c-2.67,0-8,1.34-8,4v3h16v-3C16,14.34,10.67,13,8,13z M12.51,4.05C13.43,5.11,14,6.49,14,8 s-0.57,2.89-1.49,3.95C14.47,11.7,16,10.04,16,8S14.47,4.3,12.51,4.05z M16.53,13.83C17.42,14.66,18,15.7,18,17v3h2v-3 C20,15.55,18.41,14.49,16.53,13.83z"></path></svg>
              </div>
              <div className="col d-flex flex-column justify-content-center align-items-start">
                <p className="text-secondary" style={{ fontSize: "0.85rem" }}>
                  Total Absent
                </p>
                <p className="fw-semibold fs-5" style={{ color: "#1e40af" }}>
                  102
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <div className="row g-0 p-3 border shadow rounded-4">
              <div className="col center-elements">
                <svg fill="#1e40af" width="40px" height="40px" viewBox="-3 0 19 19" xmlns="http://www.w3.org/2000/svg"><path d="M12.517 12.834v1.9a1.27 1.27 0 0 1-1.267 1.267h-9.5a1.27 1.27 0 0 1-1.267-1.267v-1.9A3.176 3.176 0 0 1 3.65 9.667h5.7a3.176 3.176 0 0 1 3.167 3.167zM3.264 5.48A3.236 3.236 0 1 1 6.5 8.717a3.236 3.236 0 0 1-3.236-3.236z"></path></svg>
              </div>
              <div className="col d-flex flex-column justify-content-center align-items-start">
                <p className="text-secondary" style={{ fontSize: "0.85rem" }}>
                  Attendance %
                </p>
                <p className="fw-semibold fs-5" style={{ color: "#1e40af" }}>
                  91.8%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TRIPPLE BAR GRAPH ------------------------------------- */}
        <div className="my-3 rounded-4 shadow -sm border bg-white">
          <div className="d-flex align-items-center justify-content-between p-4 pb-2">
            <div className="d-flex align-items-center w-auto flex-shrink-0 p-1">
              <svg
                className="me-3 my-fade-blue rounded-circle p-2"
                width="45px"
                height="45px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 19V18C18 15.7909 16.2091 14 14 14H10C7.79086 14 6 15.7909 6 18V19M23 19V18C23 15.7909 21.2091 14 19 14H18.5M1 19V18C1 15.7909 2.79086 14 5 14H5.5M17 11C18.6569 11 20 9.65685 20 8C20 6.34315 18.6569 5 17 5M7 11C5.34315 11 4 9.65685 4 8C4 6.34315 5.34315 5 7 5M15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8Z"
                  stroke="#5B6FAF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <h5 className="mb-0 fw-bold" style={{ color: "#172554" }}>Daily Manpower Trend</h5>
            </div>
          </div>
          {/* CHART DIV--------------------------- */}
          <div style={{ overflowX: "auto" }}>
            <div
              className="p-4 pt-2"
              style={{
                width: `${(data.labels?.length ?? 0) * 140}px`,
                height: "400px",
              }}
            >
              <Bar data={data} options={options} plugins={[ChartDataLabels]} />
            </div>
          </div>
          {/* FIXED BOTTOM INFORMATION (NOT HORIZONTALLY SCROLLABLE) */}
          <div
            className="d-flex align-items-center justify-content-center flex-wrap gap-4 py-3 px-4 border-top"
            style={{
              background: "#fafbff",
              borderBottomLeftRadius: "1rem",
              borderBottomRightRadius: "1rem",
            }}
          >
            <div className="d-flex align-items-center">
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: "#F59E0B",
                  display: "inline-block",
                  marginRight: 8,
                }}
              ></span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                Required
              </span>
            </div>
            <div className="d-flex align-items-center">
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: "#1e40af",
                  display: "inline-block",
                  marginRight: 8,
                }}
              ></span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                Allocation
              </span>
            </div>
            <div className="d-flex align-items-center">
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: "#2563eb",
                  display: "inline-block",
                  marginRight: 8,
                }}
              ></span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                Actual Present
              </span>
            </div>
          </div>
        </div>
        {/* DAILY ABSENTEEISM AND DAILY ATTRITION ----------------------------------------- */}
        <div className="row g-0 my-4 g-3">
          {/* Daily Absenteeism chart-------- */}
          <div className="col-lg-6 col-12 pe-2">
            <div className="p-4 rounded-4 border shadow -sm">
              {/* HEADINGSS----------------- */}
              <div className="d-flex align-items-center mb-1">
                <svg
                  className="me-2 my-fade-blue rounded-circle p-2 flex-shrink-0"
                  width="38px"
                  height="38px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="17" y1="8" x2="22" y2="13" />
                  <line x1="22" y1="8" x2="17" y2="13" />
                </svg>
                <div>
                  <p className="fw-bold mb-0" style={{ color: "#172554" }}>Daily Absenteeism</p>
                  <p className="text-secondary" style={{ fontSize: "0.85rem" }}>
                    Daily absences in selected month
                  </p>
                </div>
              </div>

              {/* SINGLE BAR GRAPH OF DAILY ABSENTEEISM */}
              <div style={{ overflowX: "auto" }}>
                <div
                  className="p-4 pt-2"
                  style={{
                    width: `${(data.labels?.length ?? 0) * 40}px`,
                    height: "235px",
                  }}
                >
                  <Bar
                    data={dailyAbsenteeismData}
                    options={dailyAbsenteeismOptions}
                    plugins={[ChartDataLabels]}
                  />
                </div>
              </div>
              {/* FIXED BOTTOM INFORMATION (NOT HORIZONTALLY SCROLLABLE) */}
              <div
                className="d-flex align-items-center justify-content-center flex-wrap gap-4 py-3 px-4 border-top"
                style={{
                  background: "#fafbff",
                  borderBottomLeftRadius: "1rem",
                  borderBottomRightRadius: "1rem",
                }}
              >
                <div className="d-flex align-items-center">
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      backgroundColor: "#1d4ed8",
                      display: "inline-block",
                      marginRight: 8,
                    }}
                  ></span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#1E293B",
                    }}
                  >
                    Daily Absenteeism
                  </span>
                </div>

              </div>
            </div>
          </div>
          {/* Daily Attrition chart-------- */}
          <div className="col-lg-6 col-12 ps-2">
            <div className="p-4 border shadow rounded-4 -sm">
              {/* HEADINGSS----------------- */}
              <div className="d-flex align-items-center mb-1">
                <svg
                  className="me-2 my-fade-blue rounded-circle p-2 flex-shrink-0"
                  width="38px"
                  height="38px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#172554"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
                <div>
                  <p className="fw-bold mb-0" style={{ color: "#172554" }}>Weekly Attrition</p>
                  <p className="text-secondary" style={{ fontSize: "0.85rem" }}>
                    Weekly employee attrition trend
                  </p>
                </div>
              </div>

              {/* SINGLE BAR GRAPH OF WEEKLY ATTRITION */}
              <div
                className="p-4"
                style={{
                  width: "100%",
                  height: "300px",
                }}
              >
                <Bar
                  data={dailyAttritionData}
                  options={dailyAttritionOptions}
                  plugins={[ChartDataLabels]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* DAILY MANPOWER DEPLOYMENT (SECOND GRAPH LIKE MANPOWER) ----------------------- */}
        <div className="border rounded-4 shadow-sm mt-4">
          {/* TOP HEADING */}
          <div className="d-flex align-items-center justify-content-between p-4 pb-0">
            <div className="d-flex align-items-center">
              <svg
                className="me-2 my-fade-blue rounded-circle p-2 flex-shrink-0"
                width="38px"
                height="38px"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <h5 className="mb-0 fw-bold" style={{ color: "#172554" }}>DOJO Manpower Trend</h5>
            </div>
          </div>
          {/* CHART DIV--------------------------- */}
          <div style={{ overflowX: "auto" }}>
            <div
              className="p-4 pt-2"
              style={{
                width: `${(secondManpowerData.labels?.length ?? 0) * 140}px`,
                height: "400px",
              }}
            >
              <Bar
                data={secondManpowerData}
                options={secondManpowerOptions}
                plugins={[ChartDataLabels]}
              />
            </div>
          </div>
          {/* FIXED BOTTOM INFORMATION (NOT HORIZONTALLY SCROLLABLE) */}
          <div
            className="d-flex align-items-center justify-content-center flex-wrap gap-4 py-3 px-4 border-top"
            style={{
              background: "#fafbff",
              borderBottomLeftRadius: "1rem",
              borderBottomRightRadius: "1rem",
            }}
          >
            <div className="d-flex align-items-center">
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: "#3b82f6",
                  display: "inline-block",
                  marginRight: 8,
                }}
              ></span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                Planned
              </span>
            </div>
            <div className="d-flex align-items-center">
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: "#5B6FAF",
                  display: "inline-block",
                  marginRight: 8,
                }}
              ></span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                Deployed
              </span>
            </div>
            <div className="d-flex align-items-center">
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: "#172554",
                  display: "inline-block",
                  marginRight: 8,
                }}
              ></span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                Optimal
              </span>
            </div>
          </div>
        </div>

        {/* SKILL LEVEL DISTRIBUTION L0–L4 ------------------------------------------------ */}
        <div className="border rounded-4 shadow-sm mt-4 w-100">
          {/* TOP HEADING */}
          <div className="d-flex align-items-center justify-content-between p-4 pb-0">
            <div className="d-flex align-items-center">
              <svg
                className="me-2 my-fade-blue rounded-circle p-2 flex-shrink-0"
                width="38px"
                height="38px"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5B6FAF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <div>
                <h5 className="mb-0 fw-bold" style={{ color: "#172554" }}>Skill Level Distribution</h5>
                <p className="mb-0 text-secondary" style={{ fontSize: "0.8rem" }}>Workforce skill progression from L0 to L4</p>
              </div>
            </div>
          </div>
          {/* CHART DIV */}
          <div style={{ overflowX: "auto" }}>
            <div
              className="p-4 pt-2"
              style={{
                width: "100%",
                height: "420px",
              }}
            >
              <Bar
                data={skillLevelData}
                options={skillLevelOptions}
                plugins={[ChartDataLabels]}
              />
            </div>
          </div>
          {/* FIXED BOTTOM LEGEND */}
          <div
            className="d-flex align-items-center justify-content-center flex-wrap gap-4 py-3 px-4 border-top"
            style={{
              background: "#fafbff",
              borderBottomLeftRadius: "1rem",
              borderBottomRightRadius: "1rem",
            }}
          >
            {[
              { color: "#4F46A5", label: "Required" },
              { color: "#2563EB", label: "Allocation" },
              { color: "#14B8A6", label: "Actual Present" },
            ].map(({ color, label }) => (
              <div key={label} className="d-flex align-items-center">
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    backgroundColor: color,
                    display: "inline-block",
                    marginRight: 8,
                  }}
                ></span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1E293B" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default DashboardOverview;
