"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const BUSINESS_TYPES = [
  { value: "salon", label: "💇 Salón de belleza" },
  { value: "barbershop", label: "💈 Barbería" },
  { value: "medical", label: "🏥 Consultorio médico" },
  { value: "dental", label: "🦷 Dentista" },
  { value: "spa", label: "💆 Spa / Masajes" },
  { value: "nail", label: "💅 Nail studio" },
  { value: "veterinary", label: "🐾 Veterinaria" },
  { value: "general", label: "🏢 Otro negocio" },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 50);
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    phone: "",
    address: "",
    description: "",
    slug: "",
  });

  function handleNameChange(name: string) {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  }

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("businesses").insert({
      user_id: user.id,
      name: formData.name,
      slug: formData.slug,
      type: formData.type,
      phone: formData.phone,
      address: formData.address,
      description: formData.description,
    });

    if (error) {
      if (error.code === "23505") {
        setError("Ese nombre de enlace ya está en uso. Cambia el nombre de tu negocio.");
      } else {
        setError("Hubo un error al guardar. Intenta de nuevo.");
      }
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">CF</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Configura tu negocio</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Solo toma 2 minutos. Puedes editar esto después.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-brand-500" : "bg-surface-600"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="card">
          {/* Step 1 — Información básica */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">
                  ¿Cómo se llama tu negocio?
                </h2>
                <p className="text-gray-400 text-sm mb-5">
                  Este nombre aparecerá en tu página de reservaciones.
                </p>
              </div>

              {/* Nombre */}
              <div>
                <label className="label-base">Nombre del negocio</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ej: Salón Ana, Dr. García, Spa Serenidad"
                  className="input-base"
                  autoFocus
                />
              </div>

              {/* Preview del slug */}
              {formData.slug && (
                <div className="bg-surface-700 rounded-lg px-4 py-3 border border-surface-500">
                  <p className="text-xs text-gray-400 mb-1">Tu enlace de reservaciones:</p>
                  <p className="text-sm font-mono">
                    <span className="text-gray-500">citafacil.com/book/</span>
                    <span className="text-brand-400 font-semibold">{formData.slug}</span>
                  </p>
                </div>
              )}

              {/* Slug editable */}
              {formData.slug && (
                <div>
                  <label className="label-base">
                    Personalizar enlace{" "}
                    <span className="text-gray-500 font-normal">(opcional)</span>
                  </label>
                  <div className="flex items-center gap-0">
                    <span className="bg-surface-600 border border-r-0 border-surface-500 rounded-l-lg px-3 py-2.5 text-gray-400 text-sm whitespace-nowrap">
                      /book/
                    </span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        handleChange("slug", generateSlug(e.target.value))
                      }
                      className="input-base rounded-l-none"
                    />
                  </div>
                </div>
              )}

              {/* Tipo de negocio */}
              <div>
                <label className="label-base">Tipo de negocio</label>
                <div className="grid grid-cols-2 gap-2">
                  {BUSINESS_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleChange("type", type.value)}
                      className={`px-3 py-2.5 rounded-lg text-sm text-left transition-all duration-150 border ${
                        formData.type === type.value
                          ? "bg-brand-500/20 border-brand-500/50 text-white"
                          : "bg-surface-700 border-surface-500 text-gray-300 hover:border-surface-400"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.type}
                className="btn-primary w-full"
              >
                Continuar →
              </button>
            </div>
          )}

          {/* Step 2 — Contacto */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">
                  Información de contacto
                </h2>
                <p className="text-gray-400 text-sm mb-5">
                  Ayuda a tus clientes a encontrarte.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Teléfono */}
              <div>
                <label className="label-base">
                  Teléfono{" "}
                  <span className="text-gray-500 font-normal">(opcional)</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Ej: 971 123 4567"
                  className="input-base"
                />
              </div>

              {/* Dirección */}
              <div>
                <label className="label-base">
                  Dirección{" "}
                  <span className="text-gray-500 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Ej: Calle Morelos 45, Ixtepec, Oaxaca"
                  className="input-base"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="label-base">
                  Descripción breve{" "}
                  <span className="text-gray-500 font-normal">(opcional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Ej: Salón de belleza especializado en cortes modernos y coloración..."
                  className="input-base resize-none"
                  rows={3}
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1"
                >
                  ← Atrás
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Guardando...
                    </span>
                  ) : (
                    "Crear mi negocio 🚀"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step indicator */}
        <p className="text-center mt-4 text-xs text-gray-500">
          Paso {step} de 2
        </p>
      </div>
    </div>
  );
}