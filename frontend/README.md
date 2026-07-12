# TransitOps — Frontend

<div align="center">

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=flat&logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Recharts](https://img.shields.io/badge/Recharts-3.1-22B5BF?style=flat)](https://recharts.org)
[![Zod](https://img.shields.io/badge/Zod-4.0-3E67B1?style=flat)](https://zod.dev)

</div>

---

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `react` | 18.3 | UI framework |
| `vite` | 7.1 | Build tool, HMR dev server |
| `tailwindcss` | 3.4 | Utility-first CSS, dark mode via `class` strategy |
| `react-router-dom` | v6 | Declarative routing, nested protected routes |
| `react-hook-form` | 7 | Performant form state, ref-based inputs |
| `@hookform/resolvers` | 5 | Zod adapter for React Hook Form |
| `zod` | 4 | Runtime schema validation |
| `recharts` | 3 | Composable chart library (Bar, Pie, Line) |
| `jspdf` | latest | Client-side PDF generation |
| `jspdf-autotable` | latest | Styled tables inside jsPDF documents |
| `axios` | 1.11 | HTTP client with request interceptor for JWT |
| `date-fns` | 4 | Date formatting and diff calculations |
| `sonner` | 2 | Accessible toast notifications |
| `lucide-react` | 0.542 | 500+ consistent SVG icons |
| `react-is` | latest | Peer dependency for recharts |

---

## Environment Variables

```env
# frontend/.env
VITE_API_BASE_URL=http://localhost:8081
VITE_USE_MOCKS=true     # true = in-memory mock data, false = real backend
```

---

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build
```

---

## Project Structure

```
src/
├── api/
│   ├── adapter.js          # Switches between mock and real API
│   ├── auth.js             # login()
│   ├── vehicles.js         # getVehicles(), createVehicle(), updateVehicle()
│   ├── drivers.js          # getDrivers(), createDriver(), updateDriver()
│   ├── trips.js            # getTrips(), createTrip(), dispatchTrip(), completeTrip(), cancelTrip()
│   ├── maintenance.js      # getMaintenanceLogs(), createMaintenanceLog(), closeMaintenanceLog()
│   ├── fuelExpenses.js     # getFuelLogs(), getExpenses(), createFuelLog(), createExpense()
│   └── mocks/
│       ├── data.js         # Seed state: 12 vehicles, 10 drivers, 17 trips...
│       └── service.js      # In-memory handlers mirroring real API behaviour
│
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx    # Root layout: sidebar + topbar + <Outlet />
│   │   ├── Sidebar.jsx     # Collapsible nav, role-filtered items, amber logo
│   │   └── Topbar.jsx      # Search bar, theme toggle, quick action, user badge
│   └── ui/
│       ├── Badge.jsx       # Coloured pill — green / blue / amber / red / slate
│       ├── Button.jsx      # primary / secondary / ghost / danger + loading state
│       ├── Card.jsx        # Panelled container with hover shadow
│       ├── EmptyState.jsx  # Centred placeholder for empty tables
│       ├── Input.jsx       # Forwarded-ref input with label + error
│       ├── Modal.jsx       # Backdrop overlay modal
│       ├── NavItem.jsx     # Sidebar nav link
│       ├── PageHeader.jsx  # Eyebrow + h1 + description + actions slot
│       ├── Select.jsx      # Forwarded-ref select with label + error
│       ├── Skeleton.jsx    # Animated pulse loader
│       ├── StatCard.jsx    # KPI card: label + large value + accent colour
│       ├── StatusBadge.jsx # Maps status strings → Badge tone
│       └── Table.jsx       # Sortable table with sticky header
│
├── constants/
│   ├── navigation.js       # NAV_ITEMS array with path, icon, pageKey
│   └── roles.js            # ROLE_LABELS, PAGE_ACCESS matrix, hasPageAccess()
│
├── context/
│   ├── AppDataContext.jsx  # Centralized state + all CRUD mutations + toast
│   ├── AppProviders.jsx    # Combines all providers
│   ├── AuthContext.jsx     # JWT session: login(), logout(), isAuthenticated
│   └── ThemeContext.jsx    # light/dark toggle, localStorage persistence
│
├── hooks/
│   └── useAccess.js        # Returns "full" | "view" | "none" for current page
│
├── pages/
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── ForgotPasswordPage.jsx
│   ├── DashboardPage.jsx
│   ├── FleetPage.jsx
│   ├── DriversPage.jsx
│   ├── TripsPage.jsx
│   ├── MaintenancePage.jsx
│   ├── FuelExpensesPage.jsx
│   ├── AnalyticsPage.jsx
│   ├── SettingsPage.jsx
│   └── ForbiddenPage.jsx
│
├── routes/
│   └── ProtectedRoute.jsx  # Redirects to /login or /forbidden based on auth + role
│
└── utils/
    ├── calculations.js     # currency(), number(), getFleetUtilization(), getVehicleRoi()...
    ├── classNames.js       # cn() — Tailwind class merge utility
    ├── csvExport.js        # exportToCsv(filename, rows)
    ├── dateHelpers.js      # formatDate(), isExpired(), getLicenseState()
    └── pdfExport.js        # exportAnalyticsPdf() using jsPDF + autoTable
```

---

## Pages

### Sign In

![Sign In](src/assets/signin.png)

- Dark left panel with dot-grid background, feature bullet list
- **4 clickable demo account cards** — selecting one auto-fills email + role
- Role dropdown auto-syncs the email field so the correct mock user is loaded
- Password show/hide toggle
- Error state for invalid credentials
- Links to `/signup` and `/forgot-password`

---

### Sign Up

![Sign Up](src/assets/signup.png)

- Two-column layout: branding left, form right
- Fields: Full Name, Organization, Email, Role, Password, Confirm Password
- **Live password strength indicators** (3 rules: length, number, letter)
- Success confirmation screen with green checkmark
- `react-hook-form` + Zod schema with `.refine()` for password match

---

### Dashboard

![Dashboard](src/assets/Dashboard.png)

**Filters (top right inline bar)**
- Vehicle Type dropdown
- Trip Status dropdown
- Region dropdown
- All filters affect the Recent Trips table reactively via `useMemo`

**Stat Cards (7 KPIs)**
- Active Vehicles, Available Vehicles, In Maintenance
- Active Trips, Pending Trips, Drivers On Duty, Fleet Utilization %

**Recent Trips Table**
- Columns: Trip (source → dest), Vehicle, Driver, Status badge, ETA/Distance
- Filtered by role — Dispatchers only see their own trips

**Vehicle Status sidebar**
- 4 horizontal progress bars with distinct colours
- Available (green), On Trip (blue), In Shop (amber), Retired (red)

**Dark Mode**

![Dark Mode](src/assets/darkmode_dashboard.png)

Toggle in topbar. Uses Tailwind `dark:` variants throughout. Preference persisted in `localStorage`.

---

### Fleet / Vehicle Registry

![Fleet](src/assets/fleet_vehicals.png)

**Filter row**
- Type: All / Van / Truck / Mini Truck / Pickup
- Status: All / Available / On Trip / In Shop / Retired
- Free-text search by reg number
- `+ Add Vehicle` button (Fleet Manager only — hidden for view-only roles)

**Sortable Table**
- Registration No. (unique), Name/Model, Type, Capacity (kg), Odometer (km), Acq. Cost (₹), Status
- Click any column header to toggle asc/desc sort

**View Modal**
- Operational cost breakdown: Fuel + Maintenance + Other = Total
- Linked trips list with status badges

**Edit Modal**
- Server-side duplicate reg number detection → inline field error
- Status can be changed manually by Fleet Manager

**Business rules**
- `RETIRED` and `IN_SHOP` vehicles are excluded from trip vehicle picker
- Red note shown at bottom of table

---

### Drivers & Safety Profiles

![Drivers](src/assets/driver.png)

**Table columns**
- Driver name, License No., Category (LMV/HMV/Transport)
- Expiry Date — red + "EXPIRED" label when past due, amber when < 30 days
- Contact, Safety Score %, Status badge

**Status Legend** (bottom of card)
- All 4 status badges displayed: Available · On Trip · Off Duty · Suspended
- Red note: Expired license or Suspended status → blocked from trip assignment

**Add/Edit Driver Modal**
- All fields with validation
- Safety score 0–100

---

### Trip Dispatcher

![Trip Dispatch](src/assets/trip_dispacher.png)

**Left panel — Create Trip**

Trip lifecycle stepper at top:
```
① Draft  →  ② Dispatched  →  ③ Completed  →  ④ Cancelled
```

Form fields:
- Source / Destination (free text)
- Vehicle picker — only AVAILABLE vehicles shown
- Driver picker — excludes ON_TRIP, SUSPENDED, and expired-license drivers
- Cargo Weight (kg) + Planned Distance (km)
- **Live capacity panel** — shows vehicle max vs entered cargo, red error if exceeded
- Button disabled until capacity is valid

**Right panel — Live Board**

![Trip Management](src/assets/trip_manage_manager.png)

- All trips shown as stacked cards with route, vehicle, driver, status badge
- Action buttons per card based on trip state and user role:
  - `DRAFT` → **Dispatch** button (Fleet Manager / Dispatcher)
  - `DISPATCHED` → **Complete** button (opens odometer + fuel modal)
  - `DRAFT` or `DISPATCHED` → **Cancel** button (red)

**Trip Completion Modal**
- Final Odometer (km) + Fuel Consumed (litres)
- On submit: trip → COMPLETED, vehicle → AVAILABLE, driver → AVAILABLE, fuel log auto-created

---

### Maintenance

![Maintenance](src/assets/Maintanance.png)

**Left — Log Service Record form** (Fleet Manager only)
- Vehicle selector (all vehicles including IN_SHOP)
- Service Type (free text: Oil Change, Brake Replacement, etc.)
- Cost (₹), Date
- Amber "Save" button
- On save: vehicle status → `IN_SHOP`, removed from dispatch pool

**Right — Service Log table**
- Columns: Vehicle, Service, Cost (₹), Date, Status (IN_SHOP / COMPLETED)
- Historical + active records

**Status flow diagram** (below form)
```
Available  ──────────────→  In Shop
In Shop    ──────────────→  Available
```
Red note: In Shop vehicles are removed from the dispatch pool

---

### Fuel & Expenses

![Fuel Logs](src/assets/Fule_logs.png)

**Header actions**
- `+ Log Fuel` (primary button)
- `+ Add Expense` (secondary button)

**Fuel Logs section**
- Table: Vehicle, Date, Liters, Cost (₹)
- Entries optionally linked to a trip

**Other Expenses (Toll / Misc) section**
- Table: Trip #, Vehicle, Description, Amount (₹), Status badge

**Total Operational Cost footer**
- `Total = Fuel + Other Expenses` — updates live
- Displayed in amber with ₹ formatting

**Log Fuel Modal**
- Vehicle, Date, Liters, Cost, Optional Trip linkage

**Add Expense Modal**
- Vehicle, Description, Amount, Date, Optional Trip linkage

---

### Analytics & Reports

![Analytics](src/assets/analytics.png)

**4 KPI Stat Cards**
- Fuel Efficiency (km/l) — best performing vehicle
- Fleet Utilization (%) — active trips / total vehicles
- Operational Cost (₹) — fuel + maintenance + other
- Vehicle ROI (%) — (revenue − costs) / acquisition cost

**Monthly Revenue Bar Chart**
- Blue bars using Recharts `BarChart`
- 6-month rolling data
- Tooltip shows ₹ formatted value

**Top Cost / Fleet Vehicles**
- Horizontal progress bars, sorted highest to lowest
- Unique colour per vehicle (red, orange, blue, green, purple)
- Inline ₹ labels

**Fuel Efficiency Table** — km/l per vehicle  
**Operational Cost Donut** — Fuel (amber) / Maintenance (pink) / Other (blue) with legend  
**Vehicle ROI Table** — green % per vehicle  

**PDF Export**

![PDF Export](src/assets/report_extraction.png)

- Powered by `jsPDF` + `jspdf-autotable`
- Amber branded header: `TransitOps — Reports & Analytics`
- KPI summary row with shaded boxes
- Tables: Fuel Efficiency, Operational Cost, Vehicle ROI, Top Cost Vehicles, Monthly Revenue
- Page numbers in footer
- Downloads as `transitops-analytics.pdf`

**CSV Export**
- `exportToCsv()` utility generates a downloadable `.csv` from any array of objects

---

### Settings & RBAC

**Left — General Settings**
- Depot Name, Currency, Distance Unit
- "Save changes" with Sonner toast

**Right — Role-Based Access Matrix**
- 4 roles (rows) × 5 pages (columns)
- Click any cell to cycle: `None` (grey) → `View` (blue) → `Full` (green)
- Visual diff between access levels at a glance

---

## Mock Data

Enabled with `VITE_USE_MOCKS=true`. All mutations (create, update, dispatch, complete) persist in-memory for the session.

### Seed data includes:

| Collection | Count | Details |
|---|---|---|
| Vehicles | 12 | Tata, Ashok Leyland, Mahindra, Eicher, BharatBenz, Force |
| Drivers | 10 | Mix of valid, expiring soon, expired, and suspended |
| Trips | 17 | 3 dispatched, 3 draft, 9 completed, 2 cancelled |
| Maintenance Logs | 8 | 2 active (IN_SHOP), 6 historical |
| Fuel Logs | 15 | Realistic ₹/litre Indian pricing |
| Expenses | 12 | Tolls, entry permits, allowances, repairs |

### Demo Accounts (password: `admin123`)

| Role | Email |
|---|---|
| Fleet Manager | ravi.kumar@transitops.in |
| Dispatcher | ajay.singh@transitops.in |
| Safety Officer | priya.nair@transitops.in |
| Financial Analyst | deepa.shah@transitops.in |

---

## Key Utilities

### `calculations.js`
```js
currency(value)                          // ₹1,45,000
number(value, digits)                    // 1,45,000
getFleetUtilization(vehicles, trips)     // % active trips / total vehicles
getFuelEfficiencyForVehicle(id, trips)   // km / litres consumed
getVehicleRoi(vehicle, trips, fuel, maint) // (revenue - costs) / acqCost * 100
getOperationalCost(id, fuel, maint, exp) // { fuel, maintenance, other, total }
```

### `pdfExport.js`
```js
exportAnalyticsPdf({ fuelEfficiencyRows, operationalRows, roiRows,
                     costPerVehicle, monthlyBreakdown, kpis })
// → downloads transitops-analytics.pdf
```

### `dateHelpers.js`
```js
formatDate(isoString)          // "12 Jul 2026"
isExpired(isoDateString)       // true/false
getLicenseState(expiryDate)    // { tone: "red"|"amber"|"green", label }
```

---

## Component API (selected)

### `<StatCard>`
```jsx
<StatCard label="Fleet Utilization" value="81%" accent="text-sky-600" hint="↑ 3% vs last week" />
```

### `<StatusBadge>`
```jsx
<StatusBadge value="DISPATCHED" />   // → blue "DISPATCHED" pill
<StatusBadge value="IN_SHOP" />      // → amber "IN SHOP" pill
```

### `<Table>`
```jsx
<Table
  columns={[{ key: "name", label: "Driver", sortable: true }]}
  rows={drivers}
  sort={{ key: "name", direction: "asc" }}
  onSort={(key) => setSort(...)}
  renderRow={(driver) => <tr key={driver.id}><td>{driver.name}</td></tr>}
/>
```

### `<Button>`
```jsx
<Button variant="primary" loading={isSubmitting}>Save</Button>
<Button variant="danger" onClick={handleCancel}>Cancel Trip</Button>
```

---

## Routing

```
/login              → LoginPage        (public)
/signup             → SignupPage       (public)
/forgot-password    → ForgotPasswordPage (public)
/                   → DashboardPage   (protected)
/dashboard          → DashboardPage   (protected)
/fleet              → FleetPage        (Fleet Manager, Financial Analyst)
/drivers            → DriversPage      (Fleet Manager, Safety Officer)
/trips              → TripsPage        (Fleet Manager, Dispatcher, Safety Officer)
/maintenance        → MaintenancePage  (Fleet Manager, Financial Analyst)
/fuel-expenses      → FuelExpensesPage (Fleet Manager, Financial Analyst)
/analytics          → AnalyticsPage   (Fleet Manager, Financial Analyst)
/settings           → SettingsPage    (Fleet Manager only)
/forbidden          → ForbiddenPage   (shown on unauthorized access)
```
