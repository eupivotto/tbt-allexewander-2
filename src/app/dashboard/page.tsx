"use client";

import { useState, useEffect } from "react";
import { TableMap, TableData } from "@/components/TableMap";
import { TableModal } from "@/components/TableModal";
import { LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const initialTables: TableData[] = Array.from({ length: 37 }, (_, i) => ({
  table_number: i + 1,
  status: "available",
  buyer_name: "",
  price: 0,
}));

export default function DashboardPage() {
  const [tables, setTables] = useState<TableData[]>(initialTables);

  useEffect(() => {
    setTables(Array.from({ length: 37 }, (_, i) => ({
      table_number: i + 1,
      status: Math.random() > 0.7 ? "paid" : Math.random() > 0.5 ? "reserved" : "available",
      buyer_name: "",
      price: 0,
    })));
  }, []);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

  const available = tables.filter((t) => t.status === "available").length;
  const reserved = tables.filter((t) => t.status === "reserved").length;
  const paid = tables.filter((t) => t.status === "paid").length;

  const handleTableClick = (table: TableData) => {
    setSelectedTable(table);
  };

  const handleSaveModal = (updatedTable: TableData) => {
    setTables(tables.map(t => t.table_number === updatedTable.table_number ? updatedTable : t));
    setSelectedTable(null);
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-black/80 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Image
                src="/assets/images/logo-aew-tbt2.png"
                alt="TBT2 Allex e Wander"
                width={140}
                height={42}
                priority
                className="drop-shadow-md"
              />
            </div>
            <Link href="/login" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
              Sair
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="w-8 h-8 text-gold" />
          <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase">Visão Geral</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-black/60 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
            <p className="text-gray-400 font-medium mb-1">Mesas Disponíveis</p>
            <p className="text-5xl font-bold text-white">{available}</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_20px_rgba(234,179,8,0.1)]">
            <p className="text-yellow-200/70 font-medium mb-1">Reservadas</p>
            <p className="text-5xl font-bold text-yellow-500">{reserved}</p>
          </div>
          <div className="bg-red-900/40 border border-red-500/30 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_20px_rgba(220,38,38,0.1)]">
            <p className="text-red-300 font-medium mb-1">Pagas / Vendidas</p>
            <p className="text-5xl font-bold text-red-500">{paid}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Mapa de Mesas</h2>
          <TableMap tables={tables} onTableClick={handleTableClick} />
        </div>
      </main>

      {selectedTable && (
        <TableModal
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
          onSave={handleSaveModal}
        />
      )}
    </div>
  );
}
