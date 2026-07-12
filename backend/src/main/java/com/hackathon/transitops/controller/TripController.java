package com.hackathon.transitops.controller;

import com.hackathon.transitops.dto.TripCompleteRequest;
import com.hackathon.transitops.dto.TripRequest;
import com.hackathon.transitops.entity.Trip;
import com.hackathon.transitops.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    @PreAuthorize("hasRole('DRIVER') or hasRole('FLEET_MANAGER')")
    public ResponseEntity<Trip> createTrip(@Valid @RequestBody TripRequest request) {
        return ResponseEntity.ok(tripService.createTrip(request));
    }

    @PostMapping("/{id}/dispatch")
    @PreAuthorize("hasRole('DRIVER') or hasRole('FLEET_MANAGER')")
    public ResponseEntity<Trip> dispatchTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.dispatchTrip(id));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Trip> completeTrip(@PathVariable Long id, @Valid @RequestBody TripCompleteRequest request) {
        return ResponseEntity.ok(tripService.completeTrip(id, request));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('DRIVER')")
    public ResponseEntity<Trip> cancelTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.cancelTrip(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST')")
    public ResponseEntity<List<Trip>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }
}
