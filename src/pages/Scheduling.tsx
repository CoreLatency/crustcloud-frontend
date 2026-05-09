import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Package,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import { productionApi } from "../api/productionApi";
import type { Recipe, Schedule } from "../api/types";
import { Skeleton } from "../components/LoadingSkeleton";
import { useRecipes, useSchedules } from "../hooks/useApi";

const statusColors: Record<string, string> = {
  scheduled: "border-l-blue-500 bg-blue-50",
  pending: "border-l-yellow-500 bg-yellow-50",
  completed: "border-l-green-500 bg-green-50",
  cancelled: "border-l-red-500 bg-red-50",
};

interface AddShiftModalProps {
  scheduleId: number;
  recipes: Recipe[];
  onClose: () => void;
  onAdd: () => void;
}

function AddShiftModal({
  scheduleId,
  recipes,
  onClose,
  onAdd,
}: AddShiftModalProps) {
  const [productId, setProductId] = useState<number>(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [batches, setBatches] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timeError, setTimeError] = useState("");

  const timeSlot = startTime && endTime ? `${startTime} - ${endTime}` : "";

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
    if (endTime && e.target.value >= endTime) {
      setTimeError("End time must be after start time");
    } else {
      setTimeError("");
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndTime(value);
    if (startTime && value && value <= startTime) {
      setTimeError("End time must be after start time");
    } else {
      setTimeError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !timeSlot || timeError) return;

    setLoading(true);
    try {
      await productionApi.addShift(scheduleId, productId, timeSlot, batches);
      onAdd();
      onClose();
    } catch (err) {
      console.error("Failed to add shift");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6 border-b border-highlight flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-primary">
            Add Production Shift
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X size={20} className="text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label
              htmlFor="shift-product"
              className="block text-sm font-medium text-primary mb-1.5">
              Product
            </label>
            <select
              id="shift-product"
              value={productId}
              onChange={(e) => setProductId(Number(e.target.value))}
              className="input"
              required>
              <option value={0}>Select a product...</option>
              {recipes.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.image} {recipe.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="shift-start"
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              className="input"
              required
            />
            <span className="text-gray-500">–</span>
            <input
              id="shift-end"
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              className={`input ${timeError ? "border-red-500" : ""}`}
              required
            />
          </div>

          <div>
            {timeError && (
              <p className="text-red-500 text-sm mt-1">{timeError}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="shift-batches"
              className="block text-sm font-medium text-primary mb-1.5">
              Number of Batches
            </label>
            <input
              id="shift-batches"
              type="number"
              min={1}
              max={10}
              value={batches}
              onChange={(e) => setBatches(Number(e.target.value))}
              className="input"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-3">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-3">
              {loading ? "Adding..." : "Add Shift"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Scheduling() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );
  const [showAddShift, setShowAddShift] = useState(false);

  const { data: schedules, loading, error, refetch } = useSchedules();
  const { data: recipes } = useRecipes();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDeleteShift = async (scheduleId: number, shiftId: number) => {
    try {
      await productionApi.deleteShift(scheduleId, shiftId);
      refetch();
    } catch (err) {
      console.error("Failed to delete shift");
    }
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDays();

  const getScheduleForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return schedules?.find((s) => s.date === dateStr);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 card">
        <p className="text-red-600 mb-4">Failed to load schedules</p>
        <button type="button" onClick={refetch} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-primary">
            Production Schedule
          </h1>
          <p className="text-muted">Plan and manage production shifts</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goToToday}
            className="btn-secondary py-2">
            Today
          </button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ChevronLeft size={20} className="text-primary" />
            </button>
            <button
              type="button"
              onClick={goToNextWeek}
              className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ChevronRight size={20} className="text-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* Week View */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-highlight bg-secondary/30">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-accent" />
            <h2 className="font-heading text-lg font-semibold text-primary">
              Week of{" "}
              {weekDays[0].toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-24 h-20 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-highlight">
            {weekDays.map((day) => {
              const schedule = getScheduleForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();

              return (
                <div
                  key={day.toISOString()}
                  className={`p-4 ${isToday ? "bg-accent/5" : ""}`}>
                  <div className="flex items-start gap-4">
                    {/* Day Column */}
                    <div
                      className={`w-20 text-center p-2 rounded-lg ${isToday ? "bg-accent text-white" : "bg-secondary"}`}>
                      <p className="text-xs font-medium uppercase">
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <p className="text-2xl font-bold">{day.getDate()}</p>
                    </div>

                    {/* Shifts */}
                    <div className="flex-1">
                      {schedule && schedule.shifts.length > 0 ? (
                        <div className="space-y-2">
                          {schedule.shifts.map((shift) => (
                            <div
                              key={shift.id}
                              className={`p-3 rounded-lg border-l-4 ${statusColors[shift.status] || statusColors.scheduled}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <p className="font-medium text-primary">
                                      {shift.product}
                                    </p>
                                    <div className="flex items-center gap-3 text-sm text-muted mt-1">
                                      <span className="flex items-center gap-1">
                                        <Clock size={14} /> {shift.timeSlot}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Package size={14} /> {shift.batches}{" "}
                                        batch{shift.batches > 1 ? "es" : ""}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteShift(schedule.id, shift.id)
                                  }
                                  className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-16 flex items-center justify-center border-2 border-dashed border-highlight rounded-lg">
                          <p className="text-sm text-muted">
                            No shifts scheduled
                          </p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={async () => {
                          const dateStr = day.toISOString().split("T")[0];
                          const s =
                            schedule ??
                            (await productionApi.findOrCreateSchedule(dateStr));
                          setSelectedSchedule(s);
                          setShowAddShift(true);
                        }}
                        className="mt-2 flex items-center gap-1 text-sm text-accent hover:underline">
                        <Plus size={14} /> Add shift
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Schedules */}
      <div className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-primary mb-4">
          Upcoming Schedules
        </h2>
        <div className="space-y-3">
          {schedules
            ?.filter(
              (schedule) =>
                schedule.date >= new Date().toISOString().split("T")[0],
            )
            .slice(0, 5)
            .map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium text-primary">
                    {formatDate(schedule.date)}
                  </p>
                  <p className="text-sm text-muted">
                    {schedule.shifts.length} shift
                    {schedule.shifts.length !== 1 ? "s" : ""} planned
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSchedule(schedule);
                    setShowAddShift(true);
                  }}
                  className="btn-secondary py-1.5 px-3 text-sm">
                  <Plus size={14} className="inline mr-1" /> Add Shift
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Add Shift Modal */}
      {showAddShift && selectedSchedule && recipes && (
        <AddShiftModal
          scheduleId={selectedSchedule.id}
          recipes={recipes}
          onClose={() => {
            setShowAddShift(false);
            setSelectedSchedule(null);
          }}
          onAdd={refetch}
        />
      )}
    </div>
  );
}
