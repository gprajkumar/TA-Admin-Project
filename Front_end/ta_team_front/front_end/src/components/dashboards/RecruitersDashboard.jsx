import React, { useEffect, useMemo,useState } from 'react'
import { Row, Col, Button, Form, Alert } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import { useSelector } from 'react-redux';
import {
  getdashboardUpdateData
} from "../../services/helper";
import "./Dashboard.css";
import MultiSelectComponent from "../sharedComponents/MultiSelectComponent.jsx";
const RecruitersDashboard = () => {
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
          (employees) =>
            employees.can_recruit === true && employees.department === 2
        ),"employee_id","emp_fName")
  }
 },[AccountData,endClientData,RecruitersData])
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

  const handleRefresh = async () => {
    await axiosInstance.get(
      "ta_team/refresh-client-dashboard/"
    );
    const updatedDateResponse = await getdashboardUpdateData();

    setUpdatedDate(updatedDateResponse.last_updated || "No data available");
    setDateAlert(true);
    handleFilterSearch();
  };
   const handleFilterSearch = () => {
  
}
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
    console.log(selectedData);
  };
  return (
   <div>
      <div className="update_container">
        <label>Last updated Date: {updatedDate}</label>
        <Button onClick={handleRefresh}>Refresh Data</Button>
      </div>
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

        {/* <Col md={4}>
          {activeFilter === "account"
            ? renderSelect(
                "accounts",
                "Account",
                filterdropdowndata.account_dropdown
              )
            : renderSelect(
                "endclients",
                "End Client",
                filterdropdowndata.endclient_dropdown
              )} 
        </Col>*/}
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
        <MultiSelectComponent name ={"recruiters"} label={"Recruiters"} options={filterdropdowndata.Recruiters} selectedData={selectedData} errors={errors} viewtype={viewtype} handleChange={handleChange}/>
        </Col>
      </Row>
   
</div>
     
          )

  
}

export default RecruitersDashboard;