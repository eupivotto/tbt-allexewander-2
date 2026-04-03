import { useState } from "react";
import { TableData, TableStatus } from "@/components/TableMap";
import { X, Save, ChevronDown } from "lucide-react";

interface TableModalProps {
  table: TableData;
  onClose: () => void;
  onSave: (table: TableData) => void;
}

export function TableModal({ table, onClose, onSave }: TableModalProps) {
  const [formData, setFormData] = useState<TableData>({
    ...table,
    buyer_name: table.buyer_name || "",
    price: table.price || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#130000] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Mesa <span className="text-gold-light">{table.table_number}</span>
          </h3>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Status</label>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TableStatus })}
                className="block w-full px-4 py-3 pr-10 bg-[#1a0a0a] border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none cursor-pointer"
                style={{ colorScheme: "dark" }}
              >
                <option value="available" style={{ background: "#1a0a0a", color: "#fff" }}>Disponível</option>
                <option value="reserved" style={{ background: "#1a0a0a", color: "#eab308" }}>Reservada — Aguardando Pagamento</option>
                <option value="paid" style={{ background: "#1a0a0a", color: "#f87171" }}>Paga / Vendida</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            {formData.status === 'reserved' && (
              <p className="text-xs text-yellow-500 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-sm bg-yellow-500" /> Mesa ficará marcada como reservada.
              </p>
            )}
            {formData.status === 'paid' && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-sm bg-red-500" /> Mesa ficará marcada como vendida.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nome do Comprador</label>
            <input
              type="text"
              value={formData.buyer_name}
              onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
              className="block w-full px-4 py-3 bg-[#1a0a0a] border border-white/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
              placeholder="Ex: João da Silva"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Valor Pago (R$)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="block w-full px-4 py-3 bg-[#1a0a0a] border border-white/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-gold/10 text-deep-red font-bold bg-gold hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-200"
            >
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
