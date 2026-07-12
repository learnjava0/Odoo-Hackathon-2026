import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { useAppData } from "../context/AppDataContext";
import { useAccess } from "../hooks/useAccess";
import { formatDate, isExpired } from "../utils/dateHelpers";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";
import { Skeleton } from "../components/ui/Skeleton";
import { StatusBadge } from "../components/ui/StatusBadge";

const schema = z.object({
  source: z.string().min(2),
  destination: z.string().min(2),
  vehicleId: z.coerce.number().positive(),
  driverId: z.coerce.number().positive(),
  cargoWeight: z.coerce.number().positive(),
  plannedDistance: z.coerce.number().positive(),
});

const columns = ["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"];

export default function TripsPage() {
  const { user } = useAuth();
  const access = useAccess("trips");
  const { vehicles, drivers, trips, saveTrip, dispatchTrip, completeTrip, cancelTrip, loading } = useAppData();
  const [activeTrip, setActiveTrip] = useState(null);
  const [completeOpen, setCompleteOpen] = useState(false);
  const tripForm = useForm({
    resolver: zodResolver(schema),
    defaultValues: { source: "", destination: "", cargoWeight: 0, plannedDistance: 0 },
  });
  const completeForm = useForm({
    defaultValues: { finalOdometer: "", fuelConsumed: "" },
  });

  const allowedVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.status === "AVAILABLE"),
    [vehicles],
  );
  const allowedDrivers = useMemo(
    () =>
      drivers.filter(
        (driver) => !["ON_TRIP", "SUSPENDED"].includes(driver.status) && !isExpired(driver.licenseExpiryDate),
      ),
    [drivers],
  );

  const selectedVehicle = allowedVehicles.find((vehicle) => vehicle.id === Number(tripForm.watch("vehicleId")));
  const cargoWeight = Number(tripForm.watch("cargoWeight") || 0);
  const capacityError =
    selectedVehicle && cargoWeight > selectedVehicle.maxLoadCapacity
      ? `Capacity exceeded - ${selectedVehicle.maxLoadCapacity} kg max. Change vehicle or reduce cargo weight.`
      : "";

  const visibleTrips = useMemo(() => {
    return user.role === "DRIVER" ? trips.filter((trip) => trip.driverId === user.id) : trips;
  }, [trips, user.id, user.role]);

  async function onCreateTrip(values) {
    if (capacityError) return;
    await saveTrip(values);
    tripForm.reset({ source: "", destination: "", cargoWeight: 0, plannedDistance: 0, vehicleId: "", driverId: "" });
  }

  async function onComplete(values) {
    await completeTrip(activeTrip.id, {
      finalOdometer: Number(values.finalOdometer),
      fuelConsumed: Number(values.fuelConsumed),
    });
    setCompleteOpen(false);
    setActiveTrip(null);
    completeForm.reset({ finalOdometer: "", fuelConsumed: "" });
  }

  if (loading) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Dispatch Board" title="Trips" description="Create trip drafts, dispatch only eligible assets, and complete or cancel movements with immediate status updates." />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          {/* Trip lifecycle stepper */}
          <div className="mb-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Trip Lifecycle</p>
            <div className="flex items-center gap-1">
              {["Draft", "Dispatched", "Completed", "Cancelled"].map((step, i) => (
                <div key={step} className="flex items-center gap-1">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    i === 0 ? "bg-emerald-500 text-white" : i === 1 ? "bg-sky-500 text-white" : "border border-slate-300 text-slate-400 dark:border-slate-600"
                  }`}>{i + 1}</div>
                  <span className={`text-xs ${i < 2 ? "font-semibold text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}>{step}</span>
                  {i < 3 && <span className="mx-1 text-slate-300 dark:text-slate-600">→</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">Create Trip</h2>
          </div>
          <form className="space-y-4" onSubmit={tripForm.handleSubmit(onCreateTrip)}>
            <Input label="Source" placeholder="Origin depot or location" error={tripForm.formState.errors.source?.message} {...tripForm.register("source")} />
            <Input label="Destination" placeholder="Delivery hub or endpoint" error={tripForm.formState.errors.destination?.message} {...tripForm.register("destination")} />
            <Select label="Vehicle (Available only)" error={tripForm.formState.errors.vehicleId?.message} {...tripForm.register("vehicleId")}>
              <option value="">Select available vehicle</option>
              {allowedVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>{vehicle.nameModel} — {vehicle.registrationNumber}</option>
              ))}
            </Select>
            <Select
              label="Driver"
              helperText="Expired-license and suspended drivers are excluded."
              error={tripForm.formState.errors.driverId?.message}
              {...tripForm.register("driverId")}
            >
              <option value="">Select available driver</option>
              {allowedDrivers.map((driver) => (
                <option key={driver.id} value={driver.id}>{driver.name}</option>
              ))}
            </Select>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Cargo Weight (kg)" type="number" error={tripForm.formState.errors.cargoWeight?.message} {...tripForm.register("cargoWeight")} />
              <Input label="Planned Distance (km)" type="number" error={tripForm.formState.errors.plannedDistance?.message} {...tripForm.register("plannedDistance")} />
            </div>
            {selectedVehicle && (
              <div className={`rounded-xl border px-4 py-3 text-sm ${capacityError ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30" : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-ink-850"}`}>
                <p className="text-slate-600 dark:text-slate-400">Vehicle Capacity: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedVehicle.maxLoadCapacity} kg</span></p>
                <p className="text-slate-600 dark:text-slate-400">Cargo Weight: <span className="font-semibold text-slate-800 dark:text-slate-200">{cargoWeight} kg</span></p>
                {capacityError && <p className="mt-1 flex items-center gap-1 font-medium text-red-600 dark:text-red-400"><span>✕</span> {capacityError}</p>}
              </div>
            )}
            <div className="flex gap-3">
              <Button type="submit" loading={tripForm.formState.isSubmitting} disabled={Boolean(capacityError)}>
                Dispatch (Draft)
              </Button>
              <Button type="button" variant="ghost" onClick={() => tripForm.reset({ source: "", destination: "", cargoWeight: 0, plannedDistance: 0, vehicleId: "", driverId: "" })}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">Live Board</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{visibleTrips.length} trips</p>
          </div>
          {visibleTrips.length ? (
            <div className="space-y-3">
              {visibleTrips.map((trip) => {
                      const tripVehicle = vehicles.find((vehicle) => vehicle.id === trip.vehicleId);
                      const tripDriver = drivers.find((driver) => driver.id === trip.driverId);
                      const canDispatch = access !== "view" && ["FLEET_MANAGER", "DRIVER"].includes(user.role) && trip.status === "DRAFT";
                      const canComplete = access !== "view" && trip.status === "DISPATCHED";
                      const canCancel = access !== "view" && ["DRAFT", "DISPATCHED"].includes(trip.status);
                      return (
                        <div key={trip.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-ink-850">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-950 dark:text-slate-100">{trip.source} → {trip.destination}</p>
                              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                {tripVehicle?.nameModel ?? "No vehicle"} / {tripDriver?.name ?? "No driver"}
                              </p>
                            </div>
                            <StatusBadge value={trip.status} />
                          </div>
                          {trip.status === "DRAFT" && !tripDriver && (
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Awaiting driver assignment</p>
                          )}
                          {trip.status === "CANCELLED" && (
                            <p className="mt-2 text-xs text-red-500">Vehicle not ready to ship</p>
                          )}
                          {(canDispatch || canComplete || canCancel) && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {canDispatch && <Button variant="primary" className="px-3 py-1.5 text-xs" onClick={() => dispatchTrip(trip.id)}>Dispatch</Button>}
                              {canComplete && (
                                <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => { setActiveTrip(trip); setCompleteOpen(true); }}>
                                  Complete
                                </Button>
                              )}
                              {canCancel && <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={() => cancelTrip(trip.id)}>Cancel</Button>}
                            </div>
                          )}
                        </div>
                      );
                    })}
            </div>
          ) : (
            <EmptyState title="No trips available" description="Trips will appear here once drafts or dispatch activity exist for your role scope." />
          )}
        </Card>
      </div>
      <Modal open={completeOpen} title="Complete Trip" onClose={() => setCompleteOpen(false)}>
        <form className="space-y-4" onSubmit={completeForm.handleSubmit(onComplete)}>
          <Input label="Final Odometer" type="number" {...completeForm.register("finalOdometer", { required: true })} />
          <Input label="Fuel Consumed" type="number" {...completeForm.register("fuelConsumed", { required: true })} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setCompleteOpen(false)}>Cancel</Button>
            <Button type="submit">Complete Trip</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
