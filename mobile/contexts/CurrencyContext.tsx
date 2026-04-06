import React, { createContext, useState, useContext } from 'react';

interface Currency {
  symbol: string;
  code: string;
}

interface CurrencyContextType {
  currency: Currency;
  currencies: Currency[];
  changeCurrency: (code: string) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currencies: Currency[] = [
    { symbol: '$', code: 'USD' },
    { symbol: '₹', code: 'INR' },
    { symbol: '€', code: 'EUR' },
    { symbol: '£', code: 'GBP' }
  ];
  
  const [currency, setCurrency] = useState<Currency>(currencies[0]);

  const formatCurrency = (amount: number) => {
    return `${currency.symbol}${amount.toLocaleString()}`;
  };

  const changeCurrency = (code: string) => {
    const newCurrency = currencies.find(c => c.code === code);
    if (newCurrency) setCurrency(newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, currencies, changeCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
