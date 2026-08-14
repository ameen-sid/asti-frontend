import "../../../styles/attendance.css";

function Attendance() {
  return (
    <>
      <div className="container-fluid g-0 p-3">
        {/* ATTENDANCE FILTERS-------------------------- */}
        <div className="Attendance Filters border shadow rounded-4 p-4 mb-4">
          <div className="d-flex align-items-center justify-content-between my-2">
            <div className="d-flex align-items-center">
              <h4>Attandence</h4>
              <button className="gradient-bg text-white px-3 rounded-pill btn mx-3">
                0 Records
              </button>
            </div>
            <button className="gradient-bg text-white px-3 rounded-pill btn mx-3">
              Upload Excel
            </button>
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
        </div>
        {/* ATTANDANCE TABLE------------------------------ */}
        <div className="Attendance Filters border shadow rounded-4 p-4 mb-4 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>SR.NO</th>
                <th>EMP ID</th>
                <th>NAME</th>
                <th>DEPARTMENT</th>
                <th>DESIGNATION</th>
                <th>PAYCODE</th>
                <th>CARD NO</th>
                <th>SHIFT</th>
                <th>START</th>
                <th>IN</th>
                <th>OUT</th>
                <th>HRS</th>
                <th>STATUS</th>
                <th>LATE</th>
                <th>EARLY</th>
                <th>OT HRS</th>
                <th>OT AMT</th>
              </tr>
            </thead>

            <tbody>
              {/* All your data rows go here */}
              <tr>
                <td>1</td>
                <td>EMP1001</td>
                <td>Aarav Sharma</td>
                <td>Production</td>
                <td>Operator</td>
                <td>PC1001</td>
                <td>45021</td>
                <td>Morning</td>
                <td>09:00</td>
                <td>08:56</td>
                <td>17:15</td>
                <td>08:19</td>
                <td>Present</td>
                <td>00:00</td>
                <td>00:00</td>
                <td>00:15</td>
                <td>₹120</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
export default Attendance;
