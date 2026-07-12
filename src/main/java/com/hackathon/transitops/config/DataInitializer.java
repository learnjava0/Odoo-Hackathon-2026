package com.hackathon.transitops.config;

import com.hackathon.transitops.entity.*;
import com.hackathon.transitops.repository.DriverRepository;
import com.hackathon.transitops.repository.UserRepository;
import com.hackathon.transitops.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UserRepository userRepository, 
                               VehicleRepository vehicleRepository, 
                               DriverRepository driverRepository, 
                               PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(User.builder()
                        .email("admin@transitops.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.FLEET_MANAGER)
                        .build());
                userRepository.save(User.builder()
                        .email("driver1@transitops.com")
                        .password(passwordEncoder.encode("driver123"))
                        .role(Role.DRIVER)
                        .build());
            }

            if (vehicleRepository.count() == 0) {
                vehicleRepository.save(Vehicle.builder()
                        .registrationNumber("VAN-01")
                        .nameModel("Ford Transit")
                        .type("Van")
                        .maxLoadCapacity(1500.0)
                        .odometer(5000.0)
                        .acquisitionCost(new BigDecimal("35000.00"))
                        .status(VehicleStatus.AVAILABLE)
                        .build());
                vehicleRepository.save(Vehicle.builder()
                        .registrationNumber("TRK-02")
                        .nameModel("Volvo FH")
                        .type("Truck")
                        .maxLoadCapacity(18000.0)
                        .odometer(120000.0)
                        .acquisitionCost(new BigDecimal("120000.00"))
                        .status(VehicleStatus.AVAILABLE)
                        .build());
            }

            if (driverRepository.count() == 0) {
                driverRepository.save(Driver.builder()
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
            }
            
            System.out.println("Mock data initialization complete.");
        };
    }
}
