"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setError("Este email ya está registrado. Intenta iniciar sesión.");
      } else {
        setError("Hubo un error al crear tu cuenta. Intenta de nuevo.");
      }
      setLoading(false);
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">CF</span>
            </div>
            <span className="text-white font-bold text-xl">CitaFácil</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Crea tu cuenta gratis</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Empieza a recibir reservaciones en minutos
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="label-base">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@negocio.com"
                className="input-base"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label-base">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="input-base"
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label-base">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                className="input-base"
                required
                autoComplete="new-password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creando cuenta...
                </span>
              ) : (
                "Crear cuenta gratis"
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Al registrarte aceptas nuestros{" "}
              <a href="#" className="text-brand-400 hover:underline">Términos de servicio</a>
              {" "}y{" "}
              <a href="#" className="text-brand-400 hover:underline">Política de privacidad</a>
            </p>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}