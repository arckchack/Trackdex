import React from 'react';
import { Search, Filter, ArrowUpDown, LayoutGrid, List, X, Check, Eye, Crown, Sparkles } from 'lucide-react';
import { PokemonType, StatusFilter, RarityFilter, SortOption, ViewMode } from '../types';
import { TYPE_COLORS } from '../data/pokemonData';

interface FilterToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  rarityFilter: RarityFilter;
  setRarityFilter: (rarity: RarityFilter) => void;
  selectedType: PokemonType | 'ALL';
  setSelectedType: (type: PokemonType | 'ALL') => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onClearFilters: () => void;
}

const ALL_TYPES: PokemonType[] = [
  'Planta', 'Fuego', 'Agua', 'Eléctrico', 'Bicho', 'Normal',
  'Veneno', 'Volador', 'Tierra', 'Roca', 'Lucha', 'Psíquico',
  'Hielo', 'Dragón', 'Fantasma', 'Siniestro', 'Acero', 'Hada'
];

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  rarityFilter,
  setRarityFilter,
  selectedType,
  setSelectedType,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  onClearFilters,
}) => {
  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || rarityFilter !== 'all' || selectedType !== 'ALL';

  return (
    <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-4 mb-6 shadow-xl space-y-4">
      {/* Top Controls Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o número (#001, Fuecoco, Rayquaza)..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#0a0a0a] border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff3e3e] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Rarity & Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="flex items-center gap-1 bg-[#0a0a0a] p-1 rounded-xl border border-neutral-800/80">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('caught')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                statusFilter === 'caught'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Capturados</span>
            </button>
            <button
              onClick={() => setStatusFilter('uncaught')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                statusFilter === 'uncaught'
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Faltantes</span>
            </button>
          </div>

          {/* Rarity filter */}
          <div className="flex items-center gap-1 bg-[#0a0a0a] p-1 rounded-xl border border-neutral-800/80">
            <button
              onClick={() => setRarityFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                rarityFilter === 'all'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Todas Rarezas
            </button>
            <button
              onClick={() => setRarityFilter('legendary_mythical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                rarityFilter === 'legendary_mythical'
                  ? 'bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-300 border border-amber-500/50 shadow-md'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" />
              <span>Legendarios / Míticos</span>
            </button>
          </div>
        </div>

        {/* Sorting Dropdown & View Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Sorting selector */}
          <div className="relative flex items-center bg-[#0a0a0a] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 mr-2" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-transparent text-white focus:outline-none cursor-pointer pr-1"
            >
              <option value="id-asc" className="bg-[#141414]"># PokéDex (1 - 1025)</option>
              <option value="id-desc" className="bg-[#141414]"># PokéDex (1025 - 1)</option>
              <option value="name-asc" className="bg-[#141414]">Nombre (A - Z)</option>
              <option value="name-desc" className="bg-[#141414]">Nombre (Z - A)</option>
            </select>
          </div>

          {/* View Mode (Grid vs List) */}
          <div className="flex items-center bg-[#0a0a0a] p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-neutral-400 transition-all ${
                viewMode === 'grid' ? 'bg-neutral-800 text-white shadow-sm' : 'hover:text-neutral-200'
              }`}
              title="Vista en Tarjetas"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-neutral-400 transition-all ${
                viewMode === 'list' ? 'bg-neutral-800 text-white shadow-sm' : 'hover:text-neutral-200'
              }`}
              title="Vista en Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Type Filter Pills Row */}
      <div className="pt-2 border-t border-neutral-800/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-bold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <span>Filtrar por Tipo:</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>

        {/* Scrollable Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
              selectedType === 'ALL'
                ? 'bg-[#ff3e3e]/20 text-[#ff3e3e] border-[#ff3e3e]/40 shadow-sm'
                : 'bg-[#0a0a0a] text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200'
            }`}
          >
            Todos los Tipos
          </button>

          {ALL_TYPES.map((type) => {
            const isSelected = selectedType === type;
            const style = TYPE_COLORS[type];

            return (
              <button
                key={type}
                onClick={() => setSelectedType(isSelected ? 'ALL' : type)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                  isSelected
                    ? `${style.badgeBg} text-white border-white/40 shadow-md scale-105`
                    : `bg-[#0a0a0a] ${style.text} ${style.border} hover:opacity-100 opacity-80`
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
