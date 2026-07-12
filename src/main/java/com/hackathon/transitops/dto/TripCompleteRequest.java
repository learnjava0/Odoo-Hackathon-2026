package com.hackathon.transitops.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TripCompleteRequest {
    @NotNull(message = "Final odometer is required")
    @Min(value = 0, message = "Final odometer cannot be negative")
    private Double finalOdometer;

    @NotNull(message = "Fuel consumed is required")
    @Min(value = 0, message = "Fuel consumed cannot be negative")
    private Double fuelConsumed;
}
