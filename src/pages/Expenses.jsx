import React, { useState, useMemo } from "react";
import { useData } from "../Context/DataContext";
import { useAuth } from "../Context/AuthContext";
import ExpenseBarChartWidget from "../Components/ExpenseBarChartWidget";
import ExpensePieChartWidget from "../Components/ExpensePieChartWidget";
import EditTransactionModal from "../Components/EditTransactionModal";

const Expenses = () => {
  const { appData, setAppData } = useData();
  const { auth } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    merchant: "",
    category: "Food",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Credit Card",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const { yearlyData, pieData, recentExpenses, monthlyTotal, topCategory } =
    useMemo(() => {
      const sorted = [...appData.expenses].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
      const recent = sorted.slice(0, 6);

      const latestDate = new Date(sorted[0]?.date || new Date());
      const currentMonth = latestDate.getMonth();
      const currentYear = latestDate.getFullYear();

      const yearMap = {};
      const catMap = {};
      let monthSum = 0;

      sorted.forEach((exp) => {
        const d = new Date(exp.date);
        const y = d.getFullYear();
        const m = d.getMonth();

        yearMap[y] = (yearMap[y] || 0) + exp.amount;
        catMap[exp.category] = (catMap[exp.category] || 0) + exp.amount;

        if (y === currentYear && m === currentMonth) {
          monthSum += exp.amount;
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
        recentExpenses: recent,
        monthlyTotal: monthSum,
        topCategory: topCat,
      };
    }, [appData.expenses]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (auth.role !== "admin") return;

    const newExpenseEntry = {
      _id: `exp_${Date.now()}`,
      merchant: formData.merchant,
      category: formData.category,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
      paymentMethod: formData.paymentMethod,
    };

    setAppData({
      ...appData,
      expenses: [newExpenseEntry, ...appData.expenses],
    });

    setFormData({
      merchant: "",
      category: "Food",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "Credit Card",
    });
    setIsAddModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;
    const newExpenses = appData.expenses.filter((item) => item._id !== id);
    setAppData({ ...appData, expenses: newExpenses });
  };

  const openEditModal = (transaction) => {
    setEditForm({
      ...transaction,
      description: transaction.merchant,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedTransaction) => {
    const updatedExpenses = appData.expenses.map((item) =>
      item._id === updatedTransaction._id
        ? {
            ...item,
            merchant: updatedTransaction.description,
            amount: parseFloat(updatedTransaction.amount),
          }
        : item,
    );
    setAppData({ ...appData, expenses: updatedExpenses });
    setIsEditModalOpen(false);
    setEditForm(null);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-neutral">Expense Tracking</h1>
          <p className="text-neutral opacity-70">
            Monitor your spending and outflows
          </p>
        </div>

        {auth.role === "admin" && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn bg-[#ef4444] hover:bg-[#dc2626] border-none text-white shadow-lg shadow-red-500/30"
          >
            + Add Expense
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300">
          <p className="text-sm font-medium text-neutral opacity-70 mb-1">
            1-Month Spend (April)
          </p>
          <p className="text-3xl font-bold text-[#ef4444]">
            $
            {monthlyTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300">
          <p className="text-sm font-medium text-neutral opacity-70 mb-1">
            Top Spending Sector
          </p>
          <p className="text-3xl font-bold text-[#f97316]">{topCategory}</p>
        </div>
        <div className="bg-base-200 p-6 rounded-2xl shadow-lg border border-base-300">
          <p className="text-sm font-medium text-neutral opacity-70 mb-1">
            Total Expenses Logged
          </p>
          <p className="text-3xl font-bold text-[#8b5cf6]">
            {appData.expenses.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseBarChartWidget data={yearlyData} />
        </div>
        <div className="lg:col-span-1">
          <ExpensePieChartWidget data={pieData} />
        </div>
      </div>

      <div className="bg-base-200 rounded-2xl shadow-lg border border-base-300 overflow-hidden">
        <div className="p-5 border-b border-base-300">
          <h3 className="text-lg font-semibold text-neutral">
            Recent Transactions
          </h3>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="table w-full text-neutral">
            <thead>
              <tr className="text-neutral opacity-70 border-b border-base-300">
                <th className="whitespace-nowrap">Date</th>
                <th className="whitespace-nowrap">Merchant</th>
                <th className="whitespace-nowrap">Category</th>
                <th className="text-right whitespace-nowrap">Amount</th>
                {auth.role === "admin" && (
                  <th className="text-right whitespace-nowrap">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map((exp) => (
                <tr key={exp._id} className="hover border-b border-base-300/50">
                  <td className="whitespace-nowrap text-sm">
                    {new Date(exp.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="font-medium min-w-[150px]">{exp.merchant}</td>
                  <td className="whitespace-nowrap">
                    <span className="badge badge-sm bg-transparent border border-neutral text-neutral opacity-80">
                      {exp.category}
                    </span>
                  </td>
                  <td className="text-right font-bold text-[#ef4444] whitespace-nowrap">
                    -$
                    {exp.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  {auth.role === "admin" && (
                    <td className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="btn btn-xs btn-outline btn-info"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(exp._id)}
                          className="btn btn-xs btn-outline btn-error"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && editForm && (
        <EditTransactionModal
          transaction={editForm}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}

      {auth.role === "admin" && isAddModalOpen && (
        <dialog open className="modal bg-black/60 backdrop-blur-sm">
          <div className="modal-box bg-base-200 border border-base-300">
            <h3 className="font-bold text-xl mb-6 text-neutral">
              Log New Expense
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="label text-sm font-medium text-neutral">
                  Merchant / Description
                </label>
                <input
                  type="text"
                  value={formData.merchant}
                  onChange={(e) =>
                    setFormData({ ...formData, merchant: e.target.value })
                  }
                  className="input input-bordered w-full bg-base-100 text-neutral"
                  placeholder="e.g. Whole Foods"
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
                    <option value="Food">Food</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Transportation Fee">Transportation</option>
                    <option value="Medical Fees">Medical Fees</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other Fee">Other Fee</option>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-sm font-medium text-neutral">
                    Amount ($)
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
                </div>
                <div>
                  <label className="label text-sm font-medium text-neutral">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="select select-bordered w-full bg-base-100 text-neutral"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Business Account">Business Account</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="modal-action mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-ghost text-neutral"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-[#ef4444] hover:bg-[#dc2626] border-none text-white"
                >
                  Log Expense
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Expenses;
