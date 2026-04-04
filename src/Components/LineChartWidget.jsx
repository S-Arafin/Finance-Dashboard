import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const LineChartWidget = ({ data }) => {
  return (
    <div className="w-full h-80 bg-base-200 p-4 rounded-2xl shadow-lg border border-base-300 flex flex-col">
      <h3 className="text-lg font-semibold text-neutral mb-4">Monthly Trend: Balance vs Expenses</h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" opacity={0.4} />
            <XAxis dataKey="day" stroke="var(--color-neutral)" fontSize={12} tickLine={false} axisLine={false} />
            
            <YAxis 
              yAxisId="left" 
              stroke="var(--color-neutral)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              domain={['auto', 'auto']} 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} 
            />
            
            {/* RIGHT AXIS: For the smaller Daily Expenses */}
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="var(--color-neutral)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `$${value}`} 
            />

            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-base-100)', borderColor: 'var(--color-base-300)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--color-neutral)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }}/>
            
            <Line yAxisId="left" type="monotone" dataKey="balance" name="Balance" stroke="var(--color-primary)" strokeWidth={3} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="expenses" name="Daily Expenses" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartWidget;