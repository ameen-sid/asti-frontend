import React, { useState } from "react";
import "../../../styles/attendance.css";
import DashboardFilterBar from "../components/dashboardFilterBar";

interface AttendanceRecord {
  srNo: number;
  empId: string;
  name: string;
  department: string;
  category: string;
  designation: string;
  shift: string;
  start: string;
  inTime: string;
  outTime: string;
  hrs: string;
  status: "Present" | "Absent" | "Half Day" | "Present";
  late: string;
  early: string;
  otHrs: string;
}

const ATTENDANCE_DATA: AttendanceRecord[] = [
  {
    srNo: 1,
    empId: "00001001",
    name: "Aarav Sharma",
    department: "Production",
    category: "Production",
    designation: "Operator",
    shift: "A",
    start: "09:00",
    inTime: "08:56",
    outTime: "17:15",
    hrs: "08:19",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:15",
  },
  {
    srNo: 2,
    empId: "00001002",
    name: "Priya Patel",
    department: "Quality",
    category: "Production",
    designation: "Inspector",
    shift: "A",
    start: "09:00",
    inTime: "08:50",
    outTime: "17:05",
    hrs: "08:15",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:05",
  },
  {
    srNo: 3,
    empId: "00001003",
    name: "Rohit Verma",
    department: "Assembly",
    category: "Production",
    designation: "Sr. Operator",
    shift: "A",
    start: "09:00",
    inTime: "09:15",
    outTime: "17:00",
    hrs: "07:45",
    status: "Present",
    late: "00:15",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 4,
    empId: "00001004",
    name: "Ananya Iyer",
    department: "SMT",
    category: "Production",
    designation: "Technician",
    shift: "A",
    start: "09:00",
    inTime: "-",
    outTime: "-",
    hrs: "00:00",
    status: "Absent",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 5,
    empId: "00001005",
    name: "Rajesh Kumar",
    department: "Maintenance",
    category: "Production",
    designation: "Supervisor",
    shift: "General",
    start: "08:30",
    inTime: "08:25",
    outTime: "18:00",
    hrs: "09:35",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "01:30",
  },
  {
    srNo: 6,
    empId: "00001006",
    name: "Sneha Reddy",
    department: "Testing",
    category: "Production",
    designation: "Engineer",
    shift: "A",
    start: "09:00",
    inTime: "08:58",
    outTime: "17:30",
    hrs: "08:32",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:30",
  },
  {
    srNo: 7,
    empId: "00001007",
    name: "Vikram Singh",
    department: "Production",
    category: "Production",
    designation: "Operator",
    shift: "B",
    start: "14:00",
    inTime: "13:52",
    outTime: "22:10",
    hrs: "08:18",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:10",
  },
  {
    srNo: 8,
    empId: "00001008",
    name: "Pooja Gupta",
    department: "HR",
    category: "Production",
    designation: "Executive",
    shift: "General",
    start: "09:00",
    inTime: "09:02",
    outTime: "13:30",
    hrs: "04:28",
    status: "Half Day",
    late: "00:02",
    early: "03:30",
    otHrs: "00:00",
  },
  {
    srNo: 9,
    empId: "00001009",
    name: "Amit Mishra",
    department: "Logistics",
    category: "Production",
    designation: "Stores Lead",
    shift: "A",
    start: "09:00",
    inTime: "-",
    outTime: "-",
    hrs: "00:00",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 10,
    empId: "00001010",
    name: "Neha Joshi",
    department: "Quality",
    category: "Production",
    designation: "Auditor",
    shift: "A",
    start: "09:00",
    inTime: "08:45",
    outTime: "17:15",
    hrs: "08:30",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:15",
  },
  {
    srNo: 11,
    empId: "00001011",
    name: "Kavita Nair",
    department: "Packaging",
    category: "Production",
    designation: "Operator",
    shift: "A",
    start: "09:00",
    inTime: "08:55",
    outTime: "17:00",
    hrs: "08:05",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 12,
    empId: "00001012",
    name: "Rahul Deshmukh",
    department: "Assembly",
    category: "Production",
    designation: "Operator",
    shift: "Night",
    start: "22:00",
    inTime: "21:50",
    outTime: "06:10",
    hrs: "08:20",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:10",
  },
  {
    srNo: 13,
    empId: "00001013",
    name: "Deepak Yadav",
    department: "Production",
    category: "Production",
    designation: "Line Incharge",
    shift: "A",
    start: "09:00",
    inTime: "08:40",
    outTime: "18:00",
    hrs: "09:20",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "01:00",
  },
  {
    srNo: 14,
    empId: "00001014",
    name: "Ritu Chauhan",
    department: "Testing",
    category: "Production",
    designation: "Technician",
    shift: "A",
    start: "09:00",
    inTime: "09:20",
    outTime: "17:20",
    hrs: "08:00",
    status: "Present",
    late: "00:20",
    early: "00:00",
    otHrs: "00:20",
  },
  {
    srNo: 15,
    empId: "00001015",
    name: "Manoj Tiwari",
    department: "Maintenance",
    category: "Production",
    designation: "Electrician",
    shift: "General",
    start: "08:30",
    inTime: "08:30",
    outTime: "17:00",
    hrs: "08:30",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 16,
    empId: "00001016",
    name: "Sunita Rao",
    department: "Quality",
    category: "Production",
    designation: "Inspector",
    shift: "A",
    start: "09:00",
    inTime: "-",
    outTime: "-",
    hrs: "00:00",
    status: "Absent",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 17,
    empId: "00001017",
    name: "Suresh Pillai",
    department: "Stores",
    category: "Production",
    designation: "Assistant",
    shift: "A",
    start: "09:00",
    inTime: "08:52",
    outTime: "17:10",
    hrs: "08:18",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:10",
  },
  {
    srNo: 18,
    empId: "00001018",
    name: "Divya Menon",
    department: "HR",
    category: "Production",
    designation: "Coordinator",
    shift: "General",
    start: "09:00",
    inTime: "08:59",
    outTime: "17:30",
    hrs: "08:31",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:30",
  },
  {
    srNo: 19,
    empId: "00001019",
    name: "Anil Saxena",
    department: "SMT",
    category: "Production",
    designation: "Sr. Engineer",
    shift: "A",
    start: "09:00",
    inTime: "08:48",
    outTime: "17:45",
    hrs: "08:57",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:45",
  },
  {
    srNo: 20,
    empId: "00001020",
    name: "Swati Kulkarni",
    department: "Production",
    category: "Production",
    designation: "Operator",
    shift: "A",
    start: "09:00",
    inTime: "09:05",
    outTime: "17:05",
    hrs: "08:00",
    status: "Present",
    late: "00:05",
    early: "00:00",
    otHrs: "00:05",
  },
  {
    srNo: 21,
    empId: "00001021",
    name: "Manish Pandey",
    department: "Assembly",
    category: "Production",
    designation: "Operator",
    shift: "A",
    start: "09:00",
    inTime: "08:51",
    outTime: "17:15",
    hrs: "08:24",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:15",
  },
  {
    srNo: 22,
    empId: "00001022",
    name: "Meera Nambiar",
    department: "Quality",
    category: "Production",
    designation: "Team Lead",
    shift: "A",
    start: "09:00",
    inTime: "08:45",
    outTime: "18:15",
    hrs: "09:30",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "01:15",
  },
  {
    srNo: 23,
    empId: "00001023",
    name: "Gaurav Bhatia",
    department: "Logistics",
    category: "Production",
    designation: "Supervisor",
    shift: "General",
    start: "08:30",
    inTime: "08:28",
    outTime: "17:30",
    hrs: "09:02",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:30",
  },
  {
    srNo: 24,
    empId: "00001024",
    name: "Shilpa Shetty",
    department: "Packaging",
    category: "Production",
    designation: "Operator",
    shift: "A",
    start: "09:00",
    inTime: "-",
    outTime: "-",
    hrs: "00:00",
    status: "Absent",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 25,
    empId: "00001025",
    name: "Alok Tripathi",
    department: "Production",
    category: "Production",
    designation: "Technician",
    shift: "A",
    start: "09:00",
    inTime: "08:58",
    outTime: "17:00",
    hrs: "08:02",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 26,
    empId: "00001026",
    name: "Jyoti Das",
    department: "Testing",
    category: "Production",
    designation: "Operator",
    shift: "B",
    start: "14:00",
    inTime: "13:50",
    outTime: "22:00",
    hrs: "08:10",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 27,
    empId: "00001027",
    name: "Harish Mehta",
    department: "Maintenance",
    category: "Production",
    designation: "Sr. Technician",
    shift: "General",
    start: "08:30",
    inTime: "08:20",
    outTime: "17:40",
    hrs: "09:20",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:40",
  },
  {
    srNo: 28,
    empId: "00001028",
    name: "Tanvi Shah",
    department: "HR",
    category: "Production",
    designation: "HRBP",
    shift: "General",
    start: "09:00",
    inTime: "-",
    outTime: "-",
    hrs: "00:00",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 29,
    empId: "00001029",
    name: "Sandeep Bose",
    department: "SMT",
    category: "Production",
    designation: "Operator",
    shift: "A",
    start: "09:00",
    inTime: "09:10",
    outTime: "17:10",
    hrs: "08:00",
    status: "Present",
    late: "00:10",
    early: "00:00",
    otHrs: "00:10",
  },
  {
    srNo: 30,
    empId: "00001030",
    name: "Preeti Sen",
    department: "Assembly",
    category: "Production",
    designation: "Operator",
    shift: "A",
    start: "09:00",
    inTime: "08:57",
    outTime: "17:00",
    hrs: "08:03",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 31,
    empId: "00001031",
    name: "Nitin Jain",
    department: "Production",
    category: "Production",
    designation: "Operator",
    shift: "Night",
    start: "22:00",
    inTime: "21:55",
    outTime: "06:30",
    hrs: "08:35",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:30",
  },
  {
    srNo: 32,
    empId: "00001032",
    name: "Radhika Agarwal",
    department: "Quality",
    category: "Production",
    designation: "Quality Engg",
    shift: "A",
    start: "09:00",
    inTime: "08:50",
    outTime: "17:25",
    hrs: "08:35",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:25",
  },
  {
    srNo: 33,
    empId: "00001033",
    name: "Pankaj Shukla",
    department: "Stores",
    category: "Production",
    designation: "Officer",
    shift: "A",
    start: "09:00",
    inTime: "09:00",
    outTime: "13:30",
    hrs: "04:30",
    status: "Half Day",
    late: "00:00",
    early: "03:30",
    otHrs: "00:00",
  },
  {
    srNo: 34,
    empId: "00001034",
    name: "Rekha Bhatt",
    department: "Packaging",
    category: "Production",
    designation: "Operator",
    shift: "A",
    start: "09:00",
    inTime: "08:49",
    outTime: "17:05",
    hrs: "08:16",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:05",
  },
  {
    srNo: 35,
    empId: "00001035",
    name: "Tarun Goswami",
    department: "Production",
    category: "Production",
    designation: "Operator",
    shift: "A",
    start: "09:00",
    inTime: "-",
    outTime: "-",
    hrs: "00:00",
    status: "Absent",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 36,
    empId: "00001036",
    name: "Vandana Kaul",
    department: "Testing",
    category: "Production",
    designation: "Engineer",
    shift: "A",
    start: "09:00",
    inTime: "08:53",
    outTime: "17:15",
    hrs: "08:22",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:15",
  },
  {
    srNo: 37,
    empId: "00001037",
    name: "Ashok Roy",
    department: "Maintenance",
    category: "Production",
    designation: "Technician",
    shift: "General",
    start: "08:30",
    inTime: "08:26",
    outTime: "17:35",
    hrs: "09:09",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:35",
  },
  {
    srNo: 38,
    empId: "00001038",
    name: "Pallavi Dubey",
    department: "Assembly",
    category: "Production",
    designation: "Operator",
    shift: "A",
    start: "09:00",
    inTime: "08:59",
    outTime: "17:00",
    hrs: "08:01",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 39,
    empId: "00001039",
    name: "Vinod Rawat",
    department: "SMT",
    category: "Production",
    designation: "Operator",
    shift: "B",
    start: "14:00",
    inTime: "13:54",
    outTime: "22:15",
    hrs: "08:21",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:15",
  },
  {
    srNo: 40,
    empId: "00001040",
    name: "Komal Soni",
    department: "Quality",
    category: "Production",
    designation: "Inspector",
    shift: "A",
    start: "09:00",
    inTime: "08:44",
    outTime: "17:10",
    hrs: "08:26",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:10",
  },
  {
    srNo: 41,
    empId: "00001041",
    name: "Ajay Mathur",
    department: "Production",
    category: "Production",
    designation: "Supervisor",
    shift: "A",
    start: "09:00",
    inTime: "08:40",
    outTime: "18:00",
    hrs: "09:20",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "01:00",
  },
  {
    srNo: 42,
    empId: "00001042",
    name: "Bharti Thakur",
    department: "Logistics",
    category: "Production",
    designation: "Assistant",
    shift: "A",
    start: "09:00",
    inTime: "-",
    outTime: "-",
    hrs: "00:00",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 43,
    empId: "00001043",
    name: "Chetan Anand",
    department: "Assembly",
    category: "Production",
    designation: "Sr. Operator",
    shift: "A",
    start: "09:00",
    inTime: "08:52",
    outTime: "17:30",
    hrs: "08:38",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:30",
  },
  {
    srNo: 44,
    empId: "00001044",
    name: "Dolly Arora",
    department: "Testing",
    category: "Production",
    designation: "Operator",
    shift: "A",
    start: "09:00",
    inTime: "09:12",
    outTime: "17:12",
    hrs: "08:00",
    status: "Present",
    late: "00:12",
    early: "00:00",
    otHrs: "00:12",
  },
  {
    srNo: 45,
    empId: "00001045",
    name: "Hemant Chawla",
    department: "SMT",
    category: "Production",
    designation: "Technician",
    shift: "Night",
    start: "22:00",
    inTime: "21:48",
    outTime: "06:15",
    hrs: "08:27",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:15",
  },
  {
    srNo: 46,
    empId: "00001046",
    name: "Isha Dewan",
    department: "HR",
    category: "Production",
    designation: "Executive",
    shift: "General",
    start: "09:00",
    inTime: "08:55",
    outTime: "17:15",
    hrs: "08:20",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:15",
  },
  {
    srNo: 47,
    empId: "00001047",
    name: "Jatin Sethi",
    department: "Production",
    category: "Production",
    designation: "Operator",
    shift: "A",
    start: "09:00",
    inTime: "-",
    outTime: "-",
    hrs: "00:00",
    status: "Absent",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 48,
    empId: "00001048",
    name: "Kiran Bajaj",
    department: "Quality",
    category: "Production",
    designation: "Auditor",
    shift: "A",
    start: "09:00",
    inTime: "08:50",
    outTime: "17:00",
    hrs: "08:10",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:00",
  },
  {
    srNo: 49,
    empId: "00001049",
    name: "Lalit Grover",
    department: "Packaging",
    category: "Production",
    designation: "Lead",
    shift: "A",
    start: "09:00",
    inTime: "08:42",
    outTime: "17:45",
    hrs: "09:03",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "00:45",
  },
  {
    srNo: 50,
    empId: "00001050",
    name: "Madhu Kapoor",
    department: "Maintenance",
    category: "Production",
    designation: "Manager",
    shift: "General",
    start: "08:30",
    inTime: "08:30",
    outTime: "18:30",
    hrs: "10:00",
    status: "Present",
    late: "00:00",
    early: "00:00",
    otHrs: "01:30",
  },
];

