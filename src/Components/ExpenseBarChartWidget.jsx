import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ExpenseBarChartWidget = ({ data }) => {
  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300 h-[450px] flex flex-col">
      <h3 className="text-lg font-semibold text-neutral mb-4">Yearly Expense Trends</h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-base-300)" />
            <XAxis dataKey="year" stroke="var(--color-neutral)" tickLine={false} axisLine={false} />
            <YAxis width={60} stroke="var(--color-neutral)" tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
            <Tooltip 
              cursor={{ fill: 'var(--color-base-300)', opacity: 0.4 }}
              contentStyle={{ backgroundColor: 'var(--color-base-100)', borderColor: 'var(--color-base-300)', color: 'var(--color-neutral)', borderRadius: '8px' }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Total Spent']}
            />
            <Bar dataKey="amount" fill="#ef4444" radius={[6, 6, 0, 0]} /> 
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseBarChartWidget;