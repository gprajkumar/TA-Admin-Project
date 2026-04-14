import axiosInstance from "../services/axiosInstance";
import React, { useState, useEffect, useCallback, use } from "react";
import Select from "react-select";
import "./RequirementForm.css";
import {
  getSources,
  getfilteredEmployees,
  getJobreqs,
} from "../services/drop_downService";
import { Form, Row, Col, Button } from "react-bootstrap";
import { hasPermission,canEdit } from "../services/utilities/rbac";
import useCalTAT from "../services/customHooks/useCalTAT";
import { normalizeData } from "../services/utilities/utilities";
import Loader from "./sharedComponents/Loader";
import Dropdown_component from "./sharedComponents/Dropdown_component";
import CustomAlert from "./sharedComponents/Alert";
import CustomAsyncSelect from "./sharedComponents/CustomAsyncSelect";
import { useSelector } from "react-redux";
import { current } from "@reduxjs/toolkit";

const Submission = ({ submission_id,viewtype = false,externaldropdowndata,onSuccess,
  onClose}) => {
  const [loading, setLoading] = useState(submission_id ? true : false); 
  const[fetchedJobs,setFetchedJobs] = useState([]);
  const[submissionHistory,setSubmissionHistory] = useState([]); 
  const baseurl = import.meta.env.VITE_API_BASE_URL;
      const [errors,setErrors] = useState({});
      const initialFormData = {
    Job: "",
    submission_date: "",
    candidate_name: "",
    payrate: "",
    w2_C2C: "",
    recruiter: "",
    sourcer: "",
    source: "",
    am_sub_date: "",
    am_screen_date: "",
    tech_screen_date: "",
    client_sub_date: "",
    client_interview_date: "",
    offer_date: "",
    start_date: "",
    turn_around_time: "",
    current_new_status: "",
    loop_closed: false,
    loop_closed_date: null,
    loop_closed_reason: "",
    status_update_submission_date: "",
    current_status: ""
      }
const emp_permissions = useSelector((state) => state.master_dropdown.permissions);
const submissionStatuses = useSelector((state) => state.master_dropdown.submissionstatuses ?? []);
const canEditSubmission = () => {
  if(canEdit(emp_permissions,"submissions") || canEdit(emp_permissions,"submissions",true)){
    return true;
  } 
}
const[alertConfig,setAlertConfig] = useState({show: false, message:"", type:""});
  const [formData, setFormData] = useState(initialFormData);
   const loadOptions = async (inputValue) => {
   const res = await axiosInstance.get( `${baseurl}/ta_team/requirement-search`, {
     params: { q: inputValue }
   });
 setFetchedJobs(res.data);
   return res.data.map(job => ({
     label: `${job.job_code}-${job.job_title} `,
     value: job.requirement_id
   }));
 };  
 useEffect(() => {
  if(alertConfig.show){
    closeAlert();
  }
  return () => {
    clearTimeout(closeAlert);
  };  
 }, [alertConfig.show]);
 const closeAlert=() =>{
  setTimeout(() => {  
    setAlertConfig(prev => ({ ...prev, show: false }));
  }, 3000);
  
}
const OnhandleSelect = useCallback(
    ({ name, value }) => {  setFormData((prevdata) => ({ ...prevdata, [name]: value })); },
    [setFormData] );
  const validationform = () =>
  {

    const newError ={};
    if(!formData.Job)  newError.job = "Please Select Job";
    if(!formData.submission_date)  newError.submission_date = "Please Select submission_date";
    if(!formData.candidate_name)  newError.candidate_name = "Please Select candidate_name";
    if(!formData.recruiter)  newError.recruiter = "Please Select recruiter";
      if(!formData.sourcer)  newError.sourcer = "Please Select sourcer";
    if(!formData.source)  newError.source = "Please Select source";
    setErrors(newError)
return Object.keys(newError).length === 0;

  }
const resetform = () =>
{
    setFormData(initialFormData);  
    
}
  const [dropdownData, setDropdownData] = useState({
   
    recruiters: [],
    sourcers: [],
    sources: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (externaldropdowndata) {
          setDropdownData({
            recruiters: externaldropdowndata.recruiters || [],
            sourcers: externaldropdowndata.sourcers || [],
            sources: externaldropdowndata.sources || [],
          });
        } else {
          const [recruitersRes, sourcersRes, sourceres] = await Promise.all([
            getfilteredEmployees({ can_recruit: true }),
            getfilteredEmployees({ can_source: true }),
            getSources(),
          ]);
          setDropdownData({
            recruiters: normalizeData(recruitersRes, "employee_id", "emp_fName"),
            sourcers: normalizeData(sourcersRes, "employee_id", "emp_fName"),
            sources: normalizeData(sourceres, "source_id", "source"),
          });
        }

        if (submission_id) {
          const [SubRes, HistoryRes] = await Promise.all([
            axiosInstance.get(`/ta_team/submissions/${submission_id}/`),
            axiosInstance.get(`/ta_team/submission-history/?submission_id=${submission_id}`),
          ]);
          const subData = SubRes.data;
          const historyData = HistoryRes.data;
          setSubmissionHistory(historyData);
          const historyEntry = historyData.find(h => h.status === subData.current_new_status);
          setFormData({
            ...subData,
            status_update_submission_date: historyEntry ? historyEntry.status_date : subData.status_update_submission_date || "",
          });
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };

    fetchData();
  }, [submission_id]);
     
  const cleanFormData = (data) => {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value === "" ? null : value])
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!validationform())
    {
     
      return
    }

    try {
      
      if(!submission_id)
      {
        const payload = {...cleanFormData(formData), loop_closed_date: formData.loop_closed_date || null, current_new_status: submissionStatuses.length > 0 ? submissionStatuses.find(s => s.main_table_field === "submission_date")?.status_id || null:null,current_status:submissionStatuses.length > 0 ? submissionStatuses.find(s => s.main_table_field === "submission_date")?.status_name || null:null};
        console.log("Form data to be submitted for creation:", payload);
      await axiosInstance.post(`/ta_team/submissions/`, payload);
      setAlertConfig({show: true, message:"Submitted successfully", type:"success"});
      resetform();
      }
      else
      {
          const payload = {...cleanFormData(formData), loop_closed_date: formData.loop_closed_date || null, current_new_status: formData.current_new_status || null};
      console.log("Form data to be submitted for update:", formData);
        await axiosInstance.patch(`/ta_team/submissions/${submission_id}/`, payload);
        setAlertConfig({show: true, message:"Updated successfully", type:"success"});
        await onSuccess?.();
        onClose?.();
 

      }
    } catch (err) {
      console.error("Error submitting requirement:", err);
      
  
      if (err.response) {
        console.error("Response data:", err.response.data);
      }
     <CustomAlert message={"Submission Failed"} type="error" />
      alert("Submission Failed");
    }
  };
  
