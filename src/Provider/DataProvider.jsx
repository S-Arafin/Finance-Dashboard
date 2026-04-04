import React, { useState, useEffect, useMemo } from 'react';
import { DataContext } from '../Context/DataContext';
import mockData from '../data/MockData.json';

export const DataProvider = ({ children }) => {
  const [appData, setAppData] = useState(() => {
    const savedData = localStorage.getItem('financeAppData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return mockData;
  });

  useEffect(() => {
    localStorage.setItem('financeAppData', JSON.stringify(appData));
  }, [appData]);

  const contextValue = useMemo(() => ({
    appData,
    setAppData
  }), [appData]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};