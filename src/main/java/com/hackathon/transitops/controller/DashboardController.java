package com.hackathon.transitops.controller;

import com.hackathon.transitops.entity.TripStatus;
import com.hackathon.transitops.entity.VehicleStatus;
import com.hackathon.transitops.repository.DriverRepository;
import com.hackathon.transitops.repository.TripRepository;
import com.hackathon.transitops.repository.VehicleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    public DashboardController(VehicleRepository vehicleRepository, DriverRepository driverRepository, TripRepository tripRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
    }

    @GetMapping("/kpis")
    @PreAuthorize("hasAnyRole('FLEET_MANAGER', 'FINANCIAL_ANALYST')")
    public ResponseEntity<Map<String, Object>> getKPIs() {
        Map<String, Object> kpis = new HashMap<>();
        
        long totalVehicles = vehicleRepository.count();
        long activeVehicles = vehicleRepository.findAll().stream()
                .filter(v -> v.getStatus() == VehicleStatus.ON_TRIP).count();
        long availableVehicles = vehicleRepository.findAll().stream()
                .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE).count();
        long inShopVehicles = vehicleRepository.findAll().stream()
                .filter(v -> v.getStatus() == VehicleStatus.IN_SHOP).count();

        long activeTrips = tripRepository.findAll().stream()
                .filter(t -> t.getStatus() == TripStatus.DISPATCHED).count();

        double fleetUtilization = totalVehicles == 0 ? 0 : ((double) activeVehicles / totalVehicles) * 100;

        kpis.put("totalVehicles", totalVehicles);
        kpis.put("activeVehicles", activeVehicles);
        kpis.put("availableVehicles", availableVehicles);
        kpis.put("inShopVehicles", inShopVehicles);
        kpis.put("activeTrips", activeTrips);
        kpis.put("fleetUtilizationPercentage", String.format("%.2f", fleetUtilization));

        return ResponseEntity.ok(kpis);
    }
}
