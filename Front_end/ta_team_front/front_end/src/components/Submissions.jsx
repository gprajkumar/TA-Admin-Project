import axios from "axios";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./RequirementForm.css";
import {
  getSources,
  getfilteredEmployees,
  getJobreqs,
} from "../services/drop_downService";
import { Form, Row, Col, Button } from "react-bootstrap";

const Submission = () => {
      const baseurl = import.meta.env.VITE_API_BASE_URL
  const [formData, setFormData] = useState({
    Job: "",
    submission_date: "",
    candidate_name: "",
    payrate: "",
    w2_C2C: "",
    recruiter: "",
    sourcer: "",
    source: "",
    am_sub_date:"",
  });
const resetform = () =>
{
    setFormData({job: "",
    submission_date: "",
    candidate_name: "",
    payrate: "",
    w2_C2C: "",
    recruiter: "",
    sourcer: "",
    source: "",
    am_sub_date:"",})
}
  const [dropdownData, setDropdownData] = useState({
    jobs: [],
    recruiters: [],
    sourcers: [],
    sources: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobres, recruitersRes, sourcersRes, sourceres] =
          await Promise.all([
            getJobreqs(),
            getfilteredEmployees({ can_recruit: true, department: 2 }),
            getfilteredEmployees({ can_source: true, department: 1 }),
            getSources(),
          ]);

        setDropdownData({
          jobs: jobres.map((data) => ({
            id: data.requirement_id,
            name: `${data.job_code} - ${data.job_title}`,
          })),
          recruiters: normalizeData(recruitersRes, "employee_id", "emp_fName"),
          sourcers: normalizeData(sourcersRes, "employee_id", "emp_fName"),
          sources: normalizeData(sourceres,"source_id","source"),
        });
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };

    fetchData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    try {
      await axios.post(`${baseurl}/ta_team/submissions/`, formData);
      alert("Submission successfully");
      resetform();
    } catch (err) {
      console.error("Error submitting requirement:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
      }
      alert("Submission failed");
    }
  };
  const normalizeData = (data, idKey, nameKey) =>
    data.map((item) => ({ id: item[idKey], name: item[nameKey] }));

  const renderSelect = (name, label, options) => {
    const selectOptions = (options || []).map((opt) => ({
      value: opt.id,
      label: opt.name,
    }));

    // Find the selected option in react-select's format
    const selectedOption = selectOptions.find(
      (opt) => opt.value === formData[name]
    );

    return (
      <div className="mb-3">
        <Select classNamePrefix="my-select"
          options={selectOptions}
          value={selectedOption || null}
          onChange={(selected) => {
            handleChange({
              target: { name, value: selected ? selected.value : "" },
            });
          }}
          placeholder={`Select ${label}`}
          isClearable
        />
      </div>
    );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
  setFormData((prev) => {
    const updatedForm = { ...prev, [name]: value };
    if (name === "submission_date") {
      updatedForm["am_sub_date"] = value; // Sync am_submission with submission_date
    }
    return updatedForm;
  });
  };
  return (
    <Form onSubmit={handleSubmit} className="requirement-form container">
      <h2 className="mb-4">Candidate Submission</h2>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3 " controlId="job">
            <Form.Label className="fs-5">Job:</Form.Label>
            {renderSelect("Job", "Job", dropdownData.jobs)}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="submission_date">
            <Form.Label className="fs-5">Submission Date:</Form.Label>
            <Form.Control
              type="Date"
              name="submission_date"
              value={formData.submission_date}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="candidate_name">
            <Form.Label className="fs-5">Candidate Name:</Form.Label>
            <Form.Control
              type="input"
              name="candidate_name"
              value={formData.candidate_name}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Form.Group className="mb-3 " controlId="payrate">
            <Form.Label className="fs-5">Payrate in $:</Form.Label>
            <Form.Control
              type="input"
              name="payrate"
              value={formData.payrate}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3 " controlId="c2c_w2">
            <Form.Label className="fs-5">Tax Terms:</Form.Label>
            <select
              id="myDropdown"
              name="w2_C2C"
              value={formData.w2_C2C}
              onChange={handleChange} className="form-control">
              <option value="">Select Tax Term:</option>
              <option value="W2">W2</option>
              <option value="C2C">C2C</option>
            </select>
          </Form.Group>
        </Col>
         <Col md={6}>
          <Form.Group className="mb-3" controlId="source">
            <Form.Label className="fs-5">Source:</Form.Label>
          {renderSelect("source","Source",dropdownData.sources)}
          </Form.Group>
        </Col>
      </Row>
    <Row>
      <Col md={6}>
      <Form.Group className="mb-3 " controlId="recruiter">
         <Form.Label className='fs-5' >Assigned Recruiter:</Form.Label>
       {renderSelect("recruiter","Recruiter",dropdownData.recruiters)}
      </Form.Group>
      </Col>
      <Col md={6}>
      <Form.Group className="mb-3" controlId="sourcer">
   <Form.Label className='fs-5' >Assigned Sourcer:</Form.Label>
       {renderSelect("sourcer","Sourcer",dropdownData.sourcers)}
      </Form.Group>
      </Col>
      </Row>
      <Button className="submit-button" type="submit">
        Submit Candidate
      </Button>
       <Button  className='submit-button' type="button" onClick={resetform}>
        Reset
      </Button>
    </Form>
  );
};
export default Submission;
