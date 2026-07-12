package com.hackathon.transitops.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MaintenanceRequest {
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Cost is required")
    @Min(value = 0, message = "Cost cannot be negative")
    private BigDecimal cost;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;
}
