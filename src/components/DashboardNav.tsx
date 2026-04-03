"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutGrid } from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Visão Geral", icon: BarChart3 },
  { href: "/dashboard/mesas", label: "Mesas", icon: LayoutGrid },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
      {tabs.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isActive
                ? "bg-gold text-deep-red shadow"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
