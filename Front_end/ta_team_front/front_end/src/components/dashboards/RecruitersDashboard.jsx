import React, { useEffect, useMemo,useState } from 'react'
import { Row, Col, Button, Form, Alert } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import { useSelector } from 'react-redux';
import axiosInstance from '../../services/axiosInstance.js';
import {
  getdashboardUpdateData,
  getRecruiterSubmissions,
  getSourcerSubmissions,
  getRecruitertatAssigned,
  getSourcertatAssigned
} from "../../services/helper";
import "./Dashboard.css";
import MultiSelectComponent from "../sharedComponents/MultiSelectComponent.jsx";
import { TargetIconComponent } from '../sharedComponents/TargetIconComponent.jsx';
const RecruitersDashboard = ({team="Recruiter"}) => {
   const AccountData = useSelector((state) => state.master_dropdown.accounts);
    const endClientData = useSelector((state) => state.master_dropdown.endClients);
    const RecruitersData = useSelector((state) => state.master_dropdown.employees);
   const errors = {};
   const viewtype =false;
  const normalizeData = (data, idkey, namekey) =>
    data.map((item) => ({ id: item[idkey], name: item[namekey] }));
 const filterdropdowndata = useMemo(()=>{
  return{
    AccountData:normalizeData(AccountData,"account_id", "account_name"),
    endClientData:normalizeData(endClientData, "end_client_id", "end_client_name"),
    Recruiters:normalizeData(RecruitersData.filter(
          (employees) =>{
            if(team === "Recruiter"){
            return employees.can_recruit === true && employees.department === 2
            }
            else if(team === "Sourcer"){
              return employees.can_source === true && employees.department === 1
            }
            return false;
          }
        ),"employee_id","emp_fName")
  }
 },[AccountData,endClientData,RecruitersData, team])
const [activeFilter, setActiveFilter] = useState("account");
  const [updatedDate, setUpdatedDate] = useState("");
  const [dateAlert, setDateAlert] = useState(false);
  const [selectedData, setSelectedData] = useState({
    accounts: [0], // Default is "Select All"
    endclients: [0],
    recruiters:[0],
    from_date:
      new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0] ,
    to_date: new Date().toISOString().split("T")[0],
    filter_type: "account", // Default filter type
  });
const [recruiterSubmissionDetails,setrecruiterSubmissionDetails] = useState([]);
  const handleRefresh = async () => {
    await axiosInstance.get(
      "ta_team/refresh-client-dashboard/"
    );
    const updatedDateResponse = await getdashboardUpdateData();

    setUpdatedDate(updatedDateResponse.last_updated || "No data available");
    setDateAlert(true);
    handleFilterSearch();
  };
   
const recruitersSubmissions = async(selectedData)=>{
  try{
  const submissionresponse = team === "Recruiter" ? await getRecruiterSubmissions(selectedData) : await getSourcerSubmissions(selectedData);
  setrecruiterSubmissionDetails(submissionresponse.grouped_data)
  }
  catch(error)
  {
    console.error("error fetching recruitersubmissions", error)

  }
}
const [ActiveRolesData, setActiveRolesData] = useState([]);
const recruiterAssignedtat = async(selectedData)=>{
  try{
    const recruiterAssignedtatresponse = team === "Recruiter" ? await getRecruitertatAssigned(selectedData) : await getSourcertatAssigned(selectedData);
    console.log("recruiterAssignedtatresponse", recruiterAssignedtatresponse)
    setActiveRolesData(recruiterAssignedtatresponse.overall_roles_tat_details || []);
  }
  catch(error)
  {
    console.error("error fetching recruiterAssignedtat", error)

  }
}
const target_acheived= (submissions, target, fromdate,typeofSub) => {
   const from = new Date(`${fromdate}T00:00:00`);   // force local date
  const to = new Date(); // fallback to today
  // If years are different → return 0
  if (from.getFullYear() !== to.getFullYear()) {
    return "selected previous year date";
  }

  // Prevent division by zero
  if (!target || target === 0) {
    return 0;
  }

 
  if(typeofSub === "Am Subs" || typeofSub === "Client Subs"){
    const currentMonth = to.getMonth(); 
    
    const monthsInYear = 12;
    const targetPerMonth = target / monthsInYear;
    const targetperday = targetPerMonth / 30; 
    const daysPassed = Math.max(0, Math.min(currentMonth * 30 + to.getDate(), 365)); // cap at 365

    const expectedtargetByNow = daysPassed * targetperday;

 // If target already achieved
  if (submissions >= expectedtargetByNow) {
    return 100;
  }
  // Otherwise calculate %
  return Math.round((submissions / expectedtargetByNow) * 100) + " %";
}else if(typeofSub === "Offers"){
  const to = new Date(); // fallback to today
 const targetperMonth = target / 12;
 const expectedtargetByNow = targetperMonth * (to.getMonth()+1); // month is 1-based
 if (submissions >= expectedtargetByNow) {
    return 100;
  }
 return Math.round((submissions / expectedtargetByNow) * 100) + " %";

}
}
const getTopRecruiterbyOffers = useMemo(()=>{
  if(recruiterSubmissionDetails.length > 0){
   const topRecruiters = recruiterSubmissionDetails.sort((a, b) => b.offers - a.offers).slice(0, 5);
   return topRecruiters;
  }
  return [];
},[recruiterSubmissionDetails])
const getTopRecruiters = useMemo(()=>{
  if(recruiterSubmissionDetails.length > 0){
   const topRecruiters = recruiterSubmissionDetails.sort((a, b) => b.amsubs - a.amsubs).slice(0, 5);
   return topRecruiters;
  }
  return [];
},[recruiterSubmissionDetails])

