import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const CustomPieChart = ({data,dataKey,nameKey}) => {
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
    return (
         <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={data}
                         cx="50%"
                         cy="50%"
                         outerRadius={150}
                         innerRadius={50} // makes it a donut chart, optional
                         dataKey={dataKey}
                         nameKey={nameKey}
                         labelLine={false}
                         label={renderCustomizedLabel}
                       >
                         {data.map((entry, index) => (
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
    );
}

export default CustomPieChart;
