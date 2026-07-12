package com.hackathon.transitops.repository;

import com.hackathon.transitops.entity.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<MaintenanceLog, Long> {
    List<MaintenanceLog> findByVehicleId(Long vehicleId);
    List<MaintenanceLog> findByVehicleIdAndActiveTrue(Long vehicleId);
}
