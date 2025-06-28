import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash,FaSearch } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import "./RequirementForm.css"; // External CSS
import "./AllRequirements.css";
import RequirementForm from './RequirementForm'
import ViewForm from "./ViewForm";
import {
  getClients,
  getEndClients,
  getRoleTypes,
  getJobStatuses,
  getfilteredEmployees,
  getJobreqs,
  getFilteredJobs,
} from "../services/drop_downService";
import { Form, Row, Col, Button, Container, FormControl } from "react-bootstrap";
import Select from "react-select";


const AllRequirements = () => {
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const [selectedvalue, setSelectedvalue] = useState({
    Job: "",
    role_type: "",
    job_status: "",
    end_client: "",
    client: "",
    assigned_recruiter: "",
    assigned_sourcer: "",
    from_date:"",
    to_date:"",
  });
  const [allRequirements, setAllRequirements] = useState([]);
  const [show, setShow] = useState(false);  
  const [dateFilter, setdateFilter] = useState({
    from_date:'',
    to_date:'',
  });
const[currentReqid, setcurrentReqid] =useState('');
const[viewtype, setviewtype] =useState(false);
  const handleClose = () => {setShow(false)};
 // const handleShow = () => {setShow(true);}
 const handleView = (reqId,sendata) => {
setcurrentReqid(reqId);
setpassData(sendata);
setShow(true)
setviewtype(true)
 }
const handleEdit = (reqId) => {
setcurrentReqid(reqId);
setShow(true)
setviewtype(false)
fetchReqs(); 
 }
 const handleDelete = async (reqId) => {
  if (window.confirm("Are you sure you want to delete this requirement?")) {
    try {
    
       const response = await axios.delete(`${baseurl}/ta_team/requirements/${reqId}/`);
  console.log('Deleted successfully', response.data);
      fetchReqs(); 
    } catch (error) {
      console.error("Failed to delete requirement:", error);
    }
  }
};
  const [filteredReqs, setfilteredReqs] = useState([]);
  const [passData,setpassData] =  useState({});
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

    if (selectedvalue.Job) {
      
      filtered = filtered.filter((item) => item.requirement_id == selectedvalue.Job);
    }
    if (selectedvalue.role_type) {
      filtered = filtered.filter(
        (item) => item.role_type == selectedvalue.role_type
      );
    }
    if (selectedvalue.job_status) {
      filtered = filtered.filter(
        (item) => item.job_status == selectedvalue.job_status
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
  const handleSearch = async () => {
  try {
    const filteredData = await getFilteredJobs(
      selectedvalue.from_date,
      selectedvalue.to_date
    );
    setAllRequirements(filteredData); // optional
    setfilteredReqs(filteredData);
  } catch (error) {
    console.error("Error fetching filtered jobs:", error);
  }
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
    const data = await getJobreqs(selectedvalue.from_date,selectedvalue.to_date);
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
   <Row className="align-items-end mb-3">
  <Col md={2}>
    <Form.Group controlId="from_date">
      <Form.Label className="fs-6">From:</Form.Label>
      <Form.Control
        type="date"
        className="date-filter-input"
        name="from_date"
        value={selectedvalue.from_date}
        onChange={handleChange}
      />
    </Form.Group>
  </Col>

  <Col md={2}>
    <Form.Group controlId="to_date">
      <Form.Label className="fs-6">To:</Form.Label>
      <Form.Control
        type="date"
        className="date-filter-input"
        name="to_date"
        value={selectedvalue.to_date}
        onChange={handleChange}
      />
    </Form.Group>
  </Col>

  <Col md={2} className="d-flex align-items-center">
    <button
      className="search-button"
      aria-label="Search"
      title="Search"
      onClick={handleSearch}
    >
      <FaSearch />
    </button>
  </Col>

  <Col md={3} className="d-flex align-items-center">
    <div className="jobs-found">
      <span className="jobs-found-label">Jobs Found:</span>
      <span className="jobs-found-count ms-2">{filteredReqs.length}</span>
    </div>
  </Col>
</Row>
      {/* Header row with class 'header-row' */}
      <Row className="header-row">
        <Col className="col-job">Job</Col>
        <Col className="col-end-client">Job Opened Date</Col>
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
          <Col className="col-end-client">{new Date(req.req_opened_date).toLocaleDateString("en-US")}</Col>
          <Col className="col-client">{req.client_name}</Col>
          <Col className="col-recruiter">{req.assigned_recruiter_name}</Col>
          <Col className="col-sourcer">{req.assigned_sourcer_name}</Col>
          <Col className="col-job-type">{req.role_type_name}</Col>
          <Col className="col-job-status">{req.job_status_name}</Col>
          <Col className="col-action">
            <button
              aria-label="View"
              title="View"
              onClick={() => handleView(req.requirement_id,req)}
            >
              <FaEye />
            </button>
            <button
              aria-label="Edit"
              title="Edit"
              onClick={() => handleEdit(req.requirement_id)}
            >
              <FaEdit />
            </button>
            <button
              aria-label="Delete"
              title="Delete"
              onClick={() => handleDelete(req.requirement_id)}
            >
              <FaTrash />
            </button>
          </Col>
        </Row>
      ))}
      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
         
        </Modal.Header>
        <Modal.Body style={{ width: '100% !important' }}>
          { viewtype ? <ViewForm data={passData}/>:
          <RequirementForm reqid={currentReqid} viewtype={viewtype} externaldropdowndata={filterdropdowndata}/>}
        
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    
  );
};

export default AllRequirements;
