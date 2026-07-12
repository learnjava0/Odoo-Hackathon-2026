package com.hackathon.transitops.controller;

import com.hackathon.transitops.dto.MaintenanceRequest;
import com.hackathon.transitops.entity.MaintenanceLog;
import com.hackathon.transitops.service.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @PostMapping
    @PreAuthorize("hasRole('FLEET_MANAGER')")
    public ResponseEntity<MaintenanceLog> startMaintenance(@Valid @RequestBody MaintenanceRequest request) {
        return ResponseEntity.ok(maintenanceService.startMaintenance(request));
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("hasRole('FLEET_MANAGER')")
    public ResponseEntity<MaintenanceLog> closeMaintenance(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.closeMaintenance(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('FLEET_MANAGER', 'FINANCIAL_ANALYST')")
    public ResponseEntity<List<MaintenanceLog>> getAllMaintenanceLogs() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenanceLogs());
    }
}
