import { useEffect, useState } from "react";
import {
  getJobreqs,
  getSubmissionsbyReqid,
} from "../services/drop_downService";
import { Form, Row, Col, Button, FormGroup, FormLabel } from "react-bootstrap";
import Select from "react-select";

import axiosInstance from "../services/axiosInstance";
const SubmissionDatesForm = ({
  submission_id,
  viewtype = false,
  externaldropdowndata,
}) => {
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const [errors, setErrors] = useState({});
  const [FormData, setFormData] = useState({
    client_sub_date: "",
    client_interview_date: "",
    offer_date: "",
    start_date: "",
    submission_id: "",
    requirement_id: "",
    tech_screen_date: "",
    am_screen_date: "",
  });
  const [JobData, setJobData] = useState([]);
  const [CandidateData, setCandidateData] = useState([]);
  const [DropdownData, setDropdownData] = useState({
    jobdropdown: [],
    candidatedropdown: [],
  });
  useEffect(() => {
    const fetchJobData = async () => {
      const jobData = await getJobreqs();
      setJobData(jobData);
      setDropdownData((prev) => ({
        ...prev,
        jobdropdown: jobData.map((job) => ({
          id: job.requirement_id,
          name: `${job.job_code} - ${job.job_title}`,
        })),
      }));
    };

    fetchJobData();
  }, []);
  const validateForm = () => {
    const newErrors = {};
    if (!FormData.requirement_id)
      newErrors.requirement_id = "Please Select Job";
    if (!FormData.submission_id)
      newErrors.submission_id = "Please Select Candidate";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const resetform = () => {
    setFormData({
      client_sub_date: "",
      client_interview_date: "",
      offer_date: "",
      start_date: "",
      submission_id: "",
      requirement_id: "",
      tech_screen_date: "",
      am_screen_date: "",
    });
  };

  const fetchCandidateData = async () => {
    const candidateData = await getSubmissionsbyReqid(FormData.requirement_id);
    setCandidateData(candidateData);
    setDropdownData((prev) => ({
      ...prev,
      candidatedropdown: candidateData.map((candidate) => ({
        id: candidate.submission_id,
        name: candidate.candidate_name,
      })),
    }));
  };

  useEffect(() => {
    fetchCandidateData();
  }, [FormData.requirement_id]);
const jobdataready = DropdownData.jobdropdown.length > 0;
  useEffect(() => {
    const fetchSubmission = async () => {
      if (submission_id && jobdataready) {
        try {
          const res = await axiosInstance.get(
            `/ta_team/submissions/${submission_id}/`
          );
         const formValues = res.data;
          console.log("check", res.data);
          setFormData({ client_sub_date: formValues.client_sub_date || "",
          client_interview_date: formValues.client_interview_date || "",
          offer_date: formValues.offer_date || "",
          start_date: formValues.start_date || "",
          submission_id: formValues.submission_id || "",
          requirement_id: formValues.Job || "",
          tech_screen_date: formValues.tech_screen_date || "",
          am_screen_date: formValues.am_screen_date || "",});
        } catch (error) {
          console.error("Error fetching submission:", error);
        }
      }
    };
    fetchSubmission();
  }, [submission_id,jobdataready]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      console.log(FormData);
      const cleanDate = (dateStr) =>
        dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? dateStr : null;

      const cleanedFormData = {
        ...FormData,
        client_sub_date: cleanDate(FormData.client_sub_date),
        client_interview_date: cleanDate(FormData.client_interview_date),
        offer_date: cleanDate(FormData.offer_date),
        start_date: cleanDate(FormData.start_date),
        tech_screen_date: cleanDate(FormData.tech_screen_date),
        am_screen_date: cleanDate(FormData.am_screen_date),
      };

      await axiosInstance.patch(
        `/ta_team/submissions/${FormData.submission_id}/`,
        cleanedFormData
      );

      alert("Submission Success");
      // setShow(true);
      resetform();
    } catch (err) {
      console.error("Error submitting requirement:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
      }
      alert("Submission failed");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderSelect = (name, label, options) => {
    const selectOptions = (options || []).map((opt) => ({
      value: opt.id,
      label: opt.name,
    }));

    const selectedOption = selectOptions.find(
      (opt) => opt.value === FormData[name]
    );
    const hasError = !!errors[name];

    return (
      <Form.Group className="mb-3">
        <Form.Label className="fs-6">
          {label}
          <span style={{ color: "red" }}>*</span>:
        </Form.Label>
        <Select
          classNamePrefix="my-select"
          options={selectOptions}
          value={selectedOption || null}
          onChange={(selected) => {
            handleChange({
              target: { name, value: selected ? selected.value : "" },
            });
          }}
          placeholder={`Select ${label}`}
          isClearable
          styles={{
            control: (base) => ({
              ...base,
              borderColor: hasError ? "#dc3545" : base.borderColor,
              boxShadow: hasError
                ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
                : base.boxShadow,
              "&:hover": {
                borderColor: hasError ? "#dc3545" : base.borderColor,
              },
            }),
          }}
        />
        {hasError && (
          <Form.Control.Feedback type="invalid" className="d-block">
            {errors[name]}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  };

  return (
    <div>
      <Form onSubmit={handleSubmit} className="requirement-form container">
        <Row>
          <Col md={6}>
            {renderSelect("requirement_id", "Job", DropdownData.jobdropdown)}
          </Col>
          <Col md={6}>
            {renderSelect(
              "submission_id",
              "Candidate Name",
              DropdownData.candidatedropdown
            )}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3 " controlId="am_screen_date">
              <Form.Label className="fs-6">AM Screen Date:</Form.Label>
              <Form.Control
                type="date"
                min="2024-01-01"
                max={new Date().toISOString().split("T")[0]}
                placeholder="AM Screen Date"
                name="am_screen_date"
                value={FormData.am_screen_date}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3 " controlId="tech_screen_date">
              <Form.Label className="fs-6">Tech Screen Date:</Form.Label>
              <Form.Control
                type="date"
                min="2024-01-01"
                max={new Date().toISOString().split("T")[0]}
                placeholder="Tech Screen Date"
                name="tech_screen_date"
                value={FormData.tech_screen_date}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3 " controlId="client_sub_date">
              <Form.Label className="fs-6">Client Submission Date:</Form.Label>
              <Form.Control
                type="date"
                min="2024-01-01"
                max={new Date().toISOString().split("T")[0]}
                placeholder="Client Submission Date"
                name="client_sub_date"
                value={FormData.client_sub_date}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3 " controlId="client_interview_date">
              <Form.Label className="fs-6">Client Interview Date:</Form.Label>
              <Form.Control
                type="date"
                min="2024-01-01"
                max={new Date().toISOString().split("T")[0]}
                placeholder="Client Interview Date:"
                name="client_interview_date"
                value={FormData.client_interview_date}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3 " controlId="offer_date">
              <Form.Label className="fs-6">Offer Date:</Form.Label>
              <Form.Control
                type="date"
                min="2024-01-01"
                max={new Date().toISOString().split("T")[0]}
                placeholder="Enter Job Open Date"
                name="offer_date"
                value={FormData.offer_date}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3 " controlId="start_date">
              <Form.Label className="fs-6">Start Date:</Form.Label>
              <Form.Control
                type="date"
                min="2024-01-01"
                max={new Date().toISOString().split("T")[0]}
                placeholder="Enter Job Open Date"
                name="start_date"
                value={FormData.start_date}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center mt-4">
          <Col xs="auto">
            <Button className="submit-button" type="submit">
              Submit
            </Button>
          </Col>
          <Col xs="auto">
            <Button className="submit-button" type="button" onClick={resetform}>
              Reset
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SubmissionDatesForm;
