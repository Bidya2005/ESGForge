import React, { useMemo, useState } from "react";
import "./Traceability.css";

const TRACE_DATA = [
  {
    id: "TR-001",
    disclosure: "BRSR Section C — GHG Emissions",
    disclosureCode: "C-EN-01",
    kpi: "Scope 1 Emissions",
    activityId: "S1-001",
    activity: "Diesel Consumption",
    scope: "Scope 1",
    quantity: 2500,
    unit: "L",
    evidence: "diesel_invoice_april.pdf",
    evidenceStatus: "VERIFIED",
    factor: 2.68,
    factorUnit: "kg CO₂e/L",
    factorSource: "Demo Emission Factor Library",
    calculation: "2,500 L × 2.68 kg CO₂e/L",
    emissions: 6.7,
    validation: "VALID",
    approval: "APPROVED",
  },
  {
    id: "TR-002",
    disclosure: "BRSR Section C — GHG Emissions",
    disclosureCode: "C-EN-01",
    kpi: "Scope 2 Emissions",
    activityId: "S2-001",
    activity: "Purchased Electricity",
    scope: "Scope 2",
    quantity: 125000,
    unit: "kWh",
    evidence: "electricity_bill_march.pdf",
    evidenceStatus: "VERIFIED",
    factor: 0.72,
    factorUnit: "kg CO₂e/kWh",
    factorSource: "Demo Grid Emission Factor",
    calculation: "125,000 kWh × 0.72 kg CO₂e/kWh",
    emissions: 90,
    validation: "VALID",
    approval: "APPROVED",
  },
  {
    id: "TR-003",
    disclosure: "BRSR Section C — GHG Emissions",
    disclosureCode: "C-EN-01",
    kpi: "Scope 3 Emissions",
    activityId: "S3-001",
    activity: "Upstream Material Transportation",
    scope: "Scope 3",
    quantity: 800,
    unit: "tonnes",
    evidence: "supplier_transport.pdf",
    evidenceStatus: "VERIFIED",
    factor: 0.105,
    factorUnit: "kg CO₂e/tonne-km",
    factorSource: "Demo Transport Factor",
    calculation:
      "800 tonnes × 420 km × 0.105 kg CO₂e/tonne-km",
    emissions: 35.28,
    validation: "VALID",
    approval: "APPROVED",
  },
  {
    id: "TR-004",
    disclosure: "BRSR Section C — Energy Management",
    disclosureCode: "C-EN-02",
    kpi: "Purchased Electricity",
    activityId: "S2-002",
    activity: "Purchased Electricity",
    scope: "Scope 2",
    quantity: 84500,
    unit: "kWh",
    evidence: "electricity_bill_february.pdf",
    evidenceStatus: "PENDING",
    factor: 0.72,
    factorUnit: "kg CO₂e/kWh",
    factorSource: "Demo Grid Emission Factor",
    calculation: "84,500 kWh × 0.72 kg CO₂e/kWh",
    emissions: 60.84,
    validation: "REVIEW",
    approval: "PENDING",
  },
  {
    id: "TR-005",
    disclosure: "BRSR Section C — Waste Management",
    disclosureCode: "C-EN-03",
    kpi: "Waste Generated",
    activityId: "S3-002",
    activity: "Waste Generated",
    scope: "Scope 3",
    quantity: 420,
    unit: "tonnes",
    evidence: "waste_manifest_q4.pdf",
    evidenceStatus: "MISSING",
    factor: 0.085,
    factorUnit: "kg CO₂e/tonne",
    factorSource: "Demo Waste Factor",
    calculation: "420 tonnes × 0.085 kg CO₂e/tonne",
    emissions: 35.7,
    validation: "REVIEW",
    approval: "PENDING",
  },
];

const STATUS_CONFIG = {
  VALID: {
    label: "Validated",
    className: "valid",
  },
  REVIEW: {
    label: "Needs Review",
    className: "review",
  },
  MISSING: {
    label: "Missing",
    className: "missing",
  },
};

