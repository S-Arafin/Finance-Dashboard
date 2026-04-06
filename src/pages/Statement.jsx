import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router'; 
import { useData } from '../Context/DataContext';
import { useAuth } from '../Context/AuthContext';
import EditTransactionModal from '../Components/EditTransactionModal'; 

const Statement = () => {
  const { appData, setAppData } = useData();
  const { auth } = useAuth();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('All');
  const itemsPerPage = 8;

  const [prevSearch, setPrevSearch] = useState(searchTerm);
  const [prevFilter, setPrevFilter] = useState(filterType);

  if (searchTerm !== prevSearch || filterType !== prevFilter) {
    setPrevSearch(searchTerm);
    setPrevFilter(filterType);
    setCurrentPage(1);
  }

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

  const filteredTransactions = useMemo(() => {
    let result = allTransactions;

    if (filterType !== 'All') {
      result = result.filter(tx => tx.type === filterType);
    }

    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      result = result.filter(tx => 
        tx.description.toLowerCase().includes(lowerCaseTerm) ||
        tx.category.toLowerCase().includes(lowerCaseTerm) ||
        tx.type.toLowerCase().includes(lowerCaseTerm) ||
        (tx.details && tx.details.toLowerCase().includes(lowerCaseTerm)) ||
        tx.amount.toString().includes(lowerCaseTerm)
      );
    }

    return result;
  }, [allTransactions, searchTerm, filterType]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

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

  const handleStatementSearch = (e) => {
    const val = e.target.value;
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Description', 'Category', 'Amount', 'Details'];
    
    const csvRows = filteredTransactions.map(tx => {
      return [
        new Date(tx.date).toLocaleDateString(),
        tx.type,
        `"${tx.description.replace(/"/g, '""')}"`,
        tx.category,
        tx.amount,
        `"${(tx.details || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_statement_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
        <div className="w-full lg:w-auto">
          <h1 className="text-3xl font-bold text-neutral mb-1">Full Statement</h1>
          <p className="text-neutral opacity-70 mb-4 lg:mb-0">Complete transaction history</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full lg:w-auto">
          
          <button 
            onClick={handleExportCSV}
            className="btn btn-outline border-base-300 text-neutral hover:bg-base-300 hover:border-base-300 transition-colors hidden sm:flex items-center gap-2"
            title="Download CSV"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>

          {auth.role === 'admin' && (
            <span className="badge badge-error badge-outline font-bold hidden xl:flex">Admin Controls Active</span>
          )}
          
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="select select-bordered w-full sm:w-40 bg-base-100 text-neutral border-base-300 focus:border-primary transition-colors"
          >
            <option value="All">All Types</option>
            <option value="Income">Income Only</option>
            <option value="Expense">Expense Only</option>
          </select>

          <div className="relative w-full sm:w-80">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search amount, merchant, method..." 
              value={searchTerm}
              onChange={handleStatementSearch}
              className="input input-bordered w-full pl-10 bg-base-100 text-neutral border-base-300 focus:border-primary transition-colors"
            />
          </div>
        </div>
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
              {currentItems.length > 0 ? (
                currentItems.map((tx) => (
                  <tr key={tx._id} className="hover text-neutral border-b border-base-300/50">
                    <td className="whitespace-nowrap text-sm">{new Date(tx.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-sm bg-transparent border ${tx.type === 'Income' ? 'border-primary text-primary' : 'border-neutral text-neutral opacity-80'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="font-medium">
                      {tx.description}
                      <br/>
                      <span className="text-xs opacity-60 font-normal">{tx.details}</span>
                    </td>
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
                ))
              ) : (
                <tr>
                  <td colSpan={auth.role === 'admin' ? 6 : 5} className="text-center py-12">
                    <p className="text-neutral opacity-60 text-lg">No transactions found matching your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-base-300 bg-base-100">
          <span className="text-sm text-neutral">
            Showing {filteredTransactions.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} entries
          </span>
          <div className="join">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="join-item btn btn-sm border-base-300 text-neutral bg-base-200 hover:bg-base-300">«</button>
            <button className="join-item btn btn-sm no-animation border-base-300 text-neutral bg-base-100">Page {currentPage} of {totalPages}</button>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="join-item btn btn-sm border-base-300 text-neutral bg-base-200 hover:bg-base-300">»</button>
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