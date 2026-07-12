package com.hackathon.transitops.service;

import com.hackathon.transitops.dto.MaintenanceRequest;
import com.hackathon.transitops.entity.MaintenanceLog;
import com.hackathon.transitops.entity.Vehicle;
import com.hackathon.transitops.entity.VehicleStatus;
import com.hackathon.transitops.repository.MaintenanceRepository;
import com.hackathon.transitops.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository, VehicleRepository vehicleRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public MaintenanceLog startMaintenance(MaintenanceRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new IllegalArgumentException("Vehicle is currently on a trip and cannot enter maintenance");
        }

        vehicle.setStatus(VehicleStatus.IN_SHOP);
        vehicleRepository.save(vehicle);

        MaintenanceLog log = MaintenanceLog.builder()
                .vehicle(vehicle)
                .description(request.getDescription())
                .cost(request.getCost())
                .startDate(request.getStartDate())
                .active(true)
                .build();

        return maintenanceRepository.save(log);
    }

    @Transactional
    public MaintenanceLog closeMaintenance(Long logId) {
        MaintenanceLog log = maintenanceRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("Maintenance log not found"));

        if (!log.isActive()) {
            throw new IllegalArgumentException("Maintenance log is already closed");
        }

        log.setActive(false);
        log.setEndDate(LocalDate.now());

        Vehicle vehicle = log.getVehicle();
        if (vehicle.getStatus() == VehicleStatus.IN_SHOP) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
        }

        return maintenanceRepository.save(log);
    }

    public List<MaintenanceLog> getAllMaintenanceLogs() {
        return maintenanceRepository.findAll();
    }
}
