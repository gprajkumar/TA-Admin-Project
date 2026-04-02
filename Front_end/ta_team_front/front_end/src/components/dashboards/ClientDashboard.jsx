import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import "./Dashboard.css";
import axiosInstance from "../../services/axiosInstance";
import { useSelector } from "react-redux";
import { FaFilter } from "react-icons/fa";
import AlertComponent from "../AlertComponent";
import CustomBarchart from "../charts/CustomBarChart";
import { hasPermission } from "../../services/utilities/rbac";
import CustomPieChart from "../charts/CustomPieChart";
import {
  getRoleTypeGroupbyData,
  getCompleteAccountData,
  getCompleteEndClientData,
  getMonthlySubsData,
  getJobStatusGroupbyData,
  getcarryforwardActiveData,
  getdashboardUpdateData,
  getPipelineorCancelledData
} from "../../services/helper";
import ScoreCard from "./ScoreCard.jsx";
import MultiSelectComponent from "../sharedComponents/MultiSelectComponent.jsx";

const ClientDashboard = () => {
    const [barChartData, setBarChartData] = useState({
    overall_data: {},
    grouped_data: [],
    pipeline_cancelled_data: {}
  });
  const accountRes = useSelector((state) => state.master_dropdown.accounts);
  const endClientRes = useSelector((state) => state.master_dropdown.endClients);
  const emp_permissions = useSelector((state) => state.master_dropdown.permissions);
  const [activeFilter, setActiveFilter] = useState("account");
  const [updatedDate, setUpdatedDate] = useState("");
  const [dateAlert, setDateAlert] = useState(false);
  const canViewDashboard = () => {
  if(hasPermission(emp_permissions,"client_dashboard","view") || hasPermission(emp_permissions,"client_dashboard","edit") || hasPermission(emp_permissions,"client_dashboard","edit_own_data") || hasPermission(emp_permissions,"client_dashboard","delete_own_data")){
    return true;
  } 
}
  const [selectedData, setSelectedData] = useState({
    accounts: [0], // Default is "Select All"
    endclients: [0],
    from_date:
      new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0] ,
    to_date: new Date().toISOString().split("T")[0],
    filter_type: "account", // Default filter type
  });

  let [req_to_hire, am_to_client_subs, client_to_interviews, interviews_to_offers, offers_to_starts,techscreen_to_csub] = [0, 0, 0, 0, 0,0];
  const toPercentage =(denominator, numerator) => {
     if (
    !barChartData.overall_data || 
    denominator === undefined || 
    numerator === undefined || 
    denominator === 0
  ) {
    return "0%";
  }

    if (denominator === 0) return "0%";
    return ((numerator / denominator) * 100).toFixed(2) + "%";
  };

    req_to_hire = useMemo(() => {
      if (!barChartData.overall_data) {
        
        return 0;
      }
return toPercentage(
                  barChartData.overall_data.roles_opened - barChartData.pipeline_cancelled_data.pipelineorCancelCount,
                  barChartData.overall_data.starts
                )
    }, [barChartData.overall_data.roles_opened, barChartData.overall_data.starts, barChartData.pipeline_cancelled_data.pipelineorCancelCount]);
  techscreen_to_csub = useMemo(() => {  
    if (!barChartData.overall_data) {
        return 0;
      } 
return toPercentage(
                  barChartData.overall_data.techscreens,
                  barChartData.overall_data.techscreen_csubs
                );
    }, [barChartData.overall_data.techscreen_csubs, barChartData.overall_data.techscreens]);  
am_to_client_subs = useMemo(() => {
   if (!barChartData.overall_data) {
        return 0;
      }
return toPercentage(
                  barChartData.overall_data.amsubs,
                  barChartData.overall_data.csubs
                );
    }, [barChartData.overall_data.amsubs, barChartData.overall_data.csubs]);  
client_to_interviews = useMemo(() => {
   if (!barChartData.overall_data) {
        return 0;
      }
return toPercentage(
                  barChartData.overall_data.csubs,
                  barChartData.overall_data.interviews
                );
    } , [barChartData.overall_data.csubs, barChartData.overall_data.interviews]);
