package com.hackathon.transitops.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TripRequest {
    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Driver ID is required")
    private Long driverId;

    @NotNull(message = "Cargo weight is required")
    @Min(value = 1, message = "Cargo weight must be greater than 0")
    private Double cargoWeight;

    @NotNull(message = "Planned distance is required")
    @Min(value = 1, message = "Planned distance must be greater than 0")
    private Double plannedDistance;
}
