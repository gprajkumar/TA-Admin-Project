import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import "./RequirementForm.css"; // External CSS
import "./AllRequirements.css";
import {
  getClients,
  getEndClients,
  getRoleTypes,
  getJobStatuses,
  getfilteredEmployees,
  getJobreqs,
} from "../services/drop_downService";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import Select from "react-select";
import Alert from "react-bootstrap/Alert";

const AllRequirements = () => {
  const [selectedvalue, setSelectedvalue] = useState({
    Job: "",
    role_type: "",
    job_status: "",
    end_client: "",
    client: "",
    assigned_recruiter: "",
    assigned_sourcer: "",
  });
  const [allRequirements, setAllRequirements] = useState([]);
  const [filteredReqs, setfilteredReqs] = useState([]);
  const [filterdropdowndata, setfilterdropdowndata] = useState({
    jobs: [],
    recruiters: [],
    sourcers: [],
    jobstatuses: [],
    clients: [],
    roletypes: [],
    end_clients: [],
  });
  useEffect(() => {
    fetchReqs();
  }, []);

  useEffect(() => {
    let filtered = allRequirements;

    if (selectedvalue.job) {
      filtered = filtered.filter((item) => item.Job == selectedvalue.job);
    }
    if (selectedvalue.role_type) {
      filtered = filtered.filter(
        (item) => item.role_type == selectedvalue.role_type
      );
    }
    if (selectedvalue.job_status) {
      filtered = filtered.filter(
        (item) => item.role_type == selectedvalue.job_status
      );
    }
    if (selectedvalue.end_client) {
      filtered = filtered.filter(
        (item) => item.end_client == selectedvalue.end_client
      );
    }
    if (selectedvalue.client) {
      filtered = filtered.filter((item) => item.client == selectedvalue.client);
    }
    if (selectedvalue.assigned_recruiter) {
      filtered = filtered.filter(
        (item) => item.assigned_recruiter == selectedvalue.assigned_recruiter
      );
    }
    if (selectedvalue.assigned_sourcer) {
      filtered = filtered.filter(
        (item) => item.assigned_sourcer == selectedvalue.assigned_sourcer
      );
    }
    setfilteredReqs(filtered);
  }, [selectedvalue, allRequirements]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedvalue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          jobsRes,
          clientRes,
          endClientsRes,
          jobStatusesRes,
          recruitersRes,
          sourcersRes,
          roletypeRes,
        ] = await Promise.all([
          getJobreqs(),
          getClients(),
          getEndClients(),
          getJobStatuses(),
          getfilteredEmployees({ can_recruit: true, department: 2 }),
          getfilteredEmployees({ can_source: true, department: 1 }),
          getRoleTypes(),
        ]);

        setfilterdropdowndata({
          jobs: jobsRes.map((data) => ({
            id: data.requirement_id,
            name: `${data.job_code} - ${data.job_title}`,
          })),
          clients: normalizeData(clientRes, "client_id", "client_name"),
          endClients: normalizeData(
            endClientsRes,
            "end_client_id",
            "end_client_name"
          ),
          jobstatuses: normalizeData(
            jobStatusesRes,
            "job_status_id",
            "job_status"
          ),
          recruiters: normalizeData(recruitersRes, "employee_id", "emp_fName"),
          sourcers: normalizeData(sourcersRes, "employee_id", "emp_fName"),
          roletypes: normalizeData(roletypeRes, "role_type_id", "role_type"),
        });
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };

    fetchData();
  }, []);

  const renderSelect = (name, label, options) => {
    const selectOptions = (options || []).map((opt) => ({
      value: opt.id,
      label: opt.name,
    }));

    // Find the selected option in react-select's format
    const selectedOption = selectOptions.find(
      (opt) => opt.value === selectedvalue[name]
    );

    return (
      <div className="mb-3">
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
        />
      </div>
    );
  };

  const normalizeData = (data, idKey, nameKey) =>
    data.map((item) => ({ id: item[idKey], name: item[nameKey] }));
  const fetchReqs = async () => {
    const data = await getJobreqs();
    console.log(data);
    setAllRequirements(data);
    setfilteredReqs(data);
  };
  return (
    <div className="data-container">
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="job">
            <Form.Label className="fs-6">Job:</Form.Label>
            {renderSelect("Job", "Job", filterdropdowndata.jobs)}
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3 " controlId="Jobtype">
            <Form.Label className="fs-6">Job Type:</Form.Label>
            {renderSelect(
              "role_type",
              "Job Type",
              filterdropdowndata.roletypes
            )}
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3" controlId="jobstatus">
            <Form.Label className="fs-6">Job Status:</Form.Label>
            {renderSelect(
              "job_status",
              "Current Status",
              filterdropdowndata.jobstatuses
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Form.Group className="mb-3" controlId="EndClient">
            <Form.Label className="fs-6">End Client:</Form.Label>
            {renderSelect(
              "end_client",
              "End Client",
              filterdropdowndata.endClients
            )}
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3 " controlId="Client">
            <Form.Label className="fs-6">Client:</Form.Label>
            {renderSelect("client", "Client", filterdropdowndata.clients)}
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3 " controlId="recruiter">
            <Form.Label className="fs-6">Assigned Recruiter:</Form.Label>
            {renderSelect(
              "assigned_recruiter",
              "Recruiter",
              filterdropdowndata.recruiters
            )}
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3" controlId="sourcer">
            <Form.Label className="fs-6">Assigned Sourcer:</Form.Label>
            {renderSelect(
              "assigned_sourcer",
              "Sourcer",
              filterdropdowndata.sourcers
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* Header row with class 'header-row' */}
      <Row className="header-row">
        <Col className="col-job">Job</Col>
        <Col className="col-end-client">End Client</Col>
        <Col className="col-client">Client</Col>
        <Col className="col-recruiter">Recruiter</Col>
        <Col className="col-sourcer">Sourcer</Col>
        <Col className="col-job-type">Job Type</Col>
        <Col className="col-job-status">Job Status</Col>
        <Col className="col-action">Action</Col>
      </Row>
      {filteredReqs.map((req) => (
        <Row key={req.requirement_id} className="data-row">
          <Col className="col-job">{`${req.job_code}- ${req.job_title}`}</Col>
          <Col className="col-end-client">{req.end_client_name}</Col>
          <Col className="col-client">{req.client_name}</Col>
          <Col className="col-recruiter">{req.assigned_recruiter_name}</Col>
          <Col className="col-sourcer">{req.assigned_sourcer_name}</Col>
          <Col className="col-job-type">{req.role_type_name}</Col>
          <Col className="col-job-status">{req.job_status_name}</Col>
          <Col className="col-action">
            <button
              aria-label="View"
              title="View"
              onClick={() => handleView(req.id)}
            >
              <FaEye />
            </button>
            <button
              aria-label="Edit"
              title="Edit"
              onClick={() => handleEdit(req.id)}
            >
              <FaEdit />
            </button>
            <button
              aria-label="Delete"
              title="Delete"
              onClick={() => handleDelete(req.id)}
            >
              <FaTrash />
            </button>
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default AllRequirements;
