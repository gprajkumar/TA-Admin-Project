import { useState, useEffect, useMemo, useCallback } from "react";
import { FaEye, FaEdit, FaTrash,FaSearch } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import "./RequirementForm.css"; // External CSS
import "./AllRequirements.css";
import RequirementForm from './RequirementForm'
import ViewForm from "./ViewForm";
import SubmissionsofReqs  from "./sharedComponents/SubmissionsofReqs";
import { hasPermission,canDelete,canEdit } from "../services/utilities/rbac";
import {
  getFilteredJobs,
} from "../services/drop_downService";
import { Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import MultiSelect from "./sharedComponents/MultiSelect";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../services/axiosInstance";
import CustomPagination from "./sharedComponents/CustomPagination";
import CustomAsyncSelect from "./sharedComponents/CustomAsyncSelect";
import { formatDateMMDDYYYY } from "../services/helper";
import useMasterDropdowns from "../services/customHooks/useMasterDropdowns";
import useDebounce from "../services/customHooks/useDebounce";

// ── Pure helpers — no component dependencies, never recreated ─────────────────
const normalizeData = (data, idKey, nameKey) =>
  data.map((item) => ({ id: item[idKey], name: item[nameKey] }));

const normalizeAndSort = (data, idKey, nameKey) =>
  normalizeData(data, idKey, nameKey).sort((a, b) =>
    (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })
  );
// ─────────────────────────────────────────────────────────────────────────────

const AllRequirements = () => {
  const {empcode} = useParams();
  const {
    drop_down_endClients,
    drop_down_clients,
    drop_down_jobStatus,
    drop_down_roleTypes,
    drop_down_employees,
    drop_down_permissions,
    drop_down_accounts,
  } = useMasterDropdowns();

  const canView = useMemo(
    () => hasPermission(drop_down_permissions, "requirements", "view"),
    [drop_down_permissions]
  );

  const baseurl = import.meta.env.VITE_API_BASE_URL;
   const profileEmployee =  useSelector((state) => state.employee.employee_details);
    const profile_employee_id = profileEmployee ? profileEmployee.employee_id : null;
  const [selectedvalue, setSelectedvalue] = useState({
    Job: "",
    role_type: [],
    job_status: [],
    end_client: [],
    client: [],
    account: [],
    assigned_recruiter: "",
    assigned_sourcer:  "",
    from_date:"",
    to_date:""
  });
 
  
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);  
  
const[currentReqid, setcurrentReqid] =useState('');
const[viewtype, setviewtype] =useState(false);
  const handleClose = () => {setShow(false)};
  const [showSubmissions, setShowSubmissions] = useState(false);
  const SubmissionshandleClose = () => setShowSubmissions(false);
  const handleShowSubmissions = (reqId) => {
    setcurrentReqid(reqId);
    setShowSubmissions(true);
  }
 // const handleShow = () => {setShow(true);}
 const handleView = (reqId,sendata) => {
setcurrentReqid(reqId);
setpassData(sendata);
setShow(true)
setviewtype(true)
 }
