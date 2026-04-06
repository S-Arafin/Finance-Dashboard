import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const PIE_COLORS = ['#10b981', '#3b82f6', '#6366f1', '#f59e0b', '#ec4899'];

const RevenuePieChartWidget = ({ data }) => {
  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300 h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-neutral mb-4">Revenue Sources</h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              cx="50%" cy="45%" 
              innerRadius={60} outerRadius={90} 
              paddingAngle={5} dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-base-100)', borderColor: 'var(--color-base-300)', color: 'var(--color-neutral)', borderRadius: '8px' }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'var(--color-neutral)' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenuePieChartWidget;