import React, { useState, useEffect,useMemo } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import "./RequirementForm.css"; // External CSS
import "./AllRequirements.css";
import { useParams } from "react-router-dom";
import ViewForm from "./ViewForm";
import Pagination from 'react-bootstrap/Pagination';
import CustomPagination from "./sharedComponents/CustomPagination";
import Submission from "./Submissions";
import useMasterDropdowns from "../services/customHooks/useMasterDropdowns";
import {
  
  getJobreqs,
  getCurrentCandidateStatus,
  getSubmissions,
  getFilteredSubmissions
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
import AsyncSelect from 'react-select/async';
import axiosInstance from "../services/axiosInstance";

const AllSubmissions = ({ dateform = false, empId }) => {
   const {empcode} = useParams();
   const {
    drop_down_endClients,
    drop_down_clients,
    drop_down_jobStatus,
   
    drop_down_roleTypes,
    drop_down_employees,
    drop_down_sources
  } = useMasterDropdowns();
 
  
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
    empcode:""
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
    const [paginationData, setPaginationData] = useState(
    {
      totalpages:0,
      currentpage: 1,
      totalrecords:0,
      endpageitemno:0,
      startpageitemno:0
     
    }
  )
  
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
    
  };
    const loadOptions = async (inputValue) => {
  const res = await axiosInstance.get( `${baseurl}/ta_team/requirement-search`, {
    params: { q: inputValue }
  });
console.log("searchData",res.data);
  return res.data.map(job => ({
    label: `${job.job_code}-${job.job_title} `,
    value: job.requirement_id
  }));
};  
  const handleDelete = async (subId) => {
    if (window.confirm("Are you sure you want to delete this Candidate?")) {
      try {
        const response = await axios.delete(
          `${baseurl}/ta_team/submissions/${subId}/`
        );
        console.log("Deleted successfully", response.data);
        handleSearch(); // Refresh the list after deletion
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
  if (empcode) {
    handleSearch();
  }
  else{
    setSelectedvalue((prev) => ({
      ...prev,
      empcode: "",
    }));
  }
  
}, [empcode]);

  useEffect(() => {
  handleSearch();
  }, [selectedvalue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedvalue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSearch = async () => {
    try {
     setPaginationData((prev) => ({...prev, currentpage: 1 }));
      const cleanFilters={};

     Object.entries(selectedvalue).forEach(([key, value]) => {
        if (value !== "") {
          cleanFilters[key] = value;
        }});
          if (empcode) {
      cleanFilters["empcode"] = empcode;
    }
    else
    {
      delete cleanFilters["empcode"] ;
    }
        cleanFilters["page"] = 1;

      const paginatedfilteredData = await getFilteredSubmissions(
       cleanFilters
      );
       const totalPages = Math.ceil(paginatedfilteredData.count / 25);
    setPaginationData({
      totalpages: totalPages,
      currentpage: 1,
      totalrecords: paginatedfilteredData.count,
      startpageitemno: 2,
      endpageitemno: totalPages > 10 ? 6 : totalPages - 1,
    });
     const filteredData = paginatedfilteredData.results;
      setfilteredSubs(filteredData);
    } catch (error) {
      console.error("Error fetching filtered jobs:", error);
    }
  };
const paginatedItemGenerate = () => {
  let paginatedItems = [];
  const { totalpages, startpageitemno, endpageitemno, currentpage } = paginationData;

  if (totalpages <= 10) {
    for (let i = 2; i <= totalpages; i++) {
      paginatedItems.push(
        <Pagination.Item
          key={i}
          active={i === currentpage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
  } else {
     if (startpageitemno > 2) {
      paginatedItems.push(<Pagination.Ellipsis key="startellipsis" />);
     }
   

    for (let i = startpageitemno; i <= endpageitemno; i++) {
      if (i !== 1 && i !== totalpages) {
       
        paginatedItems.push(
          <Pagination.Item
            key={i}
            active={i === currentpage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    if (endpageitemno < totalpages - 1) {
      paginatedItems.push(<Pagination.Ellipsis key="ellipsis" />);
    }

    if (endpageitemno < totalpages) {
      paginatedItems.push(
        <Pagination.Item
          key={totalpages}
          active={totalpages === currentpage}
          onClick={() => handlePageChange(totalpages)}
        >
          {totalpages}
        </Pagination.Item>
      );
    }
  }

  return paginatedItems;
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
       
        drop_down_employees.filter((recruiters) => recruiters.can_recruit === true || recruiters.department === 2),
           drop_down_employees.filter((sourcers) => sourcers.can_source === true || sourcers.department === 1),
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
 const handlePageChange = async (page) => {
  try {
    const cleanFilters = {};
    Object.entries(selectedvalue).forEach(([key, value]) => {
      if (value !== "") {
        cleanFilters[key] = value;
      }
    });
    cleanFilters["page"] = page;

    const paginatedfilteredData = await getFilteredSubmissions(cleanFilters);

    const totalPages = paginationData.totalpages;
    let newStart = paginationData.startpageitemno;
    let newEnd = paginationData.endpageitemno;

    // Adjust window to show 5 page numbers at a time dynamically
    if (totalPages > 10) {
      if (page <= 3) {
        newStart = 2;
        newEnd = 6;
      } else if (page >= totalPages - 2) {
        newStart = totalPages - 5;
        newEnd = totalPages - 1;
      } else {
        newStart = page - 2;
        newEnd = page + 2;
      }
    } else {
      newStart = 2;
      newEnd = totalPages - 1;
    }

    setPaginationData((prev) => ({
      ...prev,
      currentpage: page,
      startpageitemno: newStart,
      endpageitemno: newEnd,
    }));

    setfilteredSubs(paginatedfilteredData.results);
  } catch (error) {
    console.error("Error fetching page data:", error);
  }
};

  return (
    <div className="data-container">
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="job">
            <Form.Label className="fs-6">Job:</Form.Label>
           <AsyncSelect
  cacheOptions
  defaultOptions
  loadOptions={loadOptions}
  onChange={(selectedOption) => {
    setSelectedvalue((prev) => ({
      ...prev,Job: selectedOption ? selectedOption.value : ""
    }));
  }}
  isClearable
  placeholder="Search job by title or ID"
/>
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
              name="from_sub_date"
              value={selectedvalue.from_sub_date}
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
              name="to_sub_date"
              value={selectedvalue.to_sub_date}
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
            <span className="jobs-found-count ms-2">{paginationData.totalrecords}</span>
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
       <Row className="justify-content-center mt-3">
  <Pagination>
  <Pagination.First
    onClick={() => handlePageChange(1)}
    disabled={paginationData.currentpage === 1}
  />
  <Pagination.Prev
    onClick={() =>
      handlePageChange(Math.max(paginationData.currentpage - 1, 1))
    }
    disabled={paginationData.currentpage === 1}
  />
  <Pagination.Item
      key={1}
      active={1 === paginationData.currentpage}
      onClick={() =>
       handlePageChange(1)
      }
    >
      {1}
    </Pagination.Item>
 
  {paginatedItemGenerate()}
  <Pagination.Next
    onClick={() =>
      handlePageChange(Math.min(paginationData.currentpage + 1, paginationData.totalpages))
    }
    disabled={paginationData.currentpage === paginationData.totalpages}
  />
  <Pagination.Last
    onClick={() =>
    handlePageChange(paginationData.totalpages)
    }
    disabled={paginationData.currentpage === paginationData.totalpages}
  />
</Pagination>

</Row>
    </div>
  );
};

export default AllSubmissions;
