import React, { useMemo, useState } from "react";
import "./EmissionFactors.css";

const FACTORS = [
  {
    id: "EF-001",
    scope: "Scope 1",
    activity: "Diesel Consumption",
    category: "Stationary Combustion",
    fuel: "Diesel",
    value: 2.68,
    unit: "kg CO₂e / L",
    source: "CPCB Reference",
    version: "1.0",
    methodology: "Fuel quantity × emission factor",
    geography: "India",
    effectivePeriod: "FY 2025–26",
    status: "VERIFIED",
    gas: "CO₂, CH₄, N₂O",
    gwp: "IPCC-aligned GWP",
    updated: "15 Apr 2026",
  },
  {
    id: "EF-002",
    scope: "Scope 1",
    activity: "Diesel Generator",
    category: "Stationary Combustion",
    fuel: "Diesel",
    value: 2.68,
    unit: "kg CO₂e / L",
    source: "CPCB Reference",
    version: "1.0",
    methodology: "Fuel quantity × emission factor",
    geography: "India",
    effectivePeriod: "FY 2025–26",
    status: "VERIFIED",
    gas: "CO₂, CH₄, N₂O",
    gwp: "IPCC-aligned GWP",
    updated: "15 Apr 2026",
  },
  {
    id: "EF-003",
    scope: "Scope 2",
    activity: "Purchased Electricity",
    category: "Purchased Energy",
    fuel: "Grid Electricity",
    value: 0.72,
    unit: "kg CO₂e / kWh",
    source: "CEA Reference",
    version: "2.1",
    methodology: "Electricity consumption × grid factor",
    geography: "India",
    effectivePeriod: "FY 2025–26",
    status: "VERIFIED",
    gas: "CO₂",
    gwp: "IPCC-aligned GWP",
    updated: "20 Apr 2026",
  },
  {
    id: "EF-004",
    scope: "Scope 2",
    activity: "Purchased Electricity",
    category: "Purchased Energy",
    fuel: "Grid Electricity",
    value: 0.70,
    unit: "kg CO₂e / kWh",
    source: "CEA Reference",
    version: "2.0",
    methodology: "Electricity consumption × grid factor",
    geography: "India",
    effectivePeriod: "FY 2024–25",
    status: "ARCHIVED",
    gas: "CO₂",
    gwp: "IPCC-aligned GWP",
    updated: "10 Apr 2025",
  },
  {
    id: "EF-005",
    scope: "Scope 3",
    activity: "Upstream Material Transportation",
    category: "Upstream Transportation",
    fuel: "Road Freight",
    value: 0.105,
    unit: "kg CO₂e / tonne-km",
    source: "MoRTH Reference",
    version: "1.0",
    methodology: "Material × distance × transport factor",
    geography: "India",
    effectivePeriod: "FY 2025–26",
    status: "VERIFIED",
    gas: "CO₂, CH₄, N₂O",
    gwp: "IPCC-aligned GWP",
    updated: "18 Apr 2026",
  },
  {
    id: "EF-006",
    scope: "Scope 3",
    activity: "Waste Generated",
    category: "Waste",
    fuel: "Mixed Waste",
    value: 0.085,
    unit: "kg CO₂e / kg",
    source: "Indian Waste Reference",
    version: "1.0",
    methodology: "Waste quantity × waste factor",
    geography: "India",
    effectivePeriod: "FY 2025–26",
    status: "REVIEW",
    gas: "CO₂, CH₄",
    gwp: "IPCC-aligned GWP",
    updated: "22 Apr 2026",
  },
];

const STATUS_CONFIG = {
  VERIFIED: {
    label: "Verified",
    className: "verified",
  },
  REVIEW: {
    label: "Needs Review",
    className: "review",
  },
  ARCHIVED: {
    label: "Archived",
    className: "archived",
  },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.REVIEW;

  return (
    <span className={`factor-status ${config.className}`}>
      <span className="factor-status-dot" />
      {config.label}
    </span>
  );
}

function ScopeBadge({ scope }) {
  const className = scope.toLowerCase().replace(" ", "-");

  return (
    <span className={`factor-scope ${className}`}>
      {scope.replace("Scope ", "S")}
    </span>
  );
}

