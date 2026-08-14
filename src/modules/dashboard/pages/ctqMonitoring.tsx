import { Link } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import profileSvg1 from "../../../assets/purple-profile.png";
import profileSvg2 from "../../../assets/pink-profile.png";
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
import { Bar, Line, Doughnut } from "react-chartjs-2";
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
);
function CTQMonitoring() {
  const data: ChartData<"bar">  = {
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
    ],
    datasets: [
      {
        label: "Required",
        data: [75, 60, 55, 70, 65, 20, 32, 56, 43, 23],
        backgroundColor: "#466ad5",
        borderRadius: 5,
        barThickness: 25,
        inflateAmount: -2,
        // categoryPercentage: 0.5,
        // barPercentage: 0.9,
      },
      {
        label: "Actual Present/Holiday",
        data: [55, 50, 45, 60, 55, 70, 60, 95, 70, 65],
        backgroundColor: "#ec2471",
        borderRadius: 5,
        barThickness: 25,
        inflateAmount: -2,
        // categoryPercentage: 0.5,
        // barPercentage: 0.9,
      },
      {
        label: "Current Headcount",
        data: [60, 30, 28, 40, 38, 50, 50, 45, 60, 55],
        backgroundColor: "#6740d5",
        borderRadius: 5,
        barThickness: 25,
        inflateAmount: -2,
        // categoryPercentage: 0.5,
        // barPercentage: 0.9,
      },
    ],
  };

  const options: ChartOptions<"bar">  = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded", // rounded square
          boxWidth: 12,
          boxHeight: 12,
          padding: 20,
          color: "#000",
          font: {
            size: 14,
            weight: 600,
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,

        grid: {
          color: "#d9d9d9",
          // borderDash: [10, 10],
          // drawBorder: false,
        },

        ticks: {
          display: true,
        },

        border: {
          display: false,
        },
      },
    },
  };

  const employeeAttrition: ChartData<"bar">  = {
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
    ],
    datasets: [
      {
        label: "Attendance",
        data: [65, 72, 80, 68, 90, 75, 82, 32, 70, 48, 30],
        backgroundColor: "#fbb05b",
        borderRadius: 8,
        barThickness: 30,
      },
    ],
  };

  const employeeAttritionOptions: ChartOptions<"bar">  = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
        grid: {
          color: "#e5e5e5",
          // borderDash: [5, 5],
        },
      },
    },
  };
  const emoloyeeAttritionData: ChartData<"line"> = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "New Hires",
        data: [18, 24, 20, 28, 32, 30, 35, 38],
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Resignations",
        data: [6, 8, 5, 9, 7, 10, 8, 9],
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Net Employee Count",
        data: [150, 166, 181, 200, 225, 245, 272, 301],
        borderColor: "#10b981",
        backgroundColor: "#10b981",
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const employeAttritionAploar: ChartOptions<"line">  = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50,
        },
      },
    },
  };
  const genderDistributionData: ChartData<"doughnut">  = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        label: "Employees",
        data: [620, 340, 40],
        backgroundColor: [
          "#466ad5", // Male
          "#ec2471", // Female
          "#8b5cf6", // Other
        ],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const genderDistributionOptions: ChartOptions<"doughnut">= {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 30,
          boxHeight: 8,
          padding: 20,
        },
      },
    },
  };
  return (
    <>
      <div className="h-auto shadow border p-4">
        <div className="darkgrey-bg px-4 w-100 h-50px rounded-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center jutify-content-center">
            <Link
              to="/portal"
              className="text-decoration-none text-black d-flex align-items-center"
            >
              <svg
                className="me-2"
                aria-hidden="true"
                width="16px"
                height="16px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.7071 3.29289C17.0976 3.68342 17.0976 4.31658 16.7071 4.70711L9.41421 12L16.7071 19.2929C17.0976 19.6834 17.0976 20.3166 16.7071 20.7071C16.3166 21.0976 15.6834 21.0976 15.2929 20.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L15.2929 3.29289C15.6834 2.90237 16.3166 2.90237 16.7071 3.29289Z"
                  fill="#000000"
                ></path>
              </svg>
              Menu
            </Link>
            <h5 className="mb-0 ms-4">Dashboard</h5>
          </div>
        </div>
        {/* FOUR COMPONENTS AT DASHBOARD ----------------------  */}
        <div className="row g-0 g-0 my-4">
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <div className="row g-0 p-3  border shadow scale-transition rounded-4">
              <div className="col center-elements">
                <img
                  className="h-60px my-fade-purple rounded-pill p-1"
                  src={profileSvg1}
                  alt=""
                />
              </div>
              <div className="col d-flex flex-column justify-content-between align-items-start">
                <p className="text-secondary">heading</p>
                <p className="fw-semibold fs-5">description</p>
                <p>%5---</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <div className="row g-0 p-3 border shadow scale-transition rounded-4">
              <div className="col center-elements">
                <img
                  className="h-60px my-fade-pink rounded-pill p-1"
                  src={profileSvg2}
                  alt=""
                />
              </div>
              <div className="col d-flex flex-column justify-content-between align-items-start">
                <p className="text-secondary">heading</p>
                <p className="fw-semibold fs-5">description</p>
                <p>%5---</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <div className="row g-0 p-3 border shadow scale-transition rounded-4">
              <div className="col center-elements">
                <img
                  className="h-60px my-fade-blue rounded-circle p-1"
                  src={profileSvg3}
                  alt=""
                />
              </div>
              <div className="col d-flex flex-column justify-content-between align-items-start">
                <p className="text-secondary">heading</p>
                <p className="fw-semibold fs-5">description</p>
                <p>%5---</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <div className="row g-0 p-3 border shadow scale-transition rounded-4">
              <div className="col center-elements">
                <img
                  className="h-60px my-fade-yellow rounded-circle p-1"
                  src={profileSvg4}
                  alt=""
                />
              </div>
              <div className="col d-flex flex-column justify-content-between align-items-start">
                <p className="text-secondary">heading</p>
                <p className="fw-semibold fs-5">description</p>
                <p>%5---</p>
              </div>
            </div>
          </div>
        </div>
        {/* FILTERS DIV--------------------------------------------- */}
        <div className="d-flex align-item-center justify-content-start flex-wrap p-2 mt-3">
          <div className="dropdown me-2 pink-border rounded-pill pink-text my-fade-pink scale-transition mb-2">
            <button
              className="btn rounded-pill border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Units
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
          <div className="dropdown me-2 pink-border rounded-pill pink-text my-fade-pink scale-transition mb-2">
            <button
              className="btn rounded-pill border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Departments
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
          <div className="dropdown me-2 pink-border rounded-pill pink-text my-fade-pink scale-transition mb-2">
            <button
              className="btn rounded-pill border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Sections
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
          <div className="dropdown me-2 pink-border rounded-pill pink-text my-fade-pink scale-transition mb-2">
            <button
              className="btn rounded-pill border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Lines
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
          <div className="dropdown me-2 pink-border rounded-pill pink-text my-fade-pink scale-transition mb-2">
            <button
              className="btn rounded-pill border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Shifts
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center me-2 mb-2">
            <p className="me-1 mb-0">From:</p>
            <input
              type="date"
              className="h-100 scale-transition p-2 text-black bordere-0 outline-0 pink-border rounded-pill pink-text my-fade-pink"
            />
          </div>
          <div className="d-flex align-items-center me-2 mb-2">
            <p className="me-1 mb-0">To:</p>
            <input
              type="date"
              className="h-100 scale-transition p-2 text-black bordere-0 outline-0 pink-border rounded-pill pink-text my-fade-pink"
            />
          </div>
        </div>
        {/* TRIPPLE BAR GRAPH ------------------------------------- */}
        <div
          style={{ overflowX: "auto" }}
          className="my-3 px-3 rounded-4 shadow scale-transition-sm border"
        >
          <div className="d-flex align-items-center justify-content-between ps-0 p-4">
            <div className="d-flex align-items-center w-auto flex-shrink-0 me-5 p-2">
              <svg
                className="me-3 my-fade-pink rounded-circle p-2"
                width="45px"
                height="45px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 19V18C18 15.7909 16.2091 14 14 14H10C7.79086 14 6 15.7909 6 18V19M23 19V18C23 15.7909 21.2091 14 19 14H18.5M1 19V18C1 15.7909 2.79086 14 5 14H5.5M17 11C18.6569 11 20 9.65685 20 8C20 6.34315 18.6569 5 17 5M7 11C5.34315 11 4 9.65685 4 8C4 6.34315 5.34315 5 7 5M15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8Z"
                  stroke="#e22b6e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <h5 className="mb-0 fw-bold">Daily CTQMonitoring Trend</h5>
            </div>
          </div>
          {/* CHART DIV--------------------------- */}
          <div
            className="p-4"
            style={{
              width: `${(data.labels?.length ?? 0) * 140}px`,
              height: "400px",
            }}
          >
            <Bar data={data} options={options} />
          </div>
        </div>
        {/* EMPLOYEE ATTRITION AND EMPLOYEE ABSENCE----------------------------------------- */}
        <div className="row g-0 my-4 g-3">
          {/* Employee Absence chart-------- */}
          <div className="col-lg-6 col-12 pe-2">
            <div className="p-4 rounded-4 border shadow scale-transition-sm">
              {/* HEADINGSS----------------- */}
              <div>
                <p className="fw-bold">Employee absense</p>
                <p className="text-secondary">
                  Daily absences in selected month
                </p>
              </div>

              {/* BAR GRAPH OF THE EMPLOYEE ACSENSE */}
              <div style={{ overflowX: "auto" }}>
                <div
                  className="p-4"
                  style={{
                    width: "auto",
                    height: "300px",
                  }}
                >
                  <Bar
                    data={employeeAttrition}
                    options={employeeAttritionOptions}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Employee Attrition chart-------- */}
          <div className="col-lg-6 col-12 ps-2">
            <div className="p-4 border shadow rounded-4 scale-transition-sm">
              {/* HEADINGSS----------------- */}
              <div>
                <p className="fw-bold">Employee Attrition</p>
                <p className="text-secondary">
                  New hires, resignations and attrition trend
                </p>
              </div>

              {/* GRAPH OF THE EMPLLOYEE ATTRITION */}
              <div
                className="p-4"
                style={{
                  width: `auto`,
                  height: "300px",
                }}
              >
                <Line
                  data={emoloyeeAttritionData}
                  options={employeAttritionAploar}
                />
              </div>
            </div>
          </div>
        </div>
        {/* GENDER DISTRIBUTION DOUGHNUT -------------------------------------------- */}
        <div className="row g-0 ">
          <div className="col-lg-6 col-12 pe-2 ">
            {/* DOUGHNUT CHART----------------------- */}
            <div className="shadow border rounded-4 p-4 scale-transition-sm">
              {/* HEADINGSS----------------- */}
              <div>
                <p className="fw-bold">Employee absense</p>
                <p className="text-secondary">
                  Daily absences in selected month
                </p>
              </div>
              <div style={{ height: "300px" }} className="p-4">
                <Doughnut
                  data={genderDistributionData}
                  options={genderDistributionOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CTQMonitoring;