const handleEdit = (reqId,recruiterId,sourcerId) => {
   console.log("Attempting to edit submission:", reqId, "Recruiter ID:", recruiterId, "Sourcer ID:", sourcerId,"empcode:", profile_employee_id ); // Debug log for edit action
      const ownerCheck = (profile_employee_id === recruiterId) || (profile_employee_id === sourcerId);
      if(!canEdit(drop_down_permissions, "requirements", ownerCheck)) {
        alert("You don't have permission to edit this candidate as you are neither the recruiter nor the sourcer for this submission.");
      return;
      }
setcurrentReqid(reqId);
setShow(true)
setviewtype(false)

 }
     const loadOptions = async (inputValue) => {
   const res = await axiosInstance.get( `${baseurl}/ta_team/requirement-search`, {
     params: { q: inputValue }
   });
   return res.data.map(job => ({
     label: `${job.job_code}-${job.job_title} `,
     value: job.requirement_id
   }));
 };  
 const handleDelete = async (reqId,recruiterId,sourcerId) => {
  const ownerCheck = (profile_employee_id === recruiterId) || (profile_employee_id === sourcerId);
  
      if((!canDelete(drop_down_permissions, "requirements", ownerCheck))) {
        alert("You don't have permission to delete this candidate as you are neither the recruiter nor the sourcer for this submission.");
        return;
      }
  if (window.confirm("Are you sure you want to delete this requirement?")) {
    try {
    
  const response = await axiosInstance.delete(`${baseurl}/ta_team/requirements/${reqId}/`);
      await handleSearch();
    } catch (error) {
      console.error("Failed to delete requirement:", error);
    }
  }
};
  const [filteredReqs, setfilteredReqs] = useState([]);
  const [passData,setpassData] =  useState({});
  const [filterdropdowndata, setfilterdropdowndata] = useState({
    recruiters: [],
    sourcers: [],
    jobstatuses: [],
    clients: [],
    roletypes: [],
    endClients: [],
    accounts: [],
  });
  const debouncedFilters = useDebounce(selectedvalue, 400);

  useEffect(() => {
    handleSearch();
  }, [debouncedFilters, empcode]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedvalue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildCleanFilters = useCallback((page) => {
    const cleanFilters = {};
    Object.entries(selectedvalue).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) cleanFilters[key] = value.join(',');
      } else if (value !== "") {
        cleanFilters[key] = value;
      }
    });
    if (empcode) {
      cleanFilters.empcode = empcode;
    } else {
      delete cleanFilters.empcode;
    }
    cleanFilters.page = page;
    return cleanFilters;
  }, [selectedvalue, empcode]);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const cleanFilters = buildCleanFilters(1);
      const paginatedfilteredData = await getFilteredJobs(cleanFilters);
      const totalPages = Math.ceil(paginatedfilteredData.count / 25);
      setPaginationData({
        totalpages: totalPages,
        currentpage: 1,
        totalrecords: paginatedfilteredData.count,
        startpageitemno: 2,
        endpageitemno: totalPages > 10 ? 6 : totalPages - 1,
      });
      setfilteredReqs(paginatedfilteredData.results);
    } catch (error) {
      console.error("Error fetching filtered jobs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [buildCleanFilters]);

  useEffect(() => {
    const recruiters = drop_down_employees.filter(
      (e) => e.can_recruit === true && e.department === 2
    );
    const sourcers = drop_down_employees.filter(
      (e) => e.can_source === true && e.department === 1
    );
    setfilterdropdowndata({
      clients: normalizeAndSort(drop_down_clients, "client_id", "client_name"),
      endClients: normalizeAndSort(drop_down_endClients, "end_client_id", "end_client_name"),
      jobstatuses: normalizeAndSort(drop_down_jobStatus, "job_status_id", "job_status"),
      recruiters: normalizeAndSort(recruiters, "employee_id", "emp_fName"),
      sourcers: normalizeAndSort(sourcers, "employee_id", "emp_fName"),
      roletypes: normalizeAndSort(drop_down_roleTypes, "role_type_id", "role_type"),
      accounts: normalizeAndSort(drop_down_accounts || [], "account_id", "account_name"),
    });
  }, [drop_down_clients, drop_down_endClients, drop_down_jobStatus, drop_down_employees, drop_down_roleTypes, drop_down_accounts]);

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



  const handlePageChange = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const cleanFilters = buildCleanFilters(page);
      const paginatedfilteredData = await getFilteredJobs(cleanFilters);

      const totalPages = paginationData.totalpages;
      let newStart = paginationData.startpageitemno;
      let newEnd = paginationData.endpageitemno;

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
    } finally {
      setIsLoading(false);
    }
  }, [buildCleanFilters, paginationData.totalpages, paginationData.startpageitemno, paginationData.endpageitemno]);

  if (!canView) {
    return <div className="no-access">You do not have permission to view this content.</div>;
  }


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
          <MultiSelect
            name="role_type"
            label="Job Type"
            options={filterdropdowndata.roletypes}
            value={selectedvalue.role_type}
            onChange={handleChange}
            placeholder="Select Job Type"
          />
        </Col>
        <Col md={3}>
          <MultiSelect
            name="job_status"
            label="Job Status"
            options={filterdropdowndata.jobstatuses}
            value={selectedvalue.job_status}
            onChange={handleChange}
            placeholder="Select Job Status"
          />
        </Col>
      </Row>
      <Row>
         <Col md={3}>
          <MultiSelect
            name="account"
            label="Account"
            options={filterdropdowndata.accounts}
            value={selectedvalue.account}
            onChange={handleChange}
            placeholder="Select Account"
          />
        </Col>
        <Col md={3}>
          <MultiSelect
            name="end_client"
            label="End Client"
            options={filterdropdowndata.endClients}
            value={selectedvalue.end_client}
            onChange={handleChange}
            placeholder="Select End Client"
          />
        </Col>
        <Col md={3}>
          <MultiSelect
            name="client"
            label="Client"
            options={filterdropdowndata.clients}
            value={selectedvalue.client}
            onChange={handleChange}
            placeholder="Select Client"
          />
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
      </Row>
      <Row>
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
        <Col className="col-job-title">Job</Col>
        <Col className="col-end-client">Job Opened Date</Col>
        <Col className="col-client">Client</Col>
        <Col className="col-recruiter">Recruiter</Col>
        <Col className="col-sourcer">Sourcer</Col>
        <Col className="col-job-type">Job Type</Col>
        <Col className="col-job-status">Job Status</Col>
        <Col className="col-action">Action</Col>
      </Row>

      {isLoading ? (
        <Row className="justify-content-center my-4">
          <Col className="text-center text-muted">Loading...</Col>
        </Row>
      ) : filteredReqs.length === 0 ? (
        <Row className="justify-content-center my-4">
          <Col className="text-center text-muted">No requirements found.</Col>
        </Row>
      ) : filteredReqs.map((req) => (
        <Row key={req.requirement_id} className="data-row">
          <Col className="col-job" onClick={() => handleShowSubmissions(req.requirement_id)}>
            {`${req.job_code}- ${req.job_title}`}
          </Col>
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
              onClick={() => handleEdit(req.requirement_id,req.assigned_recruiter,req.assigned_sourcer)}
            >
              <FaEdit />
            </button>
            <button
              aria-label="Delete"
              title="Delete"
              onClick={() => handleDelete(req.requirement_id,req.assigned_recruiter,req.assigned_sourcer)}
            >
              <FaTrash />
            </button>
          </Col>
        </Row>
      ))}

      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w" size="xl">
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
      <Modal show={showSubmissions} onHide={SubmissionshandleClose} dialogClassName="modal-90w" size="xl" >
        <Modal.Header closeButton>
         
        </Modal.Header>
        <Modal.Body style={{ width: '100% !important' }}>
          <SubmissionsofReqs requirmentid={currentReqid} />
        
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={SubmissionshandleClose}>
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
