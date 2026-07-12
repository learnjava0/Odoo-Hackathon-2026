package com.hackathon.transitops.service;

import com.hackathon.transitops.dto.ExpenseRequest;
import com.hackathon.transitops.entity.Expense;
import com.hackathon.transitops.entity.Trip;
import com.hackathon.transitops.entity.Vehicle;
import com.hackathon.transitops.repository.ExpenseRepository;
import com.hackathon.transitops.repository.TripRepository;
import com.hackathon.transitops.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;

    public ExpenseService(ExpenseRepository expenseRepository, VehicleRepository vehicleRepository, TripRepository tripRepository) {
        this.expenseRepository = expenseRepository;
        this.vehicleRepository = vehicleRepository;
        this.tripRepository = tripRepository;
    }

    public Expense logExpense(ExpenseRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        Trip trip = null;
        if (request.getTripId() != null) {
            trip = tripRepository.findById(request.getTripId())
                    .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
        }

        Expense expense = Expense.builder()
                .vehicle(vehicle)
                .description(request.getDescription())
                .amount(request.getAmount())
                .expenseDate(request.getExpenseDate())
                .trip(trip)
                .build();

        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }
}
