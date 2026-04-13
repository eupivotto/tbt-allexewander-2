"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TableData } from "@/components/TableMap";
import { Loader2, TrendingUp, CircleDollarSign, TableProperties, Clock } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const TOTAL_TABLES = 32;

export default function OverviewPage() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTables() {
      const { data, error } = await supabase
        .from("tables")
        .select("table_number, status, price, extra_chair_price");
      if (!error && data) setTables(data as TableData[]);
      setLoading(false);
    }
    fetchTables();

    const channel = supabase
      .channel("overview-realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "tables" }, (payload) => {
        const updated = payload.new as TableData;
        setTables(prev => prev.map(t => t.table_number === updated.table_number ? updated : t));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const available = tables.filter(t => t.status === "available").length;
  const reserved  = tables.filter(t => t.status === "reserved").length;
  const paid      = tables.filter(t => t.status === "paid").length;

  const totalRevenue  = tables.filter(t => t.status === "paid").reduce((s, t) => s + (t.price ?? 0) + (t.extra_chair_price ?? 0), 0);
  const pendingRevenue = tables.filter(t => t.status === "reserved").reduce((s, t) => s + (t.price ?? 0) + (t.extra_chair_price ?? 0), 0);
  const soldPct = TOTAL_TABLES > 0 ? Math.round((paid / TOTAL_TABLES) * 100) : 0;

  const pieData = [
    { name: "Disponíveis", value: available, color: "#ffffff33" },
    { name: "Reservadas",  value: reserved,  color: "#eab308" },
    { name: "Pagas",       value: paid,       color: "#ef4444" },
  ].filter(d => d.value > 0);

  const barData = [
    { name: "Recebido", value: totalRevenue,   fill: "#ef4444" },
    { name: "Pendente", value: pendingRevenue, fill: "#eab308" },
  ];

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<TableProperties className="w-5 h-5 text-white/60" />}
          label="Disponíveis"
          value={available}
          sub={`de ${TOTAL_TABLES} mesas`}
          color="border-white/10"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-yellow-400" />}
          label="Reservadas"
          value={reserved}
          sub="aguardando pgto"
          color="border-yellow-500/30"
          valueColor="text-yellow-400"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-red-400" />}
          label="Vendidas"
          value={`${paid} (${soldPct}%)`}
          sub="mesas confirmadas"
          color="border-red-500/30"
          valueColor="text-red-400"
        />
        <StatCard
          icon={<CircleDollarSign className="w-5 h-5 text-gold-light" />}
          label="Total Arrecadado"
          value={fmt(totalRevenue)}
          sub={`${fmt(pendingRevenue)} pendente`}
          color="border-gold/30"
          valueColor="text-gold-light"
          small
        />
      </div>

      {/* ── CHARTS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Donut — Status das mesas */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">
            Status das Mesas
          </h3>
          {pieData.length === 0 ? (
            <p className="text-center text-gray-500 py-16 text-sm">Sem dados ainda</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#130000", border: "1px solid #ffffff22", borderRadius: 8 }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#ccc" }}
                  formatter={(v) => [`${v ?? 0} mesas`, ""]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ color: "#aaa", fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar — Receita */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">
            Receita (R$)
          </h3>
          {totalRevenue === 0 && pendingRevenue === 0 ? (
            <p className="text-center text-gray-500 py-16 text-sm">Sem valores registrados ainda</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" tick={{ fill: "#aaa", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#aaa", fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#130000", border: "1px solid #ffffff22", borderRadius: 8 }}
                  itemStyle={{ color: "#ccc" }}
                  formatter={(v) => [fmt(Number(v ?? 0)), ""]}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* ── PROGRESS BAR ── */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">Ocupação Geral</h3>
          <span className="text-sm font-bold text-white">{soldPct}% vendido</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-700"
            style={{ width: `${soldPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{paid} vendidas</span>
          <span>{available} disponíveis</span>
        </div>
      </div>

    </div>
  );
}

function StatCard({
  icon, label, value, sub, color, valueColor = "text-white", small = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  color: string;
  valueColor?: string;
  small?: boolean;
}) {
  return (
    <div className={`bg-black/50 border ${color} rounded-2xl p-5 backdrop-blur-md flex flex-col gap-2`}>
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <p className={`font-extrabold ${small ? "text-xl" : "text-4xl"} ${valueColor} leading-none`}>
        {value}
      </p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  );
}
