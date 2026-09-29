import DefectGraphs from "../components/DefectGraphs";

function ManRelatedDefects() {
  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: "#2d3748" }}>
          Man Related Defects
        </h2>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Analysis and monitoring of human factor and operator related quality defects.
        </p>
      </div>

      <DefectGraphs
        storageKeyA="man-related-defects-graph-a"
        storageKeyB="man-related-defects-graph-b"
        graphATitle="In House Rejection"
        graphBTitle="Customer Complaints"
        defaultTargetA={1}
        defaultTargetB={0}
      />
    </div>
  );
}

export default ManRelatedDefects;

