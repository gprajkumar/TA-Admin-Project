import { useState, useEffect,useMemo } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash,FaSearch } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import "./RequirementForm.css"; // External CSS
import "./AllRequirements.css";
import RequirementForm from './RequirementForm'
import AsyncSelect from 'react-select/async';
import ViewForm from "./ViewForm";
import {
  getJobreqs,
  getFilteredJobs,getPaginatedJobReqs
} from "../services/drop_downService";
import { Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../services/axiosInstance";
import CustomPagination from "./sharedComponents/CustomPagination";
import CustomAsyncSelect from "./sharedComponents/CustomAsyncSelect";
import { formatDateMMDDYYYY } from "../services/helper";
const AllRequirements = () => {
  const {empcode} = useParams();
  console.log("empcode", empcode)
 const {
  endClients: drop_down_endClients,
  clients: drop_down_clients,
  jobStatus: drop_down_jobStatus,
  roleTypes: drop_down_roleTypes,
  employees: drop_down_employees,
} = useSelector((state) => state.master_dropdown);

  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const [selectedvalue, setSelectedvalue] = useState({
    Job: "",
    role_type: "",
    job_status: "",
    end_client: "",
    client: "",
    
    assigned_recruiter: "",
    assigned_sourcer:  "",
    from_date:"",
    to_date:""
    // empcode:empcode || ""
  });
 
  
  const [show, setShow] = useState(false);  
  
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

 }
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
 const handleDelete = async (reqId) => {
  if (window.confirm("Are you sure you want to delete this requirement?")) {
    try {
    
  const response = await axiosInstance.delete(`${baseurl}/ta_team/requirements/${reqId}/`);
  console.log('Deleted successfully', response.data);
      await handleSearch();
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



 const normalizeData = (data, idKey, nameKey) =>
    data.map((item) => ({ id: item[idKey], name: item[nameKey] }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedvalue((prev) => ({
      ...prev,
      [name]: value,
    }));
  
  };

  const handleSearch = async () => {
  try {
    setPaginationData((prev) => ({ ...prev, currentpage: 1 }));
        const cleanFilters = {};
    Object.entries(selectedvalue).forEach(([key, value]) => {
      if (value !== "") {
        cleanFilters[key] = value;
      }
    });
      if (empcode) {
      cleanFilters["empcode"] = empcode;
    }
    else
    {
      delete cleanFilters["empcode"] ;
    }

        cleanFilters["page"] = 1;
    const paginatedfilteredData = await getFilteredJobs(
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
          jobStatusesRes,
          recruitersRes,
          sourcersRes,
          roletypeRes,
        ] = [
     
          drop_down_clients,
          drop_down_endClients,
          drop_down_jobStatus,
          drop_down_employees.filter((recruiters) => recruiters.can_recruit === true && recruiters.department === 2),
           drop_down_employees.filter((sourcers) => sourcers.can_source === true && sourcers.department === 1),
          drop_down_roleTypes,
        ];
const  jobsRes = await getJobreqs();
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

  const [paginationData, setPaginationData] = useState(
    {
      totalpages:0,
      currentpage: 1,
      totalrecords:0,
      endpageitemno:0,
      startpageitemno:0
     
    }
  )

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



 const handlePageChange = async (page) => {
  try {
    const cleanFilters = {};
    Object.entries(selectedvalue).forEach(([key, value]) => {
      if (value !== "") {
        cleanFilters[key] = value;
      }
    });
    cleanFilters["page"] = page;

    const paginatedfilteredData = await getFilteredJobs(cleanFilters);

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

    setfilteredReqs(paginatedfilteredData.results);
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
                
<CustomAsyncSelect placeholder={"Search job by title or ID"} loadOptions={loadOptions} name="Job" onChange={handleChange}/>
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
      <span className="jobs-found-count ms-2">{paginationData.totalrecords}</span>
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
          <Col className="col-end-client">{formatDateMMDDYYYY(req.req_opened_date)}</Col>
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
      <Row className="justify-content-center mt-3">
   <CustomPagination 
    paginationData={paginationData} 
    handlePageChange={handlePageChange} 
  />

</Row>
    </div>
    
  );
};

export default AllRequirements;
