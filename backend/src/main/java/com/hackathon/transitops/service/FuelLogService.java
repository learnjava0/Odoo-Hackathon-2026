package com.hackathon.transitops.service;

import com.hackathon.transitops.dto.FuelLogRequest;
import com.hackathon.transitops.entity.FuelLog;
import com.hackathon.transitops.entity.Trip;
import com.hackathon.transitops.entity.Vehicle;
import com.hackathon.transitops.repository.FuelLogRepository;
import com.hackathon.transitops.repository.TripRepository;
import com.hackathon.transitops.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuelLogService {

    private final FuelLogRepository fuelLogRepository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;

    public FuelLogService(FuelLogRepository fuelLogRepository, VehicleRepository vehicleRepository, TripRepository tripRepository) {
        this.fuelLogRepository = fuelLogRepository;
        this.vehicleRepository = vehicleRepository;
        this.tripRepository = tripRepository;
    }

    public FuelLog logFuel(FuelLogRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        Trip trip = null;
        if (request.getTripId() != null) {
            trip = tripRepository.findById(request.getTripId())
                    .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
        }

        FuelLog log = FuelLog.builder()
                .vehicle(vehicle)
                .liters(request.getLiters())
                .cost(request.getCost())
                .logDate(request.getLogDate())
                .trip(trip)
                .build();

        return fuelLogRepository.save(log);
    }

    public List<FuelLog> getAllFuelLogs() {
        return fuelLogRepository.findAll();
    }
}
