package com.hackathon.transitops.service;

import com.hackathon.transitops.entity.Driver;
import com.hackathon.transitops.repository.DriverRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LicenseExpiryScheduler {

    private final DriverRepository driverRepository;

    public LicenseExpiryScheduler(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    // Runs every day at 8 AM
    @Scheduled(cron = "0 0 8 * * *")
    public void checkExpiringLicenses() {
        System.out.println("Running scheduled task: Checking for expiring driver licenses...");
        LocalDate warningDate = LocalDate.now().plusDays(30);
        
        List<Driver> drivers = driverRepository.findAll();
        for (Driver driver : drivers) {
            if (driver.getLicenseExpiryDate().isBefore(LocalDate.now())) {
                System.out.printf("ALERT: Driver %s (License: %s) has an EXPIRED license!%n", 
                        driver.getName(), driver.getLicenseNumber());
            } else if (driver.getLicenseExpiryDate().isBefore(warningDate)) {
                System.out.printf("WARNING: Driver %s (License: %s) license will expire on %s. Mock sending email...%n", 
                        driver.getName(), driver.getLicenseNumber(), driver.getLicenseExpiryDate());
            }
        }
    }
}
