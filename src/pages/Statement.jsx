import React, { useState, useMemo } from 'react';
import { useData } from '../Context/DataContext';
import { useAuth } from '../Context/AuthContext';
import EditTransactionModal from '../Components/EditTransactionModal'; 

const Statement = () => {
  const { appData, setAppData } = useData();
  const { auth } = useAuth();
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const allTransactions = useMemo(() => {
    const formattedIncome = appData.income.map(i => ({
      _id: i._id,
      date: i.date,
      type: 'Income',
      description: i.source,
      category: i.category,
      amount: i.netAmount,
      details: i.status
    }));

    const formattedExpenses = appData.expenses.map(e => ({
      _id: e._id,
      date: e.date,
      type: 'Expense',
      description: e.merchant,
      category: e.category,
      amount: e.amount,
      details: e.paymentMethod
    }));

    return [...formattedIncome, ...formattedExpenses].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [appData.income, appData.expenses]);

  const totalPages = Math.ceil(allTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  
  const handleDelete = (id, type) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    if (type === 'Income') {
      const newIncome = appData.income.filter(item => item._id !== id);
      setAppData({ ...appData, income: newIncome });
    } else {
      const newExpenses = appData.expenses.filter(item => item._id !== id);
      setAppData({ ...appData, expenses: newExpenses });
    }
  };

  const openEditModal = (transaction) => {
    setEditForm(transaction);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedTransaction) => {
    if (updatedTransaction.type === 'Income') {
      const updatedIncome = appData.income.map(item => 
        item._id === updatedTransaction._id 
          ? { ...item, source: updatedTransaction.description, netAmount: parseFloat(updatedTransaction.amount) } 
          : item
      );
      setAppData({ ...appData, income: updatedIncome });
    } else {
      const updatedExpenses = appData.expenses.map(item => 
        item._id === updatedTransaction._id 
          ? { ...item, merchant: updatedTransaction.description, amount: parseFloat(updatedTransaction.amount) } 
          : item
      );
      setAppData({ ...appData, expenses: updatedExpenses });
    }
    
    setIsEditModalOpen(false);
    setEditForm(null); 
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral">Full Statement</h1>
          <p className="text-neutral opacity-70">Complete transaction history</p>
        </div>
        {auth.role === 'admin' && (
          <span className="badge badge-error badge-outline font-bold">Admin Controls Active</span>
        )}
      </div>

      <div className="bg-base-200 rounded-2xl shadow-lg border border-base-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-300 text-neutral">
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                {auth.role === 'admin' && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((tx) => (
                <tr key={tx._id} className="hover text-neutral">
                  <td className="whitespace-nowrap text-sm">{new Date(tx.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-sm bg-transparent border ${tx.type === 'Income' ? 'border-primary text-primary' : 'border-neutral text-neutral opacity-80'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="font-medium">{tx.description}</td>
                  <td className="text-sm opacity-70">{tx.category}</td>
                  <td className={`font-bold ${tx.type === 'Income' ? 'text-primary' : 'text-neutral'}`}>
                    {tx.type === 'Income' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </td>
                  
                  {auth.role === 'admin' && (
                    <td className="text-right space-x-2">
                      <button onClick={() => openEditModal(tx)} className="btn btn-xs btn-outline btn-info">Edit</button>
                      <button onClick={() => handleDelete(tx._id, tx.type)} className="btn btn-xs btn-outline btn-error">Del</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-base-300 bg-base-100">
         
          <span className="text-sm text-neutral">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, allTransactions.length)} of {allTransactions.length} entries
          </span>
          <div className="join">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="join-item btn btn-sm border-base-300 text-neutral">«</button>
            <button className="join-item btn btn-sm no-animation border-base-300 text-neutral">Page {currentPage}</button>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="join-item btn btn-sm border-base-300 text-neutral">»</button>
          </div>
        </div>
      </div>

      {isEditModalOpen && editForm && (
        <EditTransactionModal 
          transaction={editForm} 
          onClose={() => setIsEditModalOpen(false)} 
          onSave={handleSaveEdit} 
        />
      )}

    </div>
  );
};

export default Statement;