const tat =useCalTAT(formData.submission_date, fetchedJobs, formData.Job);
useEffect(() => {
  if (tat !== null && tat !== undefined && tat !== formData.turn_around_time) {
    setFormData((prev) => ({
      ...prev,
      turn_around_time: tat
    }));
  }
}, [tat]);
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
      <Form.Label className="fs-6">{label}{name != "w2_C2C" && <span style={{ color: "red" }}>*</span>}:</Form.Label>
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

  const handleChange = (e) => {
    const { name, value } = e.target;
  setFormData((prev) => {
    const updatedForm = { ...prev, [name]: name === "loop_closed_date" ? (value || null) : value  };

    if (name === "submission_date") {
      updatedForm["am_sub_date"] = value;
    }
    if (name === "current_new_status") {
      const historyEntry = submissionHistory.find(h => h.status === value);
      updatedForm["status_update_submission_date"] = historyEntry ? historyEntry.status_date : "";
    }
    if (name === "status_update_submission_date") {
      const selectedStatus = submissionStatuses.find(s => s.status_id === prev.current_new_status);
      if (selectedStatus?.main_table_field) {
        updatedForm[selectedStatus.main_table_field] = value;
      }
      updatedForm["current_status"]=selectedStatus?.status_name || "";
    }
    if(errors[name]){
      setErrors((preverrors)=>({...preverrors,[name]:""}))
    }
    return updatedForm;
  });
  };
  if(!canEditSubmission()){
    return (
      <div className="no-access">   
        <h2>Access Denied</h2>
        <p>You do not have permission to {submission_id ? "edit" : "create"} submission.</p>
      </div>
    );
  }

  if(loading)
{
   return <Loader />;
}
else
{
  return (
    <Form onSubmit={handleSubmit} className="requirement-form">
      <Row>
        <Col md={12}>
        <CustomAlert message={alertConfig.message} type={alertConfig.type} show={alertConfig.show} onClose={() => setAlertConfig(prev => ({ ...prev, show: false }))} />
        </Col>
      </Row>
      <h2 className="mb-4">{submission_id && "Edit "}Candidate Submission</h2>
      {!submission_id &&
      <Row>
        <Col md={12}>
           <Form.Group className="mb-3 " controlId="job">
                    <Form.Label className="fs-6">Job<span style={{ color: "red" }}>*</span>:</Form.Label>
       <CustomAsyncSelect placeholder={"Search job by title or ID"} loadOptions={loadOptions} name="Job" onChange={handleChange} error={errors.job}/>
          

       </Form.Group>
        </Col>
      </Row>
}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="submission_date">
            <Form.Label className="fs-6">Submission Date<span style={{ color: "red" }}>*</span>:</Form.Label>
            <Form.Control
             isInvalid={!!errors.submission_date}
              type="Date"
              name="submission_date"
              max={new Date().toISOString().split("T")[0]}
              value={formData.submission_date}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.submission_date}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="candidate_name">
            <Form.Label className="fs-6">Candidate Name<span style={{ color: "red" }}>*</span>:</Form.Label>
            <Form.Control
              type="input"
               isInvalid={!!errors.candidate_name}
              name="candidate_name"
              value={formData.candidate_name}
              onChange={handleChange}
            />
            <Form.Control.Feedback type = 'invalid'>
              {errors.candidate_name}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Form.Group className="mb-3 " controlId="payrate">
            <Form.Label className="fs-6">Payrate in $:</Form.Label>
            <Form.Control
              type="input"
              name="payrate"
              value={formData.payrate}
              onChange={handleChange}
            />
             
          </Form.Group>
        </Col>
        <Col md={3}>
          
           {renderSelect("w2_C2C","Tax Terms",[{id:'W2', name:'W2'}, {id:'C2C', name:'C2C'}])}
        </Col>
         <Col md={6}>
         
          {renderSelect("source","Source",dropdownData.sources)}
         
        </Col>
      </Row>
    <Row>
      <Col md={5}>
     
       {renderSelect("recruiter","Recruiter",dropdownData.recruiters)}
  
      </Col>
      <Col md={5}>
   
       {renderSelect("sourcer","Sourcer",dropdownData.sourcers)}
      
      </Col>
      <Col md="auto" className="d-flex align-items-center">
      {formData.turn_around_time && <div className="jobs-found">
            <span className="jobs-found-label">TAT</span>
            <span className="jobs-found-count ms-2">{formData.turn_around_time}</span>
          </div>}
      </Col>
      </Row>
       {submission_id &&
       <div className="loop-closed-area">
     <Row>
     
      <Col md={2}>
       <Form.Label className="fs-6">Loop Closed:</Form.Label>
      <Form.Check style={{display:"inline"}} type="checkbox" name="loop_closed" checked={formData.loop_closed} onChange={(e) => handleChange({ target: { name: "loop_closed", value: e.target.checked } })} />

      
  
      </Col>
      <Col md={4}>
   
      <Form.Label className="fs-6 ">Loop Closed Date:</Form.Label>
      <Form.Control type="Date" name="loop_closed_date" value={formData.loop_closed_date || ""} onChange={handleChange} disabled={!formData.loop_closed} min={formData.submission_date} max={new Date().toISOString().split("T")[0]} />
      </Col>
      <Col md={6}>
   
      <Form.Label className="fs-6">Loop Closed Reason:</Form.Label>
      <Form.Control as="textarea"  className="fs-6" rows={3} name="loop_closed_reason" value={formData.loop_closed_reason} onChange={handleChange} disabled={!formData.loop_closed} maxLength={199} />
      </Col>
      
      </Row>
      </div>
}
    {submission_id && (
      <div className="status-dates-area mt-3">
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fs-6">Current Status:</Form.Label>
              <Select
                classNamePrefix="my-select"
                options={submissionStatuses.map(s => ({ value: s.status_id, label: s.status_name }))}
                value={submissionStatuses.map(s => ({ value: s.status_id, label: s.status_name })).find(opt => opt.value === formData.current_new_status) || null}
                onChange={(selected) => handleChange({ target: { name: "current_new_status", value: selected ? selected.value : "" } })}
                placeholder="Select Status"
                isClearable
              />
            </Form.Group>
          </Col>
        </Row>
        {formData.current_new_status && (
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fs-6">
                  {submissionStatuses.find(s => s.status_id === formData.current_new_status)?.status_name} Date:
                </Form.Label>
                <Form.Control
                  type="date"
                  name="status_update_submission_date"
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.status_update_submission_date || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        )}
      </div>
    )}
    {!viewtype && <Row className="justify-content-center mt-4">
  <Col xs="auto">
    <Button className="submit-button" type="submit">
      {submission_id? "Update":"Submit"} Candidate
    </Button>
  </Col>
  <Col xs="auto">
    <Button className="submit-button" type="button" onClick={resetform}>
      Reset
    </Button>
  </Col>
</Row>}
    {submission_id && submissionHistory.length > 0 && (
      <div className="mt-4">
        <h6 className="mb-2">Status History</h6>
        <table className="table table-sm table-bordered">
          <thead className="table-light">
            <tr>
              <th>Status</th>
              <th>Date</th>
              <th>Changed By</th>
            </tr>
          </thead>
          <tbody>
            {submissionHistory.map((entry) => (
              <tr key={entry.log_id}>
                <td>{entry.status_name}</td>
                <td>{entry.status_date ? new Date(entry.status_date + "T00:00:00").toLocaleDateString() : "—"}</td>
                <td>{entry.updated_by_name || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    </Form>
  );
};
}
export default Submission;
