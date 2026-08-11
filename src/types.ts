export type PokemonType =
  | 'Planta'
  | 'Fuego'
  | 'Agua'
  | 'Eléctrico'
  | 'Bicho'
  | 'Normal'
  | 'Veneno'
  | 'Volador'
  | 'Tierra'
  | 'Roca'
  | 'Lucha'
  | 'Psíquico'
  | 'Hielo'
  | 'Dragón'
  | 'Fantasma'
  | 'Siniestro'
  | 'Acero'
  | 'Hada';

export type GenNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  gen: GenNumber;
  height?: number; // in meters
  weight?: number; // in kg
  category?: string; // e.g. "Pokémon Semilla"
  isLegendary?: boolean;
  isMythical?: boolean;
}

export type GenFilter = 'all' | GenNumber;
export type StatusFilter = 'all' | 'caught' | 'uncaught';
export type RarityFilter = 'all' | 'regular' | 'legendary_mythical';
export type SortOption = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc';
export type ViewMode = 'grid' | 'list' | 'compact';
export type DexMode = 'normal' | 'shiny';

export interface EvolutionMember {
  id: number;
  name: string;
  evolvesFromId: number | null;
  method: string | null;
  isLegendary?: boolean;
  isMythical?: boolean;
}

export interface EvolutionChainData {
  chainId: number;
  chain: EvolutionMember[];
}


