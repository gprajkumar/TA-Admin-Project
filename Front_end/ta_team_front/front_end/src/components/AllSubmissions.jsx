import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import "./RequirementForm.css"; // External CSS
import "./AllRequirements.css";
import { useParams } from "react-router-dom";
import ViewForm from "./ViewForm";
import Submission from "./Submissions";
import {
  
  getJobreqs,
  getCurrentCandidateStatus,
  getSubmissions,
} from "../services/drop_downService";
import {
  Form,
  Row,
  Col,
  Button
} from "react-bootstrap";
import Select from "react-select";
import SubmissionDatesForm from "./SubmissonDatesForm";
import { useSelector } from "react-redux";

const AllSubmissions = ({ dateform = false, empId }) => {
   const {empcode} = useParams();
    const drop_down_endClients = useSelector(
    (state) => state.master_dropdown.endClients
  );
  const drop_down_clients = useSelector(
    (state) => state.master_dropdown.clients
  );
  const drop_down_jobStatus = useSelector(
    (state) => state.master_dropdown.jobStatus
  );
  const drop_down_roleTypes = useSelector(
    (state) => state.master_dropdown.roleTypes
  );
  const drop_down_employees = useSelector(
    (state) => state.master_dropdown.employees
  );
  const drop_down_sources = useSelector((state)=> state.master_dropdown.sources);
   console.log(empcode);
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const [selectedvalue, setSelectedvalue] = useState({
    Job: "",
    end_client: "",
    client: "",
    recruiter: "",
    sourcer: "",
    from_sub_date: "",
    to_sub_date: "",
    candidate_name: "",
    current_status: "",
    source: "",
  });
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [show, setShow] = useState(false);
  const [dateFilter, setdateFilter] = useState({
    from_sub_date: "",
    to_sub_date: "",
  });
  const [currentSubid, setcurrentSubid] = useState("");
  const [viewtype, setviewtype] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  // const handleShow = () => {setShow(true);}
  const handleView = (subId, sendata) => {
    setcurrentSubid(subId);
    setpassData(sendata);
    setShow(true);
    setviewtype(true);
  };
  const handleEdit = (subId) => {
    setcurrentSubid(subId);
    setShow(true);
    setviewtype(false);
    fetchsubs();
  };
  const handleDelete = async (subId) => {
    if (window.confirm("Are you sure you want to delete this Candidate?")) {
      try {
        const response = await axios.delete(
          `${baseurl}/ta_team/submissions/${subId}/`
        );
        console.log("Deleted successfully", response.data);
        fetchsubs();
      } catch (error) {
        console.error("Failed to delete requirement:", error);
      }
    }
  };
  const [filteredSubs, setfilteredSubs] = useState([]);
  const [passData, setpassData] = useState({});
  const [filterdropdowndata, setfilterdropdowndata] = useState({
    jobs: [],
    recruiters: [],
    sourcers: [],
    candidate_current_Status: [],
    clients: [],
    sources: [],
    end_clients: [],
  });
  useEffect(() => {
    fetchsubs();
  }, [empcode]);

  useEffect(() => {
    let filtered = allSubmissions;

    if (selectedvalue.Job) {
      filtered = filtered.filter(
        (item) => item.job_details.requirement_id == selectedvalue.Job
      );
    }

    if (selectedvalue.candidate_name) {
      filtered = filtered.filter(
        (item) =>
          item.candidate_name &&
          item.candidate_name
            .toLowerCase()
            .includes(selectedvalue.candidate_name.toLowerCase())
      );
    }
    if (selectedvalue.end_client) {
      filtered = filtered.filter(
        (item) => item.job_details.end_client == selectedvalue.end_client
      );
    }
    if (selectedvalue.client) {
      filtered = filtered.filter(
        (item) => item.job_details.client == selectedvalue.client
      );
    }
    if (selectedvalue.recruiter) {
      filtered = filtered.filter(
        (item) => item.recruiter == selectedvalue.recruiter
      );
    }
    if (selectedvalue.sourcer) {
      filtered = filtered.filter(
        (item) => item.sourcer == selectedvalue.sourcer
      );
    }
    if (selectedvalue.source) {
      filtered = filtered.filter((item) => item.source == selectedvalue.source);
    }

    setfilteredSubs(filtered);
    console.log(filtered);
  }, [selectedvalue, allSubmissions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedvalue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSearch = async () => {
    try {
      const filteredData = await getFilteredSubmissions(
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
         
          clientRes,
          endClientsRes,
         
          recruitersRes,
          sourcersRes,
          sourceRes,
        ] = [
        
          drop_down_clients,
          drop_down_endClients,
       
        drop_down_employees.filter((recruiters) => recruiters.can_recruit === true && recruiters.department === 2),
           drop_down_employees.filter((sourcers) => sourcers.can_source === true && sourcers.department === 1),
         drop_down_sources
        ];
 const [
          jobsRes, CurrentStatusRes,] =await Promise.all([
             getJobreqs(),getCurrentCandidateStatus()
          ])
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
          candidate_current_Status: Array.isArray(CurrentStatusRes)
            ? CurrentStatusRes.map((status) => ({ id: status, name: status }))
            : [],
          recruiters: normalizeData(recruitersRes, "employee_id", "emp_fName"),
          sourcers: normalizeData(sourcersRes, "employee_id", "emp_fName"),
          sources: normalizeData(sourceRes, "source_id", "source"),
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
  const fetchsubs = async () => {
    let data = await getSubmissions();
    console.log(data);
      if (empcode) {
  data = data.filter(
    (item) =>
      item.assigned_recruiter == empcode ||
      item.assigned_sourcer == empcode
  );
}
    setAllSubmissions(data);
    setfilteredSubs(data);
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
          <Form.Group className="mb-3 " controlId="candidate_name">
            <Form.Label className="fs-6">Candidate Name</Form.Label>
            <Form.Control
              type="input"
              onChange={handleChange}
              value={selectedvalue.candidate_name}
              name="candidate_name"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3" controlId="current_status">
            <Form.Label className="fs-6">Candidate Status:</Form.Label>
            {renderSelect(
              "current_status",
              "Candidate Current Status",
              filterdropdowndata.candidate_current_Status
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
        <Col md={2}>
          <Form.Group className="mb-3 " controlId="recruiter">
            <Form.Label className="fs-6">Recruiter:</Form.Label>
            {renderSelect(
              "recruiter",
              "Recruiter",
              filterdropdowndata.recruiters
            )}
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className="mb-3" controlId="sourcer">
            <Form.Label className="fs-6">Sourcer:</Form.Label>
            {renderSelect("sourcer", "Sourcer", filterdropdowndata.sourcers)}
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className="mb-3" controlId="source">
            <Form.Label className="fs-6">Source:</Form.Label>
            {renderSelect("source", "Source", filterdropdowndata.sources)}
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
            <span className="jobs-found-label">Candidates Found:</span>
            <span className="jobs-found-count ms-2">{filteredSubs.length}</span>
          </div>
        </Col>
      </Row>
      {/* Header row with class 'header-row' */}
      <Row className="header-row">
        <Col className="col-job">Job</Col>
        <Col className="col-end-client">Submission Date</Col>
        <Col className="col-client">Candidate Name</Col>
        <Col className="col-recruiter">
          {dateform == true ? "AM Screen Date" : "Recruiter"}
        </Col>
        <Col className="col-sourcer">
          {dateform == true ? "Technical Screen Date" : "Sourcer"}
        </Col>
        <Col className="col-job-type">
          {dateform == true ? "Client  Submission Date" : "Source"}
        </Col>
        <Col className="col-job-status">
          {dateform == true ? "Client Interview Date" : "Current Status"}
        </Col>
        <Col
          className="col-job-status"
          style={{ display: dateform == true ? "block" : "none" }}
        >
          Offer Date
        </Col>
        <Col
          className="col-job-status"
          style={{ display: dateform == true ? "block" : "none" }}
        >
          Start Date
        </Col>
        <Col className="col-action">Action</Col>
      </Row>
      {filteredSubs.map((sub) => (
        <Row key={sub.submission_id} className="data-row">
          <Col className="col-job">{`${sub.job_details.job_code}- ${sub.job_details.job_title}`}</Col>
          <Col className="col-end-client">
            {new Date(sub.submission_date).toLocaleDateString("en-US")}
          </Col>
          <Col className="col-client">{sub.candidate_name}</Col>
          <Col className="col-client">
            {dateform == true
              ? sub.am_screen_date
                ? new Date(sub.am_screen_date).toLocaleDateString("en-US")
                : ""
              : sub.recruiter_name}
          </Col>
          <Col className="col-recruiter">
            {dateform
              ? sub.tech_screen_date
                ? new Date(sub.tech_screen_date).toLocaleDateString("en-US")
                : ""
              : sub.sourcer_name}
          </Col>

          <Col className="col-sourcer">
            {dateform
              ? sub.client_sub_date
                ? new Date(sub.client_sub_date).toLocaleDateString("en-US")
                : ""
              : sub.source_name}
          </Col>

          <Col className="col-job-status">
            {dateform
              ? sub.client_interview_date
                ? new Date(sub.client_interview_date).toLocaleDateString(
                    "en-US"
                  )
                : ""
              : sub.current_status}
          </Col>

          <Col
            className="col-job-status"
            style={{ display: dateform ? "block" : "none" }}
          >
            {sub.offer_date
              ? new Date(sub.offer_date).toLocaleDateString("en-US")
              : ""}
          </Col>

          <Col
            className="col-job-status"
            style={{ display: dateform ? "block" : "none" }}
          >
            {sub.start_date
              ? new Date(sub.start_date).toLocaleDateString("en-US")
              : ""}
          </Col>
          <Col className="col-action">
            <button
              aria-label="View"
              title="View"
              onClick={() => handleView(sub.submission_id, sub)}
            >
              <FaEye />
            </button>
            <button
              aria-label="Edit"
              title="Edit"
              onClick={() => handleEdit(sub.submission_id)}
            >
              <FaEdit />
            </button>
            <button
              aria-label="Delete"
              title="Delete"
              onClick={() => handleDelete(sub.submission_id)}
            >
              <FaTrash />
            </button>
          </Col>
        </Row>
      ))}
      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body style={{ width: "100% !important" }}>
          { viewtype ? <ViewForm data={passData} formtype="submission"/>:
          dateform? <SubmissionDatesForm submission_id={currentSubid} viewtype={viewtype} externaldropdowndata={filterdropdowndata}/>:
          <Submission submission_id={currentSubid} viewtype={viewtype} externaldropdowndata={filterdropdowndata}/>} 
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

export default AllSubmissions;
