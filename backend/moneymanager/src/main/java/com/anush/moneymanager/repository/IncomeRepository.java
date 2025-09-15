package com.anush.moneymanager.repository;

import com.anush.moneymanager.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {

    // Find all incomes by username
    List<Income> findByUserUsername(String username);

    // Find incomes by category and user
    List<Income> findByCategoryAndUserUsername(String category, String username);

    // Find incomes within date range for a user
    List<Income> findByUserUsernameAndDateBetween(String username, Date startDate, Date endDate);

    // Calculate total income for a user
    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user.username = :username")
    Double getTotalIncomeByUser(@Param("username") String username);

    // Calculate total income by category for a user
    @Query("SELECT i.category, SUM(i.amount) FROM Income i WHERE i.user.username = :username GROUP BY i.category")
    List<Object[]> getTotalIncomeByCategory(@Param("username") String username);

    // Find incomes by category and date range
    List<Income> findByUserUsernameAndCategoryAndDateBetween(
            String username, String category, Date startDate, Date endDate);
}