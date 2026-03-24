import React, { createContext, useState, useContext } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const currencies = [
    { symbol: '$', code: 'USD' },
    { symbol: '₹', code: 'INR' },
    { symbol: '€', code: 'EUR' },
    { symbol: '£', code: 'GBP' }
  ];
  
  const [currency, setCurrency] = useState(currencies[0]);

  const formatCurrency = (amount) => {
    return `${currency.symbol}${amount.toLocaleString()}`;
  };

  const changeCurrency = (code) => {
    const newCurrency = currencies.find(c => c.code === code);
    if (newCurrency) setCurrency(newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, currencies, changeCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
