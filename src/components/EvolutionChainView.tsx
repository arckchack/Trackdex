import React from 'react';
import { Check, Sparkles, GitCommit, GitFork, ChevronRight } from 'lucide-react';
import pokemonEvolutionsData from '../data/pokemonEvolutions.json';
import { EvolutionChainData, EvolutionMember } from '../types';
import {
  formatPokedexNumber,
  getPokemonSpriteUrl,
} from '../data/pokemonData';

interface EvolutionChainViewProps {
  currentPokemonId: number;
  isShiny: boolean;
  caughtSet: Set<number>;
  onSelectPokemonById: (id: number) => void;
  onToggleCaughtById: (id: number) => void;
}

const evolutionsDict = pokemonEvolutionsData as Record<string, EvolutionChainData>;

interface EvolutionPath {
  id: string;
  members: EvolutionMember[];
}

function getEvolutionPaths(chain: EvolutionMember[]): EvolutionPath[] {
  if (!chain || chain.length === 0) return [];

  const idToMember = new Map<number, EvolutionMember>();
  const childrenMap = new Map<number, EvolutionMember[]>();
  const hasParent = new Set<number>();

  chain.forEach((m) => {
    idToMember.set(m.id, m);
  });

  chain.forEach((m) => {
    if (m.evolvesFromId && idToMember.has(m.evolvesFromId)) {
      if (!childrenMap.has(m.evolvesFromId)) {
        childrenMap.set(m.evolvesFromId, []);
      }
      childrenMap.get(m.evolvesFromId)!.push(m);
      hasParent.add(m.id);
    }
  });

  const roots = chain.filter((m) => !hasParent.has(m.id));
  if (roots.length === 0 && chain.length > 0) {
    roots.push(chain[0]);
  }

  const paths: EvolutionMember[][] = [];

  function buildPaths(current: EvolutionMember, currentPath: EvolutionMember[]) {
    const newPath = [...currentPath, current];
    const children = childrenMap.get(current.id) || [];

    if (children.length === 0) {
      paths.push(newPath);
    } else {
      children.forEach((child) => buildPaths(child, newPath));
    }
  }

  roots.forEach((root) => buildPaths(root, []));

  return paths.map((members, idx) => ({
    id: `path-${idx}`,
    members,
  }));
}

export const EvolutionChainView: React.FC<EvolutionChainViewProps> = ({
  currentPokemonId,
  isShiny,
  caughtSet,
  onSelectPokemonById,
  onToggleCaughtById,
}) => {
  const evoData = evolutionsDict[currentPokemonId.toString()];

  if (!evoData || !evoData.chain || evoData.chain.length <= 1) {
    return (
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-neutral-400">
          <GitCommit className="w-4 h-4 text-neutral-500" />
          <span>Este Pokémon no posee evoluciones registradas.</span>
        </div>
      </div>
    );
  }

  const paths = getEvolutionPaths(evoData.chain);
  const isBranching = paths.length > 1;

  return (
    <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-4 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {isBranching ? (
            <GitFork className={`w-4 h-4 ${isShiny ? 'text-amber-400' : 'text-[#ff3e3e]'}`} />
          ) : (
            <GitCommit className={`w-4 h-4 ${isShiny ? 'text-amber-400' : 'text-[#ff3e3e]'}`} />
          )}
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-200">
            {isBranching ? 'Líneas Evolutivas y Ramificaciones' : 'Línea Evolutiva y Métodos'}
          </h3>
        </div>

        {isBranching && (
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            <span>{paths.length} Ramificaciones</span>
          </span>
        )}
      </div>

      {/* Render Evolution Paths / Lines */}
      <div className="space-y-4">
        {paths.map((path, pathIdx) => {
          const finalTarget = path.members[path.members.length - 1];

          return (
            <div
              key={path.id}
              className={`p-3 rounded-2xl border transition-all ${
                isBranching
                  ? 'bg-[#121212] border-neutral-800/90 hover:border-neutral-700'
                  : 'bg-transparent border-transparent p-0'
              }`}
            >
              {/* Branch Label if multiple paths exist */}
              {isBranching && (
                <div className="flex items-center justify-between mb-2 text-[11px] font-bold text-neutral-400">
                  <span className="text-[#ff3e3e] uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e3e]" />
                    <span>Línea {pathIdx + 1}: {finalTarget.name}</span>
                  </span>
                </div>
              )}

              {/* Horizontal / Wrapped Flow */}
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3 overflow-x-auto py-1">
                {path.members.map((member, index) => {
                  const isCurrent = member.id === currentPokemonId;
                  const isCaught = caughtSet.has(member.id);
                  const sprite = getPokemonSpriteUrl(member.id, isShiny);

                  return (
                    <React.Fragment key={member.id}>
                      {/* Arrow & Evolution Method */}
                      {index > 0 && (
                        <div className="flex flex-col items-center justify-center my-1 sm:my-0 px-1 text-center flex-shrink-0">
                          <div className="text-[10px] font-bold text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full whitespace-nowrap mb-1 max-w-[130px] truncate" title={member.method || 'Evolución'}>
                            {member.method || 'Evolución'}
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-500 hidden sm:block" />
                          <div className="w-0.5 h-3 bg-neutral-800 sm:hidden" />
                        </div>
                      )}

                      {/* Member Card */}
                      <div
                        onClick={() => onSelectPokemonById(member.id)}
                        className={`group relative p-2.5 rounded-xl border flex flex-col items-center justify-center min-w-[95px] cursor-pointer transition-all flex-shrink-0 ${
                          isCurrent
                            ? isShiny
                              ? 'bg-amber-500/20 border-amber-500/60 ring-2 ring-amber-500/30 shadow-md shadow-amber-500/10'
                              : 'bg-red-500/20 border-red-500/60 ring-2 ring-red-500/30 shadow-md shadow-red-500/10'
                            : 'bg-[#181818] hover:bg-[#222222] border-neutral-800'
                        }`}
                      >
                        {/* Sprite */}
                        <img
                          src={sprite}
                          alt={member.name}
                          className="w-11 h-11 object-contain transition-transform group-hover:scale-110"
                        />

                        {/* Pokedex # & Name */}
                        <span className="text-[10px] font-mono font-bold text-neutral-400 mt-1">
                          {formatPokedexNumber(member.id)}
                        </span>
                        <span className={`text-xs font-bold truncate max-w-[100px] ${
                          isCurrent ? 'text-white font-extrabold' : 'text-neutral-300 group-hover:text-white'
                        }`}>
                          {member.name}
                        </span>

                        {/* Catch Checkbox */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleCaughtById(member.id);
                          }}
                          className={`mt-1.5 w-5 h-5 rounded flex items-center justify-center border transition-all ${
                            isCaught
                              ? isShiny
                                ? 'bg-amber-400 text-neutral-950 border-amber-300'
                                : 'bg-[#ff3e3e] text-white border-red-400'
                              : 'border-neutral-700 bg-neutral-900 text-neutral-500 hover:border-neutral-500'
                          }`}
                          title={isCaught ? 'Capturado' : 'Marcar Capturado'}
                        >
                          {isCaught && (
                            isShiny ? <Sparkles className="w-3 h-3 fill-neutral-950" /> : <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </button>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
