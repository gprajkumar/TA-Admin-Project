import React from 'react';
import { Form, Row, Col, Button } from "react-bootstrap";
import Dropdown_component from "../sharedComponents/Dropdown_component";
import CustomAsyncSelect from "../sharedComponents/CustomAsyncSelect";
import CustomAlert from "../sharedComponents/Alert";
import "../RequirementForm.css";

const TechScreenForm = ({
  viewtype,
  isEditMode = false,
  formData,
  dropdownData,
  loadJobOptions,
  selectedJob,
  errors,
  show,
  setShow,
  handleSubmit,
  handleChange,
  OnhandleSelect,
  resetform,
}) => {
  const jobDefaultOptions = (dropdownData.jobs || []).map((job) => ({
    value: job.requirement_id,
    label: `${job.job_code} - ${job.job_title}`,
  }));
  const today = new Date();
  const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  return (
    <Form onSubmit={handleSubmit} className="requirement-form container">
      <h2 className="mb-4">
        {isEditMode ? (viewtype ? "View " : "Edit ") : ""}Technical Screening Form
      </h2>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="job">
            <Form.Label className="fs-6">
              Job<span style={{ color: "red" }}>*</span>:
            </Form.Label>
            <CustomAsyncSelect
              placeholder="Search job by title or code"
              loadOptions={loadJobOptions}
              defaultOptions={jobDefaultOptions}
              value={selectedJob}
              isDisabled={viewtype}
              name="job"
              onChange={handleChange}
              error={errors.job}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Dropdown_component
            name={"candidate"}
            label={"Candidate"}
            error={errors.candidate}
            options={dropdownData.candidates}
            onSelect={OnhandleSelect}
            value={formData.candidate}
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Dropdown_component
            name={"tech_screener"}
            label={"Technical Screener"}
            error={errors.tech_screener}
            options={dropdownData.techScreeners}
            onSelect={OnhandleSelect}
            value={formData.tech_screener}
          />
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="screening_date">
            <Form.Label className="fs-6">
              Screening Date<span style={{ color: "red" }}>*</span>:
            </Form.Label>
            <Form.Control
              type="date"
              placeholder="Select Screening Date"
              name="screening_date"
              disabled={viewtype}
              max={localToday}
              value={formData.screening_date}
              onChange={handleChange}
              isInvalid={!!errors.screening_date}
            />
            <Form.Control.Feedback type="invalid">
              {errors.screening_date}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Dropdown_component
            name={"screening_status"}
            label={"Screening Status"}
            error={errors.screening_status}
            options={dropdownData.screeningStatuses}
            onSelect={OnhandleSelect}
            value={formData.screening_status}
          />
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="feedback">
            <Form.Label className="fs-6">Feedback/Notes:</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter feedback or notes"
              maxLength={2000}
              name="feedback"
              disabled={viewtype}
              value={formData.feedback}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <CustomAlert
          show={show}
          message="Technical screening recorded successfully"
          type="success"
          handleAlertClick={() => setShow(false)}
        />
      </Row>

      <Row className="mt-4">
        {!viewtype && (
          <Col>
            <div className="d-flex justify-content-center gap-3">
              <Button className="submit-button" type="submit">
                {isEditMode ? "Update Screening" : "Submit Screening"}
              </Button>
              <Button
                className="submit-button"
                type="button"
                onClick={() => resetform(false)}
              >
                Reset
              </Button>
            </div>
          </Col>
        )}
      </Row>
    </Form>
  )
}

export default TechScreenForm;
