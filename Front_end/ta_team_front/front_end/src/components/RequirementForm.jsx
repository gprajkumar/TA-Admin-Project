// src/components/RequirementForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RequirementForm = () => {
  // State for form fields
  const [jobTitle, setJobTitle] = useState('');
  const [jobCode, setJobCode] = useState('');
  const [client, setClient] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [assignedRecruiter, setAssignedRecruiter] = useState('');
  const [offerDate, setOfferDate] = useState('');
  const [clients, setClients] = useState([]);
  const [jobStatuses, setJobStatuses] = useState([]);
  const [recruiters, setRecruiters] = useState([]);

  // Fetch clients, job statuses, and recruiters for dropdowns
  useEffect(() => {
    // Fetch clients
    axios.get('http://127.0.0.1:8000/api/clients/')
      .then(response => {
        setClients(response.data);
      })
      .catch(error => {
        console.error('Error fetching clients:', error);
      });

    // Fetch job statuses
    axios.get('http://127.0.0.1:8000/api/job_statuses/')
      .then(response => {
        setJobStatuses(response.data);
      })
      .catch(error => {
        console.error('Error fetching job statuses:', error);
      });

    // Fetch recruiters
    axios.get('http://127.0.0.1:8000/api/recruiters/')
      .then(response => {
        setRecruiters(response.data);
      })
      .catch(error => {
        console.error('Error fetching recruiters:', error);
      });
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Post data to Django API
    axios.post('http://127.0.0.1:8000/ta_admin/requirements', {
      job_title: jobTitle,
      job_code: jobCode,
      client: client,
      job_status: jobStatus,
      assigned_recruiter: assignedRecruiter,
      offer_date: offerDate,
    })
    .then(response => {
      console.log('Requirement created successfully:', response.data);
      alert('Requirement created successfully!');
    })
    .catch(error => {
      console.error('There was an error creating the requirement!', error);
    });
  };

  return (
    <div>
      <h1>Create a New Requirement</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Job Title:
          <input 
            type="text" 
            value={jobTitle} 
            onChange={(e) => setJobTitle(e.target.value)} 
          />
        </label>
        <br />
        <label>
          Job Code:
          <input 
            type="text" 
            value={jobCode} 
            onChange={(e) => setJobCode(e.target.value)} 
          />
        </label>
        <br />
        
        {/* Dropdown for Clients */}
        <label>
          Client:
          <select 
            value={client} 
            onChange={(e) => setClient(e.target.value)} 
          >
            <option value="">Select a Client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>
        <br />

        {/* Dropdown for Job Status */}
        <label>
          Job Status:
          <select 
            value={jobStatus} 
            onChange={(e) => setJobStatus(e.target.value)} 
          >
            <option value="">Select a Job Status</option>
            {jobStatuses.map(status => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </label>
        <br />

        {/* Dropdown for Assigned Recruiter */}
        <label>
          Assigned Recruiter:
          <select 
            value={assignedRecruiter} 
            onChange={(e) => setAssignedRecruiter(e.target.value)} 
          >
            <option value="">Select a Recruiter</option>
            {recruiters.map(recruiter => (
              <option key={recruiter.id} value={recruiter.id}>
                {recruiter.name}
              </option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Offer Date:
          <input 
            type="date" 
            value={offerDate} 
            onChange={(e) => setOfferDate(e.target.value)} 
          />
        </label>
        <br />
        
        <button type="submit">Create Requirement</button>
      </form>
    </div>
  );
};

export default RequirementForm;
