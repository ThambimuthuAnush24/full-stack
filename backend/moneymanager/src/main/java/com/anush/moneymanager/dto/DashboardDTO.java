package com.anush.moneymanager.dto;

import java.util.List;
import java.util.Map;

public class DashboardDTO {
    private Double totalIncome;
    private Double totalExpense;
    private Double balance;
    private List<Map<String, Object>> incomeByCategory;
    private List<Map<String, Object>> expenseByCategory;
    private List<Map<String, Object>> recentTransactions;

    // Getters and setters
    public Double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(Double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public Double getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(Double totalExpense) {
        this.totalExpense = totalExpense;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public List<Map<String, Object>> getIncomeByCategory() {
        return incomeByCategory;
    }

    public void setIncomeByCategory(List<Map<String, Object>> incomeByCategory) {
        this.incomeByCategory = incomeByCategory;
    }

    public List<Map<String, Object>> getExpenseByCategory() {
        return expenseByCategory;
    }

    public void setExpenseByCategory(List<Map<String, Object>> expenseByCategory) {
        this.expenseByCategory = expenseByCategory;
    }

    public List<Map<String, Object>> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<Map<String, Object>> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }
}
