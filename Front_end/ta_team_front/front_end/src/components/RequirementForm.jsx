import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RequirementForm.css"; // External CSS
import {
  getAccountManagers,
  getAccounts,
  getClients,
  getEndClients,
  getHiringManagers,
  getRecruiters,
  getSourcers,
  getSources,
  getRoleTypes,
  getJobStatuses,
  getfilteredEmployees,
} from "../services/drop_downService";
import { Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import Alert from "react-bootstrap/Alert";
import { Await } from "react-router-dom";

const RequirementForm = ({ reqid,viewtype = false,externaldropdowndata}) => {
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState(reqid ? true : false);
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
    no_of_positions:""
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
  };

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
  };

  const normalizeData = (data, idKey, nameKey) =>
    data.map((item) => ({ id: item[idKey], name: item[nameKey] }));

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    // Find the selected option in react-select's format
    const selectedOption = selectOptions.find(
      (opt) => opt.value === formData[name]
    );

    return (
      <div className="mb-3">
        <Select
          classNamePrefix="my-select"
          options={selectOptions}
          value={selectedOption || null}   isDisabled={viewtype}
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
            <Form.Label className="fs-6">Job Code:</Form.Label>
            <Form.Control
              type="input"
              placeholder="Enter Job Code"
              name="job_code"
              disabled={viewtype}
              value={formData.job_code}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="job_title">
            <Form.Label className="fs-6">Job Title:</Form.Label>
            <Form.Control
              type="input"
              placeholder="Enter Job Title"
              name="job_title"   disabled={viewtype}
              value={formData.job_title}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
        <Row>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="req_opened_date">
            <Form.Label className="fs-6">Date Req Opened:</Form.Label>
             <Form.Control
              type="date"
              placeholder="Enter Job Open Date"
              name="req_opened_date"   disabled={viewtype}
              value={formData.req_opened_date}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      <Col md={6}>
          <Form.Group className="mb-3" controlId="no_of_positions">
            <Form.Label className="fs-6">No of Positions:</Form.Label>
            <Form.Control
              type="input"
              placeholder="Enter No of Positions"
              name="no_of_positions"   disabled={viewtype}
              value={formData.no_of_positions}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
     
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="account">
            <Form.Label className="fs-6">Account:</Form.Label>
            {renderSelect("account", "Account", dropdownData.accounts)}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="EndClient">
            <Form.Label className="fs-6">End Client:</Form.Label>
            {renderSelect("end_client", "End Client", dropdownData.endClients)}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="Client">
            <Form.Label className="fs-6">Client:</Form.Label>
            {renderSelect("client", "Client", dropdownData.clients)}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="HiringManager">
            <Form.Label className="fs-6">Hiring Manager:</Form.Label>
            {renderSelect(
              "hiringManager",
              "Hiring Manager",
              dropdownData.hiringManagers
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="recruiter">
            <Form.Label className="fs-6">Assigned Recruiter:</Form.Label>
            {renderSelect(
              "assigned_recruiter",
              "Recruiter",
              dropdownData.recruiters
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="sourcer">
            <Form.Label className="fs-6">Assigned Sourcer:</Form.Label>
            {renderSelect("assigned_sourcer", "Sourcer", dropdownData.sourcers)}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="Jobtype">
            <Form.Label className="fs-6">Job Type:</Form.Label>
            {renderSelect("role_type", "Job Type", dropdownData.roletypes)}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="jobstatus">
            <Form.Label className="fs-6">Job Status:</Form.Label>
            {renderSelect(
              "job_status",
              "Current Status",
              dropdownData.jobStatuses
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="accountmanager">
            <Form.Label className="fs-6">Account Manager:</Form.Label>
            {renderSelect(
              "accountManager",
              "Account Manager",
              dropdownData.accountManagers
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="jobnote">
            <Form.Label className="fs-6">Note:</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Enter Note"
              name="notes"   disabled={viewtype}
              value={formData.notes}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
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
{viewtype ? null: <>
      <Button className="submit-button" type="submit">
        {reqid? 'Update':'Submit'} Requirement
      </Button>
      <Button className="submit-button" type="button" onClick={resetform}>
        Reset
      </Button></>}
    </Form>
  );
}
};

export default RequirementForm;
