package com.hackathon.transitops.controller;

import com.hackathon.transitops.entity.Expense;
import com.hackathon.transitops.entity.FuelLog;
import com.hackathon.transitops.entity.MaintenanceLog;
import com.hackathon.transitops.entity.Vehicle;
import com.hackathon.transitops.repository.ExpenseRepository;
import com.hackathon.transitops.repository.FuelLogRepository;
import com.hackathon.transitops.repository.MaintenanceRepository;
import com.hackathon.transitops.repository.VehicleRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final VehicleRepository vehicleRepository;
    private final FuelLogRepository fuelLogRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final ExpenseRepository expenseRepository;

    public ReportController(VehicleRepository vehicleRepository, FuelLogRepository fuelLogRepository, MaintenanceRepository maintenanceRepository, ExpenseRepository expenseRepository) {
        this.vehicleRepository = vehicleRepository;
        this.fuelLogRepository = fuelLogRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.expenseRepository = expenseRepository;
    }

    @GetMapping("/vehicle/{id}/roi")
    @PreAuthorize("hasAnyRole('FLEET_MANAGER', 'FINANCIAL_ANALYST')")
    public ResponseEntity<Map<String, Object>> getVehicleROI(@PathVariable Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        List<FuelLog> fuelLogs = fuelLogRepository.findByVehicleId(id);
        List<MaintenanceLog> maintenanceLogs = maintenanceRepository.findByVehicleId(id);
        List<Expense> expenses = expenseRepository.findByVehicleId(id);

        BigDecimal totalFuelCost = fuelLogs.stream().map(FuelLog::getCost).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalMaintenanceCost = maintenanceLogs.stream().map(MaintenanceLog::getCost).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpenses = expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalOperationalCost = totalFuelCost.add(totalMaintenanceCost).add(totalExpenses);
        
        BigDecimal estimatedRevenue = BigDecimal.valueOf(vehicle.getOdometer() * 2.0);

        BigDecimal roi = BigDecimal.ZERO;
        if (vehicle.getAcquisitionCost().compareTo(BigDecimal.ZERO) > 0) {
            roi = estimatedRevenue.subtract(totalOperationalCost)
                    .divide(vehicle.getAcquisitionCost(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }

        Map<String, Object> report = new HashMap<>();
        report.put("vehicle", vehicle.getRegistrationNumber());
        report.put("totalOperationalCost", totalOperationalCost);
        report.put("estimatedRevenue", estimatedRevenue);
        report.put("roiPercentage", String.format("%.2f", roi));

        return ResponseEntity.ok(report);
    }

    @GetMapping("/export/csv")
    @PreAuthorize("hasAnyRole('FLEET_MANAGER', 'FINANCIAL_ANALYST')")
    public ResponseEntity<byte[]> exportVehiclesCsv() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        StringBuilder csvContent = new StringBuilder();
        csvContent.append("Registration Number,Model,Type,Capacity,Odometer,Status,Acquisition Cost\n");
        
        for (Vehicle v : vehicles) {
            csvContent.append(String.format("%s,%s,%s,%.2f,%.2f,%s,%.2f\n",
                    v.getRegistrationNumber(),
                    v.getNameModel(),
                    v.getType(),
                    v.getMaxLoadCapacity(),
                    v.getOdometer(),
                    v.getStatus(),
                    v.getAcquisitionCost()));
        }

        byte[] output = csvContent.toString().getBytes();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "vehicles_report.csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(output);
    }
}
