function LMSOverview() {
  const stats = [
    { title: "Total Users", value: "1,245", color: "text-primary" },
    { title: "Active Courses", value: "32", color: "text-success" },
    { title: "Total Instructors", value: "45", color: "text-warning" },
    { title: "Completions", value: "85%", color: "text-info" },
  ];

  return (
    <div className="h-auto shadow-sm rounded border bg-white p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0" style={{ color: "#3e6db5" }}>LMS Overview</h3>
        <button className="btn text-white px-4 py-2 fw-semibold rounded-pill" style={{ background: "linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)", border: "none" }}>Generate Report</button>
      </div>

      <div className="row g-4 mb-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 h-100 p-3" style={{ background: "#f8f9fa" }}>
              <div className="card-body text-center">
                <h6 className="card-title text-muted fw-semibold mb-2">{stat.title}</h6>
                <h3 className={`fw-bold mb-0 ${stat.color}`}>{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Recent Enrollments</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0">User</th>
                      <th className="border-0">Course</th>
                      <th className="border-0">Date</th>
                      <th className="border-0">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><div className="fw-medium">John Doe</div></td>
                      <td>Advanced React</td>
                      <td className="text-muted">Aug 10, 2026</td>
                      <td><span className="badge bg-success bg-opacity-10 text-success border border-success">Active</span></td>
                    </tr>
                    <tr>
                      <td><div className="fw-medium">Jane Smith</div></td>
                      <td>Node.js Fundamentals</td>
                      <td className="text-muted">Aug 09, 2026</td>
                      <td><span className="badge bg-warning bg-opacity-10 text-warning border border-warning">Pending</span></td>
                    </tr>
                    <tr>
                      <td><div className="fw-medium">Mike Johnson</div></td>
                      <td>Python Data Science</td>
                      <td className="text-muted">Aug 08, 2026</td>
                      <td><span className="badge bg-success bg-opacity-10 text-success border border-success">Active</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Popular Courses</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-semibold mb-1">React Native Mastery</h6>
                    <small className="text-muted">120 Enrolled</small>
                  </div>
                  <span className="badge rounded-pill text-white" style={{ background: "linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)" }}>#1</span>
                </li>
                <li className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-semibold mb-1">Fullstack Web Dev</h6>
                    <small className="text-muted">98 Enrolled</small>
                  </div>
                  <span className="badge rounded-pill text-white" style={{ background: "linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)" }}>#2</span>
                </li>
                <li className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-0">
                  <div>
                    <h6 className="fw-semibold mb-1">UI/UX Principles</h6>
                    <small className="text-muted">75 Enrolled</small>
                  </div>
                  <span className="badge rounded-pill text-white" style={{ background: "linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)" }}>#3</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LMSOverview;
