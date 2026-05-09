"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const DAYS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

type Schedule = {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
};

export default function SchedulesPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>(
    DAYS.map((d) => ({
      day_of_week: d.value,
      start_time: "09:00",
      end_time: "18:00",
      is_active: d.value !== 0,
    }))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!business) return;
    setBusinessId(business.id);

    const { data: existing } = await supabase
      .from("schedules")
      .select("*")
      .eq("business_id", business.id);

    if (existing && existing.length > 0) {
      setSchedules(
        DAYS.map((d) => {
          const found = existing.find((s) => s.day_of_week === d.value);
          return found || {
            day_of_week: d.value,
            start_time: "09:00",
            end_time: "18:00",
            is_active: false,
          };
        })
      );
    }

    setLoading(false);
  }

  function updateSchedule(dayValue: number, field: keyof Schedule, value: string | boolean) {
    setSchedules((prev) =>
      prev.map((s) =>
        s.day_of_week === dayValue ? { ...s, [field]: value } : s
      )
    );
  }

  async function handleSave() {
    if (!businessId) return;
    setSaving(true);

    const supabase = createClient();

    for (const schedule of schedules) {
      const data = {
        business_id: businessId,
        day_of_week: schedule.day_of_week,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        is_active: schedule.is_active,
      };

      if (schedule.id) {
        await supabase.from("schedules").update(data).eq("id", schedule.id);
      } else {
        await supabase.from("schedules").upsert(data, {
          onConflict: "business_id,day_of_week",
        });
      }
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    loadData();
  }

  return (
    <div className="min-h-screen bg-surface-900">
      <nav className="border-b border-surface-500 bg-surface-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
                Dashboard
              </Link>
              <span className="text-surface-500">/</span>
              <span className="text-white text-sm font-medium">Horarios</span>
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
              {saving ? "Guardando..." : saved ? "✅ Guardado" : "Guardar horarios"}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Horarios de atención</h1>
          <p className="text-gray-400 text-sm mt-1">
            Define qué días y en qué horario recibes citas.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Cargando...</div>
        ) : (
          <div className="space-y-3">
            {DAYS.map((day) => {
              const schedule = schedules.find((s) => s.day_of_week === day.value)!;
              return (
                <div key={day.value} className={`card transition-opacity ${!schedule.is_active ? "opacity-50" : ""}`}>
                  <div className="flex items-center gap-4">
                    {/* Toggle activo */}
                    <button
                      onClick={() => updateSchedule(day.value, "is_active", !schedule.is_active)}
                      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                        schedule.is_active ? "bg-brand-500" : "bg-surface-600"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          schedule.is_active ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>

                    {/* Día */}
                    <span className="text-white font-medium w-24 shrink-0">{day.label}</span>

                    {/* Horarios */}
                    {schedule.is_active ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="time"
                          value={schedule.start_time}
                          onChange={(e) => updateSchedule(day.value, "start_time", e.target.value)}
                          className="input-base py-1.5 text-sm"
                        />
                        <span className="text-gray-400 text-sm shrink-0">a</span>
                        <input
                          type="time"
                          value={schedule.end_time}
                          onChange={(e) => updateSchedule(day.value, "end_time", e.target.value)}
                          className="input-base py-1.5 text-sm"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Cerrado</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}