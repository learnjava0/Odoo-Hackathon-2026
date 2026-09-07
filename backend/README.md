# TransitOps — Backend

<div align="center">

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://openjdk.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring_Security-6-6DB33F?style=flat&logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Maven](https://img.shields.io/badge/Maven-3.9-C71A36?style=flat&logo=apachemaven&logoColor=white)](https://maven.apache.org)
[![JWT](https://img.shields.io/badge/JWT-JJWT_0.11.5-000000?style=flat&logo=jsonwebtokens&logoColor=white)](https://github.com/jwtk/jjwt)
[![Lombok](https://img.shields.io/badge/Lombok-latest-BC1C4B?style=flat)](https://projectlombok.org)

</div>

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Language (virtual threads ready) |
| Spring Boot | 4.1 | Application framework, auto-config, embedded Tomcat |
| Spring Web MVC | 4.1 | REST controllers, request mapping |
| Spring Security | 4.1 | Stateless JWT filter chain, BCrypt password hashing |
| Spring Data JPA | 4.1 | Repository pattern, JPQL queries |
| Hibernate | 6 | JPA implementation, DDL auto-update |
| PostgreSQL | 15 | Production relational database |
| H2 | latest | In-memory DB for local dev / tests |
| JJWT | 0.11.5 | JWT generation, signing (HS256), and validation |
| Lombok | latest | `@Data`, `@Builder`, `@RequiredArgsConstructor` |
| Bean Validation | 3 | `@NotBlank`, `@Min`, `@Email` on DTOs |
| Maven | 3.9 | Build, dependency management, `mvnw` wrapper |

---

## Getting Started

### Prerequisites
- Java 21+
- PostgreSQL 13+ running locally
- Maven (or use the included `./mvnw`)

### Database Setup
```sql
psql -U postgres
CREATE DATABASE transitops_dev;
```

### Configuration
Edit `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/transitops_dev
    username: your_username
    password: your_password
```

### Run
```bash
./mvnw spring-boot:run
# Server starts at http://localhost:8081
```

On first run `DataInitializer` seeds 4 demo users with BCrypt-hashed passwords.

### Dev without PostgreSQL (H2)
Override datasource in `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:transitops
    driver-class-name: org.h2.Driver
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
```

  ## Deploy to AWS App Runner

  The backend includes a Java 21 `Dockerfile` for AWS App Runner. Use Amazon RDS for PostgreSQL; do not use the local database values in production.

  1. Create an RDS PostgreSQL database and allow inbound PostgreSQL traffic from the App Runner VPC connector/security group. Record its database name, endpoint, username, and password.
  2. Build and push the image to Amazon ECR from the `backend` directory:

  ```bash
  aws ecr create-repository --repository-name transitops-backend --region <aws-region>
  aws ecr get-login-password --region <aws-region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<aws-region>.amazonaws.com
  docker build -t transitops-backend .
  docker tag transitops-backend:latest <account-id>.dkr.ecr.<aws-region>.amazonaws.com/transitops-backend:latest
  docker push <account-id>.dkr.ecr.<aws-region>.amazonaws.com/transitops-backend:latest
  ```

  3. Create an App Runner service from the ECR image. Set the container port to `8080` and configure these environment variables:

  ```text
  SPRING_DATASOURCE_URL=jdbc:postgresql://<rds-endpoint>:5432/<database-name>
  SPRING_DATASOURCE_USERNAME=<rds-username>
  SPRING_DATASOURCE_PASSWORD=<rds-password>
  SPRING_JPA_HIBERNATE_DDL_AUTO=update
  SPRING_JPA_SHOW_SQL=false
  JWT_SECRET=<random-base64-secret-at-least-256-bits>
  JWT_EXPIRATION=86400000
  CORS_ALLOWED_ORIGINS=https://<frontend-domain>
  ```

  Use App Runner secrets or AWS Secrets Manager for the database password and `JWT_SECRET`. Attach an App Runner VPC connector if the RDS instance is private. After deployment, use the App Runner HTTPS URL as the frontend's `VITE_API_BASE_URL`.

---

## Architecture

```
com.hackathon.transitops/
│
├── config/
│   ├── CorsConfig.java              # Allows http://localhost:5173 (Vite dev)
│   ├── DataInitializer.java         # Seeds 4 demo users on startup
│   └── SecurityConfig.java          # JWT filter chain, public/protected routes
│
├── controller/                      # @RestController — thin, delegates to service
│   ├── AuthController.java          # POST /api/auth/login, /register
│   ├── VehicleController.java       # GET/POST/PUT /api/vehicles
│   ├── DriverController.java        # GET/POST/PUT /api/drivers
│   ├── TripController.java          # Trip lifecycle endpoints
│   ├── MaintenanceController.java   # /api/maintenance
│   ├── ReportController.java        # /api/reports
│   └── DashboardController.java     # /api/dashboard/summary
│
├── service/                         # Business logic
│   ├── VehicleService.java
│   ├── DriverService.java
│   ├── TripService.java             # Enforces lifecycle rules
│   ├── MaintenanceService.java      # Status transitions
│   ├── FuelLogService.java
│   ├── ExpenseService.java
│   └── LicenseExpiryScheduler.java  # @Scheduled daily cron
│
├── entity/                          # @Entity JPA models
│   ├── User.java
│   ├── Role.java                    # Enum: FLEET_MANAGER | DRIVER | SAFETY_OFFICER | FINANCIAL_ANALYST
│   ├── Vehicle.java
│   ├── VehicleStatus.java           # Enum: AVAILABLE | ON_TRIP | IN_SHOP | RETIRED
│   ├── Driver.java
│   ├── DriverStatus.java            # Enum: AVAILABLE | ON_TRIP | OFF_DUTY | SUSPENDED
│   ├── Trip.java
│   ├── TripStatus.java              # Enum: DRAFT | DISPATCHED | COMPLETED | CANCELLED
│   ├── MaintenanceLog.java
│   ├── FuelLog.java
│   └── Expense.java
│
├── dto/                             # Request/response bodies
│   ├── LoginRequest.java            # { email, password }
│   ├── RegisterRequest.java         # { email, password, role }
│   ├── AuthResponse.java            # { token, user }
│   ├── TripRequest.java             # { source, destination, vehicleId, driverId, cargoWeight, plannedDistance }
│   ├── TripCompleteRequest.java     # { finalOdometer, fuelConsumed }
│   ├── MaintenanceRequest.java      # { vehicleId, description, cost, startDate }
│   ├── FuelLogRequest.java          # { vehicleId, liters, cost, logDate, tripId? }
│   └── ExpenseRequest.java          # { vehicleId, description, amount, expenseDate, tripId? }
│
├── repository/                      # Spring Data JPA — no implementation needed
│   ├── UserRepository.java          # findByEmail()
│   ├── VehicleRepository.java       # findByStatus(), findByRegistrationNumber()
│   ├── DriverRepository.java        # findByStatus(), findByLicenseExpiryDateBefore()
│   ├── TripRepository.java          # findByStatus(), findByDriverId(), findByVehicleId()
│   ├── MaintenanceRepository.java   # findByVehicleIdAndActiveTrue()
│   ├── FuelLogRepository.java       # findByVehicleId(), findByTripId()
│   └── ExpenseRepository.java       # findByVehicleId(), findByTripId()
│
├── security/
│   ├── JwtUtil.java                 # generateToken(), validateToken(), extractEmail()
│   ├── JwtAuthenticationFilter.java # OncePerRequestFilter — validates Bearer token
│   ├── CustomUserDetails.java       # Wraps User entity for Spring Security
│   └── CustomUserDetailsService.java# Loads user by email for auth
│
└── exception/
    └── GlobalExceptionHandler.java  # @RestControllerAdvice — unified error responses
```

---

## API Reference

Base URL: `http://localhost:8081`  
All protected endpoints require: `Authorization: Bearer <token>`

---

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | No | Returns JWT + user |
| `POST` | `/api/auth/register` | No | Creates new user |

**POST /api/auth/login**
```json
// Request
{ "email": "ravi.kumar@transitops.in", "password": "admin123" }

// Response 200
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { "id": 1, "email": "ravi.kumar@transitops.in", "role": "FLEET_MANAGER" }
}

// Response 401
{ "error": "Invalid credentials" }
```

---

### Vehicles

| Method | Endpoint | Auth | Roles |
|---|---|---|---|
| `GET` | `/api/vehicles` | ✅ | All |
| `GET` | `/api/vehicles/{id}` | ✅ | All |
| `POST` | `/api/vehicles` | ✅ | FLEET_MANAGER |
| `PUT` | `/api/vehicles/{id}` | ✅ | FLEET_MANAGER |

**Vehicle object:**
```json
{
  "id": 1,
  "registrationNumber": "KA-01-AB-1001",
  "nameModel": "Tata Ace Gold",
  "type": "Mini Truck",
  "maxLoadCapacity": 750,
  "odometer": 31200,
  "acquisitionCost": 680000,
  "status": "AVAILABLE"
}
```

**Status enum:** `AVAILABLE` | `ON_TRIP` | `IN_SHOP` | `RETIRED`

**Rules:**
- `registrationNumber` must be globally unique → `409 Conflict` if duplicate
- `IN_SHOP` and `RETIRED` vehicles are excluded from trip dispatch picker

---

### Drivers

| Method | Endpoint | Auth | Roles |
|---|---|---|---|
| `GET` | `/api/drivers` | ✅ | FLEET_MANAGER, SAFETY_OFFICER |
| `GET` | `/api/drivers/{id}` | ✅ | FLEET_MANAGER, SAFETY_OFFICER |
| `POST` | `/api/drivers` | ✅ | FLEET_MANAGER |
| `PUT` | `/api/drivers/{id}` | ✅ | FLEET_MANAGER |

**Driver object:**
```json
{
  "id": 1,
  "name": "Ajay Singh",
  "licenseNumber": "KA-0119980012345",
  "licenseCategory": "HMV",
  "licenseExpiryDate": "2026-12-09",
  "contactNumber": "9880011234",
  "safetyScore": 94,
  "status": "ON_TRIP"
}
```

**Status enum:** `AVAILABLE` | `ON_TRIP` | `OFF_DUTY` | `SUSPENDED`

**Rules:**
- Drivers with `SUSPENDED` or expired license cannot be assigned to trips
- `LicenseExpiryScheduler` runs nightly and auto-flags expired drivers

---

### Trips

| Method | Endpoint | Auth | Roles |
|---|---|---|---|
| `GET` | `/api/trips` | ✅ | All (DRIVER sees only own) |
| `GET` | `/api/trips/{id}` | ✅ | All |
| `POST` | `/api/trips` | ✅ | FLEET_MANAGER, DRIVER |
| `POST` | `/api/trips/{id}/dispatch` | ✅ | FLEET_MANAGER, DRIVER |
| `POST` | `/api/trips/{id}/complete` | ✅ | FLEET_MANAGER, DRIVER |
| `POST` | `/api/trips/{id}/cancel` | ✅ | FLEET_MANAGER, DRIVER |

**Trip lifecycle:**
```
      POST /trips
           ↓
        [DRAFT]
           ↓  POST /trips/{id}/dispatch
      [DISPATCHED]
           ↓  POST /trips/{id}/complete
      [COMPLETED]

      [DRAFT or DISPATCHED] → POST /trips/{id}/cancel → [CANCELLED]
```

**Create trip request:**
```json
{
  "source": "Bengaluru Hub",
  "destination": "Mysuru Depot",
  "vehicleId": 4,
  "driverId": 5,
  "cargoWeight": 3200,
  "plannedDistance": 148
}
```

**Complete trip request:**
```json
{ "finalOdometer": 88820, "fuelConsumed": 58 }
```

**Side effects on dispatch:**
- Vehicle status → `ON_TRIP`
- Driver status → `ON_TRIP`

**Side effects on complete:**
- Vehicle status → `AVAILABLE`
- Driver status → `AVAILABLE`
- FuelLog auto-created with trip-linked entry

**Side effects on cancel:**
- If was DISPATCHED: Vehicle → `AVAILABLE`, Driver → `AVAILABLE`

**Validation errors (400):**
- Vehicle not AVAILABLE
- Driver SUSPENDED or expired license
- `cargoWeight > vehicle.maxLoadCapacity`

---

### Maintenance

| Method | Endpoint | Auth | Roles |
|---|---|---|---|
| `GET` | `/api/maintenance` | ✅ | All |
| `POST` | `/api/maintenance` | ✅ | FLEET_MANAGER |
| `PUT` | `/api/maintenance/{id}/close` | ✅ | FLEET_MANAGER |

**Create request:**
```json
{
  "vehicleId": 3,
  "description": "Brake pad replacement & wheel alignment",
  "cost": 8400,
  "startDate": "2026-07-08"
}
```

**Side effects:**
- On create: vehicle → `IN_SHOP` (removed from dispatch pool)
- On close: vehicle → `AVAILABLE` (returns to dispatch pool), `endDate` set to today

---

### Fuel Logs

| Method | Endpoint | Auth | Roles |
|---|---|---|---|
| `GET` | `/api/fuel-logs` | ✅ | FLEET_MANAGER, FINANCIAL_ANALYST |
| `POST` | `/api/fuel-logs` | ✅ | FLEET_MANAGER |

**Create request:**
```json
{
  "vehicleId": 2,
  "liters": 58,
  "cost": 6148,
  "logDate": "2026-07-12",
  "tripId": 6
}
```

---

### Expenses

| Method | Endpoint | Auth | Roles |
|---|---|---|---|
| `GET` | `/api/expenses` | ✅ | FLEET_MANAGER, FINANCIAL_ANALYST |
| `POST` | `/api/expenses` | ✅ | FLEET_MANAGER |

**Create request:**
```json
{
  "vehicleId": 2,
  "description": "NH-48 toll charges",
  "amount": 840,
  "expenseDate": "2026-07-12",
  "tripId": 6
}
```

---

### Dashboard Summary

| Method | Endpoint | Auth |
|---|---|---|
| `GET` | `/api/dashboard/summary` | ✅ All |

**Response:**
```json
{
  "activeVehicles": 11,
  "availableVehicles": 7,
  "inMaintenance": 2,
  "activeTrips": 3,
  "pendingTrips": 3,
  "driversOnDuty": 2,
  "fleetUtilization": 27.3,
  "totalFuelCost": 71618,
  "totalMaintenanceCost": 176600
}
```

---

## Security Architecture

```
Request
  │
  ▼
JwtAuthenticationFilter (OncePerRequestFilter)
  │  Extract "Authorization: Bearer <token>"
  │  Validate signature + expiry (JJWT)
  │  Load user from CustomUserDetailsService
  │  Set SecurityContextHolder
  ▼
SecurityConfig filter chain
  │  Public: /api/auth/**
  │  Protected: everything else → requires valid JWT
  ▼
@PreAuthorize / role checks in controllers
  ▼
Controller → Service → Repository
```

**JWT Config:**
```yaml
jwt:
  secret: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970  # 256-bit hex
  expiration: 86400000   # 24 hours
```

Tokens are signed with **HS256 (HMAC-SHA256)**. The secret should be replaced with a secure random key in production.

---

## Entity Relationships

```
User ─────────────────────── (auth only, not a foreign key in Trip)
                              Trip uses driverId referencing Driver entity

Vehicle ──┬── Trip            (vehicleId FK)
          ├── MaintenanceLog  (vehicleId FK)
          ├── FuelLog         (vehicleId FK)
          └── Expense         (vehicleId FK)

Driver ───┴── Trip            (driverId FK)

Trip ─────┬── FuelLog         (tripId FK, nullable)
          └── Expense         (tripId FK, nullable)
```

---

## Scheduled Jobs

**`LicenseExpiryScheduler`**  
Runs daily at midnight: `@Scheduled(cron = "0 0 0 * * *")`

```
For each driver:
  if licenseExpiryDate < today:
    driver.status = SUSPENDED
    log.warn("Driver {name} license expired on {date}")
  else if licenseExpiryDate < today + 30 days:
    log.warn("Driver {name} license expiring soon on {date}")
```

---

## Error Responses

All errors return consistent JSON:

```json
{
  "timestamp": "2026-07-12T15:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Cargo weight 9500 exceeds vehicle capacity 7000 kg",
  "path": "/api/trips"
}
```

| Exception | Status | When |
|---|---|---|
| `EntityNotFoundException` | 404 | Vehicle/Driver/Trip ID not found |
| `MethodArgumentNotValidException` | 400 | Bean Validation fails on DTO |
| `DataIntegrityViolationException` | 409 | Duplicate registration number |
| `AccessDeniedException` | 403 | Insufficient role for endpoint |
| `IllegalStateException` | 400 | Business rule violation (capacity, status) |
| `Exception` (catch-all) | 500 | Unexpected server error |

---

## Configuration Reference

```yaml
# application.yml

spring:
  application:
    name: TransitOps

  datasource:
    url: jdbc:postgresql://localhost:5432/transitops_dev
    username: ${DB_USERNAME:dev-trivedi}
    password: ${DB_PASSWORD:12345678}
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update          # creates/updates tables on startup
    show-sql: true              # logs SQL to console
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect

server:
  port: 8081

jwt:
  secret: <256-bit-hex-key>
  expiration: 86400000          # 24 hours in milliseconds
```

---

## Build & Deploy

```bash
# Run tests
./mvnw test

# Package fat JAR
./mvnw clean package -DskipTests

# Run JAR directly
java -jar target/transitops-0.0.1-SNAPSHOT.jar

# With env overrides
java -jar target/transitops-0.0.1-SNAPSHOT.jar \
  --spring.datasource.url=jdbc:postgresql://prod-host:5432/transitops \
  --spring.datasource.username=prod_user \
  --spring.datasource.password=prod_pass \
  --jwt.secret=your-production-secret
```

---

## Seeded Demo Users

Created by `DataInitializer` on first startup (BCrypt-hashed passwords):

| Email | Password | Role |
|---|---|---|
| ravi.kumar@transitops.in | admin123 | FLEET_MANAGER |
| ajay.singh@transitops.in | admin123 | DRIVER |
| priya.nair@transitops.in | admin123 | SAFETY_OFFICER |
| deepa.shah@transitops.in | admin123 | FINANCIAL_ANALYST |
