package com.hackathon.transitops.config;

import com.hackathon.transitops.entity.*;
import com.hackathon.transitops.repository.DriverRepository;
import com.hackathon.transitops.repository.UserRepository;
import com.hackathon.transitops.repository.VehicleRepository;
import com.hackathon.transitops.repository.TripRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UserRepository userRepository, 
                               VehicleRepository vehicleRepository, 
                               DriverRepository driverRepository, 
                               TripRepository tripRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            User admin = null;
            if (userRepository.count() == 0) {
                admin = userRepository.save(User.builder()
                        .email("admin@transitops.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.FLEET_MANAGER)
                        .build());
                userRepository.save(User.builder()
                        .email("driver1@transitops.com")
                        .password(passwordEncoder.encode("driver123"))
                        .role(Role.DRIVER)
                        .build());
            } else {
                admin = userRepository.findAll().get(0);
            }

            Vehicle v1 = null;
            Vehicle v2 = null;
            if (vehicleRepository.count() == 0) {
                v1 = vehicleRepository.save(Vehicle.builder()
                        .registrationNumber("VAN-01")
                        .nameModel("Ford Transit")
                        .type("Van")
                        .maxLoadCapacity(1500.0)
                        .odometer(5000.0)
                        .acquisitionCost(new BigDecimal("35000.00"))
                        .status(VehicleStatus.AVAILABLE)
                        .build());
                v2 = vehicleRepository.save(Vehicle.builder()
                        .registrationNumber("TRK-02")
                        .nameModel("Volvo FH")
                        .type("Truck")
                        .maxLoadCapacity(18000.0)
                        .odometer(120000.0)
                        .acquisitionCost(new BigDecimal("120000.00"))
                        .status(VehicleStatus.AVAILABLE)
                        .build());
            } else {
                v1 = vehicleRepository.findAll().get(0);
                v2 = vehicleRepository.findAll().size() > 1 ? vehicleRepository.findAll().get(1) : v1;
            }

            Driver d1 = null;
            if (driverRepository.count() == 0) {
                d1 = driverRepository.save(Driver.builder()
                        .name("John Doe")
                        .licenseNumber("DL-12345")
                        .licenseCategory("C")
                        .licenseExpiryDate(LocalDate.now().plusYears(2))
                        .contactNumber("+1234567890")
                        .safetyScore(98)
                        .status(DriverStatus.AVAILABLE)
                        .build());
                driverRepository.save(Driver.builder()
                        .name("Alice Smith")
                        .licenseNumber("DL-98765")
                        .licenseCategory("C+E")
                        .licenseExpiryDate(LocalDate.now().plusDays(15)) // Triggers warning
                        .contactNumber("+1987654321")
                        .safetyScore(85)
                        .status(DriverStatus.AVAILABLE)
                        .build());
            } else {
                d1 = driverRepository.findAll().get(0);
            }
            
            if (tripRepository.count() == 0 && v1 != null && d1 != null) {
                tripRepository.save(Trip.builder()
                        .vehicle(v1)
                        .driver(d1)
                        .source("New York")
                        .destination("Boston")
                        .status(TripStatus.COMPLETED)
                        .plannedDistance(215.5)
                        .cargoWeight(100.0)
                        .createdAt(LocalDateTime.now().minusDays(2))
                        .completedAt(LocalDateTime.now().minusDays(1))
                        .build());
                        
                tripRepository.save(Trip.builder()
                        .vehicle(v2)
                        .driver(d1)
                        .source("Boston")
                        .destination("Philadelphia")
                        .status(TripStatus.DRAFT)
                        .plannedDistance(305.2)
                        .cargoWeight(150.0)
                        .build());
                        
                tripRepository.save(Trip.builder()
                        .vehicle(v1)
                        .driver(d1)
                        .source("Philadelphia")
                        .destination("Washington DC")
                        .status(TripStatus.DISPATCHED)
                        .plannedDistance(139.8)
                        .cargoWeight(120.0)
                        .createdAt(LocalDateTime.now().minusHours(5))
                        .build());
            }
            
            System.out.println("Mock data initialization complete.");
        };
    }
}
