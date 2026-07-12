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
      ? `Capacity exceeded — ${selectedVehicle.maxLoadCapacity} kg max. Change vehicle or reduce cargo weight.`
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
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400">Step 1 of 2</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-100">Create Trip</h2>
            </div>
            <div className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">Draft before dispatch</div>
          </div>
          <form className="space-y-4" onSubmit={tripForm.handleSubmit(onCreateTrip)}>
            <Input label="Source" error={tripForm.formState.errors.source?.message} {...tripForm.register("source")} />
            <Input label="Destination" error={tripForm.formState.errors.destination?.message} {...tripForm.register("destination")} />
            <Select label="Vehicle" error={tripForm.formState.errors.vehicleId?.message} {...tripForm.register("vehicleId")}>
              <option value="">Select available vehicle</option>
              {allowedVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>{vehicle.nameModel} · {vehicle.registrationNumber}</option>
              ))}
            </Select>
            <Select
              label="Driver"
              helperText="Expired-license and suspended drivers are removed from the picker."
              error={tripForm.formState.errors.driverId?.message}
              {...tripForm.register("driverId")}
            >
              <option value="">Select available driver</option>
              {allowedDrivers.map((driver) => (
                <option key={driver.id} value={driver.id}>{driver.name} · {formatDate(driver.licenseExpiryDate)}</option>
              ))}
            </Select>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Cargo Weight (kg)" type="number" error={tripForm.formState.errors.cargoWeight?.message} {...tripForm.register("cargoWeight")} />
              <Input label="Planned Distance (km)" type="number" error={tripForm.formState.errors.plannedDistance?.message} {...tripForm.register("plannedDistance")} />
            </div>
            {capacityError ? <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{capacityError}</p> : null}
            <Button type="submit" loading={tripForm.formState.isSubmitting} disabled={Boolean(capacityError)}>
              Save Draft
            </Button>
          </form>
        </Card>
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-100">Live Board</h2>
            <p className="text-sm text-slate-500">{visibleTrips.length} trips</p>
          </div>
          {visibleTrips.length ? (
            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
              {columns.map((status) => (
                <div key={status} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-200">{status}</h3>
                    <span className="text-xs text-slate-500">{visibleTrips.filter((trip) => trip.status === status).length}</span>
                  </div>
                  <div className="space-y-3">
                    {visibleTrips.filter((trip) => trip.status === status).map((trip) => {
                      const tripVehicle = vehicles.find((vehicle) => vehicle.id === trip.vehicleId);
                      const tripDriver = drivers.find((driver) => driver.id === trip.driverId);
                      const canDispatch = access !== "view" && ["FLEET_MANAGER", "DRIVER"].includes(user.role) && trip.status === "DRAFT";
                      const canComplete = access !== "view" && trip.status === "DISPATCHED";
                      const canCancel = access !== "view" && ["DRAFT", "DISPATCHED"].includes(trip.status);
                      return (
                        <div key={trip.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-slate-100">{trip.source} to {trip.destination}</p>
                              <p className="mt-1 text-xs text-slate-500">{tripVehicle?.nameModel} · {tripDriver?.name}</p>
                            </div>
                            <StatusBadge value={trip.status} />
                          </div>
                          <p className="mt-3 text-sm text-slate-400">{trip.cargoWeight} kg · {trip.plannedDistance} km</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {canDispatch ? <Button variant="primary" className="px-3 py-2" onClick={() => dispatchTrip(trip.id)}>Dispatch</Button> : null}
                            {canComplete ? (
                              <Button
                                variant="secondary"
                                className="px-3 py-2"
                                onClick={() => {
                                  setActiveTrip(trip);
                                  setCompleteOpen(true);
                                }}
                              >
                                Complete
                              </Button>
                            ) : null}
                            {canCancel ? (
                              <Button variant="danger" className="px-3 py-2" onClick={() => cancelTrip(trip.id)}>
                                Cancel
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
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
