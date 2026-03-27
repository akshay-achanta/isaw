import React, { createContext, useContext, useState } from 'react';
import { format, isSameDay } from 'date-fns';

const DateContext = createContext();

export const useDate = () => useContext(DateContext);

export const DateProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isSelectedDate = (dateString) => {
    if (!dateString) return false;
    // Safely extract just the 'yyyy-MM-dd' portion from the DB string, preventing UTC-to-Local JS drift!
    const localDateStr = dateString.split('T')[0]; 
    const selectedStr = format(selectedDate, 'yyyy-MM-dd');
    return localDateStr === selectedStr;
  };

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate, isSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
};
