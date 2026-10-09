import { apiRequest } from "./api";

export async function createSubmission(
  projectId,
  reportingPeriodId
) {
  return apiRequest(
    `/api/v1/projects/${projectId}/submissions`,
    {
      method: "POST",
      body: JSON.stringify({
        reporting_period_id: reportingPeriodId,
      }),
    }
  );
}

export async function getSubmissionByProjectAndPeriod(
  projectId,
  reportingPeriodId
) {
  return apiRequest(
    `/api/v1/projects/${projectId}/submissions?reporting_period_id=${encodeURIComponent(
      reportingPeriodId
    )}`
  );
}

export async function getSubmission(submissionId) {
  return apiRequest(
    `/api/v1/submissions/${submissionId}`
  );
}

export async function createSubmissionValue(
  submissionId,
  versionId,
  valueData
) {
  return apiRequest(
    `/api/v1/submissions/${submissionId}/versions/${versionId}/values`,
    {
      method: "POST",
      body: JSON.stringify(valueData),
    }
  );
}

export async function getSubmissionValues(
  submissionId,
  versionId
) {
  return apiRequest(
    `/api/v1/submissions/${submissionId}/versions/${versionId}/values`
  );
}

export async function getSubmissionValue(
  submissionId,
  versionId,
  valueId
) {
  return apiRequest(
    `/api/v1/submissions/${submissionId}/versions/${versionId}/values/${valueId}`
  );
}

export async function updateSubmissionValue(
  submissionId,
  versionId,
  valueId,
  valueData
) {
  return apiRequest(
    `/api/v1/submissions/${submissionId}/versions/${versionId}/values/${valueId}`,
    {
      method: "PATCH",
      body: JSON.stringify(valueData),
    }
  );
}

export async function validateSubmission(
  submissionId,
  versionId
) {
  return apiRequest(
    `/api/v1/submissions/${submissionId}/versions/${versionId}/validate`,
    {
      method: "POST",
    }
  );
}

export async function calculateKPIs(
  submissionId,
  versionId
) {
  return apiRequest(
    `/api/v1/submissions/${submissionId}/versions/${versionId}/kpis/calculate`,
    {
      method: "POST",
    }
  );
}

export async function getReport(
  submissionId,
  versionId
) {
  return apiRequest(
    `/api/v1/submissions/${submissionId}/versions/${versionId}/report`
  );
}

export async function submitSubmission(
  submissionId
) {
  return apiRequest(
    `/api/v1/submissions/${submissionId}/submit`,
    {
      method: "POST",
    }
  );
}