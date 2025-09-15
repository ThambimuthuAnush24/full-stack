package com.anush.moneymanager.repository;

import com.anush.moneymanager.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Find all expenses by username
    List<Expense> findByUserUsername(String username);

    // Find expenses by category and user
    List<Expense> findByCategoryAndUserUsername(String category, String username);

    // Find expenses within date range for a user
    List<Expense> findByUserUsernameAndDateBetween(String username, Date startDate, Date endDate);

    // Calculate total expenses for a user
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.username = :username")
    Double getTotalExpensesByUser(@Param("username") String username);

    // Calculate total expenses by category for a user
    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.user.username = :username GROUP BY e.category")
    List<Object[]> getTotalExpensesByCategory(@Param("username") String username);

    // Find expenses by category and date range
    List<Expense> findByUserUsernameAndCategoryAndDateBetween(
            String username, String category, Date startDate, Date endDate);
}
