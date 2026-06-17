import { useEffect, useState, useCallback } from "react";
import CustomAsyncSelect from "./sharedComponents/CustomAsyncSelect";
import { getSubmissionsbyReqid } from "../services/drop_downService";
import { useSelector } from "react-redux";
import { canEdit } from "../services/utilities/rbac";
import { Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import Loader from "./sharedComponents/Loader";
import CustomAlert from "./sharedComponents/Alert";
import axiosInstance from "../services/axiosInstance";

/**
 * Dynamic submission-dates form.
 *
 * Renders one date field per active submission status (from the SubmissionStatus
 * master) and saves them through the `submissions/<id>/status-dates/` endpoint,
 * which keeps the Submissions columns and SubmissionStatusLog table in sync.
 *
 * Two modes:
 *   - Edit mode  : `submission_id` is supplied (opened from the submissions list).
 *   - Pick mode  : no `submission_id` — user selects Job + Candidate first.
 */
const SubmissionDatesForm = ({
  submission_id,
  viewtype = false,
  onSuccess,
  onClose,
}) => {
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const emp_permissions = useSelector((state) => state.master_dropdown.permissions);

  const [selectedSubmissionId, setSelectedSubmissionId] = useState(submission_id || "");
  const [requirementId, setRequirementId] = useState("");
  const [candidateOptions, setCandidateOptions] = useState([]);
  const [statusDates, setStatusDates] = useState([]); // [{status_id, status_name, order, status_date}]
  const [dateValues, setDateValues] = useState({}); // { [status_id]: "YYYY-MM-DD" }
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ show: false, message: "", type: "" });

  const canEditSubmission =
    canEdit(emp_permissions, "submissions") || canEdit(emp_permissions, "submissions", true);

  const activeSubmissionId = submission_id || selectedSubmissionId;

  const showAlert = (message, type) => {
    setAlertConfig({ show: true, message, type });
    setTimeout(() => setAlertConfig((prev) => ({ ...prev, show: false })), 3000);
  };

  const loadJobOptions = async (inputValue) => {
    const res = await axiosInstance.get(`${baseurl}/ta_team/requirement-search`, {
      params: { q: inputValue },
    });
    return res.data.map((job) => ({
      label: `${job.job_code}-${job.job_title} `,
      value: job.requirement_id,
    }));
  };

  // Pick mode: load candidates whenever the job changes.
  useEffect(() => {
    if (submission_id || !requirementId) return;
    const fetchCandidates = async () => {
      const candidates = await getSubmissionsbyReqid(requirementId);
      setCandidateOptions(
        candidates.map((c) => ({ value: c.submission_id, label: c.candidate_name }))
      );
      setSelectedSubmissionId("");
    };
    fetchCandidates();
  }, [requirementId, submission_id]);

  // Load the per-status dates for the active submission.
  const loadStatusDates = useCallback(async () => {
    if (!activeSubmissionId) {
      setStatusDates([]);
      setDateValues({});
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/ta_team/submissions/${activeSubmissionId}/status-dates/`
      );
      setStatusDates(res.data);
      setDateValues(
        res.data.reduce((acc, s) => {
          acc[s.status_id] = s.status_date || "";
          return acc;
        }, {})
      );
    } catch (err) {
      console.error("Failed to load status dates", err);
      showAlert("Failed to load submission dates", "error");
    } finally {
      setLoading(false);
    }
  }, [activeSubmissionId]);

  useEffect(() => {
    loadStatusDates();
  }, [loadStatusDates]);

  const handleDateChange = (statusId, value) => {
    setDateValues((prev) => ({ ...prev, [statusId]: value }));
  };

  const handleReset = () => {
    setDateValues(
      statusDates.reduce((acc, s) => {
        acc[s.status_id] = s.status_date || "";
        return acc;
      }, {})
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeSubmissionId) {
      showAlert("Please select a candidate", "error");
      return;
    }
    setSaving(true);
    try {
      const status_dates = statusDates.reduce((acc, s) => {
        acc[s.status_id] = dateValues[s.status_id] || null;
        return acc;
      }, {});
      await axiosInstance.patch(
        `/ta_team/submissions/${activeSubmissionId}/status-dates/`,
        { status_dates }
      );
      showAlert("Submission dates updated successfully", "success");
      await loadStatusDates();
      await onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Error updating submission dates:", err);
      if (err.response) console.error("Response data:", err.response.data);
      showAlert("Failed to update submission dates", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!canEditSubmission) {
    return (
      <div className="no-access">
        <h2>Access Denied</h2>
        <p>You do not have permission to edit submission dates.</p>
      </div>
    );
  }

  return (
    <div>
      <Form onSubmit={handleSubmit} className="requirement-form container">
        <Row>
          <Col md={12}>
            <CustomAlert
              message={alertConfig.message}
              type={alertConfig.type}
              show={alertConfig.show}
              onClose={() => setAlertConfig((prev) => ({ ...prev, show: false }))}
            />
          </Col>
        </Row>

        <h2 className="mb-4">Update Submission Dates</h2>

        {/* Pick mode: choose Job + Candidate when no submission was passed in. */}
        {!submission_id && (
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="job">
                <Form.Label className="fs-6">Job:</Form.Label>
                <CustomAsyncSelect
                  placeholder="Search job by title or ID"
                  loadOptions={loadJobOptions}
                  name="requirement_id"
                  onChange={(e) => setRequirementId(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fs-6">Candidate Name:</Form.Label>
                <Select
                  classNamePrefix="my-select"
                  options={candidateOptions}
                  value={candidateOptions.find((o) => o.value === selectedSubmissionId) || null}
                  onChange={(selected) =>
                    setSelectedSubmissionId(selected ? selected.value : "")
                  }
                  placeholder="Select Candidate"
                  isClearable
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        {loading ? (
          <Loader />
        ) : (
          activeSubmissionId && (
            <>
              <Row>
                {statusDates.map((status) => (
                  <Col md={4} key={status.status_id}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fs-6">{status.status_name} Date:</Form.Label>
                      <Form.Control
                        type="date"
                        value={dateValues[status.status_id] || ""}
                        onChange={(e) => handleDateChange(status.status_id, e.target.value)}
                        disabled={viewtype}
                      />
                    </Form.Group>
                  </Col>
                ))}
              </Row>

              {!viewtype && (
                <Row className="justify-content-center mt-4">
                  <Col xs="auto">
                    <Button className="submit-button" type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Update Dates"}
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button
                      className="submit-button"
                      type="button"
                      onClick={handleReset}
                      disabled={saving}
                    >
                      Reset
                    </Button>
                  </Col>
                </Row>
              )}
            </>
          )
        )}
      </Form>
    </div>
  );
};

export default SubmissionDatesForm;
