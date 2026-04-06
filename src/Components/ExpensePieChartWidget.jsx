import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const PIE_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

const renderCustomLegend = (props) => {
  const { payload } = props;
  
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 px-2">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral">
          <span 
            className="w-3 h-3 rounded-full shrink-0" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="truncate max-w-[90px] sm:max-w-none" title={entry.value}>
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );
};

const ExpensePieChartWidget = ({ data }) => {
  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300 h-[450px] flex flex-col overflow-hidden">
      <h3 className="text-lg font-semibold text-neutral mb-4">Spending by Category</h3>
      <div className="flex-1 w-full h-full min-h-0">
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
            <Legend content={renderCustomLegend} verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpensePieChartWidget;