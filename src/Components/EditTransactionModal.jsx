import React, { useState } from 'react';

const EditTransactionModal = ({ transaction, onClose, onSave }) => {
  const [formData, setFormData] = useState({ 
    description: transaction.description, 
    amount: transaction.amount 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...transaction,
      description: formData.description,
      amount: formData.amount
    });
  };

  return (
    <dialog open className="modal bg-black/50">
      <div className="modal-box bg-base-200">
        <h3 className="font-bold text-lg mb-4 text-base-content">Edit Transaction</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label text-sm font-medium">Description / Merchant</label>
            <input 
              type="text" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="input input-bordered w-full bg-base-100" 
              required 
            />
          </div>
          
          <div>
            <label className="label text-sm font-medium">Amount ($)</label>
            <input 
              type="number" 
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="input input-bordered w-full bg-base-100" 
              required 
            />
          </div>

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default EditTransactionModal;