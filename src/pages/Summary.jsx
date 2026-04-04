import React, { useMemo } from 'react';
import { useData } from '../Context/DataContext';
import LineChartWidget from '../Components/LineChartWidget';
import RadarChartWidget from '../Components/RadarChartWidget';
import DailyTransactionCard from '../Components/DataTransactionCard';

const Summary = () => {
  const { appData } = useData();
  const { user, summary, expenses, income } = appData;

  const trueBalance = summary.totalGrossIncome - summary.estimatedTaxOwed - summary.totalExpenses;

  const { lineData, radarData, todaysExpenses, todaysIncome } = useMemo(() => {
    
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});
    
    const formattedRadarData = Object.keys(categoryTotals).map(key => ({
      category: key,
      amount: categoryTotals[key]
    }));

    const formattedLineData = Array.from({ length: 30 }, (_, i) => {
      const day = (i + 1).toString().padStart(2, '0');
      const dailyExpense = ((i * 47) % 200) + 50; 
      
      let totalExpensesUpToToday = 0;
      for (let j = 0; j <= i; j++) {
        totalExpensesUpToToday += ((j * 47) % 200) + 50;
      }
      
      const currentBalance = summary.investmentPortfolioValue - totalExpensesUpToToday;

      return { 
        day: `Apr ${day}`, 
        balance: currentBalance, 
        expenses: dailyExpense 
      };
    });

    const targetExpenseDate = "2026-04-02"; 
    const filteredExpenses = expenses.filter(e => e.date.startsWith(targetExpenseDate));
    
    const targetIncomeDate = "2026-04-01";
    const filteredIncome = income.filter(i => i.date.startsWith(targetIncomeDate));

    return { 
      lineData: formattedLineData, 
      radarData: formattedRadarData,
      todaysExpenses: filteredExpenses,
      todaysIncome: filteredIncome
    };
  }, [expenses, income, summary]);

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-content">Dashboard Overview</h1>
          <p className="text-neutral">Welcome back, {user?.name || 'User'} | {summary.period}</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-6 py-4 rounded-xl text-right">
          <p className="text-sm font-semibold text-neutral">Current Balance (After Tax)</p>
          <p className="text-3xl font-bold text-primary">${trueBalance.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LineChartWidget data={lineData} />
        </div>
        <div className="lg:col-span-1">
          <RadarChartWidget data={radarData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-64">
        <DailyTransactionCard 
          title="Latest Income Activity" 
          transactions={todaysIncome} 
          isIncome={true} 
        />
        <DailyTransactionCard 
          title="Latest Expense Activity" 
          transactions={todaysExpenses} 
          isIncome={false} 
        />
      </div>

    </div>
  );
};

export default Summary;