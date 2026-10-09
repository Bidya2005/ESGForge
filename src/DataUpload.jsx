import React, { useEffect, useMemo, useState } from "react";
import "./DataUpload.css";

/*
=========================================================
ESGFORGE - DATA UPLOAD / MEIL ACTIVITY CAPTURE
=========================================================

Backend base:
  /api/v1

Activity APIs:
  POST /submissions/{submission_id}/versions/{version_id}/activities
  GET  /submissions/{submission_id}/versions/{version_id}/activities
  GET  /submissions/{submission_id}/versions/{version_id}/activities/{activity_id}
  PATCH /submissions/{submission_id}/versions/{version_id}/activities/{activity_id}
  DELETE /submissions/{submission_id}/versions/{version_id}/activities/{activity_id}
  POST /submissions/{submission_id}/versions/{version_id}/activities/validate

Catalog APIs:
  GET /activity-types
  GET /activity-sources

IMPORTANT:
- Do not invent unit/gas/EF/GWP values.
- Canonical activity_type_id/activity_source_id must be approved.
- External integer source IDs stay source_* fields.
- No frontend CO2e calculation.
- No activity -> KPI/BRSR mapping here.
=========================================================
*/

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api/v1";

/* =====================================================
   ENUMS SUPPORTED BY CURRENT BACKEND CONTRACT
===================================================== */

const DATA_METHODS = [
  "MEASURED",
  "METER",
  "INVOICE_QUANTITY",
  "SUPPLIER_DATA",
  "ENGINEERING_ESTIMATE",
  "SPEND_BASED",
  "SURVEY",
  "MODELLED",
  "OTHER_ESTIMATE",
];

const RECORD_NATURES = [
  "ACTIVITY",
  "CAPTURE",
  "ADJUSTMENT",
];

const SCOPES = [
  { value: 1, label: "Scope 1" },
  { value: 2, label: "Scope 2" },
  { value: 3, label: "Scope 3 — Category 5" },
];

const COMBUSTION_TYPES = [
  "STATIONARY",
  "MOBILE",
];

const FUGITIVE_TYPES = [
  "REFRIGERANT",
  "SF6",
  "METHANE",
  "FIRE_SUPPRESSION",
  "OTHER",
];

const ENERGY_TYPES = [
  "ELECTRICITY",
  "STEAM",
  "HEAT",
  "COOLING",
  "REFRIGERATION",
  "OTHER",
];

const PROCUREMENT_TYPES = [
  "GRID",
  "WHEELED_RE",
  "WHEELED_NONRE",
  "GREEN_TARIFF",
  "THIRD_PARTY",
  "CAPTIVE_PURCHASE",
  "OTHER",
];

const ACCOUNTING_METHODS = [
  "LOCATION_BASED",
  "MARKET_BASED",
  "OTHER",
];

const SCOPE3_CALCULATION_METHODS = [
  "SUPPLIER_SPECIFIC",
  "HYBRID",
  "AVERAGE_DATA",
  "SPEND_BASED",
  "DISTANCE_BASED",
  "FUEL_BASED",
  "WASTE_SPECIFIC",
  "ASSET_SPECIFIC",
  "INVESTMENT_SPECIFIC",
  "OTHER",
];

const WASTE_TREATMENT_METHODS = [
  "LANDFILL",
  "RECYCLING",
  "INCINERATION",
  "INCINERATION_ENERGY_RECOVERY",
  "COMPOSTING",
  "ANAEROBIC_DIGESTION",
  "WASTEWATER",
  "REUSE",
  "OTHER",
];

/* =====================================================
   HELPERS
===================================================== */

function getStoredValue(keys) {
  for (const key of keys) {
    const value = localStorage.getItem(key);

    if (value) {
      return value;
    }
  }

  return "";
}

function getToken() {
  return getStoredValue([
    "access_token",
    "token",
    "esgforge_access_token",
    "auth_token",
  ]);
}

function getSubmissionId() {
  return getStoredValue([
    "esgforge_submission_id",
    "submission_id",
  ]);
}

function getVersionId() {
  return getStoredValue([
    "esgforge_version_id",
    "version_id",
  ]);
}

function isNonEmpty(value) {
  return String(value ?? "").trim() !== "";
}

function cleanObject(object) {
  const cleaned = {};

  Object.entries(object).forEach(([key, value]) => {
    if (
      value !== "" &&
      value !== null &&
      value !== undefined
    ) {
      cleaned[key] = value;
    }
  });

  return cleaned;
}

function toNumberOrUndefined(value) {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : undefined;
}

function toIntegerOrUndefined(value) {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  const number = Number(value);

  return Number.isInteger(number) ? number : undefined;
}

/* =====================================================
   API HELPER
===================================================== */

async function apiRequest(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body
      ? {
          "Content-Type": "application/json",
        }
      : {}),
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType =
    response.headers.get("content-type") || "";

  let data = null;

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text || null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.error ||
      `Request failed with HTTP ${response.status}`;

    const error = new Error(
      typeof message === "string"
        ? message
        : JSON.stringify(message)
    );

    error.status = response.status;
    error.payload = data;

    throw error;
  }

  return data;
}

/* =====================================================
   CSV HELPERS
===================================================== */

const LEGACY_REQUIRED_COLUMNS = [
  "Metric",
  "Value",
  "Unit",
  "Category",
];

const SAMPLE_CSV = `Metric,Value,Unit,Category
Total Energy Consumption,125000,kWh,ENVIRONMENTAL
Total Energy Consumption,130000,kWh,ENVIRONMENTAL`;

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function parseCSVLine(line) {
  const result = [];

  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());

  return result;
}

function parseCSV(text) {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.trim() !== "");

  if (!lines.length) {
    throw new Error("The uploaded file is empty.");
  }

  const headers = parseCSVLine(lines[0]);

  const rows = lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });

  return {
    headers,
    rows,
  };
}

function downloadSample() {
  const blob = new Blob([SAMPLE_CSV], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "esgforge-upload-template.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/* =====================================================
   INITIAL ACTIVITY FORM
===================================================== */

const EMPTY_FORM = {
  scope_no: "2",
  scope3_category_no: "5",

  activity_type_id: "",
  activity_source_id: "",

  source_activity_id: "",
  source_report_id: "",
  source_entity_id: "",
  source_facility_id: "",
  source_emission_id: "",
  source_partner_id: "",
  source_parent_activity_id: "",
  source_activity_type_id: "",
  source_unit_id: "",

  record_nature: "ACTIVITY",

  activity_date: "",
  period_start: "",
  period_end: "",

  description: "",
  quantity: "",
  unit_id: "",

  spend_amount: "",
  currency_code: "",

  data_method: "MEASURED",
  source_reference: "",
  invoice_or_meter_ref: "",

  estimated_flag: false,
  estimation_reason: "",
  remarks: "",

  /* Scope 1 combustion */
  combustion_type: "STATIONARY",
  source_fuel_substance_id: "",
  equipment_type: "",
  vehicle_or_asset_ref: "",
  net_calorific_value: "",
  ncv_unit_text: "",
  density_value: "",
  density_unit_text: "",
  combustion_notes: "",

  /* Scope 1 process */
  process_type: "",
  input_material_id: "",
  production_quantity: "",
  source_production_unit_id: "",
  production_unit_id: "",
  process_method: "",
  lab_test_reference: "",
  process_notes: "",

  /* Scope 1 fugitive */
  fugitive_type: "REFRIGERANT",
  substance_id: "",
  gas_id: "",
  gas_master_id: "",
  opening_charge_qty: "",
  added_qty: "",
  recovered_qty: "",
  closing_charge_qty: "",
  estimated_leakage_qty: "",
  fugitive_source_unit_id: "",
  fugitive_unit_id: "",
  calculation_method: "",
  fugitive_notes: "",

  /* Scope 1 carbon capture */
  captured_gas_id: "",
  captured_quantity: "",
  capture_source_unit_id: "",
  capture_unit_id: "",
  capture_method: "",
  storage_or_use: "",
  permanent_storage_flag: false,
  measurement_method: "",
  capture_notes: "",

  /* Scope 2 */
  energy_type: "ELECTRICITY",
  supplier_partner_id: "",
  meter_identifier: "",
  connection_number: "",
  grid_region: "",
  procurement_type: "",
  accounting_method: "LOCATION_BASED",
  renewable_flag: false,
  renewable_percentage: "",
  certificate_type: "",
  certificate_reference: "",
  energy_notes: "",

  /* Scope 3 common */
  scope3_calculation_method: "WASTE_SPECIFIC",
  data_source_type: "",
  supplier_specific_flag: false,
  allocation_required_flag: false,
  allocation_method: "",
  activity_boundary: "",
  life_cycle_stage: "",
  primary_data_percentage: "",
  secondary_data_percentage: "",
  scope3_notes: "",

  /* Scope 3 Category 5 */
  waste_type_id: "",
  treatment_method: "RECYCLING",
  waste_vendor_id: "",
  disposal_location: "",
  recycled_percentage: "",
  landfill_percentage: "",
  incinerated_percentage: "",
  composted_percentage: "",
  transport_distance_km: "",
  waste_notes: "",
};

/* =====================================================
   FORM FIELD COMPONENTS
===================================================== */

function Field({
  label,
  required = false,
  children,
  hint,
}) {
  return (
    <label className="upload-form-field">
      <span className="upload-field-label">
        {label}

        {required && (
          <b className="required-mark">
            *
          </b>
        )}
      </span>

      {children}

      {hint && (
        <small className="upload-field-hint">
          {hint}
        </small>
      )}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder = "",
  type = "text",
  min,
  max,
  step,
  disabled = false,
}) {
  return (
    <input
      className="editable-cell"
      type={type}
      value={value ?? ""}
      onChange={(event) =>
        onChange(event.target.value)
      }
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}) {
  return (
    <select
      className="editable-cell"
      value={value ?? ""}
      onChange={(event) =>
        onChange(event.target.value)
      }
      disabled={disabled}
    >
      {placeholder && (
        <option value="">
          {placeholder}
        </option>
      )}

      {options.map((option) => {
        const item =
          typeof option === "string"
            ? {
                value: option,
                label: option,
              }
            : option;

        return (
          <option
            key={item.value}
            value={item.value}
          >
            {item.label}
          </option>
        );
      })}
    </select>
  );
}

/* =====================================================
   COMPONENT
===================================================== */

function DataUpload({ onNavigate }) {
  /* ===================================================
     SUBMISSION CONTEXT
  =================================================== */

  const [submissionId, setSubmissionId] =
    useState(getSubmissionId());

  const [versionId, setVersionId] =
    useState(getVersionId());

  /* ===================================================
     MAIN UI
  =================================================== */

  const [activeMode, setActiveMode] =
    useState("activity");

  const [activeTab, setActiveTab] =
    useState("capture");

  const [loading, setLoading] =
    useState(false);

  const [catalogLoading, setCatalogLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* ===================================================
     CATALOGS
  =================================================== */

  const [activityTypes, setActivityTypes] =
    useState([]);

  const [activitySources, setActivitySources] =
    useState([]);

  /* ===================================================
     ACTIVITIES
  =================================================== */

  const [activities, setActivities] =
    useState([]);

  const [selectedActivityId, setSelectedActivityId] =
    useState("");

  /* ===================================================
     FORM
  =================================================== */

  const [form, setForm] =
    useState(EMPTY_FORM);

  /* ===================================================
     VALIDATION
  =================================================== */

  const [validationResults, setValidationResults] =
    useState([]);

  const [validationLoading, setValidationLoading] =
    useState(false);

  /* ===================================================
     LEGACY CSV
  =================================================== */

  const [file, setFile] =
    useState(null);

  const [headers, setHeaders] =
    useState([]);

  const [rows, setRows] =
    useState([]);

  const [missingColumns, setMissingColumns] =
    useState([]);

  const [rowErrors, setRowErrors] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("ALL");

  const [prepared, setPrepared] =
    useState(false);

  const [dragActive, setDragActive] =
    useState(false);

  /* ===================================================
     SYNC CONTEXT
  =================================================== */

  useEffect(() => {
    const syncContext = () => {
      setSubmissionId(getSubmissionId());
      setVersionId(getVersionId());
    };

    window.addEventListener(
      "storage",
      syncContext
    );

    window.addEventListener(
      "esgforge-context-refresh",
      syncContext
    );

    return () => {
      window.removeEventListener(
        "storage",
        syncContext
      );

      window.removeEventListener(
        "esgforge-context-refresh",
        syncContext
      );
    };
  }, []);

  /* ===================================================
     UPDATE FORM
  =================================================== */

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* ===================================================
     LOAD CATALOGS
  =================================================== */

  const loadCatalogs = async () => {
    setCatalogLoading(true);

    try {
      const [types, sources] =
        await Promise.all([
          apiRequest("/activity-types"),
          apiRequest("/activity-sources"),
        ]);

      const typeList = Array.isArray(types)
        ? types
        : types?.items || types?.data || [];

      const sourceList = Array.isArray(sources)
        ? sources
        : sources?.items || sources?.data || [];

      setActivityTypes(typeList);
      setActivitySources(sourceList);

      setSuccess(
        "Activity catalogs loaded successfully."
      );
    } catch (err) {
      setError(
        `Unable to load activity catalogs: ${
          err.message
        }`
      );
    } finally {
      setCatalogLoading(false);
    }
  };

  /* ===================================================
     LOAD ACTIVITIES
  =================================================== */

  const loadActivities = async () => {
    if (!submissionId || !versionId) {
      setError(
        "Submission ID or version ID is missing. Open the current submission before loading MEIL activities."
      );
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest(
        `/submissions/${submissionId}/versions/${versionId}/activities`
      );

      const list = Array.isArray(data)
        ? data
        : data?.items || data?.activities || data?.data || [];

      setActivities(list);

      setSuccess(
        `${list.length} MEIL activit${
          list.length === 1 ? "y" : "ies"
        } loaded.`
      );
    } catch (err) {
      setError(
        `Unable to load MEIL activities: ${
          err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================================================
     INITIAL LOAD
  =================================================== */

  useEffect(() => {
    loadCatalogs();

    if (submissionId && versionId) {
      loadActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId, versionId]);

  /* ===================================================
     APPROVED CATALOGS ONLY
  =================================================== */

  const approvedActivityTypes = useMemo(
    () =>
      activityTypes.filter(
        (item) =>
          String(
            item.approval_status || ""
          ).toUpperCase() === "APPROVED"
      ),
    [activityTypes]
  );

  const approvedActivitySources = useMemo(
    () =>
      activitySources.filter(
        (item) =>
          String(
            item.approval_status || ""
          ).toUpperCase() === "APPROVED"
      ),
    [activitySources]
  );

  /* ===================================================
     ACTIVITY TYPE AUTO-SCOPE
  =================================================== */

  const handleActivityTypeChange = (id) => {
    const selected =
      approvedActivityTypes.find(
        (item) => item.id === id
      );

    updateForm("activity_type_id", id);

    if (
      selected?.default_scope_no &&
      [1, 2, 3].includes(
        Number(selected.default_scope_no)
      )
    ) {
      updateForm(
        "scope_no",
        String(selected.default_scope_no)
      );

      if (
        Number(selected.default_scope_no) !== 3
      ) {
        updateForm(
          "scope3_category_no",
          ""
        );
      } else {
        updateForm(
          "scope3_category_no",
          "5"
        );
      }
    }
  };

  /* ===================================================
     DETAIL VALIDATION
  =================================================== */

  const validateForm = () => {
    const problems = [];

    if (!submissionId) {
      problems.push(
        "Submission ID is missing."
      );
    }

    if (!versionId) {
      problems.push(
        "Submission version ID is missing."
      );
    }

    if (!form.period_start) {
      problems.push(
        "Period start is required."
      );
    }

    if (!form.period_end) {
      problems.push(
        "Period end is required."
      );
    }

    if (
      form.period_start &&
      form.period_end &&
      form.period_end < form.period_start
    ) {
      problems.push(
        "Period end must be on or after period start."
      );
    }

    if (
      form.activity_date &&
      (
        form.activity_date < form.period_start ||
        form.activity_date > form.period_end
      )
    ) {
      problems.push(
        "Activity date must fall within the activity period."
      );
    }

    if (
      form.quantity !== "" &&
      Number(form.quantity) < 0
    ) {
      problems.push(
        "Quantity cannot be negative."
      );
    }

    if (
      form.spend_amount !== "" &&
      Number(form.spend_amount) < 0
    ) {
      problems.push(
        "Spend amount cannot be negative."
      );
    }

    if (
      form.currency_code &&
      String(form.currency_code).length !== 3
    ) {
      problems.push(
        "Currency code must contain exactly 3 characters."
      );
    }

    if (
      Number(form.scope_no) === 3 &&
      Number(form.scope3_category_no) !== 5
    ) {
      problems.push(
        "The current backend foundation supports Scope 3 Category 5."
      );
    }

    if (
      Number(form.scope_no) === 1 &&
      form.record_nature === "ACTIVITY"
    ) {
      if (!form.combustion_type) {
        problems.push(
          "Scope 1 combustion type is required for combustion activities."
        );
      }
    }

    if (
      form.renewable_percentage !== "" &&
      (
        Number(form.renewable_percentage) < 0 ||
        Number(form.renewable_percentage) > 100
      )
    ) {
      problems.push(
        "Renewable percentage must be between 0 and 100."
      );
    }

    const primary =
      Number(form.primary_data_percentage || 0);

    const secondary =
      Number(form.secondary_data_percentage || 0);

    if (
      primary < 0 ||
      primary > 100 ||
      secondary < 0 ||
      secondary > 100
    ) {
      problems.push(
        "Primary and secondary data percentages must be between 0 and 100."
      );
    }

    if (primary + secondary > 100) {
      problems.push(
        "Primary and secondary data percentages cannot exceed 100 combined."
      );
    }

    const wastePercentages = [
      Number(form.recycled_percentage || 0),
      Number(form.landfill_percentage || 0),
      Number(form.incinerated_percentage || 0),
      Number(form.composted_percentage || 0),
    ];

    if (
      wastePercentages.some(
        (value) =>
          value < 0 || value > 100
      )
    ) {
      problems.push(
        "Waste treatment percentages must be between 0 and 100."
      );
    }

    if (
      wastePercentages.reduce(
        (sum, value) => sum + value,
        0
      ) > 100
    ) {
      problems.push(
        "Waste treatment percentages cannot exceed 100 combined."
      );
    }

    return problems;
  };

  /* ===================================================
     BUILD ACTIVITY PAYLOAD
  =================================================== */

  const buildActivityPayload = () => {
    const scope = Number(form.scope_no);

    const activityRecord = cleanObject({
      scope_no: scope,

      scope3_category_no:
        scope === 3
          ? 5
          : undefined,

      activity_type_id:
        form.activity_type_id || undefined,

      activity_source_id:
        form.activity_source_id || undefined,

      source_activity_id:
        toIntegerOrUndefined(
          form.source_activity_id
        ),

      source_report_id:
        toIntegerOrUndefined(
          form.source_report_id
        ),

      source_entity_id:
        toIntegerOrUndefined(
          form.source_entity_id
        ),

      source_facility_id:
        toIntegerOrUndefined(
          form.source_facility_id
        ),

      source_emission_id:
        toIntegerOrUndefined(
          form.source_emission_id
        ),

      source_partner_id:
        toIntegerOrUndefined(
          form.source_partner_id
        ),

      source_parent_activity_id:
        toIntegerOrUndefined(
          form.source_parent_activity_id
        ),

      source_activity_type_id:
        toIntegerOrUndefined(
          form.source_activity_type_id
        ),

      source_unit_id:
        toIntegerOrUndefined(
          form.source_unit_id
        ),

      record_nature:
        form.record_nature,

      activity_date:
        form.activity_date || undefined,

      period_start:
        form.period_start,

      period_end:
        form.period_end,

      description:
        form.description || undefined,

      quantity:
        toNumberOrUndefined(
          form.quantity
        ),

      unit_id:
        form.unit_id || undefined,

      spend_amount:
        toNumberOrUndefined(
          form.spend_amount
        ),

      currency_code:
        form.currency_code
          ? form.currency_code.toUpperCase()
          : undefined,

      data_method:
        form.data_method,

      source_reference:
        form.source_reference || undefined,

      invoice_or_meter_ref:
        form.invoice_or_meter_ref || undefined,

      estimated_flag:
        Boolean(form.estimated_flag),

      estimation_reason:
        form.estimation_reason || undefined,

      remarks:
        form.remarks || undefined,
    });

    const payload = {
      activity_record: activityRecord,
    };

    /* ================================================
       SCOPE 1
    ================================================= */

    if (scope === 1) {
      /*
       * The current UI lets the user choose the
       * Scope 1 detail subtype.
       */
      const subtype =
        form.scope1_detail_type ||
        "combustion";

      if (subtype === "combustion") {
        payload.scope1_combustion_detail =
          cleanObject({
            combustion_type:
              form.combustion_type,

            source_fuel_substance_id:
              toIntegerOrUndefined(
                form.source_fuel_substance_id
              ),

            equipment_type:
              form.equipment_type || undefined,

            vehicle_or_asset_ref:
              form.vehicle_or_asset_ref || undefined,

            net_calorific_value:
              toNumberOrUndefined(
                form.net_calorific_value
              ),

            ncv_unit_text:
              form.ncv_unit_text || undefined,

            density_value:
              toNumberOrUndefined(
                form.density_value
              ),

            density_unit_text:
              form.density_unit_text || undefined,

            notes:
              form.combustion_notes || undefined,
          });
      }

      if (subtype === "process") {
        payload.scope1_process_detail =
          cleanObject({
            process_type:
              form.process_type,

            input_material_id:
              toIntegerOrUndefined(
                form.input_material_id
              ),

            production_quantity:
              toNumberOrUndefined(
                form.production_quantity
              ),

            source_production_unit_id:
              toIntegerOrUndefined(
                form.source_production_unit_id
              ),

            production_unit_id:
              form.production_unit_id || undefined,

            process_method:
              form.process_method || undefined,

            lab_test_reference:
              form.lab_test_reference || undefined,

            notes:
              form.process_notes || undefined,
          });
      }

      if (subtype === "fugitive") {
        payload.scope1_fugitive_detail =
          cleanObject({
            fugitive_type:
              form.fugitive_type,

            substance_id:
              toIntegerOrUndefined(
                form.substance_id
              ),

            gas_id:
              toIntegerOrUndefined(
                form.gas_id
              ),

            gas_master_id:
              form.gas_master_id || undefined,

            opening_charge_qty:
              toNumberOrUndefined(
                form.opening_charge_qty
              ),

            added_qty:
              toNumberOrUndefined(
                form.added_qty
              ),

            recovered_qty:
              toNumberOrUndefined(
                form.recovered_qty
              ),

            closing_charge_qty:
              toNumberOrUndefined(
                form.closing_charge_qty
              ),

            estimated_leakage_qty:
              toNumberOrUndefined(
                form.estimated_leakage_qty
              ),

            source_unit_id:
              toIntegerOrUndefined(
                form.fugitive_source_unit_id
              ),

            unit_id:
              form.fugitive_unit_id || undefined,

            calculation_method:
              form.calculation_method || undefined,

            notes:
              form.fugitive_notes || undefined,
          });
      }

      if (subtype === "capture") {
        payload.scope1_carbon_capture_detail =
          cleanObject({
            captured_gas_id:
              toIntegerOrUndefined(
                form.captured_gas_id
              ),

            captured_quantity:
              toNumberOrUndefined(
                form.captured_quantity
              ),

            source_unit_id:
              toIntegerOrUndefined(
                form.capture_source_unit_id
              ),

            gas_master_id:
              form.gas_master_id || undefined,

            unit_id:
              form.capture_unit_id || undefined,

            capture_method:
              form.capture_method || undefined,

            storage_or_use:
              form.storage_or_use || undefined,

            permanent_storage_flag:
              Boolean(
                form.permanent_storage_flag
              ),

            measurement_method:
              form.measurement_method || undefined,

            notes:
              form.capture_notes || undefined,
          });
      }
    }

    /* ================================================
       SCOPE 2
    ================================================= */

    if (scope === 2) {
      payload.scope2_energy_detail =
        cleanObject({
          energy_type:
            form.energy_type,

          supplier_partner_id:
            toIntegerOrUndefined(
              form.supplier_partner_id
            ),

          meter_identifier:
            form.meter_identifier || undefined,

          connection_number:
            form.connection_number || undefined,

          grid_region:
            form.grid_region || undefined,

          procurement_type:
            form.procurement_type || undefined,

          accounting_method:
            form.accounting_method,

          renewable_flag:
            Boolean(form.renewable_flag),

          renewable_percentage:
            toNumberOrUndefined(
              form.renewable_percentage
            ),

          certificate_type:
            form.certificate_type || undefined,

          certificate_reference:
            form.certificate_reference || undefined,

          notes:
            form.energy_notes || undefined,
        });
    }

    /* ================================================
       SCOPE 3 CATEGORY 5
    ================================================= */

    if (scope === 3) {
      payload.scope3_activity_detail =
        cleanObject({
          calculation_method:
            form.scope3_calculation_method,

          data_source_type:
            form.data_source_type || undefined,

          supplier_specific_flag:
            Boolean(
              form.supplier_specific_flag
            ),

          allocation_required_flag:
            Boolean(
              form.allocation_required_flag
            ),

          allocation_method:
            form.allocation_method || undefined,

          activity_boundary:
            form.activity_boundary || undefined,

          life_cycle_stage:
            form.life_cycle_stage || undefined,

          primary_data_percentage:
            toNumberOrUndefined(
              form.primary_data_percentage
            ),

          secondary_data_percentage:
            toNumberOrUndefined(
              form.secondary_data_percentage
            ),

          notes:
            form.scope3_notes || undefined,
        });

      payload.scope3_waste_detail =
        cleanObject({
          waste_type_id:
            toIntegerOrUndefined(
              form.waste_type_id
            ),

          treatment_method:
            form.treatment_method,

          waste_vendor_id:
            toIntegerOrUndefined(
              form.waste_vendor_id
            ),

          disposal_location:
            form.disposal_location || undefined,

          recycled_percentage:
            toNumberOrUndefined(
              form.recycled_percentage
            ),

          landfill_percentage:
            toNumberOrUndefined(
              form.landfill_percentage
            ),

          incinerated_percentage:
            toNumberOrUndefined(
              form.incinerated_percentage
            ),

          composted_percentage:
            toNumberOrUndefined(
              form.composted_percentage
            ),

          transport_distance_km:
            toNumberOrUndefined(
              form.transport_distance_km
            ),

          notes:
            form.waste_notes || undefined,
        });
    }

    return payload;
  };

  /* ===================================================
     CREATE ACTIVITY
  =================================================== */

  const handleCreateActivity = async () => {
    setError("");
    setSuccess("");

    const problems = validateForm();

    if (problems.length) {
      setError(
        problems.join(" ")
      );
      return;
    }

    setLoading(true);

    try {
      const payload =
        buildActivityPayload();

      const created = await apiRequest(
        `/submissions/${submissionId}/versions/${versionId}/activities`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      setSuccess(
        `Activity ${
          created?.activity_id
            ? `created successfully: ${created.activity_id}`
            : "created successfully."
        }`
      );

      setForm(EMPTY_FORM);
      setValidationResults([]);
      setSelectedActivityId("");

      await loadActivities();
    } catch (err) {
      setError(
        `Activity creation failed: ${
          err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================================================
     DELETE ACTIVITY
  =================================================== */

  const handleDeleteActivity = async (
    activityId
  ) => {
    if (!activityId) return;

    const confirmed =
      window.confirm(
        "Delete this activity? This cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiRequest(
        `/submissions/${submissionId}/versions/${versionId}/activities/${activityId}`,
        {
          method: "DELETE",
        }
      );

      setSuccess(
        "Activity deleted successfully."
      );

      if (
        selectedActivityId === activityId
      ) {
        setSelectedActivityId("");
      }

      await loadActivities();
    } catch (err) {
      setError(
        `Unable to delete activity: ${
          err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================================================
     LOAD ACTIVITY INTO FORM
  =================================================== */

  const handleEditActivity = async (
    activityId
  ) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await apiRequest(
        `/submissions/${submissionId}/versions/${versionId}/activities/${activityId}`
      );

      const activityFields =
        data?.activity_fields || {};

      const detail =
        data?.detail_fields || {};

      setSelectedActivityId(activityId);

      setForm((previous) => ({
        ...previous,

        ...activityFields,

        scope_no:
          String(
            activityFields.scope_no ??
              data?.scope_no ??
              previous.scope_no
          ),

        scope3_category_no:
          activityFields.scope3_category_no
            ? String(
                activityFields.scope3_category_no
              )
            : previous.scope3_category_no,

        period_start:
          activityFields.period_start ||
          data?.period_start ||
          "",

        period_end:
          activityFields.period_end ||
          data?.period_end ||
          "",

        activity_date:
          activityFields.activity_date ||
          data?.activity_date ||
          "",

        quantity:
          activityFields.quantity ??
          data?.quantity ??
          "",

        activity_type_id:
          activityFields.activity_type_id ||
          "",

        activity_source_id:
          activityFields.activity_source_id ||
          "",

        /* Scope 1 combustion */
        combustion_type:
          detail.combustion_type ||
          previous.combustion_type,

        source_fuel_substance_id:
          detail.source_fuel_substance_id ??
          "",

        equipment_type:
          detail.equipment_type || "",

        vehicle_or_asset_ref:
          detail.vehicle_or_asset_ref || "",

        net_calorific_value:
          detail.net_calorific_value ?? "",

        ncv_unit_text:
          detail.ncv_unit_text || "",

        density_value:
          detail.density_value ?? "",

        density_unit_text:
          detail.density_unit_text || "",

        combustion_notes:
          detail.notes || "",

        /* Scope 2 */
        energy_type:
          detail.energy_type ||
          previous.energy_type,

        supplier_partner_id:
          detail.supplier_partner_id ?? "",

        meter_identifier:
          detail.meter_identifier || "",

        connection_number:
          detail.connection_number || "",

        grid_region:
          detail.grid_region || "",

        procurement_type:
          detail.procurement_type || "",

        accounting_method:
          detail.accounting_method ||
          previous.accounting_method,

        renewable_flag:
          Boolean(detail.renewable_flag),

        renewable_percentage:
          detail.renewable_percentage ?? "",

        certificate_type:
          detail.certificate_type || "",

        certificate_reference:
          detail.certificate_reference || "",

        energy_notes:
          detail.notes || "",
      }));

      setActiveTab("capture");

      setSuccess(
        "Activity loaded into the editor."
      );
    } catch (err) {
      setError(
        `Unable to load activity: ${
          err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================================================
     VALIDATE ACTIVITIES
  =================================================== */

  const handleValidateActivities = async () => {
    if (!submissionId || !versionId) {
      setError(
        "Submission ID or version ID is missing."
      );
      return;
    }

    setValidationLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await apiRequest(
        `/submissions/${submissionId}/versions/${versionId}/activities/validate`,
        {
          method: "POST",
        }
      );

      const results =
        data?.results || [];

      setValidationResults(results);

      const validCount =
        results.filter(
          (item) =>
            String(item.status).toUpperCase() ===
            "VALID"
        ).length;

      const pendingCount =
        results.filter(
          (item) =>
            String(item.status).toUpperCase() ===
            "PENDING"
        ).length;

      const invalidCount =
        results.filter(
          (item) =>
            String(item.status).toUpperCase() ===
              "INVALID" ||
            String(item.status).toUpperCase() ===
              "INCOMPLETE"
        ).length;

      setSuccess(
        `Validation completed — ${validCount} VALID, ${pendingCount} PENDING, ${invalidCount} INVALID/INCOMPLETE.`
      );
    } catch (err) {
      if (err.status === 503) {
        setError(
          "The backend activity validation rule is not configured yet (HTTP 503)."
        );
      } else {
        setError(
          `Activity validation failed: ${
            err.message
          }`
        );
      }
    } finally {
      setValidationLoading(false);
    }
  };

  /* ===================================================
     SELECTED ACTIVITY VALIDATION
  =================================================== */

  const selectedValidation = useMemo(() => {
    if (!selectedActivityId) {
      return null;
    }

    return (
      validationResults.find(
        (item) =>
          item.activity_id ===
          selectedActivityId
      ) || null
    );
  }, [
    selectedActivityId,
    validationResults,
  ]);

  /* ===================================================
     CSV VALIDATION
  =================================================== */

  const validateRows = (
    currentRows
  ) => {
    const errors = [];

    currentRows.forEach(
      (row, index) => {
        const rowNumber = index + 2;

        const metric = String(
          row.Metric || ""
        ).trim();

        const value = String(
          row.Value || ""
        ).trim();

        const unit = String(
          row.Unit || ""
        ).trim();

        const category = String(
          row.Category || ""
        ).trim();

        if (!metric) {
          errors.push(
            `Row ${rowNumber}: Metric is missing.`
          );
        }

        if (!value) {
          errors.push(
            `Row ${rowNumber}: Value is missing.`
          );
        } else if (
          Number.isNaN(Number(value))
        ) {
          errors.push(
            `Row ${rowNumber}: Value must be numeric.`
          );
        }

        if (!unit) {
          errors.push(
            `Row ${rowNumber}: Unit is missing.`
          );
        }

        if (!category) {
          errors.push(
            `Row ${rowNumber}: Category is missing.`
          );
        }
      }
    );

    return errors;
  };

  /* ===================================================
     CSV PROCESS
  =================================================== */

  const processFile = (
    selectedFile
  ) => {
    if (!selectedFile) return;

    setError("");
    setSuccess("");
    setPrepared(false);

    const extension =
      selectedFile.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (extension !== "csv") {
      setError(
        "Please upload a CSV file."
      );
      return;
    }

    const reader =
      new FileReader();

    reader.onload = (
      event
    ) => {
      try {
        const text =
          event.target?.result || "";

        const parsed =
          parseCSV(text);

        const normalizedHeaders =
          parsed.headers.map(
            normalizeHeader
          );

        const missing =
          LEGACY_REQUIRED_COLUMNS.filter(
            (required) =>
              !normalizedHeaders.includes(
                normalizeHeader(required)
              )
          );

        if (missing.length > 0) {
          setFile(selectedFile);
          setHeaders(
            parsed.headers
          );
          setRows([]);
          setMissingColumns(
            missing
          );

          setError(
            `Required CSV columns are missing: ${missing.join(
              ", "
            )}.`
          );

          return;
        }

        const errors =
          validateRows(
            parsed.rows
          );

        setFile(selectedFile);
        setHeaders(
          parsed.headers
        );
        setRows(
          parsed.rows
        );
        setMissingColumns([]);
        setRowErrors(
          errors
        );

        if (errors.length) {
          setError(
            `${errors.length} CSV validation issue${
              errors.length === 1
                ? ""
                : "s"
            } found.`
          );
        } else {
          setSuccess(
            `Successfully parsed ${parsed.rows.length} CSV record${
              parsed.rows.length === 1
                ? ""
                : "s"
            }.`
          );
        }
      } catch (err) {
        setError(
          err.message ||
            "Unable to parse CSV."
        );
      }
    };

    reader.onerror = () => {
      setError(
        "Unable to read the selected file."
      );
    };

    reader.readAsText(
      selectedFile
    );
  };

  const handleFileChange = (
    event
  ) => {
    const selectedFile =
      event.target.files?.[0];

    processFile(
      selectedFile
    );

    event.target.value = "";
  };

  const handleDrop = (
    event
  ) => {
    event.preventDefault();

    setDragActive(false);

    const droppedFile =
      event.dataTransfer.files?.[0];

    processFile(
      droppedFile
    );
  };

  /* ===================================================
     CSV FILTER
  =================================================== */

  const categories = useMemo(() => {
    return [
      ...new Set(
        rows
          .map((row) =>
            String(
              row.Category || ""
            ).trim()
          )
          .filter(Boolean)
      ),
    ];
  }, [rows]);

  const filteredRows =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return rows.filter(
        (row) => {
          const metric =
            String(
              row.Metric || ""
            ).toLowerCase();

          const category =
            String(
              row.Category || ""
            ).toUpperCase();

          const matchesSearch =
            !query ||
            metric.includes(
              query
            ) ||
            category
              .toLowerCase()
              .includes(query);

          const matchesCategory =
            categoryFilter ===
              "ALL" ||
            category ===
              categoryFilter;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      rows,
      search,
      categoryFilter,
    ]);

  const validRows =
    rows.length -
    rowErrors.length;

  const dataQuality =
    rows.length === 0
      ? 0
      : Math.max(
          0,
          Math.round(
            (validRows /
              rows.length) *
              100
          )
        );

  const isReady =
    rows.length > 0 &&
    missingColumns.length === 0 &&
    rowErrors.length === 0;

  /* ===================================================
     CSV EDIT
  =================================================== */

  const handleCellChange = (
    rowIndex,
    field,
    value
  ) => {
    const updatedRows = [
      ...rows,
    ];

    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [field]: value,
    };

    setRows(
      updatedRows
    );

    setRowErrors(
      validateRows(
        updatedRows
      )
    );

    setPrepared(false);
  };

  /* ===================================================
     CSV ADD
  =================================================== */

  const handleAddRow = () => {
    const newRow = {};

    const activeHeaders =
      headers.length
        ? headers
        : LEGACY_REQUIRED_COLUMNS;

    activeHeaders.forEach(
      (header) => {
        newRow[header] = "";
      }
    );

    const updatedRows = [
      ...rows,
      newRow,
    ];

    setHeaders(
      activeHeaders
    );

    setRows(
      updatedRows
    );

    setRowErrors(
      validateRows(
        updatedRows
      )
    );

    setPrepared(false);

    setSuccess(
      "New CSV record added."
    );
  };

  /* ===================================================
     CSV DELETE
  =================================================== */

  const handleDeleteRow = (
    rowIndex
  ) => {
    const updatedRows =
      rows.filter(
        (_, index) =>
          index !== rowIndex
      );

    setRows(
      updatedRows
    );

    setRowErrors(
      validateRows(
        updatedRows
      )
    );

    setPrepared(false);

    setSuccess(
      updatedRows.length
        ? "CSV record removed."
        : "All CSV records removed."
    );
  };

  /* ===================================================
     CSV PREPARE
  =================================================== */

  const handlePrepare = () => {
    const errors =
      validateRows(
        rows
      );

    setRowErrors(
      errors
    );

    if (
      rows.length === 0 ||
      missingColumns.length ||
      errors.length
    ) {
      setError(
        "Resolve CSV validation issues before preparing."
      );
      return;
    }

    setPrepared(
      true
    );

    setSuccess(
      "CSV dataset prepared successfully. No backend MEIL upload was performed."
    );
  };

  /* ===================================================
     CSV CLEAR
  =================================================== */

  const handleClear = () => {
    setFile(null);
    setHeaders([]);
    setRows([]);
    setMissingColumns([]);
    setRowErrors([]);
    setSearch("");
    setCategoryFilter("ALL");
    setPrepared(false);
  };

  /* ===================================================
     RESET ACTIVITY
  =================================================== */

  const handleNewActivity = () => {
    setForm(
      EMPTY_FORM
    );

    setSelectedActivityId(
      ""
    );

    setValidationResults(
      []
    );

    setError("");
    setSuccess(
      "New activity form ready."
    );
  };

  /* ===================================================
     RENDER
  =================================================== */

  const scope =
    Number(form.scope_no);

  return (
    <div className="data-upload-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="data-upload-header">

        <div>
          <div className="upload-eyebrow">
            <span />
            ESG DATA INGESTION
          </div>

          <h1>
            Data Upload
          </h1>

          <p>
            Capture activity-level ESG data,
            validate MEIL records and manage
            evidence-ready activity information.
          </p>
        </div>

        <button
          className="template-button"
          onClick={
            downloadSample
          }
        >
          ↓ CSV Template
        </button>

      </div>

      {/* =================================================
          CONTEXT
      ================================================= */}

      <section className="upload-card">

        <div className="upload-card-header">

          <div>
            <h2>
              Current Submission Context
            </h2>

            <p>
              Activities are owned by the
              submission version supplied in
              the API URL.
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={() => {
              loadCatalogs();
              loadActivities();
            }}
            disabled={loading || catalogLoading}
          >
            {loading ||
            catalogLoading
              ? "Refreshing..."
              : "Refresh Backend"}
          </button>

        </div>

        <div
          className="mapping-grid"
        >

          <div className="mapping-item">
            <span>
              01
            </span>

            <strong>
              Submission
            </strong>

            <small>
              {submissionId ||
                "Not available"}
            </small>
          </div>

          <div className="mapping-item">
            <span>
              02
            </span>

            <strong>
              Version
            </strong>

            <small>
              {versionId ||
                "Not available"}
            </small>
          </div>

          <div className="mapping-item">
            <span>
              03
            </span>

            <strong>
              Activity Types
            </strong>

            <small>
              {approvedActivityTypes.length} approved
            </small>
          </div>

          <div className="mapping-item">
            <span>
              04
            </span>

            <strong>
              Activity Sources
            </strong>

            <small>
              {approvedActivitySources.length} approved
            </small>
          </div>

        </div>

      </section>

      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (
        <div className="upload-alert error">
          <div className="alert-icon">
            !
          </div>

          <div>
            <strong>
              Data Upload
            </strong>

            <p>
              {error}
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className="upload-alert success">
          <div className="alert-icon">
            ✓
          </div>

          <div>
            <strong>
              Data Upload
            </strong>

            <p>
              {success}
            </p>
          </div>
        </div>
      )}

      {/* =================================================
          MODE SWITCH
      ================================================= */}

      <section className="upload-card">

        <div className="upload-pipeline">

          <button
            type="button"
            className={`pipeline-step ${
              activeMode === "activity"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveMode(
                "activity"
              )
            }
          >
            <span>
              01
            </span>

            <div>
              <strong>
                MEIL Activity
              </strong>

              <small>
                Recommended
              </small>
            </div>
          </button>

          <div className="pipeline-line" />

          <button
            type="button"
            className={`pipeline-step ${
              activeMode === "csv"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveMode(
                "csv"
              )
            }
          >
            <span>
              02
            </span>

            <div>
              <strong>
                CSV Import
              </strong>

              <small>
                Legacy ESG dataset
              </small>
            </div>
          </button>

        </div>

      </section>

      {/* =================================================
          MEIL MODE
      ================================================= */}

      {activeMode === "activity" && (
  <>
    {/* =========================================================
        FRONTEND-ONLY ACTIVITY WORKFLOW
        ESGFORGE DEMO
    ========================================================= */}

    <section className="upload-card">
      <div className="preview-footer">
        <div>
          <button
            type="button"
            className={
              activeTab === "capture"
                ? "primary-button"
                : "secondary-button"
            }
            onClick={() => setActiveTab("capture")}
          >
            Capture Activity
          </button>

          <button
            type="button"
            className={
              activeTab === "activities"
                ? "primary-button"
                : "secondary-button"
            }
            onClick={() => setActiveTab("activities")}
          >
            Activity Register
          </button>

          <button
            type="button"
            className={
              activeTab === "validation"
                ? "primary-button"
                : "secondary-button"
            }
            onClick={() => setActiveTab("validation")}
          >
            Validation
          </button>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={handleNewActivity}
        >
          + New Activity
        </button>
      </div>
    </section>

    {/* =========================================================
        CAPTURE TAB
    ========================================================= */}

    {activeTab === "capture" && (
      <section className="preview-card">

        <div className="preview-header">
          <div>
            <div className="upload-eyebrow">
              ACTIVITY-BASED ESG DATA
            </div>

            <h2>
              Capture Emission Activity
            </h2>

            <p>
              Record activity data with evidence, emission factor,
              transparent CO₂e calculation and validation.
            </p>
          </div>

          <span className="api-pending">
            FRONTEND DEMO
          </span>
        </div>

        {/* =====================================================
            WORKFLOW STEPPER
        ===================================================== */}

        <div className="upload-pipeline">

          <div className="pipeline-step active">
            <span>01</span>

            <div>
              <strong>Activity</strong>
              <small>Source data</small>
            </div>
          </div>

          <div className="pipeline-line" />

          <div className="pipeline-step active">
            <span>02</span>

            <div>
              <strong>Evidence</strong>
              <small>Traceability</small>
            </div>
          </div>

          <div className="pipeline-line" />

          <div className="pipeline-step active">
            <span>03</span>

            <div>
              <strong>Factor</strong>
              <small>Emission factor</small>
            </div>
          </div>

          <div className="pipeline-line" />

          <div className="pipeline-step active">
            <span>04</span>

            <div>
              <strong>Calculation</strong>
              <small>CO₂e result</small>
            </div>
          </div>

          <div className="pipeline-line" />

          <div className="pipeline-step active">
            <span>05</span>

            <div>
              <strong>Validation</strong>
              <small>Quality check</small>
            </div>
          </div>

        </div>

        {/* =====================================================
            SCOPE SELECTOR
        ===================================================== */}

        <div className="upload-card">

          <div className="preview-header">

            <div>
              <div className="upload-eyebrow">
                EMISSION SCOPE
              </div>

              <h2>
                Select Emission Scope
              </h2>

              <p>
                Choose the scope that best represents the activity.
              </p>
            </div>

          </div>

          <div
            className="mapping-grid"
            style={{
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
            }}
          >

            <button
              type="button"
              className={`mapping-item ${
                scope === 1 ? "active" : ""
              }`}
              onClick={() => {
                updateForm("scope_no", "1");
                updateForm(
                  "activity_name",
                  "Diesel Consumption"
                );
                updateForm(
                  "activity_type",
                  "Stationary / Mobile Combustion"
                );
                updateForm("unit", "L");
                updateForm("factor", "2.68");
                updateForm(
                  "factor_unit",
                  "kg CO₂e / L"
                );
                updateForm(
                  "factor_source",
                  "ESGForge Demo Emission Factor"
                );
              }}
            >
              <span>01</span>

              <strong>
                Scope 1
              </strong>

              <small>
                Direct emissions
                <br />
                Diesel consumption
              </small>
            </button>

            <button
              type="button"
              className={`mapping-item ${
                scope === 2 ? "active" : ""
              }`}
              onClick={() => {
                updateForm("scope_no", "2");
                updateForm(
                  "activity_name",
                  "Purchased Electricity"
                );
                updateForm(
                  "activity_type",
                  "Purchased Electricity"
                );
                updateForm("unit", "kWh");
                updateForm("factor", "0.72");
                updateForm(
                  "factor_unit",
                  "kg CO₂e / kWh"
                );
                updateForm(
                  "factor_source",
                  "ESGForge Demo Grid Emission Factor"
                );
              }}
            >
              <span>02</span>

              <strong>
                Scope 2
              </strong>

              <small>
                Purchased energy
                <br />
                Electricity
              </small>
            </button>

            <button
              type="button"
              className={`mapping-item ${
                scope === 3 ? "active" : ""
              }`}
              onClick={() => {
                updateForm("scope_no", "3");
                updateForm(
                  "activity_name",
                  "Upstream Material Transportation"
                );
                updateForm(
                  "activity_type",
                  "Upstream Transportation"
                );
                updateForm("unit", "tonne-km");
                updateForm("factor", "0.105");
                updateForm(
                  "factor_unit",
                  "kg CO₂e / tonne-km"
                );
                updateForm(
                  "factor_source",
                  "ESGForge Demo Transport Factor"
                );
              }}
            >
              <span>03</span>

              <strong>
                Scope 3
              </strong>

              <small>
                Value chain
                <br />
                Upstream transportation
              </small>
            </button>

          </div>
        </div>

        {/* =====================================================
            ACTIVITY DETAILS
        ===================================================== */}

        <div className="upload-card">

          <div className="preview-header">

            <div>
              <div className="upload-eyebrow">
                01 — ACTIVITY
              </div>

              <h2>
                Activity Details
              </h2>

              <p>
                Enter the measurable activity data used for the
                emissions calculation.
              </p>
            </div>

            <span className="quality-pill valid">
              {scope === 1
                ? "SCOPE 1"
                : scope === 2
                ? "SCOPE 2"
                : "SCOPE 3"}
            </span>

          </div>

          <div className="upload-form-grid">

            <Field
              label="Activity"
              required
            >
              <TextInput
                value={
                  form.activity_name ||
                  (
                    scope === 1
                      ? "Diesel Consumption"
                      : scope === 2
                      ? "Purchased Electricity"
                      : "Upstream Material Transportation"
                  )
                }
                onChange={(value) =>
                  updateForm(
                    "activity_name",
                    value
                  )
                }
              />
            </Field>

            <Field
              label="Activity Type"
              required
            >
              <TextInput
                value={
                  form.activity_type ||
                  (
                    scope === 1
                      ? "Stationary / Mobile Combustion"
                      : scope === 2
                      ? "Purchased Electricity"
                      : "Upstream Transportation"
                  )
                }
                onChange={(value) =>
                  updateForm(
                    "activity_type",
                    value
                  )
                }
              />
            </Field>

            <Field
              label="Reporting Period"
              required
            >
              <TextInput
                type="date"
                value={
                  form.period_start ||
                  "2025-04-01"
                }
                onChange={(value) =>
                  updateForm(
                    "period_start",
                    value
                  )
                }
              />
            </Field>

            <Field
              label="Activity Date"
            >
              <TextInput
                type="date"
                value={
                  form.activity_date ||
                  "2026-03-31"
                }
                onChange={(value) =>
                  updateForm(
                    "activity_date",
                    value
                  )
                }
              />
            </Field>

            <Field
              label="Quantity"
              required
              hint="Enter the measurable activity quantity."
            >
              <TextInput
                type="number"
                min="0"
                step="any"
                value={
                  form.quantity
                }
                onChange={(value) =>
                  updateForm(
                    "quantity",
                    value
                  )
                }
                placeholder={
                  scope === 1
                    ? "e.g. 2500"
                    : scope === 2
                    ? "e.g. 125000"
                    : "e.g. 800"
                }
              />
            </Field>

            <Field
              label="Unit"
              required
            >
              <SelectInput
                value={
                  form.unit ||
                  (
                    scope === 1
                      ? "L"
                      : scope === 2
                      ? "kWh"
                      : "tonne-km"
                  )
                }
                onChange={(value) =>
                  updateForm(
                    "unit",
                    value
                  )
                }
                options={
                  scope === 1
                    ? [
                        "L",
                        "kg",
                        "m³",
                      ]
                    : scope === 2
                    ? [
                        "kWh",
                        "MWh",
                      ]
                    : [
                        "tonne-km",
                        "tonnes",
                      ]
                }
              />
            </Field>

            {scope === 3 && (
              <>
                <Field
                  label="Material"
                  required
                >
                  <TextInput
                    value={
                      form.material ||
                      "Cement"
                    }
                    onChange={(value) =>
                      updateForm(
                        "material",
                        value
                      )
                    }
                  />
                </Field>

                <Field
                  label="Transport Distance"
                  required
                >
                  <TextInput
                    type="number"
                    min="0"
                    step="any"
                    value={
                      form.transport_distance ||
                      "420"
                    }
                    onChange={(value) =>
                      updateForm(
                        "transport_distance",
                        value
                      )
                    }
                  />
                </Field>

                <Field
                  label="Transport Mode"
                >
                  <SelectInput
                    value={
                      form.transport_mode ||
                      "Road"
                    }
                    onChange={(value) =>
                      updateForm(
                        "transport_mode",
                        value
                      )
                    }
                    options={[
                      "Road",
                      "Rail",
                      "Sea",
                      "Air",
                    ]}
                  />
                </Field>
              </>
            )}

            {scope === 2 && (
              <>
                <Field
                  label="Accounting Method"
                >
                  <SelectInput
                    value={
                      form.accounting_method ||
                      "Location Based"
                    }
                    onChange={(value) =>
                      updateForm(
                        "accounting_method",
                        value
                      )
                    }
                    options={[
                      "Location Based",
                      "Market Based",
                    ]}
                  />
                </Field>

                <Field
                  label="Grid Region"
                >
                  <TextInput
                    value={
                      form.grid_region ||
                      "Odisha"
                    }
                    onChange={(value) =>
                      updateForm(
                        "grid_region",
                        value
                      )
                    }
                  />
                </Field>
              </>
            )}

            {scope === 1 && (
              <>
                <Field
                  label="Fuel / Source"
                >
                  <TextInput
                    value={
                      form.fuel_source ||
                      "Diesel"
                    }
                    onChange={(value) =>
                      updateForm(
                        "fuel_source",
                        value
                      )
                    }
                  />
                </Field>

                <Field
                  label="Equipment / Asset"
                >
                  <TextInput
                    value={
                      form.asset_reference ||
                      "Diesel Generator"
                    }
                    onChange={(value) =>
                      updateForm(
                        "asset_reference",
                        value
                      )
                    }
                  />
                </Field>
              </>
            )}

            <Field
              label="Data Source"
              required
            >
              <SelectInput
                value={
                  form.data_source ||
                  (
                    scope === 1
                      ? "Fuel Invoice"
                      : scope === 2
                      ? "Electricity Bill"
                      : "Supplier Transport Record"
                  )
                }
                onChange={(value) =>
                  updateForm(
                    "data_source",
                    value
                  )
                }
                options={[
                  "Fuel Invoice",
                  "Electricity Bill",
                  "Supplier Transport Record",
                  "Meter Reading",
                  "Supplier Data",
                  "Manual Entry",
                ]}
              />
            </Field>

            <Field
              label="Reference"
            >
              <TextInput
                value={
                  form.source_reference ||
                  (
                    scope === 1
                      ? "INV-DIESEL-APR-2026"
                      : scope === 2
                      ? "EB-MAR-2026"
                      : "SUP-TRANS-2026-001"
                  )
                }
                onChange={(value) =>
                  updateForm(
                    "source_reference",
                    value
                  )
                }
              />
            </Field>

          </div>
        </div>

        {/* =====================================================
            EVIDENCE
        ===================================================== */}

        <div className="upload-card">

          <div className="preview-header">

            <div>
              <div className="upload-eyebrow">
                02 — EVIDENCE
              </div>

              <h2>
                Supporting Evidence
              </h2>

              <p>
                Connect the activity to a source document for
                reviewer traceability.
              </p>
            </div>

            <span className="quality-pill valid">
              TRACEABLE
            </span>

          </div>

          <div className="upload-form-grid">

            <Field
              label="Evidence File"
              required
            >
              <input
                className="editable-cell"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv"
                onChange={(event) => {
                  const selected =
                    event.target.files?.[0];

                  if (selected) {
                    updateForm(
                      "evidence_file",
                      selected.name
                    );

                    updateForm(
                      "evidence_status",
                      "AVAILABLE"
                    );
                  }
                }}
              />
            </Field>

            <Field
              label="Evidence Type"
            >
              <SelectInput
                value={
                  form.evidence_type ||
                  (
                    scope === 1
                      ? "Fuel Invoice"
                      : scope === 2
                      ? "Electricity Bill"
                      : "Supplier Record"
                  )
                }
                onChange={(value) =>
                  updateForm(
                    "evidence_type",
                    value
                  )
                }
                options={[
                  "Fuel Invoice",
                  "Electricity Bill",
                  "Supplier Record",
                  "Meter Reading",
                  "Contract",
                  "Other"
                ]}
              />
            </Field>

            <Field
              label="Evidence Status"
            >
              <SelectInput
                value={
                  form.evidence_status ||
                  "AVAILABLE"
                }
                onChange={(value) =>
                  updateForm(
                    "evidence_status",
                    value
                  )
                }
                options={[
                  "AVAILABLE",
                  "PENDING",
                  "NOT AVAILABLE",
                ]}
              />
            </Field>

            <Field
              label="Evidence Reference"
            >
              <TextInput
                value={
                  form.evidence_reference ||
                  "Evidence linked to activity"
                }
                onChange={(value) =>
                  updateForm(
                    "evidence_reference",
                    value
                  )
                }
              />
            </Field>

          </div>

          <div className="mapping-note">

            <span>
              ✓
            </span>

            <p>
              <strong>
                Traceability check:
              </strong>{" "}
              every activity should have a supporting source
              document or clearly identified evidence status.
            </p>

          </div>

        </div>

        {/* =====================================================
            EMISSION FACTOR
        ===================================================== */}

        <div className="upload-card">

          <div className="preview-header">

            <div>
              <div className="upload-eyebrow">
                03 — EMISSION FACTOR
              </div>

              <h2>
                Emission Factor
              </h2>

              <p>
                Show the factor used by the calculation instead
                of hiding the conversion behind the result.
              </p>
            </div>

            <span className="quality-pill valid">
              DEMO FACTOR
            </span>

          </div>

          <div className="upload-form-grid">

            <Field
              label="Factor"
              required
            >
              <TextInput
                type="number"
                min="0"
                step="any"
                value={
                  form.factor ||
                  (
                    scope === 1
                      ? "2.68"
                      : scope === 2
                      ? "0.72"
                      : "0.105"
                  )
                }
                onChange={(value) =>
                  updateForm(
                    "factor",
                    value
                  )
                }
              />
            </Field>

            <Field
              label="Factor Unit"
            >
              <TextInput
                value={
                  form.factor_unit ||
                  (
                    scope === 1
                      ? "kg CO₂e / L"
                      : scope === 2
                      ? "kg CO₂e / kWh"
                      : "kg CO₂e / tonne-km"
                  )
                }
                onChange={(value) =>
                  updateForm(
                    "factor_unit",
                    value
                  )
                }
              />
            </Field>

            <Field
              label="Factor Source"
            >
              <TextInput
                value={
                  form.factor_source ||
                  (
                    scope === 1
                      ? "ESGForge Demo Emission Factor"
                      : scope === 2
                      ? "ESGForge Demo Grid Emission Factor"
                      : "ESGForge Demo Transport Factor"
                  )
                }
                onChange={(value) =>
                  updateForm(
                    "factor_source",
                    value
                  )
                }
              />
            </Field>

            <Field
              label="Geography"
            >
              <TextInput
                value={
                  form.factor_geography ||
                  "India / Odisha"
                }
                onChange={(value) =>
                  updateForm(
                    "factor_geography",
                    value
                  )
                }
              />
            </Field>

            <Field
              label="Factor Version"
            >
              <TextInput
                value={
                  form.factor_version ||
                  "Demo Reference v1"
                }
                onChange={(value) =>
                  updateForm(
                    "factor_version",
                    value
                  )
                }
              />
            </Field>

            <Field
              label="Factor Status"
            >
              <SelectInput
                value={
                  form.factor_status ||
                  "REFERENCE"
                }
                onChange={(value) =>
                  updateForm(
                    "factor_status",
                    value
                  )
                }
                options={[
                  "REFERENCE",
                  "REVIEW",
                  "APPROVED",
                ]}
              />
            </Field>

          </div>

          <div className="mapping-note">

            <span>
              i
            </span>

            <p>
              These factor values are used for the
              <strong> frontend demonstration only</strong>.
              They should not be presented as authoritative
              regulatory emission factors without verification.
            </p>

          </div>

        </div>

        {/* =====================================================
            CALCULATION
        ===================================================== */}

        {(() => {
          const quantity =
            Number(form.quantity || 0);

          const factor =
            Number(
              form.factor ||
              (
                scope === 1
                  ? 2.68
                  : scope === 2
                  ? 0.72
                  : 0.105
              )
            );

          let calculationQuantity =
            quantity;

          let formulaText = "";

          if (scope === 3) {
            const tonnes =
              Number(form.quantity || 0);

            const distance =
              Number(
                form.transport_distance ||
                420
              );

            calculationQuantity =
              tonnes * distance;

            formulaText =
              `${tonnes.toLocaleString()} tonnes × ${distance.toLocaleString()} km × ${factor} kg CO₂e/t-km`;
          } else {
            formulaText =
              `${quantity.toLocaleString()} ${form.unit || (
                scope === 1
                  ? "L"
                  : "kWh"
              )} × ${factor} kg CO₂e/unit`;
          }

          const kgCO2e =
            calculationQuantity * factor;

          const tCO2e =
            kgCO2e / 1000;

          return (
            <div className="upload-card">

              <div className="preview-header">

                <div>
                  <div className="upload-eyebrow">
                    04 — CALCULATION
                  </div>

                  <h2>
                    CO₂e Calculation
                  </h2>

                  <p>
                    The calculation is visible and explainable
                    from activity quantity to final emissions.
                  </p>
                </div>

                <span className="quality-pill valid">
                  CALCULATED
                </span>

              </div>

              <div
                className="mapping-grid"
                style={{
                  gridTemplateColumns:
                    "repeat(3, minmax(0, 1fr))",
                }}
              >

                <div className="mapping-item">

                  <span>
                    01
                  </span>

                  <strong>
                    Activity
                  </strong>

                  <small>
                    {calculationQuantity.toLocaleString()}
                    {" "}
                    {scope === 3
                      ? "tonne-km"
                      : form.unit ||
                        (scope === 1
                          ? "L"
                          : "kWh")}
                  </small>

                </div>

                <div className="mapping-item">

                  <span>
                    02
                  </span>

                  <strong>
                    Factor
                  </strong>

                  <small>
                    {factor}{" "}
                    {form.factor_unit ||
                      "kg CO₂e / unit"}
                  </small>

                </div>

                <div className="mapping-item">

                  <span>
                    03
                  </span>

                  <strong>
                    Result
                  </strong>

                  <small>
                    {tCO2e.toFixed(2)}
                    {" "}
                    tCO₂e
                  </small>

                </div>

              </div>

              <div
                className="mapping-note"
                style={{
                  marginTop: "20px",
                }}
              >

                <span>
                  =
                </span>

                <p>
                  <strong>
                    {formulaText}
                  </strong>
                  <br />
                  Result:
                  {" "}
                  <strong>
                    {tCO2e.toFixed(2)} tCO₂e
                  </strong>
                  {" "}
                  ({kgCO2e.toFixed(2)} kg CO₂e)
                </p>

              </div>

              <div
                style={{
                  marginTop: "20px",
                  padding: "24px",
                  borderRadius: "18px",
                  background:
                    "linear-gradient(135deg, #eef6ff, #f8fbff)",
                  border:
                    "1px solid #d7e7f7",
                  textAlign: "center",
                }}
              >

                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    opacity: 0.7,
                    marginBottom: "8px",
                  }}
                >
                  Calculated Emissions
                </span>

                <strong
                  style={{
                    display: "block",
                    fontSize: "36px",
                    lineHeight: 1.1,
                  }}
                >
                  {tCO2e.toFixed(2)}
                  {" "}
                  <span
                    style={{
                      fontSize: "18px",
                    }}
                  >
                    tCO₂e
                  </span>
                </strong>

              </div>

            </div>
          );
        })()}

        {/* =====================================================
            VALIDATION
        ===================================================== */}

        {(() => {
          const quantityValid =
            Number(form.quantity || 0) > 0;

          const evidenceValid =
            Boolean(
              form.evidence_file ||
              form.evidence_status ===
                "AVAILABLE"
            );

          const factorValid =
            Number(form.factor || 0) > 0;

          const sourceValid =
            Boolean(form.data_source);

          const validationChecks = [
            {
              label: "Activity quantity provided",
              valid: quantityValid,
            },
            {
              label: "Evidence linked",
              valid: evidenceValid,
            },
            {
              label: "Emission factor available",
              valid: factorValid,
            },
            {
              label: "Data source identified",
              valid: sourceValid,
            },
          ];

          const validCount =
            validationChecks.filter(
              (item) => item.valid
            ).length;

          const validationStatus =
            validCount ===
            validationChecks.length
              ? "VALID"
              : "REVIEW";

          return (
            <div className="upload-card">

              <div className="preview-header">

                <div>
                  <div className="upload-eyebrow">
                    05 — VALIDATION
                  </div>

                  <h2>
                    Data Quality Check
                  </h2>

                  <p>
                    Validate the activity before adding it
                    to the ESGForge demo register.
                  </p>
                </div>

                <span
                  className={`quality-pill ${
                    validationStatus === "VALID"
                      ? "valid"
                      : "invalid"
                  }`}
                >
                  {validationStatus}
                </span>

              </div>

              <div className="mapping-grid">

                {validationChecks.map(
                  (check, index) => (
                    <div
                      className="mapping-item"
                      key={check.label}
                    >

                      <span>
                        {check.valid
                          ? "✓"
                          : "!"}
                      </span>

                      <strong>
                        {check.label}
                      </strong>

                      <small>
                        {check.valid
                          ? "Check passed"
                          : "Needs attention"}
                      </small>

                    </div>
                  )
                )}

              </div>

              <div className="upload-actions">

                <div>

                  <span className="prepared-status">
                    {validCount}/
                    {validationChecks.length}
                    {" "}
                    checks passed
                  </span>

                </div>

                <div className="upload-action-buttons">

                  <button
                    className="secondary-button"
                    type="button"
                    onClick={
                      handleNewActivity
                    }
                  >
                    Clear Form
                  </button>

                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => {

                      if (
                        validationStatus !==
                        "VALID"
                      ) {
                        setError(
                          "Please complete the required activity, evidence, factor and source information before saving."
                        );

                        return;
                      }

                      const quantity =
                        Number(
                          form.quantity || 0
                        );

                      const factor =
                        Number(
                          form.factor ||
                          (
                            scope === 1
                              ? 2.68
                              : scope === 2
                              ? 0.72
                              : 0.105
                          )
                        );

                      let activityQuantity =
                        quantity;

                      if (scope === 3) {
                        activityQuantity =
                          quantity *
                          Number(
                            form.transport_distance ||
                              420
                          );
                      }

                      const calculated =
                        (
                          activityQuantity *
                          factor
                        ) / 1000;

                      const newActivity = {
                        id:
                          selectedActivityId ||
                          `LOCAL-${Date.now()}`,

                        scope_no:
                          scope,

                        scope:
                          scope === 1
                            ? "Scope 1"
                            : scope === 2
                            ? "Scope 2"
                            : "Scope 3",

                        category:
                          scope === 3
                            ? "Category 4 — Upstream Transportation"
                            : "—",

                        activity:
                          form.activity_name ||
                          (
                            scope === 1
                              ? "Diesel Consumption"
                              : scope === 2
                              ? "Purchased Electricity"
                              : "Upstream Material Transportation"
                          ),

                        quantity:
                          quantity,

                        unit:
                          form.unit ||
                          (
                            scope === 1
                              ? "L"
                              : scope === 2
                              ? "kWh"
                              : "tonnes"
                          ),

                        factor:
                          factor,

                        factor_unit:
                          form.factor_unit ||
                          "kg CO₂e / unit",

                        emissions:
                          calculated,

                        evidence:
                          form.evidence_file ||
                          "Evidence linked",

                        evidence_status:
                          form.evidence_status ||
                          "AVAILABLE",

                        status:
                          "VALID",

                        source:
                          form.data_source ||
                          "Manual Entry",

                        date:
                          form.activity_date ||
                          new Date()
                            .toISOString()
                            .slice(0, 10),

                        material:
                          form.material ||
                          "",

                        distance:
                          form.transport_distance ||
                          "",

                        transport_mode:
                          form.transport_mode ||
                          "",

                        factor_source:
                          form.factor_source ||
                          "ESGForge Demo Factor",
                      };

                      setActivities(
                        (previous) => {

                          const existingIndex =
                            previous.findIndex(
                              (item) =>
                                item.id ===
                                newActivity.id
                            );

                          if (
                            existingIndex !==
                            -1
                          ) {
                            const updated =
                              [...previous];

                            updated[
                              existingIndex
                            ] =
                              newActivity;

                            return updated;
                          }

                          return [
                            ...previous,
                            newActivity,
                          ];
                        }
                      );

                      setSelectedActivityId(
                        newActivity.id
                      );

                      setSuccess(
                        "Activity saved successfully to the local ESGForge demo register."
                      );

                      setError("");

                      setActiveTab(
                        "activities"
                      );
                    }}
                  >
                    {selectedActivityId
                      ? "Update Activity"
                      : "Save Activity"}
                  </button>

                </div>

              </div>

            </div>
          );
        })()}

      </section>
    )}

    {/* =========================================================
        ACTIVITY REGISTER
    ========================================================= */}

    {activeTab === "activities" && (
      <section className="preview-card">

        <div className="preview-header">

          <div>
            <div className="upload-eyebrow">
              ACTIVITY REGISTER
            </div>

            <h2>
              Saved ESG Activities
            </h2>

            <p>
              Local frontend records created during the demo.
              No backend connection is required.
            </p>
          </div>

          <strong>
            {activities.length}
          </strong>

        </div>

        {activities.length === 0 ? (
          <div className="no-results">

            <strong>
              No activities yet
            </strong>

            <p>
              Create a Scope 1, Scope 2 or Scope 3 activity
              to build the demonstration dataset.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                setActiveTab("capture")
              }
            >
              + Create Activity
            </button>

          </div>
        ) : (

          <div className="preview-table-wrapper">

            <table className="preview-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Scope</th>
                  <th>Activity</th>
                  <th>Quantity</th>
                  <th>Factor</th>
                  <th>CO₂e</th>
                  <th>Evidence</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {activities.map(
                  (activity, index) => (
                    <tr
                      key={
                        activity.id ||
                        index
                      }
                    >

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        <strong>
                          {activity.scope ||
                            `Scope ${activity.scope_no}`}
                        </strong>
                      </td>

                      <td>
                        {activity.activity ||
                          "—"}
                      </td>

                      <td>
                        {Number(
                          activity.quantity || 0
                        ).toLocaleString()}
                        {" "}
                        {activity.unit ||
                          ""}
                      </td>

                      <td>
                        {activity.factor ||
                          "—"}
                        <small>
                          {" "}
                          {activity.factor_unit ||
                            ""}
                        </small>
                      </td>

                      <td>
                        <strong>
                          {Number(
                            activity.emissions ||
                              0
                          ).toFixed(2)}
                          {" "}
                          tCO₂e
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`quality-pill ${
                            activity.evidence_status ===
                            "AVAILABLE"
                              ? "valid"
                              : "invalid"
                          }`}
                        >
                          {activity.evidence_status ||
                            "PENDING"}
                        </span>
                      </td>

                      <td>
                        <span className="quality-pill valid">
                          {activity.status ||
                            "VALID"}
                        </span>
                      </td>

                      <td>

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => {

                            const loadedScope =
                              Number(
                                activity.scope_no
                              );

                            setForm({
                              ...EMPTY_FORM,

                              scope_no:
                                String(
                                  loadedScope
                                ),

                              activity_name:
                                activity.activity,

                              quantity:
                                activity.quantity,

                              unit:
                                activity.unit,

                              factor:
                                activity.factor,

                              factor_unit:
                                activity.factor_unit,

                              factor_source:
                                activity.factor_source,

                              evidence_file:
                                activity.evidence,

                              evidence_status:
                                activity.evidence_status,

                              data_source:
                                activity.source,

                              activity_date:
                                activity.date,

                              material:
                                activity.material,

                              transport_distance:
                                activity.distance,

                              transport_mode:
                                activity.transport_mode,
                            });

                            setSelectedActivityId(
                              activity.id
                            );

                            setActiveTab(
                              "capture"
                            );

                            setSuccess(
                              "Activity loaded for editing."
                            );
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-row-button"
                          onClick={() => {

                            const confirmed =
                              window.confirm(
                                "Delete this local activity?"
                              );

                            if (!confirmed) {
                              return;
                            }

                            setActivities(
                              (previous) =>
                                previous.filter(
                                  (item) =>
                                    item.id !==
                                    activity.id
                                )
                            );

                            if (
                              selectedActivityId ===
                              activity.id
                            ) {
                              setSelectedActivityId(
                                ""
                              );
                            }

                            setSuccess(
                              "Activity removed from the local register."
                            );
                          }}
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>
    )}

    {/* =========================================================
        VALIDATION TAB
    ========================================================= */}

    {activeTab === "validation" && (
      <section className="preview-card">

        <div className="preview-header">

          <div>
            <div className="upload-eyebrow">
              DATA VALIDATION
            </div>

            <h2>
              ESG Activity Quality
            </h2>

            <p>
              Review evidence, activity completeness and
              calculation readiness before reporting.
            </p>
          </div>

          <span className="quality-pill valid">
            FRONTEND VALIDATION
          </span>

        </div>

        {activities.length === 0 ? (
          <div className="no-results">

            <strong>
              No activities available for validation.
            </strong>

            <p>
              Create activities first and they will appear
              here automatically.
            </p>

          </div>
        ) : (

          <>

            <div className="mapping-grid">

              <div className="mapping-item">

                <span>
                  {activities.length}
                </span>

                <strong>
                  Total Activities
                </strong>

                <small>
                  Captured locally
                </small>

              </div>

              <div className="mapping-item">

                <span>
                  {
                    activities.filter(
                      (item) =>
                        item.status ===
                        "VALID"
                    ).length
                  }
                </span>

                <strong>
                  Valid
                </strong>

                <small>
                  Ready for demo reporting
                </small>

              </div>

              <div className="mapping-item">

                <span>
                  {
                    activities.filter(
                      (item) =>
                        item.evidence_status ===
                        "AVAILABLE"
                    ).length
                  }
                </span>

                <strong>
                  Evidence Ready
                </strong>

                <small>
                  Traceable records
                </small>

              </div>

              <div className="mapping-item">

                <span>
                  {activities
                    .reduce(
                      (
                        total,
                        item
                      ) =>
                        total +
                        Number(
                          item.emissions ||
                            0
                        ),
                      0
                    )
                    .toFixed(2)}
                </span>

                <strong>
                  tCO₂e
                </strong>

                <small>
                  Calculated emissions
                </small>

              </div>

            </div>

            <div className="preview-table-wrapper">

              <table className="preview-table">

                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>Scope</th>
                    <th>Evidence</th>
                    <th>Factor</th>
                    <th>Calculation</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {activities.map(
                    (activity) => {

                      const evidenceOK =
                        activity.evidence_status ===
                        "AVAILABLE";

                      const factorOK =
                        Number(
                          activity.factor ||
                            0
                        ) > 0;

                      const quantityOK =
                        Number(
                          activity.quantity ||
                            0
                        ) > 0;

                      const valid =
                        evidenceOK &&
                        factorOK &&
                        quantityOK;

                      return (
                        <tr
                          key={
                            activity.id
                          }
                        >

                          <td>
                            <strong>
                              {activity.activity}
                            </strong>
                          </td>

                          <td>
                            {activity.scope}
                          </td>

                          <td>
                            <span
                              className={`quality-pill ${
                                evidenceOK
                                  ? "valid"
                                  : "invalid"
                              }`}
                            >
                              {evidenceOK
                                ? "AVAILABLE"
                                : "MISSING"}
                            </span>
                          </td>

                          <td>
                            {factorOK
                              ? `${activity.factor} ${activity.factor_unit}`
                              : "Missing"}
                          </td>

                          <td>
                            {quantityOK &&
                            factorOK
                              ? `${Number(
                                  activity.emissions ||
                                    0
                                ).toFixed(
                                  2
                                )} tCO₂e`
                              : "Incomplete"}
                          </td>

                          <td>
                            <span
                              className={`quality-pill ${
                                valid
                                  ? "valid"
                                  : "invalid"
                              }`}
                            >
                              {valid
                                ? "VALID"
                                : "REVIEW"}
                            </span>
                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

            <div className="mapping-note">

              <span>
                i
              </span>

              <p>
                <strong>
                  Validation logic:
                </strong>{" "}
                an activity is considered ready when it has a
                measurable quantity, a supporting evidence
                status and an emission factor available for
                calculation.
              </p>

            </div>

          </>
        )}

      </section>
    )}

    {/* =========================================================
        FRONTEND-ONLY BOUNDARY
    ========================================================= */}

    <section className="mapping-card">

      <div className="mapping-header">

        <div>
          <div className="upload-eyebrow">
            ESGFORGE DEMO ENGINE
          </div>

          <h2>
            Activity → Evidence → Factor → CO₂e → Validation
          </h2>

          <p>
            This page is intentionally designed as a
            self-contained frontend demonstration.
          </p>
        </div>

        <span className="api-pending">
          LOCAL STATE
        </span>

      </div>

      <div className="mapping-grid">

        <div className="mapping-item">

          <span>
            01
          </span>

          <strong>
            Activity
          </strong>

          <small>
            Capture Scope 1, Scope 2 and Scope 3 data.
          </small>

        </div>

        <div className="mapping-item">

          <span>
            02
          </span>

          <strong>
            Evidence
          </strong>

          <small>
            Link supporting documents to the activity.
          </small>

        </div>

        <div className="mapping-item">

          <span>
            03
          </span>

          <strong>
            Emission Factor
          </strong>

          <small>
            Make the factor and source visible.
          </small>

        </div>

        <div className="mapping-item">

          <span>
            04
          </span>

          <strong>
            CO₂e
          </strong>

          <small>
            Explain the calculation transparently.
          </small>

        </div>

        <div className="mapping-item">

          <span>
            05
          </span>

          <strong>
            Validation
          </strong>

          <small>
            Check completeness before reporting.
          </small>

        </div>

        <div className="mapping-item">

          <span>
            06
          </span>

          <strong>
            Traceability
          </strong>

          <small>
            Activity records remain explainable.
          </small>

        </div>

      </div>

      <div className="mapping-note">

        <span>
          ✓
        </span>

        <p>
          <strong>
            Demo-ready:
          </strong>{" "}
          all activity records are maintained in React state.
          No backend, API, database or external service is
          required for this workflow.
        </p>

      </div>

    </section>

  </>
)}

      {/* =================================================
          CSV MODE
      ================================================= */}

      {activeMode === "csv" && (
        <>

          <section className="upload-card">

            <div className="upload-card-header">

              <div>
                <h2>
                  Legacy ESG CSV Import
                </h2>

                <p>
                  This validates the existing generic
                  Metric / Value / Unit / Category
                  dataset locally. It does not submit
                  those rows as MEIL activities.
                </p>
              </div>

              {file && (
                <button
                  className="clear-button"
                  onClick={
                    handleClear
                  }
                >
                  Clear
                </button>
              )}

            </div>

            <label
              className={`drop-zone ${
                dragActive
                  ? "drag-active"
                  : ""
              }`}
              onDragOver={(
                event
              ) => {
                event.preventDefault();
                setDragActive(
                  true
                );
              }}
              onDragLeave={() =>
                setDragActive(
                  false
                )
              }
              onDrop={
                handleDrop
              }
            >

              <input
                type="file"
                accept=".csv"
                onChange={
                  handleFileChange
                }
              />

              <div className="upload-cloud">
                ↑
              </div>

              <h3>
                {file
                  ? file.name
                  : "Drop your CSV file here"}
              </h3>

              <p>
                {file
                  ? `${(
                      file.size /
                      1024
                    ).toFixed(
                      1
                    )} KB`
                  : "or click to browse from your computer"}
              </p>

              <span className="file-format">
                CSV • UTF-8 recommended
              </span>

            </label>

            <div className="required-columns">

              <span>
                Required:
              </span>

              {LEGACY_REQUIRED_COLUMNS.map(
                (column) => (
                  <span
                    key={column}
                    className={
                      headers.some(
                        (
                          header
                        ) =>
                          normalizeHeader(
                            header
                          ) ===
                          normalizeHeader(
                            column
                          )
                      )
                        ? "column valid"
                        : "column"
                    }
                  >
                    {column}
                  </span>
                )
              )}

            </div>

          </section>

          {rows.length > 0 && (
            <>
              <div className="upload-summary-grid">

                <div className="summary-card">
                  <div className="summary-icon blue">
                    #
                  </div>

                  <div>
                    <span>
                      Total rows
                    </span>

                    <strong>
                      {rows.length}
                    </strong>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon green">
                    ✓
                  </div>

                  <div>
                    <span>
                      Valid rows
                    </span>

                    <strong>
                      {validRows}
                    </strong>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon red">
                    !
                  </div>

                  <div>
                    <span>
                      Issues
                    </span>

                    <strong>
                      {rowErrors.length}
                    </strong>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon purple">
                    %
                  </div>

                  <div>
                    <span>
                      Data quality
                    </span>

                    <strong>
                      {dataQuality}%
                    </strong>
                  </div>
                </div>

              </div>

              <section className="preview-card">

                <div className="preview-header">

                  <div>
                    <div className="upload-eyebrow">
                      CSV PREVIEW
                    </div>

                    <h2>
                      Uploaded Records
                    </h2>

                    <p>
                      Review and correct the
                      generic ESG dataset.
                    </p>
                  </div>

                  <div className="preview-controls">

                    <div className="search-box">

                      <span>
                        ⌕
                      </span>

                      <input
                        type="text"
                        placeholder="Search metric..."
                        value={
                          search
                        }
                        onChange={(
                          event
                        ) =>
                          setSearch(
                            event.target
                              .value
                          )
                        }
                      />

                    </div>

                    <select
                      value={
                        categoryFilter
                      }
                      onChange={(
                        event
                      ) =>
                        setCategoryFilter(
                          event.target
                            .value
                        )
                      }
                    >

                      <option value="ALL">
                        All categories
                      </option>

                      {categories.map(
                        (
                          category
                        ) => (
                          <option
                            key={
                              category
                            }
                            value={category.toUpperCase()}
                          >
                            {category}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

                <div className="preview-table-wrapper">

                  <table className="preview-table">

                    <thead>
                      <tr>
                        <th>
                          #
                        </th>

                        <th>
                          Metric
                        </th>

                        <th>
                          Value
                        </th>

                        <th>
                          Unit
                        </th>

                        <th>
                          Category
                        </th>

                        <th>
                          Quality
                        </th>

                        <th>
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredRows.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="no-results"
                          >
                            No matching records.
                          </td>
                        </tr>
                      ) : (
                        filteredRows.map(
                          (
                            row
                          ) => {
                            const actualIndex =
                              rows.indexOf(
                                row
                              );

                            const metric =
                              row.Metric ||
                              "";

                            const value =
                              row.Value ||
                              "";

                            const unit =
                              row.Unit ||
                              "";

                            const category =
                              row.Category ||
                              "";

                            const rowIsValid =
                              metric.trim() !==
                                "" &&
                              value.trim() !==
                                "" &&
                              unit.trim() !==
                                "" &&
                              category.trim() !==
                                "" &&
                              !Number.isNaN(
                                Number(
                                  value
                                )
                              );

                            return (
                              <tr
                                key={
                                  actualIndex
                                }
                              >

                                <td>
                                  {actualIndex +
                                    1}
                                </td>

                                <td>
                                  <input
                                    className="editable-cell"
                                    value={
                                      metric
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      handleCellChange(
                                        actualIndex,
                                        "Metric",
                                        event
                                          .target
                                          .value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <input
                                    className="editable-cell"
                                    value={
                                      value
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      handleCellChange(
                                        actualIndex,
                                        "Value",
                                        event
                                          .target
                                          .value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <input
                                    className="editable-cell"
                                    value={
                                      unit
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      handleCellChange(
                                        actualIndex,
                                        "Unit",
                                        event
                                          .target
                                          .value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <input
                                    className="editable-cell"
                                    value={
                                      category
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      handleCellChange(
                                        actualIndex,
                                        "Category",
                                        event
                                          .target
                                          .value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <span
                                    className={`quality-pill ${
                                      rowIsValid
                                        ? "valid"
                                        : "invalid"
                                    }`}
                                  >
                                    {rowIsValid
                                      ? "VALID"
                                      : "ISSUE"}
                                  </span>
                                </td>

                                <td>
                                  <button
                                    type="button"
                                    className="delete-row-button"
                                    onClick={() =>
                                      handleDeleteRow(
                                        actualIndex
                                      )
                                    }
                                  >
                                    Delete
                                  </button>
                                </td>

                              </tr>
                            );
                          }
                        )
                      )}

                    </tbody>

                  </table>

                </div>

                <div className="preview-footer">

                  <button
                    type="button"
                    className="add-row-button"
                    onClick={
                      handleAddRow
                    }
                  >
                    + Add Record
                  </button>

                  <span>
                    Showing{" "}
                    <strong>
                      {
                        filteredRows.length
                      }
                    </strong>{" "}
                    of{" "}
                    <strong>
                      {rows.length}
                    </strong>{" "}
                    records
                  </span>

                </div>

              </section>

              <div className="upload-actions">

                <div />

                <div className="upload-action-buttons">

                  <button
                    className="secondary-button"
                    onClick={() => {
                      if (
                        onNavigate
                      ) {
                        onNavigate(
                          "validation"
                        );
                      }
                    }}
                  >
                    Open Validation
                  </button>

                  <button
                    className="secondary-button"
                    onClick={
                      handleAddRow
                    }
                  >
                    + Add Record
                  </button>

                  <button
                    className="primary-button"
                    disabled={
                      !isReady
                    }
                    onClick={
                      handlePrepare
                    }
                  >
                    {prepared
                      ? "Prepared ✓"
                      : "Prepare Data"}
                  </button>

                </div>

              </div>
            </>
          )}

        </>
      )}

    </div>
  );
}

export default DataUpload;