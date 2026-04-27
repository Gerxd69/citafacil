import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-900">
      {/* Navbar */}
      <nav className="border-b border-surface-500 bg-surface-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              <span className="text-white font-bold text-xl">CitaFácil</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">
                Características
              </a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
                Precios
              </a>
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
                Iniciar sesión
              </Link>
              <Link href="/register" className="btn-primary text-sm">
                Empezar gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/50 via-surface-900 to-surface-900 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
            <span className="text-brand-300 text-sm font-medium">Ahora disponible — Plan gratis para siempre</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Reservaciones online
            <br />
            <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
              para tu negocio
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            La forma más sencilla de que tus clientes agenden citas contigo.
            Sin llamadas, sin WhatsApps. Solo un enlace y listo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="btn-primary text-base px-8 py-3">
              Crear mi cuenta gratis
            </Link>
            <Link href="#features" className="btn-secondary text-base px-8 py-3">
              Ver cómo funciona
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Sin tarjeta de crédito · Gratis hasta 20 citas/mes · Cancela cuando quieras
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Todo lo que necesitas para gestionar tus citas
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Sin complicaciones. Configura tu negocio en menos de 5 minutos.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="card hover:border-brand-500/30 transition-colors group">
              <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-surface-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Precios simples y transparentes
            </h2>
            <p className="text-gray-400 text-lg">
              Empieza gratis. Crece cuando lo necesites.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="card">
              <div className="badge-free mb-4">Gratis</div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400 ml-1">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                {freePlanFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-green-400">✓</span>{f}
                  </li>
                ))}
                {freePlanLimits.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="text-gray-600">✗</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-secondary w-full text-center block">
                Empezar gratis
              </Link>
            </div>
            <div className="card border-brand-500/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="badge-premium mb-4">Premium ⚡</div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$299</span>
                <span className="text-gray-400 ml-1">/mes MXN</span>
              </div>
              <ul className="space-y-3 mb-8">
                {premiumPlanFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-brand-400">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/register?plan=premium" className="btn-primary w-full text-center block">
                Empezar con Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">CF</span>
              </div>
              <span className="text-white font-semibold">CitaFácil</span>
            </div>
            <p className="text-gray-500 text-sm">© 2025 CitaFácil. Hecho en México 🇲🇽</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Privacidad</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Términos</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: "📅",
    title: "Agenda inteligente",
    description: "Tus clientes ven tu disponibilidad en tiempo real y reservan sin llamarte. El sistema evita dobles reservaciones automáticamente.",
  },
  {
    icon: "🔗",
    title: "Tu propio enlace",
    description: "Obtén una página personalizada como citafacil.com/book/salon-ana que puedes compartir en WhatsApp, Instagram o donde quieras.",
  },
  {
    icon: "🏢",
    title: "Para cualquier negocio",
    description: "Salones de belleza, consultorios médicos, dentistas, spas, peluquerías y cualquier negocio que trabaje con citas.",
  },
  {
    icon: "📧",
    title: "Recordatorios automáticos",
    description: "Tus clientes reciben un email de confirmación al reservar y un recordatorio el día anterior. Reduce las faltas.",
  },
  {
    icon: "📊",
    title: "Estadísticas de tu negocio",
    description: "Visualiza cuántas citas tuviste, cuáles servicios son más populares y cuánto generas. Toma mejores decisiones.",
  },
  {
    icon: "💳",
    title: "Pagos seguros",
    description: "Suscripción mensual con Stripe. Cancela cuando quieras. Sin contratos ni letras chiquitas.",
  },
];

const freePlanFeatures = [
  "Hasta 20 citas por mes",
  "Tu página de reservaciones",
  "Gestión de servicios",
  "Horarios de disponibilidad",
  "Panel de control",
];

const freePlanLimits = [
  "Sin recordatorios por email",
  "Sin estadísticas",
  "Sin soporte prioritario",
];

const premiumPlanFeatures = [
  "Citas ilimitadas",
  "Tu página de reservaciones",
  "Gestión de servicios",
  "Horarios de disponibilidad",
  "Panel de control avanzado",
  "Recordatorios automáticos por email",
  "Estadísticas y reportes",
  "Soporte prioritario",
];