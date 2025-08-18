
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const CustomBarchart = ({ data, xaxis, datakeys }) => {
  const fill = ["#1f77b4", "#ff7f0e", "#052b41ff", "#d62728", "#9467bd", "#28a745"]; 

  const displayNames = {
    roles_opened: "Roles Opened",
    amsubs: "AM Subs",
    csubs: "Client Subs",
    interviews: "Interviews",
    offers: "Offers",
    starts: "Starts",
    avg_turnaround_time: "Roles TAT"
  };

  // Custom Legend
const renderLegend = () => (
  <ul
    style={{
      display: "flex",
      justifyContent: "center", // centers the legend items
      listStyle: "none",
      padding: 0,
      margin: 0
    }}
  >
    {datakeys.map((key, index) => (
      <li
        key={key}
        style={{
          marginRight: 20,
          display: "flex",
          alignItems: "center"
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 12,
            height: 12,
            backgroundColor: fill[index % fill.length],
            marginRight: 5
          }}
        />
        {displayNames[key] || key}
      </li>
    ))}
  </ul>
);


  // Custom Tooltip
  const renderTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Reorder payload based on datakeys
      const orderedPayload = datakeys
        .map((key) => payload.find((p) => p.dataKey === key))
        .filter(Boolean);

      return (
        <div style={{ background: "#fff", padding: 10, border: "1px solid #ccc" }}>
          <p><b>{label}</b></p>
          {orderedPayload.map((entry, index) => (
            <p key={index} style={{ margin: 0 }}>
              <span style={{ color: entry.color }}>● </span>
              {displayNames[entry.dataKey] || entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        barCategoryGap="10%"
        maxBarSize={50}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xaxis}
          tick={{ fontSize: 12, fill: "#333", fontWeight: "bold" }}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={renderTooltip} />
        <Legend content={renderLegend} />

        {datakeys.map((key, index) => (
          <Bar key={key} dataKey={key} fill={fill[index % fill.length]}>
            <LabelList
              dataKey={key}
              position="top"
              fill="black"
              fontSize={12}
              fontWeight="bold"
            />
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarchart;
