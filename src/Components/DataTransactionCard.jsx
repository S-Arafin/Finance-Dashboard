import React from 'react';

const DailyTransactionCard = ({ title, transactions, isIncome }) => {
  return (
    <div className="bg-base-200 p-5 rounded-2xl shadow-lg border border-base-300 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-neutral mb-4">{title}</h3>
      <div className="flex-1 overflow-y-auto space-y-3">
        {transactions.length === 0 ? (
          <p className="text-sm text-neutral/50 italic">No activity for this day.</p>
        ) : (
          transactions.map((t) => (
            <div key={t._id} className="flex justify-between items-center border-b border-base-300/50 pb-2 last:border-0">
              <div className="truncate pr-2">
                <p className="text-sm font-medium text-neutral truncate">{isIncome ? t.source : t.merchant}</p>
              </div>
              <p className={`text-sm font-bold whitespace-nowrap ${isIncome ? 'text-primary' : 'text-accent'}`}>
                {isIncome ? '+' : '-'}${isIncome ? t.netAmount.toLocaleString() : t.amount.toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DailyTransactionCard;