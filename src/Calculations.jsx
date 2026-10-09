import React, { useMemo, useState } from "react";
import "./Calculations.css";

const CALCULATIONS = [
  {
    id: "CAL-001",
    activityId: "S1-001",
    scope: "Scope 1",
    activity: "Diesel Consumption",
    category: "Stationary Combustion",
    quantity: 2500,
    unit: "L",
    factor: 2.68,
    factorUnit: "kg CO₂e/L",
    factorId: "EF-001",
    factorSource: "CPCB Reference v1.0",
    gas: "CO₂",
    gwp: 1,
    evidence: "diesel_invoice_april.pdf",
    result: 6.7,
    status: "VALID",
  },
  {
    id: "CAL-002",
    activityId: "S1-002",
    scope: "Scope 1",
    activity: "Diesel Generator",
    category: "Stationary Combustion",
    quantity: 1850,
    unit: "L",
    factor: 2.68,
    factorUnit: "kg CO₂e/L",
    factorId: "EF-002",
    factorSource: "CPCB Reference v1.0",
    gas: "CO₂",
    gwp: 1,
    evidence: "generator_fuel_log.pdf",
    result: 4.958,
    status: "VALID",
  },
  {
    id: "CAL-003",
    activityId: "S2-001",
    scope: "Scope 2",
    activity: "Purchased Electricity",
    category: "Electricity",
    quantity: 125000,
    unit: "kWh",
    factor: 0.72,
    factorUnit: "kg CO₂e/kWh",
    factorId: "EF-003",
    factorSource: "CEA Reference v2.1",
    gas: "CO₂",
    gwp: 1,
    evidence: "electricity_bill_march.pdf",
    result: 90,
    status: "VALID",
  },
  {
    id: "CAL-004",
    activityId: "S2-002",
    scope: "Scope 2",
    activity: "Purchased Electricity",
    category: "Electricity",
    quantity: 84500,
    unit: "kWh",
    factor: 0.72,
    factorUnit: "kg CO₂e/kWh",
    factorId: "EF-003",
    factorSource: "CEA Reference v2.1",
    gas: "CO₂",
    gwp: 1,
    evidence: "electricity_bill_february.pdf",
    result: 60.84,
    status: "REVIEW",
  },
  {
    id: "CAL-005",
    activityId: "S3-001",
    scope: "Scope 3",
    activity: "Upstream Material Transportation",
    category: "Upstream Transportation",
    quantity: 336000,
    unit: "tonne-km",
    factor: 0.105,
    factorUnit: "kg CO₂e/tonne-km",
    factorId: "EF-005",
    factorSource: "MoRTH Reference v1.0",
    gas: "CO₂",
    gwp: 1,
    evidence: "supplier_transport.pdf",
    result: 35.28,
    status: "VALID",
  },
  {
    id: "CAL-006",
    activityId: "S3-002",
    scope: "Scope 3",
    activity: "Waste Generated",
    category: "Waste",
    quantity: 420000,
    unit: "kg",
    factor: 0.085,
    factorUnit: "kg CO₂e/kg",
    factorId: "EF-006",
    factorSource: "Indian Waste Reference v1.0",
    gas: "CO₂e",
    gwp: 1,
    evidence: "waste_manifest_q4.pdf",
    result: 35.7,
    status: "REVIEW",
  },
];

const STATUS_CONFIG = {
  VALID: {
    label: "Valid",
    className: "valid",
  },
  REVIEW: {
    label: "Review",
    className: "review",
  },
};

const formatNumber = (value, decimals = 2) =>
  Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const calculateResult = (quantity, factor) =>
  (Number(quantity || 0) * Number(factor || 0)) / 1000;

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.REVIEW;

  return (
    <span className={`calc-status ${config.className}`}>
      <span className="calc-status-dot" />
      {config.label}
    </span>
  );
}

function ScopeBadge({ scope }) {
  const scopeNumber = scope.replace("Scope ", "");

  return (
    <span className={`calc-scope scope-${scopeNumber}`}>
      {scope}
    </span>
  );
}