interviews_to_offers = useMemo(() => {
   if (!barChartData.overall_data) {
        return 0;
      }
return toPercentage(
                  barChartData.overall_data.interviews,
                  barChartData.overall_data.offers
                );
    }, [barChartData.overall_data.interviews, barChartData.overall_data.offers]);       
    offers_to_starts = useMemo(() => {
       if (!barChartData.overall_data) {
        return 0;
      }
return toPercentage(
                  barChartData.overall_data.offers,
                  barChartData.overall_data.starts
                );
    }, [barChartData.overall_data.offers, barChartData.overall_data.starts]);
  

  const [filterdropdowndata, setfilterdropdowndata] = useState({
    account_dropdown: [],
    endclient_dropdown: [],
  });


  const [monthlySubsData, SetmonthlySubsData] = useState([]);
  const [roleTypeChartData, setRoleTypeChartData] = useState([]);
  const [jobStatusChartData, setJobStatusChartData] = useState([]);
  const [carryforwardChartData, setcarryforwardChartData] = useState([]);
  
  
    
    const barChart = async () => {
      try{
      const mainRequest = activeFilter === "account" ? getCompleteAccountData(selectedData) : getCompleteEndClientData(selectedData);
      const[updaedDateResponse,mainResponse,pipeline_cancelled_response] = await Promise.all([getdashboardUpdateData(), mainRequest, getPipelineorCancelledData(selectedData)]);
      setUpdatedDate(updaedDateResponse.last_updated || "No data available");
  
     
      setBarChartData((prev) => ({
        ...prev,
        pipeline_cancelled_data: pipeline_cancelled_response.pipelineCancelCount || {},
        overall_data: mainResponse.total_data,
        grouped_data: mainResponse.grouped_data
        
      }));
    }
    catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
      
    };
   

const monthlycharts = async () => {
  try{
      const monthlydataResponse =await getMonthlySubsData(selectedData);

      SetmonthlySubsData(monthlydataResponse.grouped_data);

  }
  catch (error) {
    console.error("Error fetching monthly submissions data:", error);
  }

  } 
 
  
const roletypesfetch = async () => {
   try{
 const role_type_response =await getRoleTypeGroupbyData(selectedData);

      setRoleTypeChartData(role_type_response.grouped_data);
   }
    catch (error) { 
    console.error("Error fetching role type data:", error);
    }
   
  } 
 

   
const jobstatusfetch = async () => {
  try { 
     const job_status_response =await getJobStatusGroupbyData(selectedData);

      setJobStatusChartData(job_status_response.grouped_data);
  }
  catch (error) {
    console.error("Error fetching job status data:", error);  
  }
   
    
  } 

  const handleFilterSearch = () => {
  barChart();
  jobstatusfetch();
  roletypesfetch();  
  monthlycharts();
  carryforwardfetch();  
}
useEffect(() => { 
  handleFilterSearch();
}, [activeFilter]);
 
  const carryforwardfetch = async () => {
   try {
     const carry_forward_activedata =await getcarryforwardActiveData(selectedData);

      setcarryforwardChartData(carry_forward_activedata.grouped_data);
   } catch (error) {
    console.error("Error fetching carry forward data:", error);
   }
     
  } 
     
  const normalizeData = (data, idkey, namekey) =>
    data.map((item) => ({ id: item[idkey], name: item[namekey] }));

  useEffect(() => {
    setfilterdropdowndata((prev) => ({
      ...prev,
      account_dropdown: normalizeData(accountRes, "account_id", "account_name"),
      endclient_dropdown: normalizeData(
        endClientRes,
        "end_client_id",
        "end_client_name"
      ),
    }));
  }, [accountRes, endClientRes]);

  const errors = {};
  const viewtype = false;

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

  

  

  useEffect(() => {
    if (dateAlert) {
      const timer = setTimeout(() => setDateAlert(false), 3000); // auto-dismiss after 3 sec
      return () => clearTimeout(timer); // cleanup
    }
  }, [dateAlert]);
  const handleRefresh = async () => {
    await axiosInstance.get(
      "ta_team/refresh-client-dashboard/"
    );
    const updatedDateResponse = await getdashboardUpdateData();

    setUpdatedDate(updatedDateResponse.last_updated || "No data available");
    setDateAlert(true);
    handleFilterSearch();
  };
