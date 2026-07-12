package com.hackathon.transitops.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = false)
    private String nameModel;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Double maxLoadCapacity;

    @Column(nullable = false)
    private Double odometer;

    @Column(nullable = false)
    private BigDecimal acquisitionCost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status;
}