const handleFilterSearch = () => {

  recruitersSubmissions(selectedData);
  recruiterAssignedtat(selectedData);
}
useEffect(()=>{
  handleFilterSearch()

},[])
  const handleChange = ({ target }) => {
    const { name, value } = target;

    if (name === "from_date" || name === "to_date") {
      setSelectedData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setSelectedData((prev) => {
        if (value.includes(0)) {
          return { ...prev, [name]: [0] }; // Only Select All
        } else {
          return { ...prev, [name]: value }; // Normal selected values
        }
      });
    }
  };
  return (
   <div>
     
      {dateAlert && (
        <AlertComponent
          state={dateAlert}
          Alert="Data Refreshed successfully"
          title="Success"
        />
      )}
    
      <Row className="filter_Container">
        <Col md={2} className="filterbox">
          <FaFilter size={20} style={{ marginRight: "8px", color: "white" }} />
          <span className="title_filter">Filters</span>
          <Form.Group controlId="filterToggle" className="mb-3">
            <Form.Check
              className="custom-checkbox-style"
              type="checkbox"
              label="Filter by End Client"
              checked={activeFilter === "endclient"}
              onChange={(e) => {
              const newFilter = e.target.checked ? "endclient" : "account";
  setActiveFilter(newFilter);
  setSelectedData((prev) => ({
    ...prev,
    accounts:[0], 
    endclients:[0],
    filter_type: newFilter,  // keep in sync
  }));
}
              
              }
            />
          </Form.Group>
        </Col>

        <Col md={2}>
          <Form.Group controlId="from_date" className="mb-3">
            <Form.Label className="fs-6">From:</Form.Label>
            <Form.Control
              type="date"
              className="date-filter-input"
              name="from_date"
              value={selectedData.from_date}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={2}>
          <Form.Group controlId="to_date" className="mb-3">
            <Form.Label className="fs-6">To:</Form.Label>
            <Form.Control
              type="date"
              className="date-filter-input"
              name="to_date"
              value={selectedData.to_date}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

             <Col md={4} >
          {activeFilter === "account"
            ? <MultiSelectComponent name={"accounts"} label={"Account"} options={filterdropdowndata.AccountData} selectedData={selectedData} errors={errors} viewtype={viewtype} handleChange={handleChange}/>
            :<MultiSelectComponent name={"endclients"} label={"End Client"} options={filterdropdowndata.endClientData} selectedData={selectedData} errors={errors} viewtype={viewtype} handleChange={handleChange}/>}
        </Col>
       
         <Col md={2}>
          <button
            className="btn btn-primary" onClick={handleFilterSearch}>Filter</button>
        </Col>
      </Row>
      <Row  className="filter_Container">
        <Col md={2}></Col>
        <Col md={2}></Col>
         <Col md={4}>
        <MultiSelectComponent name ={"recruiters"} label={team === "Recruiter" ? "Recruiters" : "Sourcers"} options={filterdropdowndata.Recruiters} selectedData={selectedData} errors={errors} viewtype={viewtype} handleChange={handleChange}/>
        </Col>
      </Row>
   <div>
 </div>
   



<div className="dashboard-container">
  <div className="tables-layout">
        {/* LEFT (500px) */}
        <div className="metrics-table-wrapper table-left">
          <div className="metrics-table-scroll">
          <table className="metrics-table">
            <thead>
              <tr>
                <th>{team === "Recruiter" ? "Recruiter" : "Sourcer"}</th>
                <th>AM Subs</th>
                <th>AM Target Acheived</th>
                <th>Client Subs</th>
                <th>CSubs Target Acheived</th>
                <th>Client Interviews</th>
                <th>Offers</th>
                <th>Offers Target Acheived</th>
                <th>Starts</th>
              </tr>
            </thead>

            <tbody>
              {recruiterSubmissionDetails.map((sub) => (
                <tr key={team === "Recruiter" ? sub.recruiter : sub.sourcer}>
                  <td>{sub.recruiter__emp_fName || sub.sourcer__emp_fName}</td>
                      <td>{sub.amsubs}</td>
                      <td>{sub.target_am_submissions ==0 ? "N/A" : <TargetIconComponent targetAchieved={target_acheived(sub.amsubs, sub.target_am_submissions,selectedData.from_date,"Am Subs")}/>}</td>
                  <td>{sub.csubs}</td>
                  <td>{sub.target_c_submissions ==0 ? "N/A" : <TargetIconComponent targetAchieved={target_acheived(sub.csubs, sub.target_c_submissions,selectedData.from_date,"Client Subs")}/>}</td>
                  <td>{sub.interviews} </td>
                  <td>{sub.offers}</td>
                  <td>{sub.target_offers ==0 ? "N/A" : <TargetIconComponent targetAchieved={target_acheived(sub.offers, sub.target_offers,selectedData.from_date,"Offers")}/>}</td>
                <td>{sub.starts}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* RIGHT (250 + 250) */}
        <div className="tables-right" >
          <div className="metrics-table-wrapper table-right">
            <h5>Top {team === "Recruiter" ? "Recruiter" : "Sourcer"} by Offers</h5>
            <table className="metrics-table">
              <thead style={{background:"#00dd94", color:"white"}}>
                <tr>
                  <th>{team === "Recruiter" ? "Recruiter" : "Sourcer"}</th>
                  <th>AM Subs</th>
                  <th>Client Subs</th>
                  <th>Client Interviews</th>
                  <th>Offers</th>
                  <th>Starts</th>
                  <th>TAT</th>
                </tr>
              </thead>

              <tbody>
                {getTopRecruiterbyOffers.map((sub) => (
                  <tr key={team === "Recruiter" ? sub.recruiter : sub.sourcer}>
                    <td> {sub.recruiter__emp_fName || sub.sourcer__emp_fName}</td>
                    <td>{sub.amsubs}</td>
                    <td>{sub.csubs}</td>
                    <td>{sub.interviews}</td>
                    <td>{sub.offers}</td>
                    <td>{sub.starts}</td>
                    <td>{sub.tat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="metrics-table-wrapper table-right">
            <h5>Top {team === "Recruiter" ? "Recruiter" : "Sourcer"} by AM Submissions</h5>
            <table className="metrics-table">
              <thead>
                <tr>
                  <th>{team === "Recruiter" ? "Recruiter" : "Sourcer"}</th>
                  <th>AM Subs</th>
                  <th>Client Subs</th>
                  <th>Client Interviews</th>
                  <th>Offers</th>
                  <th>Starts</th>
                  <th>TAT</th>
                </tr>
              </thead>

              <tbody>
                {getTopRecruiters.map((sub) => (
                  <tr key={team === "Recruiter" ? sub.recruiter : sub.sourcer}>
                    <td>{sub.recruiter__emp_fName || sub.sourcer__emp_fName}</td>
                    <td>{sub.amsubs}</td>
                    <td>{sub.csubs}</td>
                    <td>{sub.interviews}</td>
                    <td>{sub.offers}</td>
                    <td>{sub.starts}</td>
                    <td>{sub.tat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
          <div>
          <div >
          <table className="metrics-table">
            <thead>
              <tr>
                <th>{team === "Recruiter" ? "Recruiter" : "Sourcer"}</th>
                <th>Roles Assigned</th>
                <th>Active Roles</th>
                <th>Assigned TAT</th>
              </tr>
            </thead>

            <tbody>
              {ActiveRolesData.map((sub) => (
                <tr key={team === "Recruiter" ? sub.assigned_recruiter_id : sub.assigned_sourcer_id}>
                  <td>{sub.assigned_recruiter__emp_fName || sub.assigned_sourcer__emp_fName}</td>
                      <td>{sub.roles_assigned}</td>
                      <td>{sub.active_roles}</td>
                  <td>{sub.avg_tat} </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

      </div>
      </div> 
</div>
     
          )

  
}

export default RecruitersDashboard;