const NODE_CONFIG = {
  disclosure: {
    label: "BRSR DISCLOSURE",
    icon: "▤",
    description: "Reported BRSR figure",
  },
  kpi: {
    label: "KPI RESULT",
    icon: "◈",
    description: "Measured ESG indicator",
  },
  calculation: {
    label: "CALCULATION",
    icon: "ƒ",
    description: "CO₂e calculation run",
  },
  activity: {
    label: "ACTIVITY DATA",
    icon: "◉",
    description: "Underlying activity quantity",
  },
  evidence: {
    label: "EVIDENCE",
    icon: "▧",
    description: "Supporting source document",
  },
  factor: {
    label: "EMISSION FACTOR",
    icon: "⚙",
    description: "Factor used in calculation",
  },
  validation: {
    label: "VALIDATION",
    icon: "✓",
    description: "Data quality state",
  },
  approval: {
    label: "APPROVAL",
    icon: "◆",
    description: "Reviewer approval state",
  },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: "review",
  };

  return (
    <span className={`trace-status ${config.className}`}>
      <span className="trace-status-dot" />
      {config.label}
    </span>
  );
}

function ScopeBadge({ scope }) {
  const number = scope.replace("Scope ", "");

  return (
    <span className={`trace-scope scope-${number}`}>
      {scope}
    </span>
  );
}

