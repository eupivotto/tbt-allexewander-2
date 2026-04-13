import Image from "next/image";
import { LogOut } from "lucide-react";
import { DashboardNav } from "@/components/DashboardNav";
import { logout } from "@/app/actions/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-12">
      <header className="bg-black/80 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Image
              src="/assets/images/logo-aew-tbt2.png"
              alt="TBT2 Allex e Wander"
              width={140}
              height={42}
              priority
              className="drop-shadow-md"
            />
            <form action={logout}>
              <button type="submit" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <DashboardNav />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {children}
      </main>
    </div>
  );
}
