import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Dropdown_component from "../sharedComponents/Dropdown_component";
import CustomAlert from "../sharedComponents/Alert";
import "../RequirementForm.css"; 
import Loader from "../sharedComponents/Loader";
const RequirementComponent = ({
  viewtype,
  reqid,
  formData,
  dropdownData,
  errors,
  show,
  setShow,
  handleSubmit,
  handleChange,
  OnhandleSelect,
  resetform,
}) => {
  return (
         <Form onSubmit={handleSubmit} className="requirement-form container">
        <h2 className="mb-4">
          {viewtype ? "" : reqid ? "Edit" : "Create"} Requirement
        </h2>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3 " controlId="job_code">
              <Form.Label className="fs-6">
                Job Code<span style={{ color: "red" }}>*</span>:
              </Form.Label>
              <Form.Control
                type="input"
                placeholder="Enter Job Code"
                minLength={3}
                maxLength={20}
                name="job_code"
                disabled={viewtype}
                value={formData.job_code}
                isInvalid={!!errors.job_code}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.job_code}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="job_title">
              <Form.Label className="fs-6">
                Job Title<span style={{ color: "red" }}>*</span>:
              </Form.Label>
              <Form.Control
                type="input"
                placeholder="Enter Job Title"
                minLength={5}
                maxLength={200}
                name="job_title"
                disabled={viewtype}
                value={formData.job_title}
                isInvalid={!!errors.job_title}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.job_title}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3 " controlId="req_opened_date">
              <Form.Label className="fs-6">
                Date Req Opened<span style={{ color: "red" }}>*</span>:
              </Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter Job Open Date"
                name="req_opened_date"
                disabled={viewtype}
                min="2024-01-01" // 👈 Earliest allowed date
                max={new Date().toISOString().split("T")[0]} // 👈 Today’s date
                value={formData.req_opened_date}
                onChange={handleChange}
                isInvalid={!!errors.req_opened_date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.req_opened_date}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="no_of_positions">
              <Form.Label className="fs-6">
                No of Positions<span style={{ color: "red" }}>*</span>:
              </Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={5}
                placeholder="Enter No of Positions"
                name="no_of_positions"
                disabled={viewtype}
                value={formData.no_of_positions}
                isInvalid={!!errors.no_of_positions}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.no_of_positions}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Dropdown_component
              name={"account"}
              label={"Account"}
              error={errors.account}
              options={dropdownData.accounts}
              onSelect={OnhandleSelect}
              value={formData.account}
            />
          </Col>
          <Col md={6}>
            <Dropdown_component
              name={"end_client"}
              label={"End Client"}
              error={errors.end_client}
              options={dropdownData.endClients}
              onSelect={OnhandleSelect}
              value={formData.end_client}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Dropdown_component
              name={"client"}
              label={"Client"}
              error={errors.client}
              options={dropdownData.clients}
              onSelect={OnhandleSelect}
              value={formData.client}
            />
          </Col>
          <Col md={6}>
            <Dropdown_component
              name={"hiringManager"}
              label={"Hiring Manager"}
              error={errors.hiringManager}
              options={dropdownData.hiringManagers}
              onSelect={OnhandleSelect}
              value={formData.hiringManager}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Dropdown_component
              name={"assigned_recruiter"}
              label={"Recruiter"}
              error={errors.assigned_recruiter}
              options={dropdownData.recruiters}
              onSelect={OnhandleSelect}
              value={formData.assigned_recruiter}
            />
          </Col>
          <Col md={6}>
            <Dropdown_component
              name={"assigned_sourcer"}
              label={"Sourcer"}
              error={errors.assigned_sourcer}
              options={dropdownData.sourcers}
              onSelect={OnhandleSelect}
              value={formData.assigned_sourcer}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Dropdown_component
              name={"role_type"}
              label={"Job Type"}
              error={errors.role_type}
              options={dropdownData.roletypes}
              onSelect={OnhandleSelect}
              value={formData.role_type}
            />
          </Col>
          <Col md={6}>
            <Dropdown_component
              name={"job_status"}
              label={"Current Status"}
              error={errors.job_status}
              options={dropdownData.jobStatuses}
              onSelect={OnhandleSelect}
              value={formData.job_status}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Dropdown_component
              name={"accountManager"}
              label={"Account Manager"}
              error={errors.accountManager}
              options={dropdownData.accountManagers}
              onSelect={OnhandleSelect}
              value={formData.accountManager}
            />
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="jobnote">
              <Form.Label className="fs-6">Note:</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Enter Note"
                maxLength={2000}
                name="notes"
                disabled={viewtype}
                value={formData.notes}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <CustomAlert
            show={show}
            message={`Requirement ${reqid ? "updated" : "added"} Successfully`}
            type="success"
            handleAlertClick={() => setShow(false)}
          />
        </Row>
        <Row className="mt-4">
          {!viewtype && (
            <Col>
              <div className="d-flex justify-content-center gap-3">
                <Button className="submit-button" type="submit">
                  {reqid ? "Update" : "Submit"} Requirement
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
  );
};

export default RequirementComponent;
