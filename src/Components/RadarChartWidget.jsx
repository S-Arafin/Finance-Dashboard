import React from 'react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';

const RadarChartWidget = ({ data }) => {
  return (
    <div className="w-full h-80 bg-base-200 p-4 rounded-2xl shadow-lg border border-base-300 flex flex-col">
      <h3 className="text-lg font-semibold text-neutral mb-2">Expenditure Breakdown</h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="var(--color-base-300)" />
            <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--color-neutral)', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-base-100)', borderColor: 'var(--color-base-300)', borderRadius: '8px' }}
            />
            <Radar name="Spent" dataKey="amount" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarChartWidget;