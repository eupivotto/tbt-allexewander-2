"use client";

export type TableStatus = 'available' | 'reserved' | 'paid';

export interface TableData {
  table_number: number;
  status: TableStatus;
  buyer_name?: string;
  buyer_phone?: string;
  price?: number;
}

interface TableMapProps {
  tables: TableData[];
  onTableClick: (table: TableData) => void;
}

export function TableMap({ tables, onTableClick }: TableMapProps) {
  const getTable = (num: number) =>
    tables.find(t => t.table_number === num) || { table_number: num, status: 'available' as TableStatus };

  const renderTable = (num: number, extraClass = "") => {
    const table = getTable(num);
    const isReserved = table.status === 'reserved';
    const isPaid = table.status === 'paid';

    let bgClass = "bg-white/10 hover:bg-white/20 border-white/20 text-white";
    if (isReserved) bgClass = "bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/50 text-yellow-200";
    if (isPaid) bgClass = "bg-red-900/40 hover:bg-red-900/60 border-red-500/50 text-red-200";

    return (
      <button
        key={num}
        onClick={() => onTableClick(table)}
        className={`relative flex items-center justify-center w-12 h-12 rounded-lg border-2 font-bold text-sm transition-all active:scale-95 ${bgClass} ${extraClass}`}
      >
        {String(num).padStart(2, '0')}
        {table.status !== 'available' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-[2px] bg-current rotate-45 absolute opacity-40" />
            <div className="w-full h-[2px] bg-current -rotate-45 absolute opacity-40" />
          </div>
        )}
      </button>
    );
  };

  // ── MOBILE VIEW ────────────────────────────────────────────
  const MobileMap = () => (
    <div className="flex flex-col gap-4">

      {/* Legenda */}
      <div className="flex items-center gap-4 text-xs flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-white/20 border border-white/30 inline-block" />
          <span className="text-gray-400">Disponível</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-yellow-500/30 border border-yellow-500/50 inline-block" />
          <span className="text-yellow-300">Reservada</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-900/50 border border-red-500/50 inline-block" />
          <span className="text-red-300">Paga</span>
        </span>
      </div>

      {/* PREMIUM */}
      <div className="bg-black/40 border border-red-500/30 rounded-xl p-4">
        <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">
          ★ PREMIUM — Frente ao Palco
        </p>
        <div className="flex gap-2 flex-wrap">
          {[4, 5, 6, 7, 8].map(n => renderTable(n, "border-yellow-400/50"))}
        </div>
      </div>

      {/* OURO */}
      <div className="bg-black/40 border border-yellow-500/20 rounded-xl p-4">
        <p className="text-xs font-bold text-yellow-400/80 uppercase tracking-widest mb-3">
          OURO — Área BAR
        </p>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 9, 10, 11, 12, 13, 14, 15, 16].map(n => renderTable(n))}
        </div>
      </div>

      {/* PRATA */}
      <div className="bg-black/40 border border-white/10 rounded-xl p-4">
        <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">
          PRATA
        </p>
        <div className="flex gap-2 flex-wrap">
          {[17, 18, 19, 20, 21, 22, 23, 24].map(n => renderTable(n))}
        </div>
      </div>

      {/* CHOPERIA */}
      <div className="bg-black/40 border border-white/10 rounded-xl p-4">
        <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">
          ÁREA CHOPERIA — Prata
        </p>
        <div className="flex gap-2 flex-wrap">
          {[25, 26, 27, 28, 29, 30, 31, 32].map(n => renderTable(n))}
        </div>
      </div>

      {/* INDIVIDUAL */}
      <div className="bg-black/40 border border-white/10 rounded-xl p-4">
        <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">
          INGRESSO INDIVIDUAL
        </p>
        <div className="flex gap-2 flex-wrap">
          {[33, 34, 35, 36, 37].map(n => renderTable(n))}
        </div>
      </div>

    </div>
  );

  // ── DESKTOP VIEW ───────────────────────────────────────────
  const DesktopMap = () => (
    <div className="w-full max-w-5xl mx-auto overflow-x-auto p-4">
      <div className="min-w-[860px] bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">

        <div className="flex gap-4">

          {/* LEFT: ÁREA CHOPERIA (25–32) */}
          <div className="w-[220px] shrink-0 border border-white/15 rounded-xl p-3 bg-white/5 flex flex-col gap-3 self-start mt-[56px]">
            <div className="text-center text-xs font-bold text-white/70 tracking-wider uppercase">
              ÁREA CHOPERIA
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 justify-center">
                {[25, 26, 27, 28].map(n => renderTable(n))}
              </div>
              <div className="flex gap-2 justify-center">
                {[29, 30, 31, 32].map(n => renderTable(n))}
              </div>
            </div>
            <div className="text-center text-[10px] text-white/40 font-semibold tracking-widest uppercase mt-1">
              PRATA
            </div>
          </div>

          {/* RIGHT: Grid principal (01–24) */}
          <div className="flex-1 flex flex-col gap-2">

            <div className="flex items-end gap-2">
              <div className="flex flex-col gap-1">
                <div className="bg-white/5 rounded-lg py-2 px-1 text-yellow-300 border border-white/10 text-[11px] font-bold text-center tracking-wide">
                  BAR<br /><span className="font-normal text-[9px] text-white/50">(ATENDIMENTO GARÇOM)</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map(n => renderTable(n))}
                </div>
                <div className="text-center text-[10px] text-yellow-400/70 font-semibold tracking-widest uppercase">
                  OURO
                </div>
              </div>

              <div className="w-px self-stretch bg-white/20 mx-1" />

              <div className="flex flex-col gap-1">
                <div className="bg-red-900 border border-red-500/40 rounded-lg py-2 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] text-base font-bold text-center tracking-wider">
                  PALCO
                </div>
                <div className="flex gap-2 p-2 rounded-lg border border-yellow-500/40 bg-yellow-500/5">
                  {[4, 5, 6, 7, 8].map(n => renderTable(n, "border-yellow-400/50"))}
                </div>
                <div className="text-center text-[10px] text-yellow-300 font-bold tracking-widest uppercase">
                  PREMIUM ★
                </div>
              </div>

              <div className="self-start">
                <div className="bg-white/5 rounded-lg py-2 px-3 text-yellow-300 border border-white/10 text-[11px] font-bold text-center tracking-wide w-[90px]">
                  BAR<br /><span className="font-normal text-[9px] text-white/50">INDIVIDUAL</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="flex gap-2">
                {[9, 10, 11].map(n => renderTable(n))}
              </div>
              <div className="w-px self-stretch bg-white/20 mx-1" />
              <div className="flex gap-2">
                {[12, 13, 14, 15, 16].map(n => renderTable(n))}
              </div>
            </div>

            <div className="text-center text-[10px] text-yellow-400/70 font-semibold tracking-widest uppercase -mt-1">
              OURO ↑
            </div>

            <div className="flex items-start gap-2">
              <div className="flex gap-2">
                {[17, 18, 19].map(n => renderTable(n))}
              </div>
              <div className="w-px self-stretch bg-white/20 mx-1" />
              <div className="flex gap-2">
                {[20, 21, 22, 23, 24].map(n => renderTable(n))}
              </div>
            </div>

            <div className="text-center text-[10px] text-white/40 font-semibold tracking-widest uppercase -mt-1">
              PRATA ↑
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6 gap-3 text-center font-bold text-[11px]">
          <div className="bg-yellow-600/20 text-yellow-200 border border-yellow-600/30 rounded px-5 py-2">
            CAIXAS / BILHETERIA
          </div>
          <div className="flex-1 bg-yellow-600/20 text-yellow-200 border border-yellow-600/30 rounded py-2">
            ÁREA PARA INGRESSO INDIVIDUAL
          </div>
          <div className="bg-yellow-600/20 text-yellow-200 border border-yellow-600/30 rounded px-5 py-2">
            BANHEIROS
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden">
        <MobileMap />
      </div>
      <div className="hidden md:block">
        <DesktopMap />
      </div>
    </>
  );
}
