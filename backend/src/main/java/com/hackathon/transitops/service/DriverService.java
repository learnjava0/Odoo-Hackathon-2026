package com.hackathon.transitops.service;

import com.hackathon.transitops.entity.Driver;
import com.hackathon.transitops.entity.DriverStatus;
import com.hackathon.transitops.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public Driver createDriver(Driver driver) {
        if (driverRepository.findByLicenseNumber(driver.getLicenseNumber()).isPresent()) {
            throw new IllegalArgumentException("Driver with this license number already exists");
        }
        driver.setStatus(DriverStatus.AVAILABLE);
        return driverRepository.save(driver);
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Optional<Driver> getDriverById(Long id) {
        return driverRepository.findById(id);
    }

    public Driver updateDriverStatus(Long id, DriverStatus status) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
        driver.setStatus(status);
        return driverRepository.save(driver);
    }
}
