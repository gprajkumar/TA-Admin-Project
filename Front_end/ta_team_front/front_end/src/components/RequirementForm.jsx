import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RequirementForm.css'; // External CSS
import {getAccountManagers,getAccounts,getClients,getEndClients,getHiringManagers,getRecruiters,getSourcers,getSources,getRoleTypes,getJobStatuses} from '../services/drop_downService'
import { Form, Row, Col, Button } from 'react-bootstrap';

const RequirementForm = () => {
  const baseurl = import.meta.env.VITE_API_BASE_URL
  const [formData, setFormData] = useState({
  job_title: '',
  job_code: '',
  client: '',
  end_client: '',
  account: '',
  job_status: '',
  assigned_recruiter: '',
  assigned_sourcer: '',
  accountManager: '',
  hiring_manager: '',
  role_type: '',  
  notes: ''
  });

  const [dropdownData, setDropdownData] = useState({
    clients: [],
    endClients: [],
    accounts: [],
    jobStatuses: [],
    recruiters: [],
    sourcers: [],
    accountManagers: [],
    hiringManagers: [],
    roletypes: []
  });

  useEffect(() => {
 
    const fetchData = async () => {
      try {
        const [
          clientsRes,
          endClientsRes,
          accountsRes,
          jobStatusesRes,
          recruitersRes,
          sourcersRes,
          accountManagersRes,
          hiringManagersRes,
          roletypeRes
        ] = await Promise.all(
          [ getClients(),
  getEndClients(),
  getAccounts(),
  getJobStatuses(),
  getRecruiters(),
  getSourcers(),
  getAccountManagers(),
  getHiringManagers(),
  getRoleTypes()
          
        ]);

        setDropdownData({
          clients: normalizeData(clientsRes, "client_id", "client_name"),
          endClients: normalizeData(endClientsRes, "end_client_id", "end_client_name"),
          accounts: normalizeData(accountsRes, "account_id", "account_name"),
          jobStatuses: normalizeData(jobStatusesRes, "job_status_id", "job_status"),
          recruiters: normalizeData(recruitersRes, "recruiter_id", "recruiter_name"),
          sourcers: normalizeData(sourcersRes, "sourcer_id", "sourcer_name"),
          accountManagers: normalizeData(accountManagersRes, "account_manager_id", "account_manager"),
          hiringManagers: normalizeData(hiringManagersRes, "hiring_manager_id", "hiring_manager"),
          roletypes: normalizeData(roletypeRes, "role_type_id", "role_type")
        });
      } catch (err) {
        console.error('Error fetching dropdown data:', err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 
  const normalizeData = (data, idKey, nameKey) =>
    data.map(item => ({ id: item[idKey], name: item[nameKey] }));


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log(formData)
    try {
      await axios.post(`${baseurl}/ta_team/requirements/`, formData);
      alert('Requirement submitted successfully');
    } catch (err) {
  console.error('Error submitting requirement:', err);
  if (err.response) {
    console.error('Response data:', err.response.data);
  }
  alert('Submission failed');
    }
  };

  const renderSelect = (name, label, options) => (
    <div className="form-group mb-3">

      <select name={name} value={formData[name]} onChange={handleChange} className="form-control">
        <option value="">Select {label}</option>
        {(Array.isArray(options) ? options : []).map(opt => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit} className="requirement-form container">
      <h2 className="mb-4">Create Requirement</h2>
      <Row>
        <Col md={6}>
      <Form.Group className="mb-3 " controlId="job_code">
        <Form.Label className='fs-5' >Job Code:</Form.Label>
        <Form.Control type="input" placeholder="Enter Job Code" name="job_code" value={formData.job_code} onChange={handleChange} />
      </Form.Group>
      </Col>
      <Col md={6}>
      <Form.Group className="mb-3" controlId="job_title">
         <Form.Label className='fs-5' >Job Title:</Form.Label>
      <Form.Control type='input' placeholder='Enter Job Title' name='job_title' value={formData.job_title} onChange={handleChange}/>
      </Form.Group>
      </Col>
      </Row>
    <Row>
      <Col md={6}>
      <Form.Group className="mb-3 " controlId="account">
         <Form.Label className='fs-5' >Account:</Form.Label>
       {renderSelect("account","Account",dropdownData.accounts)}
      </Form.Group>
      </Col>
      <Col md={6}>
      <Form.Group className="mb-3" controlId="EndClient">
   <Form.Label className='fs-5' >End Client:</Form.Label>
       {renderSelect("end_client","End Client",dropdownData.endClients)}
      </Form.Group>
      </Col>
      </Row>
      <Row>
      <Col md={6}>
      <Form.Group className="mb-3 " controlId="Client">
         <Form.Label className='fs-5' >Client:</Form.Label>
       {renderSelect("client","Client",dropdownData.clients)}
      </Form.Group>
      </Col>
      <Col md={6}>
      <Form.Group className="mb-3" controlId="HiringManager">
   <Form.Label className='fs-5' >Hiring Manager:</Form.Label>
       {renderSelect("hiring_manager","Hiring Manager",dropdownData.hiringManagers)}
      </Form.Group>
      </Col>
      </Row>
          <Row>
      <Col md={6}>
      <Form.Group className="mb-3 " controlId="recruiter">
         <Form.Label className='fs-5' >Assigned Recruiter:</Form.Label>
       {renderSelect("assigned_recruiter","Recruiter",dropdownData.recruiters)}
      </Form.Group>
      </Col>
      <Col md={6}>
      <Form.Group className="mb-3" controlId="sourcer">
   <Form.Label className='fs-5' >Assigned Sourcer:</Form.Label>
       {renderSelect("assigned_sourcer","Sourcer",dropdownData.sourcers)}
      </Form.Group>
      </Col>
      </Row>
             <Row>
      <Col md={6}>
      <Form.Group className="mb-3 " controlId="Jobtype">
         <Form.Label className='fs-5' >Job Type:</Form.Label>
       {renderSelect("role_type","Job Type",dropdownData.roletypes)}
      </Form.Group>
      </Col>
      <Col md={6}>
      <Form.Group className="mb-3" controlId="jobstatus">
   <Form.Label className='fs-5' >Job Status:</Form.Label>
       {renderSelect("job_status","Current Status",dropdownData.jobStatuses)}
      </Form.Group>
      </Col>
      </Row>
               <Row>
      <Col md={6}>
      <Form.Group className="mb-3 " controlId="accountmanager">
         <Form.Label className='fs-5' >Account Manager:</Form.Label>
       {renderSelect("accountManager","Account Manager",dropdownData.accountManagers)}
      </Form.Group>
      </Col>
      <Col md={6}>
      <Form.Group className="mb-3" controlId="jobnote">
   <Form.Label className='fs-5' >Note:</Form.Label>
      <Form.Control as="textarea" rows={2}  placeholder="Enter Note" name="notes" value={formData.notes} onChange={handleChange} />
      </Form.Group>
      </Col>
      </Row>
       <Button  className='submit-button' type='submit'>
        Submit Requirement
      </Button>
    </Form>
    
  );
};

export default RequirementForm;
