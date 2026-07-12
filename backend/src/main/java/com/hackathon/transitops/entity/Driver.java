package com.hackathon.transitops.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "drivers")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    @Column(nullable = false)
    private String licenseCategory;

    @Column(nullable = false)
    private LocalDate licenseExpiryDate;

    @Column(nullable = false)
    private String contactNumber;

    @Column(nullable = false)
    private Integer safetyScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriverStatus status;
}
