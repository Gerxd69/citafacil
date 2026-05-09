import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!business) {
    redirect("/onboarding");
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
              <span className="text-white font-bold">CitaFácil</span>
              <span className="text-surface-500">|</span>
              <span className="text-gray-300 text-sm">{business.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className={business.plan === "premium" ? "badge-premium" : "badge-free"}>
                {business.plan === "premium" ? "⚡ Premium" : "Plan Gratis"}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Bienvenida */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Bienvenido, {business.name} 👋
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Tu página de reservaciones:{" "}
            <span className="text-brand-400 font-mono">
              citafacil.com/book/{business.slug}
            </span>
          </p>
        </div>

        {/* Cards de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <p className="text-gray-400 text-sm mb-1">Citas este mes</p>
            <p className="text-3xl font-bold text-white">
              {business.appointments_this_month}
              {business.plan === "free" && (
                <span className="text-sm text-gray-500 font-normal"> / 20</span>
              )}
            </p>
            {business.plan === "free" && (
              <div className="mt-3">
                <div className="w-full bg-surface-600 rounded-full h-1.5">
                  <div
                    className="bg-brand-500 h-1.5 rounded-full transition-all"
                    style={{
                      width: `${Math.min((business.appointments_this_month / 20) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {20 - business.appointments_this_month} citas restantes este mes
                </p>
              </div>
            )}
          </div>

          <div className="card">
            <p className="text-gray-400 text-sm mb-1">Tu enlace</p>
            <p className="text-sm font-mono text-brand-400 truncate">
              /book/{business.slug}
            </p>
            <button className="mt-3 text-xs text-gray-400 hover:text-white transition-colors">
              📋 Copiar enlace
            </button>
          </div>

          <div className="card">
            <p className="text-gray-400 text-sm mb-1">Plan actual</p>
            <p className="text-xl font-bold text-white capitalize">
              {business.plan === "premium" ? "⚡ Premium" : "🆓 Gratis"}
            </p>
            {business.plan === "free" && (
              <button className="mt-3 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                Mejorar a Premium →
              </button>
            )}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="card border-dashed border-surface-400 text-center py-16">
          <p className="text-4xl mb-4">📅</p>
          <h3 className="text-lg font-semibold text-white mb-2">
            Tus citas aparecerán aquí
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Configura tus servicios y horarios para empezar a recibir reservaciones.
            Tus clientes podrán agendar citas desde tu enlace personalizado.
          </p>
          <div className="flex gap-3 mt-6 justify-center">
            <Link href="/dashboard/services" className="btn-primary">
              ✂️ Configurar servicios
            </Link>
            <Link href="/dashboard/schedules" className="btn-secondary">
              🕐 Configurar horarios
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}