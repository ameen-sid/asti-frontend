import DefectGraphs from "../components/DefectGraphs";

function TotalDefects() {
  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: "#2d3748" }}>
          Total Defects
        </h2>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Comprehensive overview and analytics of all recorded defects across production lines.
        </p>
      </div>

      <DefectGraphs
        storageKeyA="total-defects-graph-a"
        storageKeyB="total-defects-graph-b"
        graphATitle="In House Rejection"
        graphBTitle="Customer Complaints"
        defaultTargetA={3}
        defaultTargetB={7}
      />
    </div>
  );
}

export default TotalDefects;

