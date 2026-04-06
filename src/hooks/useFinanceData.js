import { useState, useEffect } from 'react';
import storageService from '../services/storageService';

export const useIncome = () => {
  const [income, setIncome] = useState([]);

  useEffect(() => {
    setIncome(storageService.getIncome());
  }, []);

  const addIncome = (item) => {
    const newIncome = [...income, { ...item, id: Math.random().toString(36).substr(2, 9) }];
    setIncome(newIncome);
    storageService.setIncome(newIncome);
  };

  const updateIncome = (id, updatedItem) => {
    const newIncome = income.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setIncome(newIncome);
    storageService.setIncome(newIncome);
  };

  const deleteIncome = (id) => {
    const newIncome = income.filter(item => item.id !== id);
    setIncome(newIncome);
    storageService.setIncome(newIncome);
  };

  return { income, addIncome, updateIncome, deleteIncome };
};

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    setExpenses(storageService.getExpenses());
  }, []);

  const addExpense = (item) => {
    const newExpenses = [...expenses, { ...item, id: Math.random().toString(36).substr(2, 9) }];
    setExpenses(newExpenses);
    storageService.setExpenses(newExpenses);
  };

  const updateExpense = (id, updatedItem) => {
    const newExpenses = expenses.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setExpenses(newExpenses);
    storageService.setExpenses(newExpenses);
  };

  const deleteExpense = (id) => {
    const newExpenses = expenses.filter(item => item.id !== id);
    setExpenses(newExpenses);
    storageService.setExpenses(newExpenses);
  };

  return { expenses, addExpense, updateExpense, deleteExpense };
};

export const useExpenseLimits = () => {
  const [limits, setLimits] = useState({});

  useEffect(() => {
    setLimits(storageService.getExpenseLimits());
  }, []);

  const updateLimit = (category, limit) => {
    const newLimits = { ...limits, [category]: limit };
    setLimits(newLimits);
    storageService.setExpenseLimits(newLimits);
  };

  return { limits, updateLimit };
};

export const useEMIs = () => {
  const [emis, setEmis] = useState([]);

  useEffect(() => {
    setEmis(storageService.getEMIs());
  }, []);

  const addEMI = (item) => {
    const newEmis = [...emis, { ...item, id: Math.random().toString(36).substr(2, 9) }];
    setEmis(newEmis);
    storageService.setEMIs(newEmis);
  };

  const updateEMI = (id, updatedItem) => {
    const newEmis = emis.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setEmis(newEmis);
    storageService.setEMIs(newEmis);
  };

  const deleteEMI = (id) => {
    const newEmis = emis.filter(item => item.id !== id);
    setEmis(newEmis);
    storageService.setEMIs(newEmis);
  };

  return { emis, addEMI, updateEMI, deleteEMI };
};

export const useFees = () => {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    setFees(storageService.getFees());
  }, []);

  const addFee = (item) => {
    const newFees = [...fees, { ...item, id: Math.random().toString(36).substr(2, 9) }];
    setFees(newFees);
    storageService.setFees(newFees);
  };

  const updateFee = (id, updatedItem) => {
    const newFees = fees.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setFees(newFees);
    storageService.setFees(newFees);
  };

  const deleteFee = (id) => {
    const newFees = fees.filter(item => item.id !== id);
    setFees(newFees);
    storageService.setFees(newFees);
  };

  return { fees, addFee, updateFee, deleteFee };
};

export const useSavings = () => {
  const [savings, setSavings] = useState([]);

  useEffect(() => {
    setSavings(storageService.getSavings());
  }, []);

  const addSaving = (item) => {
    const newSavings = [...savings, { ...item, id: Math.random().toString(36).substr(2, 9) }];
    setSavings(newSavings);
    storageService.setSavings(newSavings);
  };

  const updateSaving = (id, updatedItem) => {
    const newSavings = savings.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setSavings(newSavings);
    storageService.setSavings(newSavings);
  };

  const deleteSaving = (id) => {
    const newSavings = savings.filter(item => item.id !== id);
    setSavings(newSavings);
    storageService.setSavings(newSavings);
  };

  return { savings, addSaving, updateSaving, deleteSaving };
};

export const useInvestments = () => {
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    setInvestments(storageService.getInvestments());
  }, []);

  const addInvestment = (item) => {
    const newInvestments = [...investments, { ...item, id: Math.random().toString(36).substr(2, 9) }];
    setInvestments(newInvestments);
    storageService.setInvestments(newInvestments);
  };

  const updateInvestment = (id, updatedItem) => {
    const newInvestments = investments.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setInvestments(newInvestments);
    storageService.setInvestments(newInvestments);
  };

  const deleteInvestment = (id) => {
    const newInvestments = investments.filter(item => item.id !== id);
    setInvestments(newInvestments);
    storageService.setInvestments(newInvestments);
  };

  return { investments, addInvestment, updateInvestment, deleteInvestment };
};

export const useTrips = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    setTrips(storageService.getTrips());
  }, []);

  const addTrip = (item) => {
    const newTrips = [...trips, { ...item, id: Math.random().toString(36).substr(2, 9), expenses: [] }];
    setTrips(newTrips);
    storageService.setTrips(newTrips);
  };

  const updateTrip = (id, updatedItem) => {
    const newTrips = trips.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setTrips(newTrips);
    storageService.setTrips(newTrips);
  };

  const deleteTrip = (id) => {
    const newTrips = trips.filter(item => item.id !== id);
    setTrips(newTrips);
    storageService.setTrips(newTrips);
  };

  const addTripExpense = (tripId, expense) => {
    const newTrips = trips.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          expenses: [...trip.expenses, { ...expense, id: Math.random().toString(36).substr(2, 9) }]
        };
      }
      return trip;
    });
    setTrips(newTrips);
    storageService.setTrips(newTrips);
  };

  return { trips, addTrip, updateTrip, deleteTrip, addTripExpense };
};