if(!canViewDashboard()){
  return (
    <div className="no-access">
      <h2>Access Denied</h2>  
      <p>You do not have permission to view this dashboard.</p>
    </div>
  );
}
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

             <Col md={4}>
          {activeFilter === "account"
            ? <MultiSelectComponent name={"accounts"} label={"Account"} options={filterdropdowndata.account_dropdown} selectedData={selectedData} errors={errors} viewtype={viewtype} handleChange={handleChange}/>
            :<MultiSelectComponent name={"endclients"} label={"End Client"} options={filterdropdowndata.endclient_dropdown} selectedData={selectedData} errors={errors} viewtype={viewtype} handleChange={handleChange}/>}
        </Col>
         <Col md={2}>
          <button
            className="btn btn-primary" onClick={handleFilterSearch}>Filter</button>
        </Col>
      </Row>

      <div className="dashboard_area">
        <div className="dashboard">
          <div className="submissions-scorecard-layout">
  
  <div className="scorecard-row row-1">
    <ScoreCard title="Roles Opened" score={barChartData.overall_data.roles_opened} />
    <ScoreCard title="AM Submissions" score={barChartData.overall_data.amsubs} />
    <ScoreCard title="Client Submissions" score={barChartData.overall_data.csubs} />
    <ScoreCard title="Interviews" score={barChartData.overall_data.interviews} />
    <ScoreCard title="Offers" score={barChartData.overall_data.offers} />
    <ScoreCard title="Starts" score={barChartData.overall_data.starts} />
  </div>

  <div className="scorecard-row row-2">
    <ScoreCard title="AM to Client Submissions" score={am_to_client_subs} />
    <ScoreCard title="Tech Screen to CSubs" score={techscreen_to_csub} />
    <ScoreCard title="CSubs to interviews" score={client_to_interviews} />
    <ScoreCard title="Interviews to Offers" score={interviews_to_offers} />
    <ScoreCard title="Offers to Starts" score={offers_to_starts} />
    <ScoreCard title="Conversion Ratio" score={req_to_hire} />
  </div>

  <div className="scorecard-row row-3">
    <ScoreCard title="TA Team's TAT" score={barChartData.overall_data.avg_turnaround_time} />
    <ScoreCard title="CSM TAT" score={barChartData.overall_data.avg_days_am_to_csub} />
    <ScoreCard title="Client TAT" score={barChartData.overall_data.avg_days_csub_to_offer} />
     <ScoreCard title="Time to Interview" score={barChartData.overall_data.avg_days_time_to_interview} />
    <ScoreCard title="Time to Fill" score={barChartData.overall_data.avg_days_time_to_fill} />
    <ScoreCard title="Time to Hire" score={barChartData.overall_data.avg_days_time_to_hire} />
    
   
  </div>

</div>

          <div className="chart-box-primary">
            <CustomBarchart data={barChartData.grouped_data} xaxis={ activeFilter === "account" ? "account_name" : "end_client_name"} datakeys={["roles_opened","amsubs", "csubs", "interviews", "offers", "starts"]} />
            
          </div>
          <div className="chart-box-primary">
            <CustomBarchart
              data={monthlySubsData}
              xaxis={"month"}   
              datakeys={["roles_opened", "amsubs", "csubs", "interviews", "offers", "starts"]}
            chartTitle="Monthly Submissions"
            />
          </div>
          
          <div className="chart-box">
            <CustomPieChart data={roleTypeChartData} dataKey="no_of_roles_opened" nameKey="role_type" />  
          </div>
          <div className="chart-box">
            <CustomPieChart data={jobStatusChartData} dataKey="no_of_roles_opened" nameKey="job_status" />
          
          </div>
          <div className="chart-box">
            <CustomBarchart data={carryforwardChartData} xaxis={"month"} datakeys={["roles_opened"]} chartTitle={"Carry Forwarded roles"} />
    
          </div>
          <div className="chart-box-primary">
            <CustomBarchart
              data={barChartData.grouped_data}
              xaxis={ activeFilter === "account" ? "account_name" : "end_client_name"}
              datakeys={["avg_turnaround_time"]} chartTitle={"Average Turnaround Time"}
            />
          
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