function Traceability({ setActivePage }) {
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [selectedNode, setSelectedNode] = useState("disclosure");
  const [scopeFilter, setScopeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    return TRACE_DATA.filter((item) => {
      const matchesScope =
        scopeFilter === "ALL" ||
        item.scope === `Scope ${scopeFilter}`;

      const matchesStatus =
        statusFilter === "ALL" ||
        item.validation === statusFilter;

      const query = search.toLowerCase();

      const matchesSearch =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.activity.toLowerCase().includes(query) ||
        item.kpi.toLowerCase().includes(query) ||
        item.disclosure.toLowerCase().includes(query) ||
        item.evidence.toLowerCase().includes(query);

      return matchesScope && matchesStatus && matchesSearch;
    });
  }, [scopeFilter, statusFilter, search]);

  const totalEmissions = TRACE_DATA.reduce(
    (sum, item) => sum + item.emissions,
    0
  );

  const validatedCount = TRACE_DATA.filter(
    (item) => item.validation === "VALID"
  ).length;

  const reviewCount = TRACE_DATA.filter(
    (item) => item.validation === "REVIEW"
  ).length;

  const evidenceLinkedCount = TRACE_DATA.filter(
    (item) => item.evidenceStatus === "VERIFIED"
  ).length;

  const approvedCount = TRACE_DATA.filter(
    (item) => item.approval === "APPROVED"
  ).length;

  const traceCompleteness = Math.round(
    ((validatedCount +
      evidenceLinkedCount +
      approvedCount) /
      (TRACE_DATA.length * 3)) *
      100
  );

  const openTrace = (item) => {
    setSelectedTrace(item);
    setSelectedNode("disclosure");
  };

  const navigateTo = (page) => {
    if (setActivePage) {
      setActivePage(page);
    }
  };

  const getNodeContent = (item, node) => {
    switch (node) {
      case "disclosure":
        return {
          title: item.disclosure,
          value: item.disclosureCode,
          meta: "BRSR Section C disclosure mapping",
          status: item.validation,
        };

      case "kpi":
        return {
          title: item.kpi,
          value: `${item.emissions.toFixed(2)} tCO₂e`,
          meta: "KPI result contributing to reporting",
          status: item.validation,
        };

      case "calculation":
        return {
          title: "CO₂e Calculation Run",
          value: `${item.emissions.toFixed(2)} tCO₂e`,
          meta: item.calculation,
          status: item.validation,
        };

      case "activity":
        return {
          title: item.activity,
          value: `${item.quantity.toLocaleString()} ${item.unit}`,
          meta: `${item.activityId} • ${item.scope}`,
          status: item.validation,
        };

      case "evidence":
        return {
          title: item.evidence,
          value: item.evidenceStatus,
          meta: "Supporting evidence record",
          status:
            item.evidenceStatus === "VERIFIED"
              ? "VALID"
              : "REVIEW",
        };

      case "factor":
        return {
          title: item.factorSource,
          value: `${item.factor} ${item.factorUnit}`,
          meta: "Emission factor used for CO₂e calculation",
          status: "VALID",
        };

      case "validation":
        return {
          title: "Validation Result",
          value:
            item.validation === "VALID"
              ? "Validation Passed"
              : "Review Required",
          meta: "Activity, evidence and calculation checks",
          status: item.validation,
        };

      case "approval":
        return {
          title: "Reviewer Approval",
          value: item.approval,
          meta: "Governance and reporting approval state",
          status:
            item.approval === "APPROVED"
              ? "VALID"
              : "REVIEW",
        };

      default:
        return {};
    }
  };

  return (
    <div className="trace-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="trace-hero">
        <div>
          <div className="trace-eyebrow">
            AUDIT-READY DATA LINEAGE
          </div>

          <h1>Traceability</h1>

          <p>
            Follow every reported ESG figure from the BRSR disclosure
            back to the underlying activity, evidence, emission factor,
            calculation, validation and approval.
          </p>
        </div>

        <div className="trace-hero-badge">
          <div className="trace-hero-icon">⌁</div>

          <div>
            <strong>{traceCompleteness}% Trace Complete</strong>
            <span>Evidence-linked reporting</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="trace-summary">

        <div className="trace-summary-card">
          <div className="trace-summary-icon">◎</div>
          <div>
            <span>Total Lineage Records</span>
            <strong>{TRACE_DATA.length}</strong>
          </div>
        </div>

        <div className="trace-summary-card">
          <div className="trace-summary-icon">✓</div>
          <div>
            <span>Validated</span>
            <strong>{validatedCount}</strong>
          </div>
        </div>

        <div className="trace-summary-card">
          <div className="trace-summary-icon">!</div>
          <div>
            <span>Needs Review</span>
            <strong>{reviewCount}</strong>
          </div>
        </div>

        <div className="trace-summary-card">
          <div className="trace-summary-icon">▧</div>
          <div>
            <span>Evidence Linked</span>
            <strong>
              {evidenceLinkedCount}/{TRACE_DATA.length}
            </strong>
          </div>
        </div>

        <div className="trace-summary-card">
          <div className="trace-summary-icon">◆</div>
          <div>
            <span>Approved</span>
            <strong>
              {approvedCount}/{TRACE_DATA.length}
            </strong>
          </div>
        </div>

        <div className="trace-summary-card">
          <div className="trace-summary-icon">CO₂</div>
          <div>
            <span>Tracked Emissions</span>
            <strong>{totalEmissions.toFixed(2)} t</strong>
          </div>
        </div>

      </section>

      {/* =====================================================
          LINEAGE FLOW
      ===================================================== */}

      <section className="trace-section">

        <div className="trace-section-header">
          <div>
            <span className="trace-section-label">
              REPORTING LINEAGE
            </span>

            <h2>Follow the reporting chain</h2>

            <p>
              Select a node to inspect its role in the ESG reporting
              lineage.
            </p>
          </div>
        </div>

        <div className="lineage-flow">

          {[
            ["disclosure", "BRSR Disclosure", "Reported figure"],
            ["kpi", "KPI Result", "Measured indicator"],
            ["calculation", "Calculation", "Transparent formula"],
            ["activity", "Activity", "Source quantity"],
            ["evidence", "Evidence", "Supporting proof"],
            ["factor", "Factor", "Emission factor"],
            ["validation", "Validation", "Review status"],
            ["approval", "Approval", "Governance state"],
          ].map((node, index) => (
            <React.Fragment key={node[0]}>

              <button
                className={`lineage-node ${
                  selectedNode === node[0]
                    ? "active"
                    : ""
                }`}
                onClick={() => setSelectedNode(node[0])}
              >
                <div className="lineage-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="lineage-icon">
                  {NODE_CONFIG[node[0]].icon}
                </div>

                <strong>{node[1]}</strong>
                <span>{node[2]}</span>
              </button>

              {index < 7 && (
                <div className="lineage-arrow">›</div>
              )}

            </React.Fragment>
          ))}

        </div>
      </section>

      {/* =====================================================
          INTERACTIVE NODE EXPLORER
      ===================================================== */}

      {selectedTrace && (
        <section className="trace-section">

          <div className="trace-section-header compact">
            <div>
              <span className="trace-section-label">
                INTERACTIVE TRACE
              </span>

              <h2>
                {NODE_CONFIG[selectedNode].label}
              </h2>

              <p>
                {NODE_CONFIG[selectedNode].description}
              </p>
            </div>

            <button
              className="close-lineage-btn"
              onClick={() => setSelectedTrace(null)}
            >
              Close
            </button>
          </div>

          <div className="trace-node-explorer">

            <div className="trace-selected-record">

              <div className="trace-selected-icon">
                {NODE_CONFIG[selectedNode].icon}
              </div>

              <div className="trace-selected-content">

                <span className="trace-selected-label">
                  {NODE_CONFIG[selectedNode].label}
                </span>

                <h3>
                  {getNodeContent(
                    selectedTrace,
                    selectedNode
                  ).title}
                </h3>

                <strong className="trace-selected-value">
                  {getNodeContent(
                    selectedTrace,
                    selectedNode
                  ).value}
                </strong>

                <p>
                  {getNodeContent(
                    selectedTrace,
                    selectedNode
                  ).meta}
                </p>

              </div>

              <StatusBadge
                status={
                  getNodeContent(
                    selectedTrace,
                    selectedNode
                  ).status
                }
              />

            </div>

            {/* QUICK NAVIGATION */}

            <div className="trace-related-actions">

              <button
                onClick={() => navigateTo("evidence")}
              >
                <span>▧</span>
                Evidence
                <small>View source documents</small>
              </button>

              <button
                onClick={() => navigateTo("calculations")}
              >
                <span>ƒ</span>
                Calculation
                <small>View calculation runs</small>
              </button>

              <button
                onClick={() => navigateTo("emission-factors")}
              >
                <span>⚙</span>
                Emission Factor
                <small>View factor library</small>
              </button>

              <button
                onClick={() => navigateTo("validation")}
              >
                <span>✓</span>
                Validation
                <small>View validation status</small>
              </button>

              <button
                onClick={() => navigateTo("reports")}
              >
                <span>▤</span>
                BRSR Report
                <small>View reporting output</small>
              </button>

            </div>

          </div>
        </section>
      )}

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <section className="trace-section">

        <div className="trace-section-header compact">
          <div>
            <span className="trace-section-label">
              TRACEABILITY REGISTER
            </span>

            <h2>Disclosure lineage records</h2>
          </div>
        </div>

        <div className="trace-toolbar">

          <div className="trace-search">
            <span>⌕</span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search activity, KPI, disclosure or evidence..."
            />
          </div>

          <div className="trace-filter-group">

            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
            >
              <option value="ALL">All Scopes</option>
              <option value="1">Scope 1</option>
              <option value="2">Scope 2</option>
              <option value="3">Scope 3</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="VALID">Validated</option>
              <option value="REVIEW">Needs Review</option>
            </select>

          </div>
        </div>

        <div className="trace-table-wrapper">

          <table className="trace-table">

            <thead>
              <tr>
                <th>Lineage ID</th>
                <th>BRSR Disclosure</th>
                <th>Scope</th>
                <th>Activity</th>
                <th>Evidence</th>
                <th>CO₂e</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {filteredData.map((item) => (
                <tr key={item.id}>

                  <td>
                    <span className="trace-id">
                      {item.id}
                    </span>
                  </td>

                  <td>
                    <div className="disclosure-cell">
                      <strong>{item.disclosure}</strong>
                      <span>{item.disclosureCode}</span>
                    </div>
                  </td>

                  <td>
                    <ScopeBadge scope={item.scope} />
                  </td>

                  <td>
                    <div className="activity-cell">
                      <strong>{item.activity}</strong>
                      <span>
                        {item.quantity.toLocaleString()}{" "}
                        {item.unit}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className="evidence-cell">

                      <span className="evidence-file">
                        {item.evidence}
                      </span>

                      <small
                        className={
                          item.evidenceStatus === "VERIFIED"
                            ? "evidence-verified"
                            : "evidence-pending"
                        }
                      >
                        {item.evidenceStatus}
                      </small>

                    </div>
                  </td>

                  <td>
                    <strong className="emission-value">
                      {item.emissions.toFixed(2)}
                    </strong>

                    <span className="emission-unit">
                      tCO₂e
                    </span>
                  </td>

                  <td>
                    <StatusBadge
                      status={item.validation}
                    />
                  </td>

                  <td>
                    <button
                      className="trace-view-btn"
                      onClick={() => openTrace(item)}
                    >
                      View Lineage →
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          {filteredData.length === 0 && (
            <div className="trace-empty">
              No traceability records match your filters.
            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          AUDIT PRINCIPLE
      ===================================================== */}

      <section className="trace-audit-banner">

        <div className="trace-audit-icon">
          ✓
        </div>

        <div>
          <strong>
            Audit-ready reporting principle
          </strong>

          <p>
            Every material ESG figure should have a clear source,
            supporting evidence, calculation method, emission factor,
            validation state and approval trail.
          </p>
        </div>

      </section>

      <div className="trace-demo-note">
        Frontend demonstration data • Emission factors shown here
        are demo visualization values and should be replaced with
        verified factors for production reporting.
      </div>

    </div>
  );
}

export default Traceability;