function Attendance() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleClearFilters = () => {
    setSelectedFilters({});
    setFromDate("");
    setToDate("");
  };

  const filteredData = ATTENDANCE_DATA.filter((record) => {
    if (
      selectedFilters["Departments"] &&
      record.department !== selectedFilters["Departments"]
    ) {
      return false;
    }
    if (selectedFilters["Shifts"]) {
      const shiftVal = selectedFilters["Shifts"];
      const matchShift =
        (shiftVal === "Shift A" && record.shift === "A") ||
        (shiftVal === "Shift B" && record.shift === "B") ||
        (shiftVal === "General" &&
          (record.shift === "General" || record.shift === "G"));
      if (!matchShift) return false;
    }
    return true;
  });

  const totalRecords = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const currentRecords = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusBadgeClass = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "Present":
        return "status-present";
      case "Absent":
        return "status-absent";
      case "Half Day":
        return "status-halfday";
      case "Present":
        return "status-leave";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="container-fluid g-0 p-3">

        {/* FILTERS DIV--------------------------------------------- */}
        <DashboardFilterBar
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          handleClearFilters={handleClearFilters}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
        />

        {/* ATTENDANCE TABLE & PAGINATION ------------------------------ */}
        <div className="border shadow rounded-4 p-4 mb-4 bg-white">
          <div className="overflow-x-auto">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>SR.NO</th>
                  <th>USER ID</th>
                  <th>FULL NAME</th>
                  <th>DEPARTMENT</th>
                  <th>CATEGORY</th>
                  <th>DESIGNATION</th>

                  <th>SHIFT</th>
                  <th>START</th>
                  <th>IN</th>
                  <th>OUT</th>
                  <th>HRS</th>
                  <th>STATUS</th>
                  <th>LATE</th>
                  <th>EARLY</th>
                  <th>OT HRS</th>
                </tr>
              </thead>

              <tbody>
                {currentRecords.map((record) => (
                  <tr key={record.srNo}>
                    <td style={{ fontWeight: 600, color: "#6c757d" }}>
                      {record.srNo}
                    </td>
                    <td style={{ fontWeight: 600, color: "#1d4ed8" }}>
                      {record.empId}
                    </td>
                    <td style={{ fontWeight: 600 }}>{record.name}</td>
                    <td>{record.department}</td>
                    <td>{record.category}</td>
                    <td>{record.designation}</td>

                    <td>
                      <span className="badge bg-light text-dark border">
                        {record.shift}
                      </span>
                    </td>
                    <td>{record.start}</td>
                    <td>{record.inTime}</td>
                    <td>{record.outTime}</td>
                    <td style={{ fontWeight: 600 }}>{record.hrs}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusBadgeClass(record.status)}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td
                      style={{
                        color: record.late !== "00:00" ? "#c62828" : "#6c757d",
                      }}
                    >
                      {record.late}
                    </td>
                    <td
                      style={{
                        color: record.early !== "00:00" ? "#e65100" : "#6c757d",
                      }}
                    >
                      {record.early}
                    </td>
                    <td>{record.otHrs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION BAR --------------------------------- */}
          <div className="attendance-pagination border-top mt-3 pt-3">
            <div className="text-secondary" style={{ fontSize: "0.85rem" }}>
              Showing{" "}
              <span className="fw-semibold text-dark">{startIndex + 1}</span> to{" "}
              <span className="fw-semibold text-dark">{endIndex}</span> of{" "}
              <span className="fw-semibold text-dark">{totalRecords}</span>{" "}
              entries
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
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
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>Prev</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ),
              )}

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span>Next</span>
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
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Attendance;
