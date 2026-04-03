"use client";

import { useState, useEffect } from "react";
import { TableMap, TableData } from "@/components/TableMap";
import { TableModal } from "@/components/TableModal";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function MesasPage() {
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
      if (!error && data) setTables(data as TableData[]);
      setLoading(false);
    }
    fetchTables();

    const channel = supabase
      .channel("tables-realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "tables" }, (payload) => {
        const updated = payload.new as TableData;
        setTables(prev => prev.map(t => t.table_number === updated.table_number ? updated : t));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

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
      setTables(prev => prev.map(t => t.table_number === updatedTable.table_number ? updatedTable : t));
    }
    setSaving(false);
    setSelectedTable(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white/70 uppercase tracking-wider">Mapa de Mesas</h2>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded border-2 border-white/30 inline-block" />
            <span className="text-gray-400">Disponível</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded border-2 border-yellow-500/60 bg-yellow-500/20 inline-block" />
            <span className="text-yellow-300">Reservada</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded border-2 border-red-500/60 bg-red-900/40 inline-block" />
            <span className="text-red-300">Paga</span>
          </span>
        </div>
      </div>

      <TableMap tables={tables} onTableClick={setSelectedTable} />

      {selectedTable && (
        <TableModal
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
          onSave={handleSaveModal}
          saving={saving}
        />
      )}
    </>
  );
}
