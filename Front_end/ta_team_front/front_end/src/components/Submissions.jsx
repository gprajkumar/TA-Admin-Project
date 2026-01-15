import axiosInstance from "../services/axiosInstance";
import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import "./RequirementForm.css";
import {
  getSources,
  getfilteredEmployees,
  getJobreqs,
} from "../services/drop_downService";
import { Form, Row, Col, Button } from "react-bootstrap";
import useCalTAT from "../services/customHooks/useCalTAT";
import { normalizeData } from "../services/utilities/utilities";
import Loader from "./sharedComponents/Loader";
import Dropdown_component from "./sharedComponents/Dropdown_component";
import CustomAlert from "./sharedComponents/Alert";
import CustomAsyncSelect from "./sharedComponents/CustomAsyncSelect";

const Submission = ({ submission_id,viewtype = false,externaldropdowndata}) => {
  const [loading, setLoading] = useState(submission_id ? true : false); 
  const[fetchedJobs,setFetchedJobs] = useState([]);
  const baseurl = import.meta.env.VITE_API_BASE_URL;
      const [errors,setErrors] = useState({});
      const initialFormData = {Job: "",
    submission_date: "",
    candidate_name: "",
    payrate: "",
    w2_C2C: "",
    recruiter: "",
    sourcer: "",
    source: "",
    am_sub_date:"",
    turn_around_time: "",
      }

  const [formData, setFormData] = useState(initialFormData);
   const loadOptions = async (inputValue) => {
   const res = await axiosInstance.get( `${baseurl}/ta_team/requirement-search`, {
     params: { q: inputValue }
   });
 console.log("searchData",res.data);
 setFetchedJobs(res.data);
   return res.data.map(job => ({
     label: `${job.job_code}-${job.job_title} `,
     value: job.requirement_id
   }));
 };  
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
        const [recruitersRes, sourcersRes, sourceres] =
          await Promise.all([
           
            getfilteredEmployees({ can_recruit: true }),
            getfilteredEmployees({ can_source: true }),
            getSources(),
          ]);

        setDropdownData({
          // jobs: jobres.map((data) => ({
          //   id: data.requirement_id,
          //   name: `${data.job_code} - ${data.job_title}`,
          // })),
          recruiters: normalizeData(recruitersRes, "employee_id", "emp_fName"),
          sourcers: normalizeData(sourcersRes, "employee_id", "emp_fName"),
          sources: normalizeData(sourceres,"source_id","source"),
        });
        console.log(submission_id)
           if (submission_id) {
        const res = await axiosInstance.get(`/ta_team/submissions/${submission_id}/`);
        setFormData(res.data);
        setLoading(false);
      }
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };

    fetchData();
  }, [submission_id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData",formData.Job);
    
    if(!validationform())
    {
     
      return
    }

    console.log(formData);
    try {
      if(!submission_id)
      {
      await axiosInstance.post(`/ta_team/submissions/`, formData);
      alert("Submitted successfully");
     <CustomAlert message={"Submitted successfully"} type="success" />
      resetform();
      }
      else
      {
        await axiosInstance.patch(`/ta_team/submissions/${submission_id}/`, formData);
        alert("Updated successfully");
 
  <CustomAlert message={"Updated successfully"} type="success" />
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
console.log("TAT:", tat);
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
    const updatedForm = { ...prev, [name]: value };
    if (name === "submission_date") {
      updatedForm["am_sub_date"] = value; // Sync am_submission with submission_date
    }
    if(errors[name]){
      setErrors((preverrors)=>({...preverrors,[name]:""}))
    }
    return updatedForm;
  });
  };
  if(loading)
{
   return <Loader />;
}
else
{
  return (
    <Form onSubmit={handleSubmit} className="requirement-form container">
      <h2 className="mb-4">{submission_id && "Edit "}Candidate Submission</h2>
      <Row>
        <Col md={12}>
           <Form.Group className="mb-3 " controlId="job">
                    <Form.Label className="fs-6">Job<span style={{ color: "red" }}>*</span>:</Form.Label>
       <CustomAsyncSelect placeholder={"Search job by title or ID"} loadOptions={loadOptions} name="Job" onChange={handleChange} error={errors.job}/>
          

       </Form.Group>
        </Col>
      </Row>
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
    </Form>
  );
};
}
export default Submission;
