import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Button, Form, Alert } from "react-bootstrap";
import "./Dashboard.css";
import axiosInstance from "../../services/axiosInstance";
import Select from "react-select";
import { useSelector } from "react-redux";
import { FaFilter } from "react-icons/fa";
import AlertComponent from "../AlertComponent";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  getRoleTypeGroupbyData,
  getCompleteAccountData,
  getCompleteEndClientData,
  getMonthlySubsData,
  getJobStatusGroupbyData,
  getcarryforwardActiveData,
  getdashboardUpdateData,
} from "../../services/helper";

const ClientDashboard = () => {
    const [barChartData, setBarChartData] = useState({
    overall_data: {},
    grouped_data: [],
  });
  const accountRes = useSelector((state) => state.master_dropdown.accounts);
  const endClientRes = useSelector((state) => state.master_dropdown.endClients);
  const [activeFilter, setActiveFilter] = useState("account");
  const [updatedDate, setUpdatedDate] = useState("");
  const [dateAlert, setDateAlert] = useState(false);
  const [selectedData, setSelectedData] = useState({
    accounts: [0], // Default is "Select All"
    endclients: [0],
    from_date:
      new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0] ,
    to_date: new Date().toISOString().split("T")[0],
    filter_type: activeFilter,
  });
  const displayNames = {
    roles_opened: "Roles Opened",
    amsubs: "AM Subs",
    csubs: "Client Subs",
    interviews: "Interviews",
    offers: "Offers",
    starts: "Starts",
    avg_turnaround_time:"Roles TAT"
  };
  let [req_to_hire, am_to_client_subs, client_to_interviews, interviews_to_offers, offers_to_starts] = [0, 0, 0, 0, 0];
  const toPercentage =(denominator, numerator) => {
     if (
    !barChartData.overall_data || 
    denominator === undefined || 
    numerator === undefined || 
    denominator === 0
  ) {
    return "0%";
  }

    if (denominator === 0) return 0;
    console.log("denominator", denominator);
    console.log("numerator", numerator);
    return ((numerator / denominator) * 100).toFixed(2) + "%";
  };
  // // Custom Tooltip formatter

    req_to_hire = useMemo(() => {
      if (!barChartData.overall_data) {
        return 0;
      }
return toPercentage(
                  barChartData.overall_data.roles_opened,
                  barChartData.overall_data.starts
                )
    }, [barChartData.overall_data.roles_opened, barChartData.overall_data.starts]);
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
  
  const formatTooltip = (value, name) => {
    return [value, displayNames[name] || name];
  };

  // Custom Legend formatter
  const formatLegend = (value) => {
    return displayNames[value] || value;
  };

  const [filterdropdowndata, setfilterdropdowndata] = useState({
    account_dropdown: [],
    endclient_dropdown: [],
  });


  const [monthlySubsData, SetmonthlySubsData] = useState([]);
  const [roleTypeChartData, setRoleTypeChartData] = useState([]);
  const [jobStatusChartData, setJobStatusChartData] = useState([]);
  const [carryforwardChartData, setcarryforwardChartData] = useState([]);
  
   const getfilters=() => ({
      accounts: selectedData.accounts,
      end_clients: selectedData.endclients,
      from_date: selectedData.from_date,
      to_date: selectedData.to_date,
      filter_type: activeFilter,
    });

    
    const barChart = async () => {
      const updatedDateResponse = await getdashboardUpdateData();
console.log("updatedDateResponse", updatedDateResponse);
      setUpdatedDate(updatedDateResponse.last_updated || "No data available");
      let response;
      console.log("selected Data", selectedData)
      if (activeFilter === "account") {
        response =await getCompleteAccountData(selectedData);
      } else {
        response =await getCompleteEndClientData(selectedData);
      }
      console.log(response);
      setBarChartData((prev) => ({
        ...prev,
        overall_data: response.total_data,
        grouped_data: response.grouped_data,
      }));
      
    };
   

const monthlycharts = async () => {
  const monthlydataResponse =await getMonthlySubsData(selectedData);

      SetmonthlySubsData(monthlydataResponse.grouped_data);
  } 
 
  
const roletypesfetch = async () => {
   
    const role_type_response =await getRoleTypeGroupbyData(selectedData);

      setRoleTypeChartData(role_type_response.grouped_data);
  } 
 

   
