package com.hackathon.transitops.repository;

import com.hackathon.transitops.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByVehicleId(Long vehicleId);
}
