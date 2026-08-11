import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { POKEMON_LIST, isLegendaryPokemon, isMythicalPokemon } from './data/pokemonData';
import { Pokemon, GenFilter, StatusFilter, RarityFilter, PokemonType, SortOption, ViewMode, DexMode } from './types';
import { Navbar } from './components/Navbar';
import { GenStatsHeader } from './components/GenStatsHeader';
import { FilterToolbar } from './components/FilterToolbar';
import { PokemonCard } from './components/PokemonCard';
import { PokemonListItem } from './components/PokemonListItem';
import { PokemonDetailModal } from './components/PokemonDetailModal';
import { ExportImportModal } from './components/ExportImportModal';
import { CheckCircle2, RotateCcw, SearchX, Sparkles } from 'lucide-react';

const STORAGE_KEY_NORMAL = 'pokemon_tracker_caught_ids_v2';
const STORAGE_KEY_SHINY = 'pokemon_tracker_shiny_caught_ids_v2';

export default function App() {
  // --- STATE ---
  const [dexMode, setDexMode] = useState<DexMode>('normal');

  // Normal caught IDs
  const [caughtIds, setCaughtIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NORMAL);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      // Migration fallback from older storage key if present
      const oldSaved = localStorage.getItem('pokemon_tracker_caught_ids_gen123');
      if (oldSaved) {
        const parsed = JSON.parse(oldSaved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading saved Pokemon progress:', e);
    }
    return [];
  });

  // Shiny caught IDs
  const [shinyCaughtIds, setShinyCaughtIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHINY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading shiny Pokemon progress:', e);
    }
    return [];
  });

  const [activeGen, setActiveGen] = useState<GenFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
  const [selectedType, setSelectedType] = useState<PokemonType | 'ALL'>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('id-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [selectedPokemonModal, setSelectedPokemonModal] = useState<Pokemon | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // --- SAVE TO LOCALSTORAGE ---
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NORMAL, JSON.stringify(caughtIds));
    } catch (e) {
      console.error('Error saving normal Pokemon progress:', e);
    }
  }, [caughtIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SHINY, JSON.stringify(shinyCaughtIds));
    } catch (e) {
      console.error('Error saving shiny Pokemon progress:', e);
    }
  }, [shinyCaughtIds]);

  // Current active set depending on dexMode ('normal' vs 'shiny')
  const activeCaughtIds = dexMode === 'shiny' ? shinyCaughtIds : caughtIds;
  const activeCaughtSet = useMemo(() => new Set(activeCaughtIds), [activeCaughtIds]);

  // --- FILTERED POKEMON COMPUTATION ---
  const genPokemonList = useMemo(() => {
    if (activeGen === 'all') return POKEMON_LIST;
    return POKEMON_LIST.filter((p) => p.gen === activeGen);
  }, [activeGen]);

  const activeGenCaughtCount = useMemo(() => {
    return genPokemonList.filter((p) => activeCaughtSet.has(p.id)).length;
  }, [genPokemonList, activeCaughtSet]);

  const filteredPokemonList = useMemo(() => {
    return genPokemonList
      .filter((p) => {
        // Status filter
        if (statusFilter === 'caught' && !activeCaughtSet.has(p.id)) return false;
        if (statusFilter === 'uncaught' && activeCaughtSet.has(p.id)) return false;

        // Rarity filter
        if (rarityFilter === 'legendary_mythical') {
          const isLegOrMyth = p.isLegendary || p.isMythical || isLegendaryPokemon(p.id) || isMythicalPokemon(p.id);
          if (!isLegOrMyth) return false;
        } else if (rarityFilter === 'regular') {
          const isLegOrMyth = p.isLegendary || p.isMythical || isLegendaryPokemon(p.id) || isMythicalPokemon(p.id);
          if (isLegOrMyth) return false;
        }

        // Type filter
        if (selectedType !== 'ALL' && !p.types.includes(selectedType)) return false;

        // Search Query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesId = p.id.toString().includes(q) || `#${p.id}`.includes(q);
          if (!matchesName && !matchesId) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'id-asc':
            return a.id - b.id;
          case 'id-desc':
            return b.id - a.id;
          case 'name-asc':
            return a.name.localeCompare(b.name, 'es');
          case 'name-desc':
            return b.name.localeCompare(a.name, 'es');
          default:
            return a.id - b.id;
        }
      });
  }, [genPokemonList, statusFilter, rarityFilter, selectedType, searchQuery, sortOption, activeCaughtSet]);

  // --- CONFETTI TRIGGER ON GENERATION COMPLETION ---
  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  // --- ACTIONS ---
  const handleToggleCaught = useCallback((id: number) => {
    const updateFn = (prev: number[]) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      const nextSet = new Set(next);
      const isNowCompleted = genPokemonList.every((p) => nextSet.has(p.id));
      if (isNowCompleted && genPokemonList.length > 0) {
        triggerConfetti();
      }
      return next;
    };

    if (dexMode === 'shiny') {
      setShinyCaughtIds(updateFn);
    } else {
      setCaughtIds(updateFn);
    }
  }, [dexMode, genPokemonList, triggerConfetti]);

  const handleMarkVisibleCaught = () => {
    const visibleIds = filteredPokemonList.map((p) => p.id);
    const updateFn = (prev: number[]) => {
      const combined = new Set([...prev, ...visibleIds]);
      const next = Array.from(combined);
      if (next.length === POKEMON_LIST.length) {
        triggerConfetti();
      }
      return next;
    };

    if (dexMode === 'shiny') {
      setShinyCaughtIds(updateFn);
    } else {
      setCaughtIds(updateFn);
    }
  };

  const handleUnmarkVisibleCaught = () => {
    const visibleSet = new Set(filteredPokemonList.map((p) => p.id));
    const updateFn = (prev: number[]) => prev.filter((id) => !visibleSet.has(id));

    if (dexMode === 'shiny') {
      setShinyCaughtIds(updateFn);
    } else {
      setCaughtIds(updateFn);
    }
  };

  const handleResetActiveGen = () => {
    const activeIdsSet = new Set(genPokemonList.map((p) => p.id));
    const updateFn = (prev: number[]) => prev.filter((id) => !activeIdsSet.has(id));

    if (dexMode === 'shiny') {
      setShinyCaughtIds(updateFn);
    } else {
      setCaughtIds(updateFn);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setRarityFilter('all');
    setSelectedType('ALL');
    setSortOption('id-asc');
  };

  const handleImportBoth = (normalIds: number[], shinyIds: number[]) => {
    setCaughtIds(normalIds);
    setShinyCaughtIds(shinyIds);
  };

  const handleClearAllData = () => {
    setCaughtIds([]);
    setShinyCaughtIds([]);
  };

  // --- MODAL NAVIGATION ---
  const handleNavigateModal = (direction: 'prev' | 'next') => {
    if (!selectedPokemonModal) return;
    const currentIndex = filteredPokemonList.findIndex((p) => p.id === selectedPokemonModal.id);
    if (currentIndex === -1) return;

    if (direction === 'prev') {
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredPokemonList.length - 1;
      setSelectedPokemonModal(filteredPokemonList[prevIndex]);
    } else {
      const nextIndex = currentIndex < filteredPokemonList.length - 1 ? currentIndex + 1 : 0;
      setSelectedPokemonModal(filteredPokemonList[nextIndex]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(circle_at_top,_#1a1d24_0%,_#0a0a0a_100%)] text-neutral-100 font-sans selection:bg-[#ff3e3e] selection:text-white flex flex-col">
      
      {/* Navbar Header */}
      <Navbar
        activeGen={activeGen}
        setActiveGen={setActiveGen}
        dexMode={dexMode}
        setDexMode={setDexMode}
        totalCaught={caughtIds.length}
        totalShinyCaught={shinyCaughtIds.length}
        totalPokemon={POKEMON_LIST.length}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Shiny Mode Active Banner */}
        {dexMode === 'shiny' && (
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/40 flex items-center justify-between text-xs text-amber-200 shadow-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold">MODO APARTADO SHINY ACTIVADO</span>
              <span className="hidden sm:inline text-neutral-400">• Marcando capturas exclusivamente para tu Living Dex Variocolor</span>
            </div>
            <button
              onClick={() => setDexMode('normal')}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black rounded-lg transition-all"
            >
              Volver a Normal
            </button>
          </div>
        )}

        {/* Active Generation Statistics Header */}
        <GenStatsHeader
          activeGen={activeGen}
          dexMode={dexMode}
          caughtCount={activeGenCaughtCount}
          totalCount={genPokemonList.length}
          filteredCount={filteredPokemonList.length}
          onMarkVisibleCaught={handleMarkVisibleCaught}
          onUnmarkVisibleCaught={handleUnmarkVisibleCaught}
          onResetActiveGen={handleResetActiveGen}
        />

        {/* Filters & Search Toolbar */}
        <FilterToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          rarityFilter={rarityFilter}
          setRarityFilter={setRarityFilter}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          sortOption={sortOption}
          setSortOption={setSortOption}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onClearFilters={handleClearFilters}
        />

        {/* Pokemon Grid / List Display */}
        {filteredPokemonList.length > 0 ? (
          viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredPokemonList.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  isCaught={activeCaughtSet.has(pokemon.id)}
                  isShiny={dexMode === 'shiny'}
                  onToggleCaught={handleToggleCaught}
                  onSelectPokemon={(p) => setSelectedPokemonModal(p)}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2 max-w-4xl mx-auto">
              {filteredPokemonList.map((pokemon) => (
                <PokemonListItem
                  key={pokemon.id}
                  pokemon={pokemon}
                  isCaught={activeCaughtSet.has(pokemon.id)}
                  isShiny={dexMode === 'shiny'}
                  onToggleCaught={handleToggleCaught}
                  onSelectPokemon={(p) => setSelectedPokemonModal(p)}
                />
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-12 bg-[#141414] border border-neutral-800 rounded-2xl text-center my-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 border border-neutral-800">
              <SearchX className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No se encontraron Pokémon</h3>
              <p className="text-xs text-neutral-400 max-w-sm">
                No hay resultados con los filtros o búsqueda actuales en esta generación.
              </p>
            </div>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl border border-neutral-700 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-[#ff3e3e]" />
              <span>Limpiar Filtros</span>
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[11px]">
            TrackDex • Pokémon Generaciones 1 a 9 (Kanto a Paldea) — 1025 Pokémon
          </p>
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Guardado automático activado</span>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <PokemonDetailModal
        pokemon={selectedPokemonModal}
        isCaught={selectedPokemonModal ? activeCaughtSet.has(selectedPokemonModal.id) : false}
        isShinyMode={dexMode === 'shiny'}
        onClose={() => setSelectedPokemonModal(null)}
        onToggleCaught={handleToggleCaught}
        onNavigate={handleNavigateModal}
        activeCaughtSet={activeCaughtSet}
        onSelectPokemonById={(id) => {
          const found = POKEMON_LIST.find((p) => p.id === id);
          if (found) setSelectedPokemonModal(found);
        }}
      />

      {/* Export / Import Modal with Dual Methods */}
      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        caughtIds={caughtIds}
        shinyCaughtIds={shinyCaughtIds}
        onImport={handleImportBoth}
        onClearAll={handleClearAllData}
      />

    </div>
  );
}
