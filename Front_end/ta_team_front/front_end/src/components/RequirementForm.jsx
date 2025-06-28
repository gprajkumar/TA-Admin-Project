import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RequirementForm.css"; // External CSS
import {
  getAccountManagers,
  getAccounts,
  getClients,
  getEndClients,
  getHiringManagers,
  getRoleTypes,
  getJobStatuses,
  getfilteredEmployees,
} from "../services/drop_downService";
import { Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import Alert from "react-bootstrap/Alert";
import { Await } from "react-router-dom";
import Dropdown_component from "./Dropdown_component";

const RequirementForm = ({ reqid,viewtype = false,externaldropdowndata}) => {
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState(reqid ? true : false);
  const [errors,setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    job_title: "",
    job_code: "",
    client: "",
    end_client: "",
    account: "",
    job_status: "",
    assigned_recruiter: "",
    assigned_sourcer: "",
    accountManager: "",
    hiringManager: "",
    role_type: "",
    notes: "",
    req_opened_date:"",
    no_of_positions:"1"
  });
  const [show, setShow] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    clients: [],
    endClients: [],
    accounts: [],
    jobStatuses: [],
    recruiters: [],
    sourcers: [],
    accountManagers: [],
    hiringManagers: [],
    roletypes: [],
  });
const OnhandleSelect = ({name,value}) =>
{
  setFormData((prevdata)=>({...prevdata,[name]:value}))

}

 
useEffect(() => {
  const fetchData = async () => {
    try {
      if (externaldropdowndata) {
       

        const [accountsRes, accountManagersRes, hiringManagersRes] = await Promise.all([
          getAccounts(),
          getAccountManagers(),
          getHiringManagers(),
        ]);

        setDropdownData({
          clients:externaldropdowndata.clients,
          endClients: externaldropdowndata.endClients,
          accounts: normalizeData(accountsRes, "account_id", "account_name"),
          jobStatuses: externaldropdowndata.jobstatuses,
          recruiters: externaldropdowndata.recruiters,
          sourcers: externaldropdowndata.sourcers,
          accountManagers: normalizeData(accountManagersRes, "account_manager_id", "account_manager"),
          hiringManagers: normalizeData(hiringManagersRes, "hiring_manager_id", "hiring_manager"),
          roletypes: externaldropdowndata.roletypes,
        });
      } else {
        const [
          clientsRes,
          endClientsRes,
          accountsRes,
          jobStatusesRes,
          recruitersRes,
          sourcersRes,
          accountManagersRes,
          hiringManagersRes,
          roletypeRes,
        ] = await Promise.all([
          getClients(),
          getEndClients(),
          getAccounts(),
          getJobStatuses(),
          getfilteredEmployees({ can_recruit: true, department: 2 }),
          getfilteredEmployees({ can_source: true, department: 1 }),
          getAccountManagers(),
          getHiringManagers(),
          getRoleTypes(),
        ]);

        setDropdownData({
          clients: normalizeData(clientsRes, "client_id", "client_name"),
          endClients: normalizeData(endClientsRes, "end_client_id", "end_client_name"),
          accounts: normalizeData(accountsRes, "account_id", "account_name"),
          jobStatuses: normalizeData(jobStatusesRes, "job_status_id", "job_status"),
          recruiters: normalizeData(recruitersRes, "employee_id", "emp_fName"),
          sourcers: normalizeData(sourcersRes, "employee_id", "emp_fName"),
          accountManagers: normalizeData(accountManagersRes, "account_manager_id", "account_manager"),
          hiringManagers: normalizeData(hiringManagersRes, "hiring_manager_id", "hiring_manager"),
          roletypes: normalizeData(roletypeRes, "role_type_id", "role_type"),
        });
      }

      if (reqid) {
        const res = await axios.get(`${baseurl}/ta_team/requirements/${reqid}/`);
        setFormData(res.data);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
    }
  };

  fetchData();
}, [reqid, externaldropdowndata]);

  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if(errors[name]){
      setErrors((preverrors)=>({...preverrors,[name]:""}))
    }
  };

  const validateForm = () =>
  {
    const newErrors = {};
    if (!formData.job_code.trim()) newErrors.job_code = "Job code is required";
  if (!formData.job_title.trim()) newErrors.job_title = "Job title is required";
  if (!formData.req_opened_date) 
    {newErrors.req_opened_date = "Date is required";}
  
  if (!formData.no_of_positions) newErrors.no_of_positions = "Number of positions is required";
  if (!formData.account) newErrors.account = "Account is required";
  if (!formData.client) newErrors.client = "Client is required";
  if (!formData.end_client) newErrors.end_client = "End client is required";
  if (!formData.hiringManager) newErrors.hiringManager = "Hiring manager is required";
  if (!formData.assigned_recruiter) newErrors.assigned_recruiter = "Assigned recruiter is required";
  if (!formData.assigned_sourcer) newErrors.assigned_sourcer = "Assigned sourcer is required";
  if (!formData.role_type) newErrors.role_type = "Job type is required";
  if (!formData.job_status) newErrors.job_status = "Job status is required";
  if (!formData.accountManager) newErrors.accountManager = "Account manager is required";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
  }
  const resetform = () => {
    setFormData({
      job_title: "",
      job_code: "",
      client: "",
      end_client: "",
      account: "",
      job_status: "",
      assigned_recruiter: "",
      assigned_sourcer: "",
      accountManager: "",
      hiring_manager: "",
      role_type: "",
      notes: "",
       req_opened_date:"",
       no_of_positions:""
       
    });
    setErrors({})
  };

  const normalizeData = (data, idKey, nameKey) =>
    data.map((item) => ({ id: item[idKey], name: item[nameKey] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateForm())
    {
      return
    }

    try {
      if(!reqid)
      {
      await axios.post(`${baseurl}/ta_team/requirements/`, formData);
      setShow(true);
      resetform();
      }
      else
      {
        await axios.put(`${baseurl}/ta_team/requirements/${reqid}/`,formData);
        setShow(true);
      resetform();
      }
    } catch (err) {
      console.error("Error submitting requirement:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
      }
      alert("Submission failed");
    }
  };

 const renderSelect = (name, label, options) => {
  const selectOptions = (options || []).map((opt) => ({
    value: opt.id,
    label: opt.name,
  }));

  const selectedOption = selectOptions.find(
    (opt) => opt.value === formData[name]
  );
  const hasError = !!errors[name];

  return (
    <Form.Group className="mb-3">
      <Form.Label className="fs-6">{label}<span style={{ color: "red" }}>*</span>:</Form.Label>
      <Select
        classNamePrefix="my-select"
        options={selectOptions}
        value={selectedOption || null}
        isDisabled={viewtype}
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
            '&:hover': {
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

if(loading)
{
   return  <div className="text-center">Loading requirement...</div>;
}
else
{
  return (
    <Form onSubmit={handleSubmit} className="requirement-form container">
      <h2 className="mb-4">{viewtype ? '' : (reqid ? 'Edit' : 'Create')} Requirement</h2>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="job_code">
            <Form.Label className="fs-6">Job Code<span style={{ color: "red" }}>*</span>:</Form.Label>
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
            <Form.Label className="fs-6">Job Title<span style={{ color: "red" }}>*</span>:</Form.Label>
            <Form.Control
              type="input"
              placeholder="Enter Job Title"
              minLength={5}
              maxLength={200}
              name="job_title"   disabled={viewtype}
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
            <Form.Label className="fs-6">Date Req Opened<span style={{ color: "red" }}>*</span>:</Form.Label>
             <Form.Control
              type="date"
              placeholder="Enter Job Open Date"
              name="req_opened_date"   disabled={viewtype}
         min="2024-01-01"               // 👈 Earliest allowed date
    max={new Date().toISOString().split("T")[0]}  // 👈 Today’s date
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
            <Form.Label className="fs-6">No of Positions<span style={{ color: "red" }}>*</span>:</Form.Label>
            <Form.Control
              type="Number"
              min={1}
              max={5}
              placeholder="Enter No of Positions"
              name="no_of_positions"   disabled={viewtype}
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
        
            {renderSelect("account", "Account", dropdownData.accounts)}
         
        </Col>
        <Col md={6}>
        {/* implement this to also dropdown */}
         <Dropdown_component name={"end_client"} label={"End Client"} error= {errors.end_client} options={dropdownData.endClients} onSelect={OnhandleSelect} value={formData.end_client}/>
            {/* {renderSelect("end_client", "End Client", dropdownData.endClients)} */}
        
        </Col>
      </Row>
      <Row>
        <Col md={6}>
         
            {renderSelect("client", "Client", dropdownData.clients)}
       
        </Col>
        <Col md={6}>
          
            {renderSelect(
              "hiringManager",
              "Hiring Manager",
              dropdownData.hiringManagers
            )}

          
        </Col>
      </Row>
      <Row>
        <Col md={6}>
        
            {renderSelect(
              "assigned_recruiter",
              "Recruiter",
              dropdownData.recruiters
            )}
   
        </Col>
        <Col md={6}>
        
            {renderSelect("assigned_sourcer", "Sourcer", dropdownData.sourcers)}
       
        </Col>
      </Row>
      <Row>
        <Col md={6}>
       
            {renderSelect("role_type", "Job Type", dropdownData.roletypes)}
      
        </Col>
        <Col md={6}>
        
            {renderSelect(
              "job_status",
              "Current Status",
              dropdownData.jobStatuses
            )}
     
        </Col>
      </Row>
      <Row>
        <Col md={6}>
        
            {renderSelect(
              "accountManager",
              "Account Manager",
              dropdownData.accountManagers
            )}
      
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="jobnote">
            <Form.Label className="fs-6">Note:</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Enter Note"
              maxLength={2000}
              name="notes"   disabled={viewtype}
              value={formData.notes}
              onChange={handleChange}
            />
         
          </Form.Group>
        </Col>
      </Row>
      <Row>
      <Alert show={show} variant="success">
        <Alert.Heading>Hurray!</Alert.Heading>
        <p>Requirement {reqid ? 'updated' : 'added'} Successfully</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-success">
            Ok
          </Button>
        </div>
      </Alert>
      </Row>
      <Row className="mt-4">
  {!viewtype && (
    <Col>
      <div className="d-flex justify-content-center gap-3">
        <Button className="submit-button" type="submit">
          {reqid ? 'Update' : 'Submit'} Requirement
        </Button>
        <Button className="submit-button" type="button" onClick={resetform}>
          Reset
        </Button>
      </div>
    </Col>
  )}
      </Row>
    </Form>
  );
}
};

export default RequirementForm;