function Calculations({ user, setActivePage }) {
  const [selectedId, setSelectedId] = useState("CAL-001");
  const [scopeFilter, setScopeFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const selected = CALCULATIONS.find(
    (item) => item.id === selectedId
  );

  const [quantity, setQuantity] = useState(
    selected?.quantity || 0
  );

  const [factor, setFactor] = useState(
    selected?.factor || 0
  );

  const filteredCalculations = useMemo(() => {
    return CALCULATIONS.filter((item) => {
      const matchesScope =
        scopeFilter === "ALL" ||
        item.scope === `Scope ${scopeFilter}`;

      const query = search.toLowerCase();

      const matchesSearch =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.activityId.toLowerCase().includes(query) ||
        item.activity.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.evidence.toLowerCase().includes(query);

      return matchesScope && matchesSearch;
    });
  }, [scopeFilter, search]);

  const totalEmissions = useMemo(
    () =>
      CALCULATIONS.reduce(
        (sum, item) => sum + item.result,
        0
      ),
    []
  );

  const validCount = CALCULATIONS.filter(
    (item) => item.status === "VALID"
  ).length;

  const reviewCount = CALCULATIONS.filter(
    (item) => item.status === "REVIEW"
  ).length;

  const liveResult = calculateResult(quantity, factor);

  const handleSelect = (item) => {
    setSelectedId(item.id);
    setQuantity(item.quantity);
    setFactor(item.factor);
  };

  return (
    <div className="calculations-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="calculations-hero">

        <div className="calculations-hero-content">

          <div className="calc-eyebrow">
            <span className="calc-eyebrow-icon">∑</span>
            CARBON ACCOUNTING ENGINE
          </div>

          <h1>
            CO₂e Calculation
            <span> Engine</span>
          </h1>

          <p>
            Transparent activity-to-emission calculations with
            emission-factor, GWP, evidence and validation
            traceability.
          </p>

          <div className="calc-hero-tags">
            <span>Activity Based</span>
            <span>Factor Linked</span>
            <span>Evidence Linked</span>
            <span>Frontend Demo</span>
          </div>

        </div>

        <div className="calculations-hero-result">

          <span>Total Calculated Emissions</span>

          <strong>
            {formatNumber(totalEmissions)}
          </strong>

          <small>tCO₂e</small>

        </div>

      </section>


      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="calc-summary-grid">

        <div className="calc-summary-card">

          <div className="calc-summary-icon">Σ</div>

          <div>
            <span>Calculations</span>
            <strong>{CALCULATIONS.length}</strong>
          </div>

        </div>

        <div className="calc-summary-card">

          <div className="calc-summary-icon valid-icon">✓</div>

          <div>
            <span>Validated</span>
            <strong>{validCount}</strong>
          </div>

        </div>

        <div className="calc-summary-card">

          <div className="calc-summary-icon review-icon">!</div>

          <div>
            <span>Needs Review</span>
            <strong>{reviewCount}</strong>
          </div>

        </div>

        <div className="calc-summary-card">

          <div className="calc-summary-icon">CO₂</div>

          <div>
            <span>Total CO₂e</span>
            <strong>{formatNumber(totalEmissions, 2)}</strong>
            <small>tCO₂e</small>
          </div>

        </div>

      </section>


      {/* =====================================================
          WORKFLOW
      ===================================================== */}

      <section className="calc-section">

        <div className="calc-section-heading">

          <div>
            <span className="calc-section-kicker">
              CALCULATION WORKFLOW
            </span>

            <h2>
              From activity data to verified CO₂e
            </h2>
          </div>

        </div>

        <div className="calc-workflow">

          <div className="calc-workflow-step">
            <div className="calc-workflow-number">01</div>
            <div className="calc-workflow-icon">▣</div>
            <h3>Activity</h3>
            <p>Quantity + unit + source</p>
          </div>

          <div className="calc-workflow-arrow">→</div>

          <div className="calc-workflow-step">
            <div className="calc-workflow-number">02</div>
            <div className="calc-workflow-icon">ƒ</div>
            <h3>Factor</h3>
            <p>Versioned emission factor</p>
          </div>

          <div className="calc-workflow-arrow">→</div>

          <div className="calc-workflow-step">
            <div className="calc-workflow-number">03</div>
            <div className="calc-workflow-icon">CO₂</div>
            <h3>GWP</h3>
            <p>Gas and global warming potential</p>
          </div>

          <div className="calc-workflow-arrow">→</div>

          <div className="calc-workflow-step">
            <div className="calc-workflow-number">04</div>
            <div className="calc-workflow-icon">∑</div>
            <h3>Calculation</h3>
            <p>Quantity × factor</p>
          </div>

          <div className="calc-workflow-arrow">→</div>

          <div className="calc-workflow-step">
            <div className="calc-workflow-number">05</div>
            <div className="calc-workflow-icon">✓</div>
            <h3>Validation</h3>
            <p>Review and approval status</p>
          </div>

        </div>

      </section>


      {/* =====================================================
          CALCULATION REGISTER
      ===================================================== */}

      <section className="calc-section">

        <div className="calc-section-heading">

          <div>
            <span className="calc-section-kicker">
              CALCULATION REGISTER
            </span>

            <h2>Emission calculation records</h2>

            <p>
              Every result is connected to an activity,
              factor, evidence record and validation state.
            </p>
          </div>

        </div>

        <div className="calc-toolbar">

          <div className="calc-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search calculation, activity or evidence..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="calc-filter-group">

            {["ALL", "1", "2", "3"].map((scope) => (
              <button
                key={scope}
                type="button"
                className={
                  scopeFilter === scope
                    ? "calc-filter active"
                    : "calc-filter"
                }
                onClick={() => setScopeFilter(scope)}
              >
                {scope === "ALL"
                  ? "All Scopes"
                  : `Scope ${scope}`}
              </button>
            ))}

          </div>

        </div>

        <div className="calc-register">

          {filteredCalculations.map((item) => (

            <button
              key={item.id}
              type="button"
              className={
                selectedId === item.id
                  ? "calc-record selected"
                  : "calc-record"
              }
              onClick={() => handleSelect(item)}
            >

              <div className="calc-record-main">

                <div className="calc-record-top">

                  <span className="calc-record-id">
                    {item.id}
                  </span>

                  <ScopeBadge scope={item.scope} />

                  <StatusBadge status={item.status} />

                </div>

                <h3>{item.activity}</h3>

                <p>{item.category}</p>

              </div>

              <div className="calc-record-middle">

                <span>Activity Quantity</span>

                <strong>
                  {formatNumber(item.quantity)}
                  {" "}
                  {item.unit}
                </strong>

              </div>

              <div className="calc-record-factor">

                <span>Emission Factor</span>

                <strong>
                  {item.factor}
                </strong>

                <small>
                  {item.factorUnit}
                </small>

              </div>

              <div className="calc-record-result">

                <span>CO₂e Result</span>

                <strong>
                  {formatNumber(item.result, 3)}
                </strong>

                <small>tCO₂e</small>

              </div>

              <div className="calc-record-chevron">
                →
              </div>

            </button>

          ))}

          {filteredCalculations.length === 0 && (
            <div className="calc-empty">
              No calculation records found.
            </div>
          )}

        </div>

      </section>


      {/* =====================================================
          DETAIL
      ===================================================== */}

      {selected && (

        <section className="calc-detail-grid">

          {/* LEFT */}
          <div className="calc-detail-card">

            <div className="calc-detail-header">

              <div>

                <span className="calc-section-kicker">
                  SELECTED CALCULATION
                </span>

                <h2>
                  {selected.activity}
                </h2>

                <p>
                  {selected.id} · {selected.activityId}
                </p>

              </div>

              <StatusBadge status={selected.status} />

            </div>


            {/* Activity */}
            <div className="calc-detail-block">

              <div className="calc-detail-block-title">
                <span className="calc-block-icon">▣</span>
                Activity Data
              </div>

              <div className="calc-detail-grid-small">

                <div>
                  <span>Scope</span>
                  <strong>
                    {selected.scope}
                  </strong>
                </div>

                <div>
                  <span>Activity Type</span>
                  <strong>
                    {selected.category}
                  </strong>
                </div>

                <div>
                  <span>Quantity</span>
                  <strong>
                    {formatNumber(selected.quantity)}
                    {" "}
                    {selected.unit}
                  </strong>
                </div>

                <div>
                  <span>Evidence</span>
                  <strong className="calc-file">
                    {selected.evidence}
                  </strong>
                </div>

              </div>

            </div>


            {/* Factor */}
            <div className="calc-detail-block">

              <div className="calc-detail-block-title">
                <span className="calc-block-icon">ƒ</span>
                Emission Factor
              </div>

              <div className="calc-factor-panel">

                <div>
                  <span>Factor ID</span>
                  <strong>
                    {selected.factorId}
                  </strong>
                </div>

                <div>
                  <span>Value</span>
                  <strong>
                    {selected.factor}
                    {" "}
                    <small>
                      {selected.factorUnit}
                    </small>
                  </strong>
                </div>

                <div>
                  <span>Source</span>
                  <strong>
                    {selected.factorSource}
                  </strong>
                </div>

              </div>

            </div>


            {/* GWP */}
            <div className="calc-detail-block">

              <div className="calc-detail-block-title">
                <span className="calc-block-icon">CO₂</span>
                Gas & GWP Context
              </div>

              <div className="calc-gwp-panel">

                <div className="calc-gwp-main">

                  <span>Gas</span>

                  <strong>
                    {selected.gas}
                  </strong>

                </div>

                <div className="calc-gwp-main">

                  <span>GWP Value</span>

                  <strong>
                    {selected.gwp}
                  </strong>

                </div>

                <p>
                  Global warming potential context is retained
                  with the calculation record for transparent
                  CO₂e conversion.
                </p>

              </div>

            </div>

          </div>


          {/* RIGHT */}
          <div className="calc-engine-card">

            <div className="calc-engine-header">

              <div>
                <span className="calc-section-kicker">
                  LIVE CALCULATION
                </span>

                <h2>Calculation Engine</h2>
              </div>

              <div className="calc-engine-symbol">
                ∑
              </div>

            </div>


            <div className="calc-input-grid">

              <label>

                <span>Activity Quantity</span>

                <div className="calc-input-wrap">

                  <input
                    type="number"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(event.target.value)
                    }
                  />

                  <span>{selected.unit}</span>

                </div>

              </label>


              <label>

                <span>Emission Factor</span>

                <div className="calc-input-wrap">

                  <input
                    type="number"
                    step="0.001"
                    value={factor}
                    onChange={(event) =>
                      setFactor(event.target.value)
                    }
                  />

                  <span>kg/unit</span>

                </div>

              </label>

            </div>


            <div className="calc-formula">

              <span>CALCULATION FORMULA</span>

              <strong>
                {formatNumber(quantity, 0)}
                {" "}
                ×
                {" "}
                {formatNumber(factor, 3)}
                {" "}
                ÷ 1,000
              </strong>

              <small>
                Activity quantity × emission factor ÷ 1,000
                = tCO₂e
              </small>

            </div>


            <div className="calc-live-result">

              <span>Calculated CO₂e</span>

              <strong>
                {formatNumber(liveResult, 3)}
              </strong>

              <small>tCO₂e</small>

            </div>


            <div className="calc-result-comparison">

              <div>
                <span>Stored Result</span>
                <strong>
                  {formatNumber(selected.result, 3)}
                  {" "}
                  tCO₂e
                </strong>
              </div>

              <div>
                <span>Live Difference</span>

                <strong>
                  {formatNumber(
                    liveResult - selected.result,
                    3
                  )}
                  {" "}
                  tCO₂e
                </strong>

              </div>

            </div>


            <div className="calc-engine-note">

              <span>i</span>

              <p>
                Changing the quantity or factor updates the
                calculation preview only. This is a
                frontend demonstration and does not modify
                a backend record.
              </p>

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          TRACEABILITY
      ===================================================== */}

      {selected && (

        <section className="calc-trace-card">

          <div className="calc-section-heading">

            <div>

              <span className="calc-section-kicker">
                TRACEABILITY
              </span>

              <h2>
                Calculation lineage
              </h2>

            </div>

          </div>

          <div className="calc-trace-flow">

            <div className="calc-trace-node">

              <span>01</span>

              <strong>
                Activity
              </strong>

              <small>
                {selected.activityId}
              </small>

            </div>

            <div className="calc-trace-line">
              →
            </div>

            <div className="calc-trace-node">

              <span>02</span>

              <strong>
                Evidence
              </strong>

              <small>
                {selected.evidence}
              </small>

            </div>

            <div className="calc-trace-line">
              →
            </div>

            <div className="calc-trace-node">

              <span>03</span>

              <strong>
                Factor
              </strong>

              <small>
                {selected.factorId}
              </small>

            </div>

            <div className="calc-trace-line">
              →
            </div>

            <div className="calc-trace-node">

              <span>04</span>

              <strong>
                GWP
              </strong>

              <small>
                {selected.gas} · {selected.gwp}
              </small>

            </div>

            <div className="calc-trace-line">
              →
            </div>

            <div className="calc-trace-node final">

              <span>05</span>

              <strong>
                CO₂e
              </strong>

              <small>
                {formatNumber(selected.result, 3)} tCO₂e
              </small>

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          VALIDATION
      ===================================================== */}

      <section className="calc-validation-banner">

        <div className="calc-validation-icon">
          ✓
        </div>

        <div>

          <strong>
            Calculation validation layer
          </strong>

          <p>
            Each calculation can be reviewed against activity
            data, evidence, emission factor source, GWP context
            and the resulting CO₂e value.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            setActivePage("validation")
          }
        >
          Open Validation →
        </button>

      </section>


      {/* =====================================================
          DEMO NOTICE
      ===================================================== */}

      <div className="calc-demo-notice">

        <span>DEMO</span>

        <p>
          These calculations use frontend demonstration
          values to illustrate the ESGForge carbon-accounting
          workflow. Production deployment should connect
          approved, versioned emission-factor and GWP sources.
        </p>

      </div>

    </div>
  );
}

export default Calculations;