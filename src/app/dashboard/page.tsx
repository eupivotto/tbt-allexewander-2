"use client";

import { useState, useEffect } from "react";
import { TableMap, TableData } from "@/components/TableMap";
import { TableModal } from "@/components/TableModal";
import { LogOut, LayoutDashboard, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { logout } from "@/app/actions/auth";

export default function DashboardPage() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchTables() {
      const { data, error } = await supabase
        .from("tables")
        .select("table_number, status, buyer_name, buyer_phone, price")
        .order("table_number");

      if (!error && data) {
        setTables(data as TableData[]);
      }
      setLoading(false);
    }

    fetchTables();

    const channel = supabase
      .channel("tables-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "tables" },
        (payload) => {
          const updated = payload.new as TableData;
          setTables((prev) =>
            prev.map((t) =>
              t.table_number === updated.table_number ? updated : t
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const available = tables.filter((t) => t.status === "available").length;
  const reserved = tables.filter((t) => t.status === "reserved").length;
  const paid = tables.filter((t) => t.status === "paid").length;

  const handleTableClick = (table: TableData) => {
    setSelectedTable(table);
  };

  const handleSaveModal = async (updatedTable: TableData) => {
    setSaving(true);

    const { error } = await supabase
      .from("tables")
      .update({
        status: updatedTable.status,
        buyer_name: updatedTable.buyer_name ?? null,
        buyer_phone: updatedTable.buyer_phone ?? null,
        price: updatedTable.price ?? null,
      })
      .eq("table_number", updatedTable.table_number);

    if (!error) {
      setTables(tables.map(t =>
        t.table_number === updatedTable.table_number ? updatedTable : t
      ));
    }

    setSaving(false);
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
            <form action={logout}>
              <button type="submit" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <LayoutDashboard className="w-6 h-6 md:w-8 md:h-8 text-gold" />
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight uppercase">Visão Geral</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-gold" />
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>

      {selectedTable && (
        <TableModal
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
          onSave={handleSaveModal}
          saving={saving}
        />
      )}
    </div>
  );
}
