package com.hackathon.transitops.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FuelLogRequest {
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Liters is required")
    @Min(value = 0, message = "Liters cannot be negative")
    private Double liters;

    @NotNull(message = "Cost is required")
    @Min(value = 0, message = "Cost cannot be negative")
    private BigDecimal cost;

    @NotNull(message = "Log date is required")
    private LocalDate logDate;

    private Long tripId;
}
