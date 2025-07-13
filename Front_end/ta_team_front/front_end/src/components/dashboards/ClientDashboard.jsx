import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import './Dashboard.css';
import axiosInstance from '../../services/axiosInstance';
import Select from "react-select";
import { useSelector } from 'react-redux';
import { FaFilter } from 'react-icons/fa';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {getCompleteAccountData, getCompleteEndClientData} from '../../services/helper';
const ClientDashboard = () => {
  
  const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

  
  const accountRes = useSelector((state) => state.master_dropdown.accounts);
  const endClientRes = useSelector((state) => state.master_dropdown.endClients);
const [activeFilter, setActiveFilter] = useState("account");
  const [selectedData, setSelectedData] = useState({
    accounts: [0], // Default is "Select All"
    endclients: [0],
    from_date: "",
    to_date: "",
  });

  const [filterdropdowndata, setfilterdropdowndata] = useState({
    account_dropdown: [],
    endclient_dropdown: [],
  });

const [barChartData, setBarChartData] = useState(
  {
    overall_data : {},
    grouped_data: []

  }
)


useEffect( () => {
  const filters = {
    accounts: selectedData.accounts,
    end_clients:selectedData.endclients,
    from_date:selectedData.from_date,
    to_date:selectedData.to_date,
    filter_type: activeFilter,
  }
  const barChart = async () => {
    let response;
    if(activeFilter === "account")
    {
    response = await getCompleteAccountData(filters);
    }
    else
    {
response = await getCompleteEndClientData(filters);
    }
    console.log(response)
    setBarChartData((prev) => ({...prev,
      overall_data: response.total_data,
     grouped_data: response.grouped_data,
  }))
  } 
  barChart();
},[selectedData,activeFilter])
  

  const normalizeData = (data, idkey, namekey) =>
    data.map((item) => ({ id: item[idkey], name: item[namekey] }));

  useEffect(() => {
    setfilterdropdowndata((prev) => ({
      ...prev,
      account_dropdown: normalizeData(accountRes, "account_id", "account_name"),
      endclient_dropdown: normalizeData(endClientRes, "end_client_id", "end_client_name"),
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
      height: '38px',
      minHeight: '38px',
      borderColor: '#ced4da',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0, 123, 255, 0.25)' : base.boxShadow,
      '&:hover': {
        borderColor: '#86b7fe',
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 8px',
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '38px',
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
            const newValues = values.includes(0) ? [0] : values.filter((v) => v !== 0);
            handleChange({ target: { name, value: newValues } });
          }}
          placeholder={`Select ${label}`}
          isClearable
          styles={{
            ...customSelectStyles,
            control: (base, state) => ({
              ...customSelectStyles.control(base, state),
              borderColor: hasError ? "#dc3545" : customSelectStyles.control(base, state).borderColor,
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

  const handleRefresh = async () => {
    const response = await axiosInstance.get('ta_team/refresh-client-dashboard/');
    console.log(response.data.message);
  };

  return (
    <div>
      <div className='update_container'>
        <label>Last updated data: 7/6/2025</label>
        <Button onClick={handleRefresh}>Refresh Data</Button>
      </div>

      <Row className="filter_Container">
        <Col md={3} className='filterbox'>
          <FaFilter size={20} style={{ marginRight: '8px', color: 'white' }} />
          <span className="title_filter">Filters</span>
          <Form.Group controlId="filterToggle" className="mb-3">
            <Form.Check
              className='custom-checkbox-style'
              type="checkbox"
              label="Filter by End Client"
              checked={activeFilter === "endclient"}
              onChange={(e) =>
                setActiveFilter(e.target.checked ? "endclient" : "account")
              }
            />
          </Form.Group>
        </Col>

        <Col md={3}>
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

        <Col md={3}>
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

        <Col md={3}>
          {activeFilter === "account"
            ? renderSelect("accounts", "Account", filterdropdowndata.account_dropdown)
            : renderSelect("endclients", "End Client", filterdropdowndata.endclient_dropdown)}
        </Col>
      </Row>

      <div className='dashboard_area'>
        <div className='dashboard'>
          <div className="chart-box-primary">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
          width={500}
          height={300}
          data={barChartData.grouped_data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={activeFilter === "account" ? "account_name": "end_client_name"} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amsubs" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          <Bar dataKey="csubs" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
        </ResponsiveContainer>
          </div>
          <div className="chart-box">Chart 2</div>
          <div className="chart-box">Chart 3</div>
          <div className="chart-box">Chart 4</div>
          <div className="chart-box">Chart 5</div>
          <div className="chart-box">Chart 6</div>
                 <div className="chart-box">Chart 7</div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;