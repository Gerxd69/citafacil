"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Service = {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  is_active: boolean;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: 60,
    price: 0,
  });

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

    const { data: services } = await supabase
      .from("services")
      .select("*")
      .eq("business_id", business.id)
      .order("created_at");

    setServices(services || []);
    setLoading(false);
  }

  function openNew() {
    setEditingService(null);
    setForm({ name: "", description: "", duration: 60, price: 0 });
    setShowForm(true);
    setError(null);
  }

  function openEdit(service: Service) {
    setEditingService(service);
    setForm({
      name: service.name,
      description: service.description || "",
      duration: service.duration,
      price: service.price,
    });
    setShowForm(true);
    setError(null);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!businessId) return;

    setSaving(true);
    setError(null);
    const supabase = createClient();

    if (editingService) {
      const { error } = await supabase
        .from("services")
        .update({
          name: form.name,
          description: form.description,
          duration: form.duration,
          price: form.price,
        })
        .eq("id", editingService.id);

      if (error) { setError("Error al actualizar."); setSaving(false); return; }
    } else {
      const { error } = await supabase
        .from("services")
        .insert({
          business_id: businessId,
          name: form.name,
          description: form.description,
          duration: form.duration,
          price: form.price,
        });

      if (error) { setError("Error al guardar."); setSaving(false); return; }
    }

    setSaving(false);
    setShowForm(false);
    loadData();
  }

  async function toggleActive(service: Service) {
    const supabase = createClient();
    await supabase
      .from("services")
      .update({ is_active: !service.is_active })
      .eq("id", service.id);
    loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este servicio?")) return;
    const supabase = createClient();
    await supabase.from("services").delete().eq("id", id);
    loadData();
  }

  return (
    <div className="min-h-screen bg-surface-900">
      {/* Navbar */}
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
              <span className="text-white text-sm font-medium">Servicios</span>
            </div>
            <button onClick={openNew} className="btn-primary text-sm">
              + Nuevo servicio
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Mis servicios</h1>
          <p className="text-gray-400 text-sm mt-1">
            Define qué ofreces, cuánto dura y cuánto cuesta.
          </p>
        </div>

        {/* Modal formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <div className="card w-full max-w-md">
              <h2 className="text-lg font-semibold text-white mb-5">
                {editingService ? "Editar servicio" : "Nuevo servicio"}
              </h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="label-base">Nombre del servicio</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ej: Corte de cabello, Consulta general"
                    className="input-base"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="label-base">
                    Descripción <span className="text-gray-500 font-normal">(opcional)</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe brevemente el servicio..."
                    className="input-base resize-none"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Duración (minutos)</label>
                    <select
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                      className="input-base"
                    >
                      {[15, 30, 45, 60, 90, 120].map((d) => (
                        <option key={d} value={d}>{d} min</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label-base">Precio (MXN)</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      placeholder="0"
                      min="0"
                      className="input-base"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex-1"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de servicios */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Cargando...</div>
        ) : services.length === 0 ? (
          <div className="card border-dashed border-surface-400 text-center py-16">
            <p className="text-4xl mb-4">✂️</p>
            <h3 className="text-lg font-semibold text-white mb-2">
              Sin servicios aún
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Agrega tu primer servicio para que los clientes puedan reservar.
            </p>
            <button onClick={openNew} className="btn-primary">
              + Agregar servicio
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className={`card flex items-center justify-between gap-4 ${
                  !service.is_active ? "opacity-50" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium truncate">{service.name}</h3>
                    {!service.is_active && (
                      <span className="text-xs text-gray-500 bg-surface-600 px-2 py-0.5 rounded-full">
                        Inactivo
                      </span>
                    )}
                  </div>
                  {service.description && (
                    <p className="text-gray-400 text-sm truncate mt-0.5">{service.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-500">⏱ {service.duration} min</span>
                    <span className="text-xs text-brand-400 font-medium">
                      ${Number(service.price).toFixed(2)} MXN
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(service)}
                    className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded bg-surface-700"
                  >
                    {service.is_active ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    onClick={() => openEdit(service)}
                    className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded bg-surface-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded bg-surface-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}