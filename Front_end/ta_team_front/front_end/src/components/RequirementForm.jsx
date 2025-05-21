import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RequirementForm.css'; // External CSS


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
    offer_date: '',
    filled_by_recruiter: '',
    filled_by_sourcer: '',
    accountManager: '',
    hiringManager: '',
    filled_source: '',
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
    sources: []
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
          sourcesRes,
          roletypeRes
        ] = await Promise.all([
          axios.get(`${baseurl}/ta_team/clients`),
          axios.get(`${baseurl}/ta_team/endclients`),
          axios.get(`${baseurl}/ta_team/accounts`),
          axios.get(`${baseurl}/ta_team/jobstatuses`),
          axios.get(`${baseurl}/ta_team/recruiters`),
          axios.get(`${baseurl}/ta_team/sourcers`),
          axios.get(`${baseurl}/ta_team/accountmanagers`),
          axios.get(`${baseurl}/ta_team/hiringmanagers`),
          axios.get(`${baseurl}/ta_team/sources`),
          axios.get(`${baseurl}/ta_team/roletypes`)
        ]);

        setDropdownData({
          clients: normalizeData(clientsRes.data, "client_id", "client_name"),
          endClients: normalizeData(endClientsRes.data, "end_client_id", "end_client_name"),
          accounts: normalizeData(accountsRes.data, "account_id", "account_name"),
          jobStatuses: normalizeData(jobStatusesRes.data, "job_status_id", "job_status"),
          recruiters: normalizeData(recruitersRes.data, "recruiter_id", "recruiter_name"),
          sourcers: normalizeData(sourcersRes.data, "sourcer_id", "sourcer_name"),
          accountManagers: normalizeData(accountManagersRes.data, "account_manager_id", "account_manager"),
          hiringManagers: normalizeData(hiringManagersRes.data, "hiring_manager_id", "hiring_manager"),
          sources: normalizeData(sourcesRes.data, "source_id", "source"),
          roletypes: normalizeData(roletypeRes.data, "role_type_id", "role_type")
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
    try {
      await axios.post(`${baseurl}/ta_team/requirements/`, formData);
      alert('Requirement submitted successfully');
    } catch (err) {
      console.error('Error submitting requirement:', err);
      alert('Submission failed');
    }
  };

  const renderSelect = (name, label, options) => (
    <div className="form-group mb-3">
      <label>{label}:</label>
      <select name={name} value={formData[name]} onChange={handleChange} className="form-control">
        <option value="">Select {label}</option>
        {(Array.isArray(options) ? options : []).map(opt => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="requirement-form container">
      <h2 className="mb-4">Create Requirement</h2>
      <div className="row">
        {/* Left Column */}
        <div className="col-md-6">
         

          <div className="form-group mb-3">
            <label>Job Code:</label>
            <input
              name="job_code"
              type="text"
              value={formData.job_code}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <label>Job Title:</label>
            <input
              name="job_title"
              type="text"
              value={formData.job_title}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          {renderSelect('client', 'Client', dropdownData.clients)}
          {renderSelect('end_client', 'End Client', dropdownData.endClients)}
          {renderSelect('account', 'Account', dropdownData.accounts)}
          {renderSelect('job_status', 'Job Status', dropdownData.jobStatuses)}
          {renderSelect('offer_date', 'Offer Date', [])}
          {renderSelect('role_types', 'Role Type', dropdownData.roletypes)}
        </div>

        {/* Right Column */}
        <div className="col-md-6">
          {renderSelect('assigned_recruiter', 'Assigned Recruiter', dropdownData.recruiters)}
          {renderSelect('assigned_sourcer', 'Assigned Sourcer', dropdownData.sourcers)}
          {renderSelect('filled_by_recruiter', 'Filled by Recruiter', dropdownData.recruiters)}
          {renderSelect('filled_by_sourcer', 'Filled by Sourcer', dropdownData.sourcers)}
          {renderSelect('accountManager', 'Account Manager', dropdownData.accountManagers)}
          {renderSelect('hiringManager', 'Hiring Manager', dropdownData.hiringManagers)}
          {renderSelect('filled_source', 'Filled Source', dropdownData.sources)}

          <div className="form-group mb-3">
            <label>Notes:</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-control"
              rows="3"
            />
          </div>
        </div>
      </div>
      <div className="text-center">
      <button type="submit" className="submit-button">Submit Requirement</button>
      </div>
    </form>
  );
};

export default RequirementForm;