function EmissionFactors() {
  const [scopeFilter, setScopeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedFactor, setSelectedFactor] = useState(FACTORS[0]);

  const [calculation, setCalculation] = useState({
    quantity: "2500",
    factorId: "EF-001",
  });

  const filteredFactors = useMemo(() => {
    return FACTORS.filter((factor) => {
      const matchesScope =
        scopeFilter === "ALL" || factor.scope === scopeFilter;

      const matchesStatus =
        statusFilter === "ALL" || factor.status === statusFilter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        !searchText ||
        factor.id.toLowerCase().includes(searchText) ||
        factor.activity.toLowerCase().includes(searchText) ||
        factor.category.toLowerCase().includes(searchText) ||
        factor.fuel.toLowerCase().includes(searchText) ||
        factor.source.toLowerCase().includes(searchText);

      return matchesScope && matchesStatus && matchesSearch;
    });
  }, [scopeFilter, statusFilter, search]);

  const selectedCalculationFactor =
    FACTORS.find((factor) => factor.id === calculation.factorId) ||
    FACTORS[0];

  const quantity = Number(calculation.quantity) || 0;

  const calculationResult =
    (quantity * selectedCalculationFactor.value) / 1000;

  const verifiedCount = FACTORS.filter(
    (factor) => factor.status === "VERIFIED"
  ).length;

  const reviewCount = FACTORS.filter(
    (factor) => factor.status === "REVIEW"
  ).length;

  const scopeCount = new Set(FACTORS.map((factor) => factor.scope)).size;

  const handleSelectFactor = (factor) => {
    setSelectedFactor(factor);
    setCalculation({
      quantity:
        factor.id === "EF-003"
          ? "125000"
          : factor.id === "EF-005"
          ? "800"
          : factor.id === "EF-006"
          ? "420000"
          : "2500",
      factorId: factor.id,
    });
  };

  return (
    <div className="factor-page">

      {/* HERO */}
      <section className="factor-hero">

        <div className="factor-hero-content">

          <span className="factor-eyebrow">
            EMISSION FACTOR INTELLIGENCE
          </span>

          <h1>Emission Factor Engine</h1>

          <p>
            A centralized reference layer for activity-level carbon
            calculations, factor versions, source provenance and
            verification status.
          </p>

          <div className="factor-hero-tags">
            <span>Scope 1</span>
            <span>Scope 2</span>
            <span>Scope 3</span>
            <span>India Context</span>
            <span>Version Controlled</span>
          </div>

        </div>

        <div className="factor-hero-stat">

          <div className="factor-engine-icon">
            ƒ
          </div>

          <strong>{FACTORS.length}</strong>
          <span>Reference Factors</span>

          <small>
            {verifiedCount} verified
          </small>

        </div>

      </section>

      {/* SUMMARY */}
      <section className="factor-summary">

        <div className="factor-summary-card">
          <span>Factor Library</span>
          <strong>{FACTORS.length}</strong>
          <small>Reference records</small>
        </div>

        <div className="factor-summary-card verified-card">
          <span>Verified Factors</span>
          <strong>{verifiedCount}</strong>
          <small>Ready for calculation</small>
        </div>

        <div className="factor-summary-card review-card">
          <span>Under Review</span>
          <strong>{reviewCount}</strong>
          <small>Require confirmation</small>
        </div>

        <div className="factor-summary-card scope-card">
          <span>Emission Scopes</span>
          <strong>{scopeCount}</strong>
          <small>Scope 1 • 2 • 3</small>
        </div>

      </section>

      {/* ENGINE FLOW */}
      <section className="factor-section">

        <div className="factor-section-heading">
          <div>
            <span>CALCULATION ARCHITECTURE</span>
            <h2>From activity to verified CO₂e</h2>
          </div>
        </div>

        <div className="factor-flow">

          <div className="factor-flow-step">
            <div className="flow-number">01</div>
            <strong>Activity</strong>
            <span>Quantity + Unit</span>
          </div>

          <div className="factor-flow-arrow">→</div>

          <div className="factor-flow-step active-flow">
            <div className="flow-number">02</div>
            <strong>Factor</strong>
            <span>Value + Version</span>
          </div>

          <div className="factor-flow-arrow">→</div>

          <div className="factor-flow-step">
            <div className="flow-number">03</div>
            <strong>Gas / GWP</strong>
            <span>Carbon equivalence</span>
          </div>

          <div className="factor-flow-arrow">→</div>

          <div className="factor-flow-step">
            <div className="flow-number">04</div>
            <strong>CO₂e</strong>
            <span>Reproducible result</span>
          </div>

          <div className="factor-flow-arrow">→</div>

          <div className="factor-flow-step">
            <div className="flow-number">05</div>
            <strong>BRSR</strong>
            <span>Disclosure mapping</span>
          </div>

        </div>

      </section>

      {/* FILTER + REGISTER */}
      <section className="factor-section">

        <div className="factor-section-heading">
          <div>
            <span>REFERENCE DATA</span>
            <h2>Emission Factor Register</h2>
          </div>

          <div className="factor-library-label">
            DEMO REFERENCE LIBRARY
          </div>
        </div>

        <div className="factor-toolbar">

          <div className="factor-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search factor, activity, fuel or source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
          >
            <option value="ALL">All Scopes</option>
            <option value="Scope 1">Scope 1</option>
            <option value="Scope 2">Scope 2</option>
            <option value="Scope 3">Scope 3</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="VERIFIED">Verified</option>
            <option value="REVIEW">Review</option>
            <option value="ARCHIVED">Archived</option>
          </select>

        </div>

        <div className="factor-register">

          <div className="factor-register-header">
            <span>Factor</span>
            <span>Scope</span>
            <span>Activity</span>
            <span>Fuel / Source</span>
            <span>Value</span>
            <span>Version</span>
            <span>Status</span>
          </div>

          {filteredFactors.map((factor) => (
            <button
              className={`factor-register-row ${
                selectedFactor.id === factor.id ? "selected" : ""
              }`}
              key={factor.id}
              onClick={() => handleSelectFactor(factor)}
            >

              <div className="factor-id">
                <strong>{factor.id}</strong>
                <small>{factor.geography}</small>
              </div>

              <ScopeBadge scope={factor.scope} />

              <div className="factor-activity">
                <strong>{factor.activity}</strong>
                <small>{factor.category}</small>
              </div>

              <div className="factor-source">
                <strong>{factor.fuel}</strong>
                <small>{factor.source}</small>
              </div>

              <div className="factor-value">
                <strong>{factor.value}</strong>
                <small>{factor.unit}</small>
              </div>

              <span className="factor-version">
                v{factor.version}
              </span>

              <StatusBadge status={factor.status} />

            </button>
          ))}

          {filteredFactors.length === 0 && (
            <div className="factor-empty">
              No emission factors match your current filters.
            </div>
          )}

        </div>

      </section>

      {/* DETAILS + CALCULATION */}
      <section className="factor-detail-grid">

        {/* DETAILS */}
        <div className="factor-detail-card">

          <div className="factor-card-heading">
            <div>
              <span>SELECTED FACTOR</span>
              <h2>{selectedFactor.id}</h2>
            </div>

            <StatusBadge status={selectedFactor.status} />
          </div>

          <div className="selected-factor-title">
            <ScopeBadge scope={selectedFactor.scope} />

            <div>
              <h3>{selectedFactor.activity}</h3>
              <p>{selectedFactor.category}</p>
            </div>
          </div>

          <div className="factor-detail-grid-inner">

            <div>
              <span>Factor Value</span>
              <strong>{selectedFactor.value}</strong>
              <small>{selectedFactor.unit}</small>
            </div>

            <div>
              <span>Fuel / Material</span>
              <strong>{selectedFactor.fuel}</strong>
              <small>Activity input</small>
            </div>

            <div>
              <span>Source</span>
              <strong>{selectedFactor.source}</strong>
              <small>Reference source</small>
            </div>

            <div>
              <span>Version</span>
              <strong>v{selectedFactor.version}</strong>
              <small>Controlled version</small>
            </div>

            <div>
              <span>Geography</span>
              <strong>{selectedFactor.geography}</strong>
              <small>Context</small>
            </div>

            <div>
              <span>Effective Period</span>
              <strong>{selectedFactor.effectivePeriod}</strong>
              <small>Validity context</small>
            </div>

          </div>

          <div className="methodology-box">

            <span>Methodology</span>

            <strong>
              {selectedFactor.methodology}
            </strong>

            <p>
              The factor is selected based on the activity type,
              measurement unit, geographic context and reporting period.
            </p>

          </div>

          <div className="gas-gwp-box">

            <div>
              <span>Emission Gases</span>
              <strong>{selectedFactor.gas}</strong>
            </div>

            <div>
              <span>GWP Framework</span>
              <strong>{selectedFactor.gwp}</strong>
            </div>

          </div>

        </div>

        {/* CALCULATION */}
        <div className="factor-calculation-card">

          <div className="factor-card-heading">

            <div>
              <span>LIVE CALCULATION PREVIEW</span>
              <h2>CO₂e Calculation</h2>
            </div>

            <span className="calculation-live">
              LIVE
            </span>

          </div>

          <div className="calculation-field">

            <label>Emission Factor</label>

            <select
              value={calculation.factorId}
              onChange={(e) =>
                setCalculation({
                  ...calculation,
                  factorId: e.target.value,
                })
              }
            >
              {FACTORS.filter(
                (factor) => factor.status !== "ARCHIVED"
              ).map((factor) => (
                <option key={factor.id} value={factor.id}>
                  {factor.id} — {factor.activity}
                </option>
              ))}
            </select>

          </div>

          <div className="calculation-field">

            <label>Activity Quantity</label>

            <div className="quantity-input">
              <input
                type="number"
                min="0"
                value={calculation.quantity}
                onChange={(e) =>
                  setCalculation({
                    ...calculation,
                    quantity: e.target.value,
                  })
                }
              />

              <span>
                {selectedCalculationFactor.unit
                  .split("/")
                  .pop()
                  .trim()}
              </span>
            </div>

          </div>

          <div className="formula-box">

            <span>Calculation Formula</span>

            <div className="formula">

              <strong>
                {quantity.toLocaleString()}
              </strong>

              <span>×</span>

              <strong>
                {selectedCalculationFactor.value}
              </strong>

              <span>÷ 1000</span>

              <span>=</span>

              <strong className="formula-result">
                {calculationResult.toFixed(2)}
              </strong>

              <small>tCO₂e</small>

            </div>

          </div>

          <div className="calculation-breakdown">

            <div>
              <span>Activity quantity</span>
              <strong>
                {quantity.toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Emission factor</span>
              <strong>
                {selectedCalculationFactor.value}
              </strong>
            </div>

            <div>
              <span>Factor unit</span>
              <strong>
                {selectedCalculationFactor.unit}
              </strong>
            </div>

            <div>
              <span>Calculated CO₂e</span>
              <strong className="result-value">
                {calculationResult.toFixed(2)} tCO₂e
              </strong>
            </div>

          </div>

          <div className="calculation-lineage">

            <span>CALCULATION LINEAGE</span>

            <div>
              Activity
              <b>→</b>
              Factor
              <b>→</b>
              GWP
              <b>→</b>
              CO₂e
            </div>

          </div>

        </div>

      </section>

      {/* AUDIT INFORMATION */}
      <section className="factor-audit-section">

        <div className="factor-audit-icon">
          ✓
        </div>

        <div>

          <span>FACTOR PROVENANCE & AUDITABILITY</span>

          <h3>
            Every calculation can be explained back to its factor.
          </h3>

          <p>
            ESGForge keeps the factor value, source, version, methodology,
            geography, effective period and verification status visible
            so reviewers can understand why a CO₂e value was produced.
          </p>

        </div>

        <div className="audit-chain">

          <span>Source</span>
          <b>→</b>
          <span>Version</span>
          <b>→</b>
          <span>Factor</span>
          <b>→</b>
          <span>Calculation</span>
          <b>→</b>
          <span>BRSR</span>

        </div>

      </section>

      {/* DEMO NOTE */}
      <div className="factor-demo-note">

        <strong>Frontend Demonstration Mode</strong>

        <span>
          The displayed emission factors are demonstration/reference
          values for the ESGForge prototype. They are not presented as
          authoritative regulatory values. Production deployment should
          connect them to the approved factor source and version library.
        </span>

      </div>

    </div>
  );
}

export default EmissionFactors;