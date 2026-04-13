"use client";

import { useActionState } from "react";
import { Lock, Mail, Loader2 } from "lucide-react";
import Image from "next/image";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-gold/20 bg-deep-red/80 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-900/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <Image
              src="/assets/images/logo-aew-tbt2.png"
              alt="TBT2 Allex e Wander"
              width={280}
              height={84}
              priority
              className="drop-shadow-lg"
            />
          </div>
          <p className="text-center text-gray-300 text-sm mb-8">
            Área de administradores e vendas
          </p>

          <form action={action} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-200 ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                  placeholder="admin@evento.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-200 ml-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {state?.error && (
              <div className="p-3 text-sm text-red-200 bg-red-900/50 border border-red-500/30 rounded-lg">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-gold/10 text-sm font-bold text-deep-red bg-gold hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gold transition-all duration-200 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
            >
              {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar Painel"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
