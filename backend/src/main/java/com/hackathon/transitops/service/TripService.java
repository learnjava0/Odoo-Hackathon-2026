package com.hackathon.transitops.service;

import com.hackathon.transitops.dto.TripCompleteRequest;
import com.hackathon.transitops.dto.TripRequest;
import com.hackathon.transitops.entity.*;
import com.hackathon.transitops.repository.DriverRepository;
import com.hackathon.transitops.repository.TripRepository;
import com.hackathon.transitops.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public TripService(TripRepository tripRepository, VehicleRepository vehicleRepository, DriverRepository driverRepository) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
    }

    @Transactional
    public Trip createTrip(TripRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));

        if (request.getCargoWeight() > vehicle.getMaxLoadCapacity()) {
            throw new IllegalArgumentException("Cargo weight exceeds vehicle's maximum load capacity");
        }

        Trip trip = Trip.builder()
                .source(request.getSource())
                .destination(request.getDestination())
                .vehicle(vehicle)
                .driver(driver)
                .cargoWeight(request.getCargoWeight())
                .plannedDistance(request.getPlannedDistance())
                .status(TripStatus.DRAFT)
                .createdAt(LocalDateTime.now())
                .build();

        return tripRepository.save(trip);
    }

    @Transactional
    public Trip dispatchTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));

        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new IllegalArgumentException("Only DRAFT trips can be dispatched");
        }

        Vehicle vehicle = trip.getVehicle();
        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new IllegalArgumentException("Vehicle is not available for dispatch");
        }

        Driver driver = trip.getDriver();
        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new IllegalArgumentException("Driver is not available for dispatch");
        }
        if (driver.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Driver's license is expired");
        }

        vehicle.setStatus(VehicleStatus.ON_TRIP);
        driver.setStatus(DriverStatus.ON_TRIP);
        trip.setStatus(TripStatus.DISPATCHED);

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip completeTrip(Long tripId, TripCompleteRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));

        if (trip.getStatus() != TripStatus.DISPATCHED) {
            throw new IllegalArgumentException("Only DISPATCHED trips can be completed");
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicle.setOdometer(request.getFinalOdometer());
        driver.setStatus(DriverStatus.AVAILABLE);

        trip.setStatus(TripStatus.COMPLETED);
        trip.setFinalOdometer(request.getFinalOdometer());
        trip.setFuelConsumed(request.getFuelConsumed());
        trip.setCompletedAt(LocalDateTime.now());

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip cancelTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));

        if (trip.getStatus() == TripStatus.COMPLETED || trip.getStatus() == TripStatus.CANCELLED) {
            throw new IllegalArgumentException("Trip cannot be cancelled");
        }

        if (trip.getStatus() == TripStatus.DISPATCHED) {
            Vehicle vehicle = trip.getVehicle();
            Driver driver = trip.getDriver();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            driver.setStatus(DriverStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
            driverRepository.save(driver);
        }

        trip.setStatus(TripStatus.CANCELLED);
        return tripRepository.save(trip);
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }
}
