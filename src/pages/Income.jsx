import React, { useState, useMemo } from "react";
import { useData } from "../Context/DataContext";
import { useAuth } from "../Context/AuthContext";
import YearlyBarChartWidget from "../Components/YearlyBarChartWidget";
import RevenuePieChartWidget from "../Components/RevenuePieChartWidget";

const Income = () => {
  const { appData, setAppData } = useData();
  const { auth } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    source: "",
    category: "Business",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const { yearlyData, pieData, recentIncome, monthlyTotal, topCategory } =
    useMemo(() => {
      const sorted = [...appData.income].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
      const recent = sorted.slice(0, 6);

      const latestDate = new Date(sorted[0]?.date || new Date());
      const currentMonth = latestDate.getMonth();
      const currentYear = latestDate.getFullYear();

      const yearMap = {};
      const catMap = {};
      let monthSum = 0;

      sorted.forEach((inc) => {
        const d = new Date(inc.date);
        const y = d.getFullYear();
        const m = d.getMonth();

        yearMap[y] = (yearMap[y] || 0) + inc.netAmount;
        catMap[inc.category] = (catMap[inc.category] || 0) + inc.netAmount;

        if (y === currentYear && m === currentMonth) {
          monthSum += inc.netAmount;
        }
      });

      const yData = Object.keys(yearMap)
        .map((y) => ({ year: y, amount: yearMap[y] }))
        .sort((a, b) => a.year - b.year);

      const pData = Object.keys(catMap).map((c) => ({
        name: c,
        value: catMap[c],
      }));
      const topCat = pData.sort((a, b) => b.value - a.value)[0]?.name || "N/A";

      return {
        yearlyData: yData,
        pieData: pData,
        recentIncome: recent,
        monthlyTotal: monthSum,
        topCategory: topCat,
      };
    }, [appData.income]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (auth.role !== "admin") return;

    const gross = parseFloat(formData.amount);
    const tax = gross * 0.24;
    const net = gross - tax;

    const newIncomeEntry = {
      _id: `inc_${Date.now()}`,
      source: formData.source,
      category: formData.category,
      grossAmount: gross,
      taxDeducted: tax,
      netAmount: net,
      frequency: "One-Time",
      date: new Date(formData.date).toISOString(),
      status: "Deposited",
    };

    setAppData({
      ...appData,
      income: [newIncomeEntry, ...appData.income],
    });

    setFormData({
      source: "",
      category: "Business",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-neutral">Income Overview</h1>
          <p className="text-neutral opacity-70">
            Track your cash inflows and revenue streams
          </p>
        </div>

        {auth.role === "admin" && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary text-white shadow-lg shadow-primary/30"
          >
            + Add Income
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300">
          <p className="text-sm font-medium text-neutral opacity-70 mb-1">
            1-Month Revenue (April)
          </p>
          <p className="text-3xl font-bold text-primary">
            ${monthlyTotal.toLocaleString()}
          </p>
        </div>
        <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300">
          <p className="text-sm font-medium text-neutral opacity-70 mb-1">
            Top Income Sector
          </p>
          <p className="text-3xl font-bold text-secondary">{topCategory}</p>
        </div>
        <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300">
          <p className="text-sm font-medium text-neutral opacity-70 mb-1">
            Total Entries Logged
          </p>
          <p className="text-3xl font-bold text-accent">
            {appData.income.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <YearlyBarChartWidget data={yearlyData} />
        </div>
        <div className="lg:col-span-1">
          <RevenuePieChartWidget data={pieData} />
        </div>
      </div>

      <div className="bg-base-200 rounded-2xl shadow-lg border border-base-300 overflow-hidden">
        <div className="p-5 border-b border-base-300">
          <h3 className="text-lg font-semibold text-neutral">Recent Inflows</h3>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="table w-full text-neutral">
            <thead>
              <tr className="text-neutral opacity-70 border-b border-base-300">
                <th>Date</th>
                <th>Source</th>
                <th>Category</th>
                <th className="text-right">Net Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentIncome.map((inc) => (
                <tr key={inc._id} className="hover border-b border-base-300/50">
                  <td className="whitespace-nowrap">
                    {new Date(inc.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="font-medium">{inc.source}</td>
                  <td>
                    <span className="badge badge-sm bg-transparent border border-neutral text-neutral opacity-80">
                      {inc.category}
                    </span>
                  </td>

                  <td className="text-right font-bold text-primary">
                    +${inc.netAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {auth.role === "admin" && isAddModalOpen && (
        <dialog open className="modal bg-black/60 backdrop-blur-sm">
          <div className="modal-box bg-base-200 border border-base-300">
            <h3 className="font-bold text-xl mb-6 text-neutral">
              Add New Income
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="label text-sm font-medium text-neutral">
                  Income Source / Client
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  className="input input-bordered w-full bg-base-100 text-neutral"
                  placeholder="e.g. Freelance Project"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-sm font-medium text-neutral">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="select select-bordered w-full bg-base-100 text-neutral"
                  >
                    <option value="Employment">Employment</option>
                    <option value="Business">Business</option>
                    <option value="Investments">Investments</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label text-sm font-medium text-neutral">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="input input-bordered w-full bg-base-100 text-neutral"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label text-sm font-medium text-neutral">
                  Gross Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="input input-bordered w-full bg-base-100 text-neutral"
                  placeholder="0.00"
                  required
                />
                <label className="label">
                  <span className="label-text-alt text-neutral opacity-60">
                    Net amount will auto-calculate with 24% tax deduction.
                  </span>
                </label>
              </div>

              <div className="modal-action mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-ghost text-neutral"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-white">
                  Log Income
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Income;