const jobstatusfetch = async () => {
   
     const job_status_response =await getJobStatusGroupbyData(selectedData);

      setJobStatusChartData(job_status_response.grouped_data);
  } 
  useEffect(() => { 
    handleFilterSearch();
  }
  , [activeFilter]);
 const handleFilterSearch =useCallback(() => {
    barChart();
     jobstatusfetch();
     roletypesfetch();  
      monthlycharts();
      carryforwardfetch();  
  },[selectedData, activeFilter]);
 
  const carryforwardfetch = async () => {
   
      const carry_forward_activedata =await getcarryforwardActiveData(selectedData);

      setcarryforwardChartData(carry_forward_activedata.grouped_data);
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

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      height: "38px",
      minHeight: "38px",
      borderColor: "#ced4da",
      borderRadius: "0.375rem",
      fontSize: "1rem",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(0, 123, 255, 0.25)"
        : base.boxShadow,
      "&:hover": {
        borderColor: "#86b7fe",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 8px",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "38px",
    }),
  };

  const renderSelect = (name, label, options) => {
    const values = selectedData[name] || [];

    const selectOptions = [
      {
        value: 0,
        label: "Select All",
        isDisabled: false,
      },
      ...(options || []).map((opt) => ({
        value: opt.id,
        label: opt.name,
        isDisabled: values.includes(0), // disable others if Select All is active
      })),
    ];

    const selectedOptions = values.includes(0)
      ? [selectOptions.find((opt) => opt.value === 0)]
      : values
          .map((val) => selectOptions.find((opt) => opt.value === val))
          .filter(Boolean);

    const hasError = !!errors[name];

    return (
      <Form.Group className="mb-3">
        <Form.Label className="fs-6">
          {label}
          <span style={{ color: "red" }}>*</span>:
        </Form.Label>
        <Select
          classNamePrefix="my-select"
          isMulti
          options={selectOptions}
          value={selectedOptions}
          isDisabled={viewtype}
          onChange={(selected) => {
            const values = selected ? selected.map((opt) => opt.value) : [];
            const newValues = values.includes(0)
              ? [0]
              : values.filter((v) => v !== 0);
            handleChange({ target: { name, value: newValues } });
          }}
          placeholder={`Select ${label}`}
          isClearable
          styles={{
            ...customSelectStyles,
            control: (base, state) => ({
              ...customSelectStyles.control(base, state),
              borderColor: hasError
                ? "#dc3545"
                : customSelectStyles.control(base, state).borderColor,
              boxShadow: hasError
                ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
                : customSelectStyles.control(base, state).boxShadow,
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

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#ec4fa5ff",
    "#85b0f1ff",
  ];
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={15}
        fontWeight={"bold"}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  useEffect(() => {
    if (dateAlert) {
      const timer = setTimeout(() => setDateAlert(false), 3000); // auto-dismiss after 3 sec
      return () => clearTimeout(timer); // cleanup
    }
  }, [dateAlert]);
  const handleRefresh = async () => {
    const response = await axiosInstance.get(
      "ta_team/refresh-client-dashboard/"
    );
    const updatedDateResponse = await getdashboardUpdateData();

    setUpdatedDate(updatedDateResponse.last_updated || "No data available");
    setDateAlert(true);
  };

  return (
    <div>
      <div className="update_container">
        <label>Last updated data:{updatedDate}</label>
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
                setActiveFilter(e.target.checked ? "endclient" : "account")
                setSelectedData((prev)=>({...prev, filter_type:e.target.checked ? "endclient" : "account"}))
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
        </Col>
         <Col md={2}>
          <button
            className="btn btn-primary" onClick={handleFilterSearch}>Filter</button>
        </Col>
      </Row>

      <div className="dashboard_area">
        <div className="dashboard">
          <div className="submissions-scorecard-layout">
            <div className="scorecard">
              <p className="title">AM Submissions</p>
              <p>{barChartData.overall_data.amsubs || 0}</p>
            </div>
            <div className="scorecard">
              <p className="title">Client Submissions</p>
              <p>{barChartData.overall_data.csubs || 0}</p>
            </div>
            <div className="scorecard">
              <p className="title">Interviews</p>
              <p>{barChartData.overall_data.interviews || 0}</p>
            </div>
            <div className="scorecard">
              <p className="title">Offers</p>
              <p>{barChartData.overall_data.offers || 0}</p>
            </div>
            <div className="scorecard">
              <p className="title">Starts</p>
              <p>{barChartData.overall_data.starts || 0}</p>
            </div>
            <div className="scorecard">
              <p className="title">Req to Hire</p>
              <p>
                {req_to_hire ||0}
              </p>
            </div>
            <div className="scorecard">
              <p className="title">AM to Client Submissions</p>
              <p>
                {am_to_client_subs || 0}
              </p>
            </div>
            <div className="scorecard">
              <p className="title">Clients to interviews</p>
              <p>
                {client_to_interviews || 0}
              </p>
            </div>
            <div className="scorecard">
              <p className="title">Interviews to Offer</p>
              <p>
                {interviews_to_offers
                || 0}
              </p>
            </div>
            <div className="scorecard">
              <p className="title">Offers to Starts</p>
              <p>
                {offers_to_starts || 0}
              </p>
            </div>
          </div>
          <div className="chart-box-primary">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={barChartData.grouped_data}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                barCategoryGap="10%"
                maxBarSize={50}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={
                    activeFilter === "account"
                      ? "account_name"
                      : "end_client_name"
                  }
                  tick={{ fontSize: 12, fill: "#333", fontWeight: "bold" }}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={formatTooltip} />
                <Legend formatter={formatLegend} />

                <Bar dataKey="roles_opened" fill="#1f77b4">
                  {" "}
                  {/* Blue */}
                  <LabelList
                    dataKey="roles_opened"
                    position="top"
                    fill="black"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>

                <Bar dataKey="amsubs" fill="#ff7f0e">
                  {" "}
                  {/* Orange */}
                  <LabelList
                    dataKey="amsubs"
                    position="top"
                    fill="black"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>

                <Bar dataKey="csubs" fill="#2ca02c">
                  {" "}
                  {/* Green for Client Submissions */}
                  <LabelList
                    dataKey="csubs"
                    position="top"
                    fill="black"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>

                <Bar dataKey="interviews" fill="#d62728">
                  {" "}
                  {/* Red */}
                  <LabelList
                    dataKey="interviews"
                    position="top"
                    fill="black"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>

                <Bar dataKey="offers" fill="#9467bd">
                  {" "}
                  {/* Purple */}
                  <LabelList
                    dataKey="offers"
                    position="top"
                    fill="black"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>

                <Bar dataKey="starts" fill="#28a745">
                  {" "}
                  {/* Green for Starts */}
                  <LabelList
                    dataKey="starts"
                    position="top"
                    fill="black"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box-primary">
            {" "}
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={monthlySubsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                barCategoryGap="10%"
                maxBarSize={50}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={"month"}
                  tick={{ fontSize: 12, fill: "#333", fontWeight: "bold" }}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={formatTooltip} />
                <Legend formatter={formatLegend} />

                <Bar dataKey="roles_opened" fill="#1f77b4">
                  {" "}
                  {/* Blue */}
                  <LabelList
                    dataKey="roles_opened"
                    position="top"
                    fill="black"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>

                <Bar dataKey="amsubs" fill="#ff7f0e">
                  {" "}
                  {/* Orange */}
                  <LabelList
                    dataKey="amsubs"
                    position="top"
                    fill="black"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>

                <Bar dataKey="csubs" fill="#2ca02c">
                  {" "}
                  {/* Green for Client Submissions */}
                  <LabelList
                    dataKey="csubs"
                    position="top"
                    fill="black"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>

                <Bar dataKey="interviews" fill="#d62728">
                  {" "}
                  {/* Red */}
                  <LabelList
                    dataKey="interviews"
                    position="top"
                    fill="black"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>

                <Bar dataKey="offers" fill="#9467bd">
                  {" "}
                  {/* Purple */}
                  <LabelList
                    dataKey="offers"
                    position="top"
                    fill="black"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>

                <Bar dataKey="starts" fill="#28a745">
                  {" "}
                  {/* Green for Starts */}
                  <LabelList
                    dataKey="starts"
                    position="top"
                    fill="black"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleTypeChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  innerRadius={50} // makes it a donut chart, optional
                  dataKey="no_of_roles_opened"
                  nameKey="role_type"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {roleTypeChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}`, name]} />
                <Legend
                  layout="horizontal" // or "vertical"
                  verticalAlign="bottom" // top, middle, bottom
                  align="center" // left, center, right
                  iconType="square" // line, circle, square
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobStatusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  innerRadius={50} // makes it a donut chart, optional
                  dataKey="no_of_roles_opened"
                  nameKey="job_status"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {jobStatusChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}`, name]} />
                <Legend
                  layout="horizontal" // or "vertical"
                  verticalAlign="bottom" // top, middle, bottom
                  align="center" // left, center, right
                  iconType="square" // line, circle, square
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={carryforwardChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                barCategoryGap="10%"
                maxBarSize={50}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={"month"}
                  tick={{ fontSize: 12, fill: "#333", fontWeight: "bold" }}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={formatTooltip} />
                <Legend formatter={formatLegend} />

                <Bar dataKey="roles_opened" fill="#d62728">
                  {" "}
                  {/* Red */}
                  <LabelList
                    dataKey="roles_opened"
                    position="top"
                    fill="black"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-box-primary">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={barChartData.grouped_data}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                barCategoryGap="10%"
                maxBarSize={50}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={
                    activeFilter === "account"
                      ? "account_name"
                      : "end_client_name"
                  }
                  tick={{ fontSize: 12, fill: "#333", fontWeight: "bold" }}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={formatTooltip} />
                <Legend formatter={formatLegend} />

                <Bar dataKey="avg_turnaround_time" fill="#1f77b4">
                  {" "}
                  {/* Blue */}
                  <LabelList
                    dataKey="avg_turnaround_time"
                    position="top"
                    fill="black"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>

             
                
              </BarChart>
            </ResponsiveContainer>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
